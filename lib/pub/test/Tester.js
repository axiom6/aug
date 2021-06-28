var Tester, fits, test, unit,
  hasProp = {}.hasOwnProperty;

Tester = (function() {
  class Tester {
    constructor() {
      // -- test -- Pass a closeure in the form of  (t) -> { code... }
      // Modeled like the Ava JavaScipt test framework
      // Imports: import { test }     from "../test/Tester.js"
      // Specify: test( text, (t) -> { code... }
      // Example:
      //   const add = ( a, b ) ->
      //     a + b
      //   test("2 + 3 = 5", (t) ->
      //     t.eq( add(2,3), 5 ) )
      this.test = this.test.bind(this);
      
      // -- unit -- For invoking the result argument immediately in a module-unit.js file

      // Imports: import { unit } from "../test/Tester.js"
      //          import Vis      from "../draw/Vis.js"
      // Specify: unit( text, result, expect )
      // Example: unit( "can convert hex color to rgb object",  Vis.rgb(0xFFFFFF), {r:255,g:255,b:255} )
      this.unit = this.unit.bind(this);
      
      // Validate and diagnose a result that fits a schema both of type 'object' or 'array'
      //  Very usefull for a result originating from a'.json' file and parsed by JSON.parse(...)
      //  Very usefull for a schema originating from a'.json' file and parsed by JSON.parse(...)
      this.fits = this.fits.bind(this);
      this.eq = this.eq.bind(this);
      this.stream = null; // Optional streaming publisher module that is set by @injectStream( stream )
      
      // Key settings that can be reconfigured through setOptions( options )
      this.testing = true; // When false all testing is turned which allows tests to remain in code
      this.logToConsole = true;
      this.archive = true; // When true archives test status object to localStorage TestsPassed and TestFail
      this.verbose = false; // Adds addition and sometimes mind numbing detail to testStatus objects
      this.debug = false; // Turns on debugs call to console.log(...)
      this.schemaKey = "schema"; // Specifies the key in a JSON file to look up its argidating schema in JSON
      this.statusSubject = "TestStatus"; // Subject for publishing each test status object
      this.stringSubject = "TestString"; // Subject for publishing each test status string
      this.summarySubject = "TestSummary"; // Subject for publishing module and final summaries
      
      // Short hand for logging in a chained call i.e test(...).log( test().status )
      //  it is important that @log and @error be called in the modules being tested
      //  for viewing the code being tested rather that viewing code in the Tester itself
      this.log = console.log;
      this.error = console.error;
      // Set by @describe( description, suite )
      this.description = "";
      this.suite = "";
      // Accummulate test status state
      this.text = ""; // set by test() that is passed inside eq() and sent to run()
      this.info = "";
      this.code = "";
      this.statusText = "";
      this.statusClear = true;
      this.blockText = "";
      this.blockClear = true;
      // Accumulated status objects
      this.modules = {};
      this.passed = [];
      this.failed = [];
      // optional instance for publishing each test status object to to UIs that subscripe to stream
      // set by @injectStream(stream) which enforces that it have @klass 'Stream'
      this.stream = null;
    }

    setOptions(options) {
      this.testing = options.testing != null ? options.testing : true;
      this.logToConsole = options.logToConsole != null ? options.logToConsole : true;
      this.archive = options.archive != null ? options.archive : true;
      this.verbose = options.verbose != null ? options.verbose : false;
      this.debug = options.debug != null ? options.debug : false;
      this.schemaKey = options.schemaKey != null ? options.schemaKey : "schema";
      this.statusSubject = options.statusSubject != null ? options.statusSubject : "TestStatus";
      this.stringSubject = options.stringSubject != null ? options.stringSubject : "TestString";
      this.summarySubject = options.summarySubject != null ? options.summarySubject : "TestSummary";
    }

    test(text, closure) {
      if (arguments.length === 0 || !this.testing) {
        return this;
      }
      this.text = text; // @text is latter referenced inside eq()
      this.code = closure.toString(); // @code is latter referenced inside eq()
      closure(this);
      return this;
    }

    unit(text, result, expect) { // unit(...) is always @testing
      if (arguments.length === 0 || !this.testing) {
        return this;
      }
      this.text = text;
      this.code = "";
      return this.run(result, expect, "eq"); // returns tester instance for chaining
    }

    fits(text, result, schema) {
      if (arguments.length === 0 || !this.testing) {
        return this;
      }
      this.text = text;
      this.code = "";
      // if @debug
      //  console.log( "Tester.fits(result,schema)", { type:@type(result), result:result, schema:schema, status:status } )
      return this.run(result, schema, "schema"); // returns tester for chaining  is expect = @toSchema( expect, op ) needed?
    }

    eq(result, expect) {
      return this.run(result, expect, "eq");
    }

    run(text, result, expect, op) {
      var status;
      return this(!this.testing);
      if (this.debug) {
        console.log("Tester.run()", {
          text: text,
          result: result,
          expect: expect,
          op: op
        });
      }
      status = this.initStatus(result, expect, op);
      status = this.assert(result, expect, op, status);
      this.report(result, expect, op, status);
      return this;
    }

    describe(description, suite = null) {
      this.description = description;
      this.suite = suite != null ? suite : null;
      return this;
    }

    initStatus(result, expect, op) {
      var eType, module;
      module = text.split(".")[0];
      eType = op === "schema" ? "schema" : this.type(expect);
      return {
        assert: {
          text: this.text,
          pass: true,
          module: module,
          op: op,
          code: this.code,
          info: ""
        },
        result: {
          text: "",
          type: this.type(result),
          value: result
        },
        expect: {
          text: "",
          type: eType,
          value: expect
        }
      };
    }

    // Performs all assertions even a deep equal on objects and arrays
    //   Strong type checking with @type(arg) so asserions are only test when types match
    //   Skips over @type(arg) = "function"
    assert(result, expect, status, op, level = 0, key = null, index = null) {
      // Covert expect to a schema object if op is schema
      expect = this.toSchema(expect, op);
      // Check values and types
      status = this.checkValuesTypes(result, expect, status, op, key, index);
      // Perform all comparisions
      if (status.assert.pass) {
        status = (function() {
          switch (this.type(result)) {
            case "string":
            case "number":
            case "boolean":
              return this.valuesEq(result, expect, status, op);
            case "object":
              return this.objectsEq(result, expect, status, op, level);
            case "array":
              return this.arraysEq(result, expect, status, op, level);
            default:
              return this.unknownsEq(result, expect, status); // just a fallback
          }
        }).call(this);
        this.examine(status.assert.pass, result, expect, status, op, "", key, index);
      }
      // Store status in @passed and @failed arrays
      if (level === 0) {
        if (status.assert.pass) {
          this.passed.push(status);
        }
        if (!status.assert.pass) {
          this.failed.push(status);
        }
      }
      return status;
    }

    // Generates informative text in status
    examine(pass, result, expect, status, op, info, key, index) {
      var eType, prefix, value;
      expect = op === "schema" && !this.isSchema(expect) ? this.toSchema(expect, op) : expect;
      value = op === "schema" ? expect.value : expect;
      eType = op === "schema" ? expect.type : this.type(expect);
      prefix = pass ? "-- Passed -- " : "-- Failed -- ";
      status.assert.text = prefix + status.assert.text;
      status.assert.pass = pass && status.assert.pass; // Asserts a previous status.assert.pass is false
      status.assert.info += info;
      status.assert.code = this.isString(this.code) ? this.code : "";
      status.result.text += this.textValue("Result", this.type(result), result, key, index);
      status.expect.text += this.textValue("Expect", eType, value, key, index);
      return status;
    }

    // Convert expect to a schema object if op is schema
    isSchema(v) {
      return (v.op != null) && (v.type != null) && (v.value != null) && (v.range != null) && (v.op != null) && (v.size != null);
    }

    // Format "type:ranges or value:length:oper?"
    // Examples:
    //   "array:[[0,360],[0,100],[0,100]]:eq?"
    //   { type:"array", ranges:[[0,360],[0,100],[0,100]], oper:"eq", opt="?" }
    //   "array:[0,255]" } # Range is applies to all array values
    //   { type:"array", ranges:[0,255]
    //   "object:{r:[0,255],g:[0,255],b:[0,255]}
    //   "string:James"
    //   "number:[0,100]"
    //   "boolean"
    toSchema(expect, op) {
      var schema;
      if (op !== "schema") {
        return expect;
      }
      schema = {
        type: "any",
        ranges: ["any"],
        value: "any",
        length: "any",
        oper: "eq",
        opt: "1"
      };
      switch (this.type(expect)) {
        case "string":
          schema = this.parseSchema(expect, schema);
          break;
        case "object":
          schema.opt = expect.opt === "?" ? expect.opt : "1"; // "1" implies key required
          schema.type = this.isString(expect.type) ? expect.type : "any";
          schema.value = expect.value != null ? expect.value : "any";
          schema.ranges = this.isArray(expect.ranges) ? expect.ranges : ["any"];
          schema.length = this.isNumber(expect.length) ? expect.length : "any";
          schema.oper = this.isString(expect.oper) ? expect.oper : "eq";
      }
      return schema;
    }

    // parseSchemaStr
    parseSchema(expect, schema) {
      var length, splits;
      schema.opt = this.tail(expect, "?", true) === "?" ? "?" : "1"; // @tail() pops the '?'
      splits = expect.split(":");
      length = splits.length;
      schema.type = length >= 1 ? splits[0] : void 0;
      if (length >= 1) {
        if (splits[1][0] === "[") {
          schema.ranges = this.toRanges(splits[1]);
          schema.value = "any";
        } else if (splits[1].includes("|")) {
          schema.ranges = this.toEnums(splits[1]);
          schema.value = "any";
        } else {
          schema.ranges = "any";
          schema.value = this.toType(splits[1], schema.type);
        }
        schema.length = length >= 2 ? this.toInt(splits[2]) : "any";
        schema.oper = length >= 3 ? this.toString(splits[3]) : "eq";
        return schema;
      }
    }

    // Range parser for @toSchema(expect,op)
    toRanges(splits) {
      var array, j, l, len1, len2, len3, len4, p, q, ranges, split, str, strs;
      ranges = [];
      for (j = 0, len1 = splits.length; j < len1; j++) {
        split = splits[j];
        switch (this.type(split)) {
          case "string":
            for (l = 0, len2 = splits.length; l < len2; l++) {
              split = splits[l];
              if (this.head(split, "[[", false) === "[[" && this.tail(split, "]]", false) === "]]") {
                strs = this.toArray(split);
                for (p = 0, len3 = strs.length; p < len3; p++) {
                  str = strs[p];
                  ranges.push[this.toArray(str)];
                }
                return ranges;
              } else if (this.head(split) === "[" && this.tail(split) === "]") {
                ranges.push[this.toArray(split)];
                return ranges;
              }
            }
            break;
          case "array":
            if (this.isArray(split[0])) {
              for (q = 0, len4 = split.length; q < len4; q++) {
                array = split[q];
                ranges.push(array);
              }
              return ranges;
            } else {
              ranges.push[split];
              return ranges;
            }
        }
      }
      return ranges;
    }

    checkValuesTypes(result, expect, status, op, key, index) {
      var eType, eTypes, info, rType, types;
      rType = this.type(result);
      eType = op !== "schema" ? this.type(expect) : expect.type;
      types = ["string", "number", "boolean", "object", "array"];
      info = (function() {
        switch (false) {
          case !this.isNot(result):
            return ` Result of ${rType} is not defined\nExpect is type '${eType}'`;
          case !this.isNot(expect):
            return ` Expect of ${eType} is not defined\nResult is type '${rType}'`;
          case op !== "schema":
            if (eType === "any") {
              return "";
            } else if (etype(includes("|"))) {
              eTypes = eType.split("|");
              if (this.inArray(rType, eTypes)) {
                return "";
              } else {
                return ` Result type is '${rType}' that is not in\nExpect schema types '${eType}'`;
              }
            } else if (rType !== eType) {
              return ` Result type is '${rType}'\nExpect type is '${eType}' from schema`;
            }
            break;
          case rType === eType:
            return ` Types do not match\nResult type is '${rType}'\nExpect type is '${eType}'`;
          case rType !== "function":
            return ` Result type is 'function'\nExpect type is '${eType}'`;
          case eType !== "function":
            return ` Expect type is 'function'\nResult type is '${rType}'`;
          case !!this.inArray(rType, types):
            return ` Result is type '${rType}' an unknown type is type '${eType}'`;
          case !!this.inArray(eType, types):
            return ` Result is type '${rType}'\nExpect is type '${eType}' an unknown type`;
          default:
            return "";
        }
      }).call(this);
      if (this.isString(info)) {
        return this.examine(false, result, expect, status, op, info, key, index);
      } else {
        return status;
      }
    }

    // Equality check for "string","number","boolean" types
    valuesEq(result, expect, status, op) {
      var i, length, oper, pass, ranges, value;
      value = expect;
      if (op === "schema") {
        value = expect.value;
        ranges = expect.ranges;
        oper = (function() {
          switch (false) {
            case ranges !== "any":
              return "eq";
            case !this.isArray(ranges):
              if (this.isArray(ranges[0])) {
                return "ranges";
              } else {
                return "range";
              }
          }
        }).call(this);
      }
      status.assert.pass = (function() {
        var j, ref1;
        switch (oper) {
          case value === "any":
            return true;
          case op === "range":
            return this.inRange(result, ranges);
          case op === "ranges" && this.isArray(result):
            pass = true;
            length = Math.min(result.length, ranges.length);
            for (i = j = 0, ref1 = length; (0 <= ref1 ? j < ref1 : j > ref1); i = 0 <= ref1 ? ++j : --j) {
              if (this.isArray(result[i]) && this.isArray(ranges[i])) {
                pass = pass && this.inRange(result[i], ranges[i]);
              }
            }
            return pass;
          case "eq":
            return result === value;
          case "le":
            return result <= value;
          case "lt":
            return result < value;
          case "ge":
            return result >= value;
          case "lt":
            return result > value;
          case "ne":
            return result !== value;
          default:
            return false;
        }
      }).call(this);
      return status;
    }

    // Just a fallback when types are not fully screened
    unknownsEq(result, expect, status) {
      status.assert.pass = false;
      status.assert.info += "unknown types for comparision";
      return status;
    }

    textValue(name, value, key, index) {
      var ref;
      ref = " ";
      if (this.isString(key)) {
        ref(` at key:${key} `);
      }
      if (this.isNumber(index)) {
        ref = ` at index: ${index} `;
      }
      return `${name}${ref}where type is ${this.type(value)} and value is ${this.toString(value)}`;
    }

    // Deep object equality assertion where all matching keys are examined
    objectsEq(result, expect, status, op, level) {
      var arg, key, obj;
      for (key in result) {
        if (!hasProp.call(result, key)) continue;
        arg = result[key];
        if (expect[key] != null) {
          status = this.examine(false, arg, expect[key], status, op, "missing expect", key, null);
        }
      }
      for (key in expect) {
        if (!hasProp.call(expect, key)) continue;
        arg = expect[key];
        if ((result[key] != null) || (op === "schema" && arg.opt === "1")) {
          status = this.examine(false, result[key], arg, status, op, "missing result", key, null);
        }
      }
      for (key in expect) {
        if (!hasProp.call(expect, key)) continue;
        obj = expect[key];
        if ((result[key] != null) && (expect[key] != null)) {
          status = this.assert(result[key], arg, status, op, ++level, key, null);
        }
      }
      return status;
    }

    // Deep array equality assertion
    arraysEq(result, expect, status, op, level) {
      var i, info, j, length, ref1, value;
      value = expect;
      // Check against the schema when present
      if (op === "schema") {
        value = expect.value;
        if (value === "any") {
          status.assert.pass = true;
          return status;
        } else if (value.size !== "any" && result.length > value.size) {
          info = ` Result length exceeds the maximum size ${value.size}`;
          info += ` Result length is ${result.length}`;
          info += ` Size is ${value.size}`;
          return this.examine(false, result, expect, status, op, info, null, null);
        } else if (!this.isArray(value)) {
          return status;
        }
      }
      // Examine the array lengths
      if (result.length !== value.length) {
        info = " different array lengths";
        info += ` Result length is ${result.length}`;
        info += ` Expect length is ${value.length}`;
        status = this.examine(false, result, expect, status, op, info, null, null);
      }
      // Assert each value within the minimum length of the result and expect arrays
      length = Math.min(result.length, expect.length);
      for (i = j = 0, ref1 = length; (0 <= ref1 ? j < ref1 : j > ref1); i = 0 <= ref1 ? ++j : --j) {
        status = this.assert(result[i], expect[i], status, op, ++level, null, i);
      }
      return status;
    }

    report(result, expect, op, status) {
      var eq;
      this.noop(op);
      eq = status.assert.pass ? "is" : "not";
      if (this.blockClear) {
        this.blockText = "";
      }
      this.statusText = `\n${status.assert.text} `;
      if (status.result.type !== "function") {
        this.statusText += `${eq} ${this.toString(expect)}`;
      }
      if (this.isString(status.assert.info)) {
        this.statusText += status.assert.info;
      }
      if (this.verbose || !status.assert.pass) {
        this.statusText += `\n   ${this.textValue("Result", this.type(result), result)}`;
      }
      if (this.verbose || !status.assert.pass) {
        this.statusText += `\n   ${this.textValue("Expect", this.type(expect), expect)}`;
      }
      if (!this.statusClear) {
        //statusText += "\n"+@code                           if @isString(@code) and ( @verbose or not status.assert.pass )
        this.blockText += this.statusText;
      }
      this.statusClear = false;
      this.blockClear = false;
      if (this.isDef(this.stream)) {
        this.stream.publish(this.statusSubject, status);
        this.stream.publish(this.stringSubject, status);
      }
    }

    status() {
      this.statusClear = true;
      return this.statusText;
    }

    block() {
      this.blockClear = true;
      return this.blockText;
    }

    async runUnitTests(paths) {
      var j, len1, modulePath, path;
      for (j = 0, len1 = paths.length; j < len1; j++) {
        path = paths[j];
        modulePath = this.path(path);
        if (this.logToConsole) {
          console.log(`\n-- Started Unit Testing for: ${modulePath.name} in ${modulePath.path}`);
        }
        await import( path /* @vite-ignore */ );
      }
      this.summary();
    }

    path(path) {
      var dirs, module;
      dirs = path.split("/");
      module = this.tail(dirs).split("-")[0];
      this.modules[module] = {
        name: module,
        path: path
      };
      if (this.debug) {
        console.log("Tester.path(path)", {
          path: path,
          dirs: dirs,
          module: module
        });
      }
      return this.modules[module];
    }

    summary(module = null) {
      var fail, failCount, fullCount, j, l, len1, len2, pass, passCount, path, ref1, ref2, summaryText;
      path = (module != null) && (this.modules[module] != null) ? this.modules[module].path : "?";
      if (this.debug) {
        console.log("Tester.summary(module)", {
          module: module,
          modules: this.modules,
          key: this.modules[module],
          path: path
        });
      }
      summaryText = "";
      if (module != null) {
        passCount = 0;
        failCount = 0;
        ref1 = this.passed;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          pass = ref1[j];
          if (pass.assert.module === module) {
            ++passCount;
          }
        }
        ref2 = this.failed;
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          fail = ref2[l];
          if (fail.assert.module === module) {
            ++failCount;
          }
        }
        fullCount = passCount + failCount;
        summaryText += `\n\n-- Summary - for ${module} in ${path}`;
        summaryText += `\n   ${this.pad(passCount, fullCount)} tests passed`;
        summaryText += `\n   ${this.pad(failCount, fullCount)} tests failed`;
        summaryText += `\n   ${this.pad(fullCount, fullCount)} tests total`;
      } else {
        fullCount = this.passed.length + this.failed.length;
        summaryText += `\n\n-- Summary - for all tests`;
        summaryText += `\n   ${this.pad(this.passed.length, fullCount)} tests passed`;
        summaryText += `\n   ${this.pad(this.failed.length, fullCount)} tests failed`;
        summaryText += `\n   ${this.pad(fullCount, fullCount)} tests total`;
      }
      if (this.isDef(this.stream) && this.stream.hasSubscribers(this.summarySubject)) {
        this.stream.publish(this.summarySubject, summaryText);
      }
      summaryText = this.block() + summaryText; // Prepend any block statuses
      
      // Archive since all tests are complete
      if (this.archive) {
        this.archiveLocal(this.failed, this.passed);
        this.reviewsLocal({
          failed: false,
          passed: false
        });
      }
      return summaryText;
    }

    // The 9 fundamental type Assertions that leverage @type(arg) the improved typeof(arg)
    // In addition isInt isFloat isBoolean isArray isObject can optionally chech strings
    isString(s) {
      return this.isType(s, "string") && s.length > 0 && s !== "None";
    }

    isInt(i, sc = false) {
      return (this.isType(i, "int") && !isNaN(i)) || (sc && this.isStringInt(i));
    }

    isFloat(f, sc = false) {
      return (this.isType(f, "float") && !isNaN(f)) || (sc && this.isStringFloat(f));
    }

    isBoolean(b, sc = false) {
      return this.isType(b, "boolean") || (sc && this.isStringBoolean(b));
    }

    isObject(o, sc = false) {
      return this.isType(o, "object") || (sc && this.isStringObject(o));
    }

    isRegex(r) {
      return this.isType(r, "regex");
    }

    isFunction(f) {
      return this.isType(f, "function");
    }

    isNull(m) {
      return this.isType(m, "null");
    }

    isUndef(u) {
      return this.isType(u, "undefined");
    }

    isBigInt(b) {
      return typeof b === "bigint"; // Will incorporate into type
    }

    isSymbol(s) {
      return typeof s === "symbol"; // Will incorporate into type
    }

    
      // Set type for asserting uniformly typed arrays and sc=true for determining if a string is an array
    isArray(a, type = null, sc = false) {
      return (this.isType(a, "array") && (a.length != null) && a.length > 0 && this.isArrayTyped(a, type)) || (sc && this.isStringArray(a));
    }

    
      // Aggregate and special value assertions
    isType(v, t) {
      return this.type(v) === t;
    }

    isDef(d) {
      return this.type(d) !== ("null" || "undefined");
    }

    isNumber(n) {
      return this.type(n) === ("int" || "float");
    }

    isNot(d) {
      return !this.isDef(d);
    }

    isNaN(n) {
      return Number.isNaN(n); // @isNumber(n) and
    }

    isArrayTyped(a, t) {
      var e, j, len1;
      if (this.isNull(t)) {
        return true;
      }
      if (!this.isArray(a)) {
        return false;
      }
      for (j = 0, len1 = a.length; j < len1; j++) {
        e = a[j];
        if (this.type(e) !== t) {
          return false;
        }
      }
      return true;
    }

    isArrayMixed(a) {
      var e, j, len1, type;
      if (!this.isArray(a)) {
        return false;
      }
      type = this.type(a[0]);
      for (j = 0, len1 = a.length; j < len1; j++) {
        e = a[j];
        if (this.type(e) !== type) {
          return false;
        }
      }
      return false;
    }

    // Containment assertions where args are always ( value, container )
    inString(e, s) {
      return this.isString(s) && s.includes(e);
    }

    inArray(e, a) {
      return this.isArray(a) && a.includes(e);
    }

    inObject(k, o) {
      return this.isObject(o) && this.isDef(o[k]) && o.hasOwnProperty(k);
    }

    inRange(i, r) {
      return this.isRange(r) && this.isType(i, "int") && r[0] <= i && i <= r[1];
    }

    inTolerance(f, t) {
      return this.isTolerance(t) && this.isType(f, "float") && t[0] - t[2] <= f && f <= t[1] + t[2];
    }

    inBetween(s, b) {
      return this.isBetween(r) && this.isType(s, "string") && b[0] - b[2] <= s && s <= b[1] + b[2];
    }

    toKeys(o) {
      if (this.isObject(o)) {
        return Object.keys(o);
      } else {
        return [];
      }
    }

    time() {
      return new Date().getTime();
    }

    // -- More assertions --

      // Checks for offical child key which starts with capital letter and isnt an _ or $
    isChild(key) {
      var a, b;
      a = key.charAt(0);
      b = key.charAt(key.length - 1);
      return a === a.toUpperCase() && a !== "$" && b !== "_";
    }

    // Check if an object or array or string is empty
    isEmpty(e) {
      if (this.isNot(e)) {
        return false;
      }
      switch (this.isType(e)) {
        case "object":
          return Object.getOwnPropertyNames(e).length === 0;
        case "array":
          return e.length === 0;
        case "string":
          return e.length === 0;
        default:
          return false; // Look into
      }
    }

    isStringFloat(str) {
      var regex;
      if (this.isString(str)) {
        regex = /^-?\d+(?:[.,]\d*?)?$/;
        return regex.test(str);
      } else {
        return false;
      }
    }

    isStringInt(str) {
      var regex;
      if (this.isString(str)) {
        regex = /^-?\d+$/;
        return regex.test(str);
      } else {
        return false;
      }
    }

    isStringBoolean(str) {
      return this.isString(str) && (str === "true" || str("false"));
    }

    isStringArray(str) {
      return this.isStringEnclosed("[", str, "]");
    }

    isStringObject(str) {
      return this.isStringEnclosed("{", str, "}");
    }

    // Tests if string is enclosed good for [array] and {object}
    isStringEnclosed(beg, str, end) {
      var s;
      if (this.isString(str)) {
        s = str.trim();
        return s.startsWith(beg) && s.endsWith(end);
      } else {
        return false;
      }
    }

    // Converters
    toType(arg, type) {
      switch (type) {
        case "string":
          return this.toString(arg);
        case "int":
          return this.toInt(arg);
        case "float":
          return this.toFloat(arg);
        case "boolean":
          return this.toBoolean(arg);
        case "array":
          return this.toArray(arg);
        case "object":
          return this.toObject(arg);
        default:
          console.error("Tester.toType(type,arg) unknown type", {
            type: type,
            arg: arg
          });
          return null;
      }
    }

    // enclose a 'string'
    // enclose("abc",   '"'  )       # returns "abc" - good for JSON keys and values
    // enclose("123",   "'"  )       # returns '123'
    // enclose("xyz",   "()" )       # returns (xyz)
    // enclose("d,e,f", "[]" )       # returns [d,e,f]
    // enclose("a:x,b:y,c:z", "[]" ) # returns {a:x,b:y,c:z}
    enclose(str, enc = "") {
      if (enc.length === 2) {
        `${enc.charAt(0)}${str}${enc.charAt(1)}`;
      }
      if (enc.length === 1) {
        return `${enc.charAt(0)}${str}${enc.charAt(0)}`;
      } else {
        return str;
      }
    }

    toString(arg, enc = "") {
      var j, key, len1, str, type, val;
      str = "";
      type = this.type(arg);
      switch (type) {
        case "string":
          arg;
          break;
        case "int":
          parseInt(arg);
          break;
        case "float":
          parseFloat(arg);
          break;
        case "boolean":
          if (arg) {
            "true";
          } else {
            "false";
          }
          break;
        case "object": // This combination of travesal and recursion is cleaner than JSON.stringify()
          str += "{ ";
          for (key in arg) {
            if (!hasProp.call(arg, key)) continue;
            val = arg[key];
            str += key + ":" + this.enclose(this.toString(val), '"') + ", ";
          }
          str = str.substring(0, str.length - 2); // remove trailing comma and space
          str += " }";
          break;
        case "array": // This combination of travesal and recursion is cleaner than JSON.stringify()
          str += "[ ";
          for (j = 0, len1 = arg.length; j < len1; j++) {
            arg = arg[j];
            str += this.toString(arg) + ", ";
          }
          str = str.substring(0, str.length - 2); // remove trailing comma  and space
          str += " ]";
          break;
        case "function":
          this.toInfo("toString(arg)", arg, "function", "string", "?function?", "?function?");
          break;
        case "null":
          "null";
          break;
        case "undefined":
          "undefined";
          break;
        case "bigint":
          arg.toString();
          break;
        case "symbol":
          arg.toString(); // return of arg.toString() could be a hail mary
          break;
        default:
          this.toInfo("toString(arg)", arg, type, "string", arg.toString(), arg.toString());
      }
      if (type !== ("object" || "array") && enc.length > 0) {
        return this.enclose(str, enc);
      } else {
        return str;
      }
    }

    toFloat(arg) {
      var type;
      type = this.type(arg);
      switch (type) {
        case "float":
          return arg;
        case "int":
          return parseFloat(arg.toFixed(1)); // Coerces an 'int' like '1' to a 'float' like '1.0'
        case "string":
          if (this.isStringFloat(arg)) {
            return parseFloat(arg);
          } else {
            return this.toInfo("toFloat(arg)", arg, "string", "float", "NaN", 0/0);
          }
          break;
        default:
          return this.toInfo("toFloat(arg)", arg, type, "float", "NaN", 0/0);
      }
    }

    toInt(arg) {
      var type;
      type = this.type(arg);
      switch (type) {
        case "int":
          return arg;
        case "float":
          return Math.round(arg);
        case "string":
          if (this.isStringInt(arg)) {
            return parseInt(arg);
          } else {
            return this.toInfo("toInt(arg)", arg, "string", "int", "NaN", 0/0);
          }
          break;
        default:
          return this.toInfo("toInt(arg)", arg, type, "int", "NaN", 0/0);
      }
    }

    toInfo(method, arg, type, typeTo, retnStr, retn) {
      this.info += `\n  Tester.${method} unable to convert ${this.toString(arg)} of '${type}' to'${typeTo}' returning ${retnStr}`;
      return retn;
    }

    toBoolean(arg) {
      var type;
      type = this.type(arg);
      switch (type) {
        case "boolean":
          return arg;
        case "string":
          switch (arg) {
            case "true":
              return true;
            case "false":
              return false;
            default:
              return this.toInfo("toBoolean(arg)", arg, type, "boolean", "false", false);
          }
          break;
        case "int":
          return arg !== 0; // check 0   false may not be a convention
        case "float":
          return arg !== 0.0; // check 0.0 false may not be a convention
        default:
          return this.toInfo("toBoolean(arg)", arg, type, "boolean", "false", false);
      }
    }

    toArray(arg, type, sep = ",") {
      var array, j, len1, str, strs;
      type = this.type(arg);
      switch (type) {
        case "array":
          return arg;
        case "string":
          str = arg.trim();
          if (this.head(arg) === "[" && this.tail(arg) === "]") { // Strip off brackets
            arg = this.slice(arg, 2, arg.length - 1);
          }
          array = [];
          strs = this.slice(arg, 2, arg.length - 1).split(sep);
          for (j = 0, len1 = strs.length; j < len1; j++) {
            str = strs[j];
            array.push(this.toType(str, type));
          }
          return array;
        default:
          return this.toInfo("toArray(arg)", arg, type, "array", "[]", []);
      }
    }

    toObject(arg) {
      var i, j, obj, ref1, results, type;
      obj = {};
      type = this.type(arg);
      switch (type) {
        case "object":
          return obj = arg;
        case "array":
          results = [];
          for (i = j = 0, ref1 = arg.length; (0 <= ref1 ? j < ref1 : j > ref1); i = 0 <= ref1 ? ++j : --j) {
            results.push(obj[i] = arg[i]);
          }
          return results;
          break;
        case "number":
        case "boolean":
        case "function":
          return obj[type] = arg;
        case "string":
          return obj = arg.split(",").map((keyVal) => {
            return keyVal.split(":").map((arg) => {
              return arg.trim();
            });
          }).reduce((acc, cur) => {
            acc[cur[0]] = cur[1];
            return acc({}); // acc accumulator cur current
          });
        default:
          return this.toInfo("toObject(arg)", arg, type, "object", "{}", {});
      }
    }

    // -- Assertion for range with type='int', tolerane with type='float' and 'between' with type='string'
    isRange(r) {
      return this.isArray(r, "int") && r.length === 2 && r[0] <= r[1];
    }

    isWithin(w) {
      return this.isArray(r, "float") && w.length === 3 && w[0] - w[2] <= w[1] + w[2];
    }

    isBetween(b) {
      return this.isArray(r, "string") && r.length === 2 && r[0] <= r[1];
    }

    toRange(arg) {
      var type, zero;
      type = this.type(arg);
      zero = 0; //  0 is the default minimum
      if (this.isRange(arg)) {
        return arg; // the 2 int [min,max] are present and even verified
      } else if (type === "int") {
        return [zero, arg];
      } else if (type === "float") {
        return [zero, this.toInt(arg)];
      } else if (this.isArray(arg, 'int') && arg.length === 1) {
        return [zero, arg[0]];
      } else {
        return this.toInfo("toRange(arg)", arg, type, "range", "[]", []);
      }
    }

    toWithin(arg) {
      var type, zero;
      type = this.type(arg);
      zero = ""; // is "" the monoid zero or the sortable for string?
      if (this.isWithin(arg)) {
        return arg; // the 2 strings [min,max] are present and even verified
      } else if (type === "string") {
        return [zero, arg];
      } else if (this.isArray(arg, 'string') && arg.length === 1) {
        return [zero, arg[0]];
      } else {
        return this.toInfo("toWithin(arg)", arg, type, "within", "[]", []);
      }
    }

    toBetween(arg) {
      var flt, tolerance, type, zero;
      type = this.type(arg);
      zero = 0.0; //  0.0   is the default minimum
      tolerance = 0.001; //  0.001 is the default tokerance multiplier of the max value
      flt = this.toFloat(arg);
      if (this.isBetween(arg)) {
        return arg; // the 3 floats [min,max,tol] are present and even verified
      } else if (type === "int") {
        return [zero, flt, flt * tolerance];
      } else if (type === "float") {
        return [zero, arg, arg * tolerance];
      } else if (this.isArray(arg, 'float')) {
        if (arg.length === 1) {
          return [zero, arg[0], flt * tolerance];
        } else if (arg.length === 2) {
          return [arg[0], arg[1], flt * tolerance];
        }
      } else {
        return this.toInfo("toBetween(arg)", arg, type, "between", "[]", []);
      }
    }

    // Return a number with a fixed number of decimal places
    toFixed(arg, dec = 2) {
      var num;
      num = (function() {
        switch (this.type(arg)) {
          case "int":
          case "float":
            return arg;
          case "string":
            return parseFloat(arg);
        }
      }).call(this);
      return num.toFixed(dec);
    }

    toCap(str) {
      return str.charAt(0).toUpperCase() + str.substring(1);
    }

    unCap(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    }

    head(v, action = false, pop = false) {
      var arg;
      arg = null;
      switch (this.type(v)) {
        case "array":
          switch (this.type(action)) {
            case "boolean":
              arg = v[0];
              if (action) {
                v = v.shift();
              }
          }
          break;
        case "string":
          switch (this.type(action)) {
            case "boolean":
              arg = v.charAt(0);
              if (action) {
                v = v.substring(1);
              }
              break;
            case "string" && v.startsWith(action):
              arg = action;
              if (pop) {
                v = v.substring(action.length);
              }
          }
      }
      return pop;
    }

    tail(v, action = false) {
      var pop;
      pop = null;
      switch (this.type(v)) {
        case "array":
          pop = v[v.length - 1];
          if (this.isType(action, "boolean") && action) {
            v = v.pop();
          }
          break;
        case "string":
          switch (this.type(action)) {
            case "boolean":
              pop = v.charAt(v.length - 1);
              if (action) {
                v = v.substring(0, v.length - 1);
              }
              break;
            case "string" && v.endsWith(action):
              pop = action;
              v = v.substring(0, v.length - action.length);
          }
      }
      return pop;
    }

    // Unlike the built in Array v.slice(beg,end) where beg is a zero-based index and end

      // Here beg starts at 1 and end includes the last position or is set to beg if ommitted
    //  an array slice( ["a","b","c"], 1, 2 ) returns ["a","b"]
    //  an array slice( ["a","b","c"], 2    ) returns ["b"]
    //  a string slice( ["abc"],       1, 2 ) returns   "ab"
    //  a string slice( ["abc"],       2    ) returns   "b"
    // where with Array.slice() it is open
    slice(v, beg, end = null, remove = false) {
      var pop;
      end(this.isDef(end) ? end : beg);
      pop = null;
      switch (this.type(v)) {
        case "array":
          pop = remove ? v.splice(beg - 1, end + 1) : v.slice(beg - 1, end + 1);
          break;
        case "string":
          pop = v.splice(beg - 1, end + 1);
          if (remove) {
            v = v.substring(0, beg - 1) + v.substring(end + 1);
          }
      }
      return pop;
    }

    pad(n, m) {
      var i, j, len, ref1, ref2, str, tot;
      len = this.numDigits(n);
      tot = this.numDigits(m);
      str = n.toString();
      for (i = j = ref1 = len, ref2 = tot; (ref1 <= ref2 ? j < ref2 : j > ref2); i = ref1 <= ref2 ? ++j : --j) {
        str = " " + str;
      }
      return str;
    }

    numDigits(n) {
      return Math.max(Math.floor(Math.log10(Math.abs(n))), 0) + 1;
    }

    // A deliberate do nothing consumer of arguments and variables
    noop(...args) {
      if (args) {
        false;
      }
    }

    type(arg, lowerCase = true) {
      var str, tok, typ;
      str = Object.prototype.toString.call(arg);
      tok = str.split(" ")[1];
      typ = tok.substring(0, tok.length - 1);
      typ = typ === "Number" ? Number.isInteger(arg) ? "Int" : "Float" : void 0;
      if (lowerCase) {
        return typ.toLowerCase();
      } else {
        return typ;
      }
    }

    scheme(arg, op = "eq") {
      if (op === "schema") {
        return "schema";
      } else {
        return this.type(arg);
      }
    }

    // A more detail type that returns basic types, class, object and function name in upper case
    klass(arg) {
      var typ;
      typ = this.type(arg, false); // Start with basic type to catch "Null" and "Undefined"
      switch (typ) {
        case "Null":
          return "Null";
        case "Undefined":
          return "Undefined";
        case "Function":
          return arg.name;
        case "Object":
          return arg.constructor.name;
        default:
          return typ;
      }
    }

    // mdnType from
    mdnType(obj, showFullClass) {
      var deepType;
      // get toPrototypeString() of obj (handles all types)
      if (showFullClass && typeof obj === "object") {
        return Object.prototype.toString.call(obj);
      }
      if (obj === null) {
        return (obj + '').toLowerCase(); // implicit toString() conversion
      }
      deepType = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
      if (deepType === "generatorfunction") {
        return "function";
      }
      // Prevent overspecificity (for example, [object HTMLDivElement], etc).
      // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
      // String.prototype.match is universally supported.
      if (deepType.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/)) {
        return deepType;
      } else {
        if (typeof obj === 'object' || typeof obj === 'function') {
          return 'object';
        } else {
          return typeof obj;
        }
      }
    }

    // Stream is an optional libary for publising statusObject to UIs like RxJS
    injectStream(stream) {
      var type;
      type = this.klass(stream);
      if (type === "Stream") {
        this.stream = stream;
      } else {
        console.error("Tester.injectStream( stream ) stream klass must be 'Stream' not", type);
      }
    }

    archiveLocal(failed, passed) {
      localStorage.setItem("TestsFailed", JSON.stringify(failed));
      localStorage.setItem("TestsPassed", JSON.stringify(passed));
    }

    reviewsLocal(reviewFailed, reviewPassed) {
      var failLocals, failStatus, failStatuses, j, l, len1, len2, passLocals, passStatus, passStatuses;
      if (!this.debug) {
        return;
      }
      if (reviewFailed) {
        failLocals = localStorage.getItem("TestsFailed");
        if (failLocals != null) {
          failStatuses = JSON.parse(failLocals);
          for (j = 0, len1 = failStatuses.length; j < len1; j++) {
            failStatus = failStatuses[j];
            if (this.logToConsole) {
              console.log(failStatus);
            }
          }
        }
      }
      if (reviewPassed) {
        passLocals = localStorage.getItem("TestsPassed");
        if (passLocals != null) {
          passStatuses = JSON.parse(passLocals);
          for (l = 0, len2 = passStatuses.length; l < len2; l++) {
            passStatus = passStatuses[l];
            if (this.logToConsole) {
              console.log(passStatus);
            }
          }
        }
      }
    }

  };

  // An improved typeof() that follows the convention by returning types in lower case by default.
  // The basic types similar to typeof() returned are:
  Tester.types = ["string", "int", "float", "boolean", "array", "object", "regex", "date", "function", "bigint", "symbol", "null", "undefined"];

  Tester.typeofs = ["string", "number", "boolean", "object", "function", "bigint", "symbol", "null", "undefined"];

  return Tester;

}).call(this);

// -- ES6 exports for single tester instance and its test() and unit() methods
//   tester is instanciates once on its first import subseqent imports
//   get this single instance that holds all testing state
export var tester = new Tester();

test = tester.test;

unit = tester.unit;

fits = tester.fits;

export {
  test,
  unit,
  fits
};

/*
    isOrdered:(o)     -> ( @isNumber(o) and not isNaN(i) ) or @isString(o)
 * if range.length = 3 min=range[0], max=range[1] and tol=range[2]
 * if range.length = 2 min=range[0], max=range[1] and tol=0
 * if range.length = 1 min=0,        max=range[0] and  tol=0
  inRange:( result, range ) ->
    pass  = true
    rType = @type(result)
    if @inArray(rType,["string","number"])
      len = range.length
      min = 0
      max = range[0]
      tol = 0
      if len >= 2
        min = range[0]
        max = range[1]
        tol = range[2] if len is 3
      pass = pass and ( min-tol <= result and result <= max+tol )
    else if rType is "array" and @inArray(@type(result[0]),["string","number"])
      for arg in result
        pass = pass and @inRange( arg, range )
    pass
 */

//# sourceMappingURL=Tester.js.map
