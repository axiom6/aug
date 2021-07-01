var Tester, fits, test, unit,
  hasProp = {}.hasOwnProperty;

Tester = class Tester {
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
    this.eq = this.eq.bind(this);
    this.describe = this.describe.bind(this);
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
    return this.run(text, result, expect); // returns tester instance for chaining
  }

  eq(result, expect) {
    return this.run(this.text, result, expect);
  }

  // -- info reporting ---

    // A gem methods that appends text along with retrStr to @info for detailed reporting of inconsistence
  //  along with a vialble actual return specified by the caller
  toInfo(method, text, arg, type, typeTo, retnStr, retn) {
    this.info += `\n  Tester.${method} ${text} ${this.toString(arg)} of '${type}' to'${typeTo}' returning ${retnStr}`;
    return retn;
  }

  isInfo(pass, text, type, types) {
    if (pass) {
      return true;
    }
    this.info += `\n  ${text} of type '${type}' not in '${types}'`;
    return false;
  }

  inInfo(pass, result, expect, oper, spec, text) {
    var condit, prefix;
    prefix = pass ? "-- Passed --" : "-- Failed --";
    condit = pass ? "matches " : "no match";
    this.info += `\n  ${prefix} ${result} ${condit} ${expect} with oper ${oper} and spec ${spec} ${text}`;
    return false;
  }

  // -- run() scenario is @initStatus(...) @assert(...) @report(...)
  //     console.log( "Tester.run()", { text:text, result:result, expect:expect} ) if  @debug
  run(text, result, expect) {
    var status;
    return this(!this.testing);
    status = this.initStatus(result, expect, text);
    status = this.assert(result, expect, status);
    this.report(result, expect, status);
    return this;
  }

  
    // Create a new status object for the current test
  initStatus(result, schema, text) {
    var module;
    module = text.split(".")[0];
    return {
      assert: {
        text: text,
        pass: true,
        module: module,
        code: this.code,
        info: ""
      },
      result: {
        text: "",
        type: this.type(result),
        value: result
      },
      schema: {
        text: "",
        type: schema.type,
        value: schema.expect // Need to reconsider
      }
    };
  }

  // Performs all assertions even a deep equal on objects and arrays
  //   Strong type checking with @type(arg) so asserions are only test when types match
  //   Skips over @type(arg) = "function"
  assert(result, expect, status, level = 0, key = null, index = null) {
    var isValue, schema, type;
    // Check values and types
    status = this.checkValuesTypes(result, expect, status, key, index);
    // Perform all schema based assertions
    if (this.isSchema(expect)) {
      schema = this.toSchema(expect);
      status.assert.pass = (function() {
        switch (schema.oper) {
          case 'enums':
            return this.inEnums(result, schema);
          case "range":
            return this.inRange(result, schema);
          default:
            return this.examine(false, result, schema.expect, status, `unknow schema.oper ${schema.oper}`);
        }
      }).call(this);
      return status.assert.pass;
    }
    // Perform all comparisions
    type = this.type(result);
    isValue = function(type) {
      return this.isIn(type, "values");
    };
    status = (function() {
      switch (type) {
        case isValue(type):
          return this.valuesEq(result, expect, status, "eq"); // op is not passed aroung
        case "object":
          return this.objectsEq(result, expect, status, level);
        case "array":
          return this.arraysEq(result, expect, status, level);
        default:
          return this.unknownsEq(result, expect, status); // just a fallback
      }
    }).call(this);
    this.examine(status.assert.pass, result, expect, status, "", key, index);
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

  // Check and report on values and types
  checkValuesTypes(result, expect, status, key, index) {
    var eType, info, rType;
    rType = this.type(result);
    eType = this.type(expect);
    info = (function() {
      switch (false) {
        case !this.isNot(result):
          return ` Result of ${rType} is not defined\nExpect is type '${eType}'`;
        case !this.isNot(expect):
          return ` Expect of ${eType} is not defined\nResult is type '${rType}'`;
        case !(rType !== eType && !this.isIn(eType, "specs")):
          return ` Types do not match\nResult type is '${rType}'\nExpect type is '${eType}'`;
        case rType !== "function":
          return ` Result type is 'function'\nExpect type is '${eType}'`;
        case eType !== "function":
          return ` Expect type is 'function'\nResult type is '${rType}'`;
        case !!this.isIn(rType, "results"):
          return ` Result is type '${rType}' an unknown type is type '${eType}'`;
        case !!this.isIn(eType, "expects"):
          return ` Result is type '${rType}'\nExpect is type '${eType}' an unknown type`;
        default:
          return "";
      }
    }).call(this);
    if (this.isString(info)) {
      return this.examine(false, result, expect, status, info, key, index);
    } else {
      return status;
    }
  }

  valuesEq(result, expect, status, oper) {
    var pass;
    if (expect === "any") {
      return true;
    }
    pass = (function() {
      switch (oper) {
        case "eq":
          return result === expect;
        case "le":
          return result <= expect;
        case "lt":
          return result < expect;
        case "ge":
          return result >= expect;
        case "gt":
          return result > expect;
        case "ne":
          return result !== expect;
        default:
          return false;
      }
    })();
    status.assert.pass = pass;
    return status;
  }

  // Just a fallback when types are not fully  screened
  unknownsEq(result, schema, status) {
    status.assert.pass = false;
    status.assert.info += "unknown types for comparision";
    return status;
  }

  // Deep object equality assertion where all matching keys are examined
  objectsEq(result, expect, status, level) {
    var arg, key, obj;
    for (key in result) {
      if (!hasProp.call(result, key)) continue;
      arg = result[key];
      if (expect[key] != null) {
        status = this.examine(false, arg, expect[key], status, "missing expect", key, null);
      }
    }
    for (key in expect) {
      if (!hasProp.call(expect, key)) continue;
      arg = expect[key];
      if (result[key] != null) {
        status = this.examine(false, result[key], arg, status, "missing result", key, null);
      }
    }
    for (key in expect) {
      if (!hasProp.call(expect, key)) continue;
      obj = expect[key];
      if ((result[key] != null) && (expect[key] != null)) {
        status = this.assert(result[key], arg, status, ++level, key, null);
      }
    }
    return status;
  }

  // Deep array equality assertion
  arraysEq(result, expect, status, level) {
    var i, info, j, length, ref1;
    // Examine the array lengths
    if (result.length !== value.expect) {
      info = " different array lengths";
      info += ` Result length is ${result.length}`;
      info += ` Expect length is ${expect.length}`;
      status = this.examine(false, result, expect, status, info, null, null);
    }
    // Assert each value within the minimum length of the result and expect arrays
    length = Math.min(result.length, expect.length);
    for (i = j = 0, ref1 = length; (0 <= ref1 ? j < ref1 : j > ref1); i = 0 <= ref1 ? ++j : --j) {
      status = this.assert(result[i], expect[i], status, ++level, null, i);
    }
    return status;
  }

  // Generates informative text in status
  examine(pass, result, expect, status, info, key, index) {
    var prefix;
    prefix = pass ? "-- Passed -- " : "-- Failed -- ";
    status.assert.text = prefix + status.assert.text;
    status.assert.pass = pass && status.assert.pass; // Asserts a previous status.assert.pass is false
    status.assert.info += info;
    status.assert.code = this.isString(this.code) ? this.code : "";
    status.result.text += this.textResult(result, key, index);
    status.expect.text += this.textExpect(expect, key, index);
    return status;
  }

  report(result, expect, status) {
    var eq, pass;
    pass = status.assert.pass;
    eq = pass ? "is" : "not";
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
    if (this.verbose || !pass) {
      this.statusText += `\n   ${this.textResult(result)}`;
    }
    if (this.verbose || !pass) {
      this.statusText += `\n   ${this.textExpect(expect)}`;
    }
    //statusText += "\n"+@code                                 if @isString(@code) and ( @verbose or not pass )
    this.blockText += this.statusText; // if not @statusClear # keep the status in the block for now
    this.statusClear = false;
    this.blockClear = false;
    if (this.isDef(this.stream)) {
      this.stream.publish(this.statusSubject, status);
      this.stream.publish(this.stringSubject, status);
    }
  }

  textResult(result, key = null, index = null) {
    var ref;
    ref = " ";
    if (this.isString(key)) {
      ref(` at key:${key} `);
    }
    if (this.isInt(index)) {
      ref = ` at index: ${index} `;
    }
    return `Result${ref}where type is ${this.type(result)} and value is ${this.toString(result)}`;
  }

  textExpect(expect, key = null, index = null) {
    var ref;
    ref = " ";
    if (this.isString(key)) {
      ref(` at key:${key} `);
    }
    if (this.isInt(index)) {
      ref = ` at index: ${index} `;
    }
    return `Expect${ref}where type is ${this.type(expect)} and value is ${this.toString(expect)}`;
  }

  textSchema(schema, key = null, index = null) {
    var ref;
    ref = " ";
    if (this.isString(key)) {
      ref(` at key:${key} `);
    }
    if (this.isInt(index)) {
      ref = ` at index: ${index} `;
    }
    return `Schema${ref}where type is ${schema.type} and value is ${this.toString(schema.expect)}`;
  }

  // @runUnitTests(...) @describe(...) @summary(...)
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

  describe(description, suite = null) {
    this.description = description;
    this.suite = suite != null ? suite : null;
    return this;
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

  // Returns a single text status fron the last test run when called in a unit test module like Tester-unit.coffee
  // Example: console.log( unit().status() )
  //   or      unit().log( unit().status() )
  status() {
    // @statusClear = true
    return this.statusText;
  }

  // Returns a block of text statuses when callrd in a unit test module like Tester-unit.coffee
  // Example: console.log( unit().block() )
  //   or      unit().log( unit().block() )
  block() {
    this.blockClear = true;
    return this.blockText;
  }

  // Add a unit test file path to the @modules object
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

  isEnums(arg, oper, type) {
    return oper === "enums" && this.isArray(arg, type) && this.isResultType(type);
  }

  // Check if an arg like expect is a 'schema'
  verifySchema(arg) {
    return this.conditions(this.isObject(arg), this.isResultType(arg.type), this.isExpect(arg.expect, arg.oper), this.isCard(arg.card));
  }

  isResultType(type) {
    var pass;
    pass = this.isDef(type) && this.isIn(type, "results");
    return this.isInfo(pass, "Not a Result", type, Tester.results);
  }

  isExpect(expect, oper) {
    var pass, type;
    this.isOper(oper);
    this.isDef(expect);
    type = this.type(expect);
    pass = (function() {
      switch (oper) {
        case "range":
          return this.isRange(expect);
        case "enums":
          return this.isEnums(expect, oper, type);
        case "eq":
          return this.isResultType(type);
        default:
          return this.isInfo(false, "Not a Expect oper", oper, Tester.opers);
      }
    }).call(this);
    return this.isInfo(pass, "Not a Expect", type, Tester.expects);
  }

  isExpectType(type) {
    var pass;
    pass = this.isDef(type) && this.isIn(type, "expects");
    return this.isInfo(pass, "Not a Expect", type, Tester.expects);
  }

  isOper(oper) {
    var pass;
    pass = this.isDef(oper) && this.isIn(oper, "opers");
    return this.isInfo(pass, "Not an 'oper'", oper, "opers");
  }

  isCard(card) {
    var pass;
    pass = this.isDef(card) && this.isIn(card, "cards");
    return this.isInfo(pass, "Not a 'card'", card, Tester.cards);
  }

  // This approach insures that all conditions are checked and messages sent
  //   then all arg returns are anded together to determine a final pass or fail
  conditions(...args) {
    var arg, j, len1, pass;
    pass = true;
    for (j = 0, len1 = args.length; j < len1; j++) {
      arg = args[j];
      pass = pass && arg;
    }
    return pass;
  }

  isSchema(expect) {
    var type;
    type = this.type(expect);
    return this.isSchemaParse(expect, type) || this.isSchemaObject(expect, type);
  }

  // In the first t
  toSchema(expect) {
    var schema, type;
    type = this.type(expect);
    schema = {
      type: "any",
      oper: "any",
      expect: "any",
      card: "1",
      spec: ""
    };
    return schema = (function() {
      switch (type) {
        case this.isSchemaParse(expect, type):
          return this.toSchemaParse(schema, expect);
        case this.isSchemaObject(expect, type):
          return this.toSchemaObject(schema, expect);
        default:
          return this.toInfo("toSchema(expect)", "expect not schema 'string' or 'object'", expect, type, "schema", this.toString(schema), schema);
      }
    }).call(this);
  }

  isSchemaParse(arg, type) {
    return type === "string" && arg(includes(":"));
  }

  // toSchemaParse:( schema, arg )
  // Examples
  //   "array:[0,255]" }      { type:"array",   oper:"range", check:[0,255],         card="1" }
  //   "string:James"         { type:"string",  oper:"eq",    check:James,           card="1" }
  //   "string:a|b|c"         { type:"string",  oper:"enums", check:"a|b|c",         card="1" }
  //   "int:[0,100]"          { type:"int",     oper:"range", check:[0,100],         card="1" }
  //   "float:[0.0,100.0,1.0] { type:"float",   oper:"range", check:[0.0,100.0,1.0], card="1" }
  //   "string:["","zzz"]     { type:"string",  oper:"range", check:["","zzz"],      card="1" }
  //   "boolean"              { type:"boolean", oper:"any",   check:"any",           card="1" }
  //   "object:{r:[0,255],g:[0,255],b:[0,255]}
  //     { type:"object", oper:"range", range:{r:[0,255],g:[0,255],b:[0,255]}, card="1" }
  //  "array:[[0,360],[0,100],[0,100]]:?"
  //     { type:"array",  oper:"range", range:[[0,360],[0,100],[0,100]], card="?" }
  toSchemaParse(schema, arg) {
    var length, splits;
    splits = arg.split(":");
    length = splits.length;
    if (length >= 1) { // type
      schema.type = splits[0];
    }
    if (length >= 1) { // expect
      schema.spec(splits[1]);
      if (splits[1].includes("|")) { //   enum
        schema.oper = "enums";
        schema.expect = this.toEnums(splits[1]);
      } else if (this.isStringEnclosed("[", splits[1], "]")) { //    range array
        schema.oper = "range";
        schema.expect = this.toArray(splits[1]);
      }
    } else if (this.isStringEnclosed("{", splits[1], "}")) { //    range object
      schema.oper = "range";
      schema.expect = this.toObject(splits[1]);
    } else {
      schema.oper = "any";
      schema.expect = "any";
    }
    if (length >= 2) { // card i.e cardinaliry
      schema.oper = splits[2];
    }
    return schema;
  }

  isSchemaObject(arg, type) {
    return type === "object" && (arg.oper != null) && (arg.expect != null); // and arg.type? and arg.card?
  }

  toSchemaObject(schema, arg) {
    schema.type = arg.type != null ? arg.type : "any";
    schema.oper = arg.oper != null ? arg.oper : "any";
    schema.expect = arg.expect != null ? arg.expect : "any";
    schema.card = arg.card != null ? arg.card : "1"; // required
    schema.spec = arg.spec != null ? arg.spec : ""; // required
    return schema;
  }

  isSchemaValue(type) {
    return this.isIn(type, "results");
  }

  // Holding off on this conversion. Instead we will just return an expect value
  toSchemaValue(schema, arg, type) {
    schema.type = type;
    schema.oper = "eq";
    schema.expect = arg;
    schema.card = "1"; // required
    schema.spec = "";
    return schema;
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
  // isArrayOfType called within @isArray(...) because it assumes array exists
  //   and returns true for 'null' that signifies that the type assertions
  //   on the elements should be skipped
  isArray(a, type = null, sc = false) {
    var isArrayOfType;
    if (sc) {
      return this.isStringArray(a);
    }
    // Internal function that assert that an viable is uniformly types
    isArrayOfType = (a, t) => {
      var e, j, len1;
      if (t === 'null') {
        return true;
      }
      for (j = 0, len1 = a.length; j < len1; j++) {
        e = a[j];
        if (this.type(e) !== t) {
          return false;
        }
      }
      return true;
    };
    if (this.isType(a, "array") && (a.length != null) && a.length > 0) {
      type = this.type(a[0]);
      return isArrayOfType(a, type);
    }
  }

  // General purpose since if checks the array's existence and interate over all the elements
  isArrayType(a, t) {
    var e, j, len1;
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

  // General purpose since if checks the array's existence and interate over all the elements
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

  // Aggregate and special value assertions
  isType(v, t) {
    return this.type(v) === t;
  }

  isDef(d) {
    return this.isIn(this.type(d), "undefs");
  }

  isNumber(n) {
    return this.isIn(this.type(n), "numbers");
  }

  isNot(d) {
    return !this.isDef(d);
  }

  isNaN(n) {
    return Number.isNaN(n); // @isNumber(n) and
  }

  
    // Containment assertions where args are always ( value, container )
  inString(e, s) {
    return this.isString(s) && this.isDef(e) && s.includes(e);
  }

  inArray(e, a) {
    return this.isArray(a) && this.isDef(e) && a.includes(e);
  }

  inObject(k, o) {
    return this.isObject(o) && this.isDef(o[k]) && o.hasOwnProperty(k);
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
    return this.isString(str) && (str === "true" || str === "false");
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
        this.toInfo("toString(arg)", "unable to convert", arg, "function", "string", "?function?", "?function?");
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
        this.toInfo("toString(arg)", "unable to convert", arg, type, "string", arg.toString(), arg.toString());
    }
    if (!this.isIn(type("manys")) && enc.length > 0) {
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
          return this.toInfo("toFloat(arg)", "unable to convert", arg, "string", "float", "NaN", 0/0);
        }
        break;
      default:
        return this.toInfo("toFloat(arg)", "unable to convert", arg, type, "float", "NaN", 0/0);
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
          return this.toInfo("toInt(arg)", "unable to convert", arg, "string", "int", "NaN", 0/0);
        }
        break;
      default:
        return this.toInfo("toInt(arg)", "unable to convert", arg, type, "int", "NaN", 0/0);
    }
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
            return this.toInfo("toBoolean(arg)", "unable to convert", arg, type, "boolean", "false", false);
        }
        break;
      case "int":
        return arg !== 0; // check 0   false may not be a convention
      case "float":
        return arg !== 0.0; // check 0.0 false may not be a convention
      default:
        return this.toInfo("toBoolean(arg)", "unable to convert", arg, type, "boolean", "false", false);
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
        return this.toInfo("toArray(arg)", "unable to convert", arg, type, "array", "[]", []);
    }
  }

  toObject(arg) {
    var i, j, obj, ref1, type;
    obj = {};
    type = this.type(arg);
    switch (type) {
      case "object":
        obj = arg;
        break;
      case "array":
        for (i = j = 0, ref1 = arg.length; (0 <= ref1 ? j < ref1 : j > ref1); i = 0 <= ref1 ? ++j : --j) {
          obj[i] = arg[i];
        }
        break;
      case "int":
      case "float":
      case "boolean":
      case "function":
        obj[type] = arg;
        break;
      case "string":
        obj = arg.split(",").map((keyVal) => {
          return keyVal.split(":").map((arg) => {
            return arg.trim();
          });
        }).reduce((acc, cur) => {
          acc[cur[0]] = cur[1];
          return acc({}); // acc accumulator cur current
        });
        break;
      default:
        this.toInfo("toObject(arg)", "unable to convert", arg, type, "object", "{}", {});
    }
    return obj;
  }

  toEnums(arg) {
    var enums, j, len1, split, splits, type;
    enums = [];
    type = type = this.type(arg);
    switch (type) {
      case "string" && arg.includes("|"):
        splits = arg.split("|");
        for (j = 0, len1 = splits.length; j < len1; j++) {
          split = splits[j];
          enums.push(split);
        }
        break;
      case "array":
        enums = arg;
        break;
      default:
        enums = this.toInfo("toEnums(arg)", "unable to convert", arg, type, "enums", "[]", []);
    }
    return enums;
  }

  inEnums(arg, enums) {
    return this.inArray(arg, enums);
  }

  rangeType(range) {
    var type;
    type = range.length > 0 ? this.type(range[0]) : "null";
    if (this.isIn(type, "ranges")) {
      if (this.isArray(range, type)) {
        return type;
      } else {
        return "mixed";
      }
    } else if (type === "array") {
      return this.rangeType(range[0]);
    }
  }

  // -- Range Methods --

    // Asserts range with for types "string" or "int" or "float"
  isRange(range) {
    var isArrayRange, isFloatRange, isIntRange, isStringRamge, type;
    // internal functions called after @rangeType(range) has verified that range
    //   is an array of type "string" or "int" or "float"
    isStringRamge = function(r) {
      return r.length === 2 && r[0] <= r[1];
    };
    isIntRange = function(r) {
      return r.length === 2 && r[0] <= r[1];
    };
    isFloatRange = function(r) {
      return r.length === 3 && r[0] - r[2] <= r[1] + r[2];
    };
    isArrayRange = function(r) {
      var e, j, len1, pass;
      pass = true;
      for (j = 0, len1 = r.length; j < len1; j++) {
        e = r[j];
        pass = pass && this.isRange(e);
      }
      return pass;
    };
    // @rangeType(...) checks array existence and asserts type with @isArray(range,type)
    type = this.rangeType(range);
    switch (type) {
      case 'string':
        return isStringRamge(range);
      case 'int':
        return isIntRange(range);
      case 'float':
        return isFloatRange(range);
      case 'array':
        return isArrayRange(range);
      default:
        return this.toInfo("isRange(range)", "not a range type", range, type, "", "false", false);
    }
  }

  // toRange:( type, min=null, max=null, tol=null ) -> in Tester.big.coffee

    // Adds 'range' 'enums' and 'schema' based on 'op' to @type(arg)
  typeExpect(expect, op) {
    switch (op) {
      case 'range' && this.isRange(expect):
        return "range";
      case 'enums' && this.isEnums(expect):
        return "enums";
      case 'schema' && this.isSchema(expect):
        return "schema";
      default:
        return this.type(expect);
    }
  }

  inRange(result, range, op = "range") {
    var inFloatRange, inIntRange, inStringRange, pass, rangeType, resultType;
    pass = this.isRange(range);
    resultType = this.type(result);
    rangeType = this.typeExpect(result, op);
    if (!pass || resultType(iant(rangeType))) {
      return this.toInfo("inRange(result,range,op)", result, resultType, rangeType, "false", false);
    }
    inStringRange = function(string, range) {
      return range[0] <= string && string <= range[1];
    };
    inIntRange = function(int, range) {
      return range[0] <= int && int <= range[1];
    };
    inFloatRange = function(float, range) {
      return range[0] - range[2] <= float && float <= range[1] + range[2];
    };
    switch (resultType) {
      case "string":
        return inStringRange(result, range);
      case "int":
        return inIntRange(result, range);
      case "float":
        return inFloatRange(result, range);
      case "array":
        return this.inArrayRange(result, range);
      case "object" && this.isObject(rangeType):
        return this.inObjectRange(result, range);
      case "enums" && this.isEnums(rangeType):
        return this.inEnumsRange(result, range);
      default:
        return this.toInfo("inRamge()", "unknown range type", result, resultType, rangeType, "false", false);
    }
  }

  inArrayRange(result, range) {
    var i, j, l, min, nRange, nResult, pass, ref1, ref2, text, type;
    pass = true;
    type = this.type(result);
    nResult = result.length;
    nRange = range.length;
    if (nRange === 1) {
      for (i = j = 0, ref1 = nResult; (0 <= ref1 ? j < ref1 : j > ref1); i = 0 <= ref1 ? ++j : --j) {
        if (this.isArray(result[i])) {
          pass = pass && this.inMyRange(result[i], range);
        }
      }
    } else if (nResult > nRange) {
      text = `not enough range tests ${nRange} for result so only will be ${nRange} tests on result`;
      pass = this.toInfo("inRange()", text, result, type, type, "false", false);
    } else if (nResult < nRange) {
      text = `OK with more range bounds ${nRange} than needed for result ${nResult}`;
      pass = this.toInfo("inRange()", result, text, type, type, "true", true);
      min = Math.min(nResult, nRange);
      for (i = l = 0, ref2 = min; (0 <= ref2 ? l < ref2 : l > ref2); i = 0 <= ref2 ? ++l : --l) {
        if (this.isArray(result[i]) && this.isArray(range[i])) {
          pass = pass && this.inMyRange(result[i], range[i]);
        }
      }
    }
    return pass;
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

  // An improved typeof() that follows the convention by returning types in lower case by default.
  // The basic types similar to typeof() returned are:
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

  // mdnType:( obj, showFullClass ) ->  in Tester.big.coffee

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
    return;
    return {
      isIn: function(type, key) {
        if (Tester[key] != null) {
          return Tester[key].includes(type);
        } else {
          return this.isInfo(false, `key ${key} missing for`, type, []);
        }
      }
    };
  }

};

