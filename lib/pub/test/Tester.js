var Tester, fits, test, unit,
  hasProp = {}.hasOwnProperty;

Tester = class Tester {
  constructor() {
    // -- test -- Pass a closeure in the form of  (t) => { code... }
    // Modeled like the Ava JavaScipt test framework
    // Imports: import { test }     from "../test/Tester.js"
    // Specify: test( text, (t) => { code... }
    // Example:
    //   const add = ( a, b ) ->
    //     a + b
    //   test('2 + 3 = 5', (t) ->
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
    this.run = this.run.bind(this);
    this.describe = this.describe.bind(this);
    this.runUnitTests = this.runUnitTests.bind(this);
    this.summary = this.summary.bind(this);
    // Type Assertions that leverage @type(arg) the improved typeof(arg)
    this.isType = this.isType.bind(this);
    this.isNull = this.isNull.bind(this);
    this.isUndef = this.isUndef.bind(this);
    this.isDef = this.isDef.bind(this);
    this.isNot = this.isNot.bind(this);
    this.isStr = this.isStr.bind(this);
    this.inStr = this.inStr.bind(this);
    this.isNum = this.isNum.bind(this);
    this.isNaN = this.isNaN.bind(this);
    this.isObj = this.isObj.bind(this);
    this.inObj = this.inObj.bind(this);
    this.toKeys = this.toKeys.bind(this);
    this.isVal = this.isVal.bind(this);
    this.isFunc = this.isFunc.bind(this);
    this.isArray = this.isArray.bind(this);
    this.isBoolean = this.isBoolean.bind(this);
    this.inArray = this.inArray.bind(this);
    this.inRange = this.inRange.bind(this);
    this.atIndex = this.atIndex.bind(this);
    this.time = this.time.bind(this);
    this.hasInteger = this.hasInteger.bind(this);
    this.hasFloat = this.hasFloat.bind(this);
    this.hasCurrency = this.hasCurrency.bind(this);
    this.hasEmail = this.hasEmail.bind(this);
    // Converters
    this.toStr = this.toStr.bind(this);
    // Check if an object or array or string is empty
    this.isEmpty = this.isEmpty.bind(this);
    // Checks for offical child key which starts with capital letter and isnt an _ or $
    this.isChild = this.isChild.bind(this);
    // An improved typeof() that follows the convention by returning types in lower case
    // by default. The basic types returned are:
    // boolean number string function object array date regexp undefined null
    this.type = this.type.bind(this);
    this.scheme = this.scheme.bind(this);
    // A more detail type that returns basic types, class, object and function name in upper case
    this.klass = this.klass.bind(this);
    this.archiveLocal = this.archiveLocal.bind(this);
    this.stream = null; // Optional streaming publisher module that is set by @injectStream( stream )
    
    // Key settings that can be reconfigured through setOptions( options )
    this.testing = true; // When false all testing is turned which allows tests to remain in code
    this.logToConsole = true;
    this.archive = true; // When true archives test status object to localStorage TestsPassed and TestFail
    this.verbose = false; // Adds addition and sometimes mind numbing detail to testStatus objects
    this.debug = false; // Turns on debugs call to console.log(...)
    this.schemaKey = "schema"; // Specifies the key in a JSON file to look up its validating schema in JSON
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
    this.text = null; // set by test() that is passed inside eq() and sent to run()
    this.statusText = "";
    this.statusClear = true;
    this.blockText = "";
    this.blockClear = true;
    this.code = "";
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
    if (this.debug) {
      console.log("Tester.fits(result,schema)", {
        type: this.type(result),
        result: result,
        schema: schema,
        status: status
      });
    }
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
    module = text.split('.')[0];
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
  //   Strong type checking with @type(val) so asserions are only test when types match
  //   Skips over @type(val) = "function"
  assert(result, expect, status, op, level = 0, key = null, index = null) {
    // Covert expect to a schema object if op is schema
    expect = this.toSchema(expect, op);
    // Check values and types
    status = this.checkValuesTypes(result, expect, status, op, key, index);
    // Perform all comparisions
    if (status.assert.pass) {
      status = (function() {
        switch (this.type(result)) {
          case 'string':
          case 'number':
          case 'boolean':
            return this.valuesEq(result, expect, status, op);
          case 'object':
            return this.objectsEq(result, expect, status, op, level);
          case 'array':
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
    expect = op === "schema" && !isSchema(expect) ? this.toSchema(expect, op) : expect;
    value = op === "schema" ? expect.value : expect;
    eType = op === "schema" ? expect.type : this.type(expect);
    prefix = pass ? "-- Passed -- " : "-- Failed -- ";
    status.assert.text = prefix + status.assert.text;
    status.assert.pass = pass && status.assert.pass; // Asserts a previous status.assert.pass is false
    status.assert.info += info;
    status.assert.code = this.isStr(this.code) ? this.code : "";
    status.result.text += this.textValue("Result", this.type(result), result, key, index);
    status.expect.text += this.textValue("Expect", eType, value, key, index);
    return status;
  }

  // Convert expect to a schema object if op is schema
  isSchema(v) {
    return (v.op != null) && (v.type != null) && (v.value != null) && (v.range != null) && (v.op != null) && (v.size != null);
  }

  toSchema(expect, op) {
    var schema;
    if (op !== "schema") {
      return expect;
    }
    schema = {
      opt: false,
      type: "unknown",
      value: "any",
      range: "any",
      op: "eq",
      size: "any"
    };
    switch (this.type(expect)) {
      case "string":
        schema.opt = this.tail(expect, "?") === "?";
        schema.type = expect; // @tail(expect,"?") removed the trailing '?'
        break;
      case "object":
        schema.opt = this.isBoolean(expect.opt) ? expect.opt : false;
        schema.type = this.isString(expect.type) ? expect.type : "string";
        schema.value = expect.value != null ? expect.value : "any";
        schema.range = this.isArray(expect.range) ? expect.range : "any";
        schema.size = this.isNum(expect.size) ? expect.size : "any";
        schema.op = expect.op != null ? expect.op : "eq";
    }
    return schema;
  }

  checkValuesTypes(result, expect, status, op, key, index) {
    var eType, eTypes, info, rType, types;
    rType = this.type(result);
    eType = op !== "schema" ? this.type(expect) : expect.type;
    types = ["string", "number", "boolean", "object", "array"];
    info = (function() {
      switch (false) {
        case !this.isNot(result):
          return ` Result of ${rType} is not defined\nExpect is type '${eType}`;
        case !this.isNot(expect):
          return ` Expect of ${eType} is not defined\nResult is type '${rType}`;
        case op !== 'schema':
          if (eType === 'any') {
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
    if (this.isStr(info)) {
      return this.examine(false, result, expect, status, op, info, key, index);
    } else {
      return status;
    }
  }

  // Equality check for "string","number","boolean" types
  valuesEq(result, expect, status, op) {
    var range, value;
    value = op === "schema" ? expect.value : expect;
    op = op === "schema" && expect.range !== "any" ? 'range' : expect.op;
    status.assert.pass = (function() {
      switch (false) {
        case value !== "any":
          return true;
        case op !== "range":
          range = expect.range;
          if (range.length === 2) {
            range[0] <= value && value <= range[1];
          }
          if (range.length === 3) {
            return range[0] - range[2] <= value && value <= range[1] - range[2];
          }
          break;
        case op !== "eq":
          return result === value;
        case op !== "le":
          return result <= value;
        case op !== "lt":
          return result < value;
        case op !== "ge":
          return result >= value;
        case op !== "lt":
          return result > value;
        case op !== "neq":
          return result !== value;
        default:
          return false;
      }
    })();
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
    if (this.isStr(key)) {
      ref(` at key:${key} `);
    }
    if (this.isNum(index)) {
      ref = ` at index: ${index} `;
    }
    return `${name}${ref}where type is ${this.type(value)} and value is ${this.toStr(value)}`;
  }

  // Deep object equality assertion where all matching keys are examined
  objectsEq(result, expect, status, op, level) {
    var key, obj, val;
    for (key in result) {
      if (!hasProp.call(result, key)) continue;
      val = result[key];
      if (expect[key] != null) {
        status = this.examine(false, val, expect[key], status, op, "missing expect", key, null);
      }
    }
    for (key in expect) {
      if (!hasProp.call(expect, key)) continue;
      val = expect[key];
      if (result[key] != null) {
        status = this.examine(false, result[key], val, status, op, "missing result", key, null);
      }
    }
    for (key in expect) {
      if (!hasProp.call(expect, key)) continue;
      obj = expect[key];
      if ((result[key] != null) && (expect[key] != null)) {
        status = this.assert(result[key], val, status, op, ++level, key, null);
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
      if (value === 'any') {
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

  report(status, result, expect) {
    var eq;
    eq = status.assert.pass ? 'is' : 'not';
    if (this.blockClear) {
      this.blockText = "";
    }
    this.statusText = `\n${status.assert.text} `;
    if (status.result.type !== "function") {
      this.statusText += `${eq} ${this.toStr(expect)}`;
    }
    if (this.isStr(status.assert.info)) {
      this.statusText += status.assert.info;
    }
    if (this.verbose || !status.assert.pass) {
      this.statusText += `\n   ${this.textResult(status, result)}`;
    }
    if (this.verbose || !status.assert.pass) {
      this.statusText += `\n   ${this.textExpect(status, expect)}`;
    }
    if (!this.statusClear) {
      //statusText += "\n"+@code              if @isStr(@code) and ( @verbose or not status.assert.pass )
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
      console.log('Tester.path(path)', {
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
      console.log('Tester.summary(module)', {
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

  isType(v, t) {
    return this.type(v) === t;
  }

  isNull(d) {
    return this.isType(d, 'null');
  }

  isUndef(d) {
    return this.isType(d, 'undefined');
  }

  isDef(d) {
    return this.type(d) !== 'null' && this.type(d) !== 'undefined';
  }

  isNot(d) {
    return !this.isDef(d);
  }

  isStr(s) {
    return this.isType(s, "string") && s.length > 0 && s !== 'None';
  }

  inStr(s, e) {
    return this.isStr(s) && s.indexOf(e) > -1;
  }

  isNum(n) {
    return this.isType(n, "number");
  }

  isNaN(n) {
    return this.isNum(n) && Number.isNaN(n);
  }

  isObj(o) {
    return this.isType(o, "object");
  }

  inObj(o, k) {
    return this.isObj(o) && this.isDef(o[k]) && o.hasOwnProperty(k);
  }

  toKeys(o) {
    if (this.isObj(o)) {
      return Object.keys(o);
    } else {
      return [];
    }
  }

  isVal(v) {
    return this.isType(v, "number") || this.isType(v, "string") || this.isType(v, "boolean");
  }

  isFunc(f) {
    return this.isType(f, "function");
  }

  isArray(a) {
    return this.isType(a, "array") && (a.length != null) && a.length > 0;
  }

  isBoolean(v) {
    return this.isType(a, "array");
  }

  inArray(a, e) {
    return this.isArray(a) && a.includes(e);
  }

  inRange(a, i) {
    return this.isArray(a) && 0 <= i && i < a.length;
  }

  atIndex(a, e) {
    if (this.isArray(a)) {
      return a.indexOf(e);
    } else {
      return -1;
    }
  }

  time() {
    return new Date().getTime();
  }

  hasInteger(s) {
    return this.isStr(s) && /^\s*(\+|-)?\d+\s*$/.test(s);
  }

  hasFloat(s) {
    return this.isStr(s) && /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s);
  }

  hasCurrency(s) {
    return this.isStr(s) && /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s);
  }

  hasEmail(s) {
    return this.isStr(s) && /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s);
  }

  head(v, action = false) {
    var pop;
    pop = null;
    switch (this.type(v)) {
      case 'array':
        switch (this.type(action)) {
          case 'boolean':
            pop = v[0];
            if (action) {
              v = v.shift();
            }
        }
        break;
      case 'string':
        switch (this.type(action)) {
          case 'boolean':
            pop = v.charAt(0);
            if (action) {
              v = v.substring(1);
            }
            break;
          case 'string' && v.startsWith(action):
            pop = action;
            v = v.substring(action.length);
            break;
          case 'number':
            pop = v.charAt(action);
            if (action) {
              v = v.shift();
            }
        }
    }
    return pop;
  }

  tail(v, action = false) {
    var pop;
    pop = null;
    switch (this.type(v)) {
      case 'array':
        pop = v[v.length - 1];
        if (this.isType(action, "boolean") && action) {
          v = v.pop();
        }
        break;
      case 'string':
        switch (this.type(action)) {
          case 'boolean':
            pop = v.charAt(v.length - 1);
            if (action) {
              v = v.substring(0, v.length - 1);
            }
            break;
          case 'string' && v.endsWith(action):
            pop = action;
            v = v.substring(0, v.length - action.length);
        }
    }
    return pop;
  }

  // Unlike the built in Array v.slice(beg,end) where beg is a zero-based index and end

    // Here beg starts at 1 and end includes the last position or is set to beg if ommitted
  //  an array slice( ['a','b','c'], 1, 2 ) returns ['a','b']
  //  an array slice( ['a','b','c'], 2    ) returns ['b']
  //  a string slice( ['abc'],       1, 2 ) returns   'ab'
  //  a string slice( ['abc'],       2    ) returns   'b'
  // where with Array.slice() it is open
  slice(v, beg, end = null, remove = false) {
    var pop;
    end(this.isDef(end) ? end : beg);
    pop = null;
    switch (this.type(v)) {
      case 'array':
        pop = remove ? v.splice(beg - 1, end + 1) : v.slice(beg - 1, end + 1);
        break;
      case 'string':
        pop = v.splice(beg - 1, end + 1);
        if (remove) {
          v = v.substring(0, beg - 1) + v.substring(end + 1);
        }
    }
    return pop;
  }

  toStr(value, enclose = false) {
    var j, key, len1, str, val;
    str = "";
    switch (this.type(value)) {
      case 'string':
        str = enclose ? '"' + value + '"' : value;
        break;
      case 'function':
        str = "?";
        break;
      case 'object': // This combination of travesal and recursion is cleaner than JSON.stringify()
        str += "{ ";
        for (key in value) {
          if (!hasProp.call(value, key)) continue;
          val = value[key];
          str += key + ":" + this.toStr(val, true) + ", ";
        }
        str = str.substring(0, str.length - 2); // remove trailing comma and space
        str += " }";
        break;
      case 'array': // This combination of travesal and recursion is cleaner than JSON.stringify()
        str += "[ ";
        for (j = 0, len1 = value.length; j < len1; j++) {
          val = value[j];
          str += this.toStr(val, true) + ", ";
        }
        str = str.substring(0, str.length - 2); // remove trailing comma  and space
        str += " ]";
        break;
      default:
        str = value.toString();
    }
    if (enclose && this.debug) {
      console.log("Tester.toStr(val)", {
        type: this.type(value),
        value: value,
        str: str
      });
    }
    return str;
  }

  isEmpty(e) {
    if (this.isNot(e)) {
      return false;
    }
    switch (this.isType(e)) {
      case 'object':
        return Object.getOwnPropertyNames(e).length === 0;
      case 'array':
        return e.length === 0;
      case 'string':
        return e.length === 0;
      default:
        return false;
    }
  }

  isChild(key) {
    var a, b;
    a = key.charAt(0);
    b = key.charAt(key.length - 1);
    return a === a.toUpperCase() && a !== '$' && b !== '_';
  }

  pad(n, m) {
    var i, j, len, ref1, ref2, str, tot;
    len = this.numDigits(n);
    tot = this.numDigits(m);
    str = n.toString();
    for (i = j = ref1 = len, ref2 = tot; (ref1 <= ref2 ? j < ref2 : j > ref2); i = ref1 <= ref2 ? ++j : --j) {
      str = ' ' + str;
    }
    return str;
  }

  numDigits(n) {
    return Math.max(Math.floor(Math.log10(Math.abs(n))), 0) + 1;
  }

  type(val, lowerCase = true) {
    var str, tok, typ;
    str = Object.prototype.toString.call(val);
    tok = str.split(' ')[1];
    typ = tok.substring(0, tok.length - 1);
    if (lowerCase) {
      return typ.toLowerCase();
    } else {
      return typ;
    }
  }

  scheme(val, op = 'eq') {
    if (op === 'schema') {
      return 'schema';
    } else {
      return this.type(val);
    }
  }

  klass(val) {
    var typ;
    typ = this.type(val, false); // Start with basic type to catch 'Null' and 'Undefined'
    switch (typ) {
      case 'Null':
        return 'Null';
      case 'Undefined':
        return 'Undefined';
      case "Function":
        return val.name;
      case "Object":
        return val.constructor.name;
      default:
        return typ;
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
    localStorage.setItem('TestsFailed', JSON.stringify(failed));
    localStorage.setItem('TestsPassed', JSON.stringify(passed));
  }

  reviewsLocal(reviewFailed, reviewPassed) {
    var failLocals, failStatus, failStatuses, j, l, len1, len2, passLocals, passStatus, passStatuses;
    if (!this.debug) {
      return;
    }
    if (reviewFailed) {
      failLocals = localStorage.getItem('TestsFailed');
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
      passLocals = localStorage.getItem('TestsPassed');
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

// -- ES6 exports for single tester instance and its test() and unit() methods
//   tester is instanciates once on its first import subseqent imports
//   get this single instance that holds all testing state
export var tester = new Tester();

test = tester.test;

unit = tester.unit;

fits = tester.unit;

export {
  test,
  unit,
  fits
};

/*
 * Validate and diagnose a result that fits a schema both of type 'object' or 'array'
 *  Very usefull for a result originating from a'.json' file and parsed by JSON.parse(...)
 *  Very usefull for a schema originating from a'.json' file and parsed by JSON.parse(...)
  fits2:( text, result, schema ) =>
    return @ if arguments.length is 0 or not @testing
    @text   = text
    @code   = ""
    status = @initStatus( result, schema, text, 'schema', "" )
    status = switch @type(result)
      when 'object' then @objectsEq( result, schema, status, level )
      when 'array'  then @arraysEq(  result, schema, status, level )
      else               @assert(    result, schema, status )
    if @debug
      console.log( "Tester.fits(result,schema)", { type:@type(result), result:result, schema:schema, status:status } )
    @
 */

//# sourceMappingURL=Tester.js.map