// All Tester[key] arrays
Tester.undefs = ["null", "undefined"];

Tester.numbers = ["int", "float"];

Tester.ranges = ["string", "int", "float"];

Tester.values = ["string", "int", "float", "boolean"];

Tester.manys = ["object", "array"];

Tester.results = ["string", "int", "float", "boolean", "object", "array"];

Tester.expects = Tester.results.concat(["schema", "range", "enums", "amy"]);

Tester.typeofs = ["string", "number", "boolean", "object", "function", "bigint", "symbol", "null", "undefined"];

Tester.types = Tester.typeofs.concat(["int", "float", "array", "regex", "date"]);

Tester.types = Tester.remove("number", Tester.types); // number is now either 'int' or 'float'

Tester.specs = [
  "range",
  "enums" // high level schema based comparision specs
];

Tester.opers = [
  "eq",
  "le",
  "lt",
  "ge",
  "gt",
  "ne" // low  level value  based comparison  ooers 'eq' default
];

Tester.cards = ["n", "?", "*", "+", "min to max"];

// cards  1 required, ? optional, * 0 to many, + 1 to many, min:max a range
Tester.remove(e, a)(function() {
  var index;
  index = a.indexOf(e);
  if (index > -1) {
    a.splice(index, 1);
  }
  return a;
});

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

//# sourceMappingURL=Tester.js.map
