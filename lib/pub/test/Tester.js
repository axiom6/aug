var Tester, fits, test, unit,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } },
  hasProp = {}.hasOwnProperty;

import Type from "./Type.js";

Tester = class Tester extends Type {
  constructor() {
    super();
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
    this.module = "";
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
    boundMethodCheck(this, Tester);
    if (arguments.length === 0 || !this.testing) {
      return this;
    }
    this.text = text; // @text is latter referenced inside eq()
    this.code = closure.toString(); // @code is latter referenced inside eq()
    closure(this);
    return this;
  }

  unit(text, result, expect) { // unit(...) is always @testing
    boundMethodCheck(this, Tester);
    if (arguments.length === 0 || !this.testing) {
      return this;
    }
    this.text = text;
    this.code = "";
    return this.run(text, result, expect); // returns tester instance for chaining
  }

  eq(result, expect) {
    boundMethodCheck(this, Tester);
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
    return pass;
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
            return this.inEnums(result, schema, status, level, key, index);
          case "range":
            return this.inRange(result, schema, status, level, key, index);
          default:
            return this.examine(false, result, schema, status, `unknown schema.oper ${schema.oper}`, key, index);
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
    var isSchema, prefix;
    isSchema = this.isSchema(expect);
    prefix = pass ? "-- Passed -- " : "-- Failed -- ";
    status.assert.text = prefix + status.assert.text;
    status.assert.pass = pass && status.assert.pass; // Asserts a previous status.assert.pass is false
    status.assert.info += info;
    status.assert.code = this.isString(this.code) ? this.code : "";
    status.result.text += this.textResult(result, key, index);
    if (!isSchema) {
      status.expect.text += this.textExpect(expect, key, index);
    }
    if (isSchema) {
      status.expect.text += this.textSchema(expect, key, index);
    }
    return status;
  }

  report(result, expect, status) {
    var eq, pass;
    pass = status.assert.pass;
    eq = pass ? "is" : "not";
    if (this.blockClear) {
      this.blockText = "";
    }
    this.statusText = `\n${this.module}.${status.assert.text} `;
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
    return `Schema${ref}where type is ${schema.type} and spec is ${schema.spec} with oper ${schema.oper}`;
  }

  // @runUnitTests(...) @describe(...) @summary(...)
  async runUnitTests(paths) {
    var j, len, modulePath, path;
    for (j = 0, len = paths.length; j < len; j++) {
      path = paths[j];
      modulePath = this.path(path);
      if (this.logToConsole) {
        console.log(`\n-- Started Unit Testing for: ${modulePath.name} in ${modulePath.path}`);
      }
      await import( path /* @vite-ignore */ );
    }
    this.summary();
  }

  describe(module, suite = null, description = null) {
    boundMethodCheck(this, Tester);
    this.module = module;
    this.suite = suite != null ? suite : null;
    this.description = description != null ? description : null;
    return this;
  }

  summary(module = null) {
    var fail, failCount, fullCount, j, k, len, len1, pass, passCount, path, ref1, ref2, summaryText;
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
      for (j = 0, len = ref1.length; j < len; j++) {
        pass = ref1[j];
        if (pass.assert.module === module) {
          ++passCount;
        }
      }
      ref2 = this.failed;
      for (k = 0, len1 = ref2.length; k < len1; k++) {
        fail = ref2[k];
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
    return this.isInfo(pass, "Not a Result", type, Type.results);
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
          return this.isInfo(false, "Not a Expect oper", oper, Type.opers);
      }
    }).call(this);
    return this.isInfo(pass, "Not a Expect", type, Type.expects);
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
    return this.isInfo(pass, "Not a 'card'", card, Type.cards);
  }

  // This approach insures that all conditions are checked and messages sent
  //   then all arg returns are anded together to determine a final pass or fail
  conditions(...args) {
    var arg, j, len, pass;
    pass = true;
    for (j = 0, len = args.length; j < len; j++) {
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

  inEnums(result, schema, status, level, key, index) {
    var enums, pass;
    this.noop(level);
    enums = schema.expect;
    pass = this.inArray(result, enums);
    return this.examine(pass, result, schema, status, "inEnums(...)", key, index);
  }

  inRange(result, schema, status, level, key, index) {
    var inFloatRange, inIntRange, inStringRange, pass, range, type;
    range = schema.expect;
    pass = this.isRange(range);
    type = this.type(result);
    inStringRange = function(string, range) {
      return range[0] <= string && string <= range[1];
    };
    inIntRange = function(int, range) {
      return range[0] <= int && int <= range[1];
    };
    inFloatRange = function(float, range) {
      return range[0] - range[2] <= float && float <= range[1] + range[2];
    };
    pass = (function() {
      switch (type) {
        case "string":
          return inStringRange(result, range);
        case "int":
          return inIntRange(result, range);
        case "float":
          return inFloatRange(result, range);
        case "array":
          return this.inArrayRange(result, range);
        case "object":
          return this.objectsEq(result, range, status, level);
        default:
          return this.toInfo("inRange()", "unknown range type", result, type, type, "false", false);
      }
    }).call(this);
    return this.examine(pass, result, schema, status, "inRange(...)", key, index);
  }

  // Camnot is @arraysEq(...) because a single ramge can be applied to all resuls in a result array
  inArrayRange(result, range) {
    var i, j, k, min, nRange, nResult, pass, ref1, ref2, text, type;
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
      for (i = k = 0, ref2 = min; (0 <= ref2 ? k < ref2 : k > ref2); i = 0 <= ref2 ? ++k : --k) {
        if (this.isArray(result[i]) && this.isArray(range[i])) {
          pass = pass && this.inMyRange(result[i], range[i]);
        }
      }
    }
    return pass;
  }

  toEnums(arg) {
    var enums, j, len, split, splits, type;
    enums = [];
    type = type = this.type(arg);
    switch (type) {
      case "string" && arg.includes("|"):
        splits = arg.split("|");
        for (j = 0, len = splits.length; j < len; j++) {
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
      var e, j, len, pass;
      pass = true;
      for (j = 0, len = r.length; j < len; j++) {
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
    var failLocals, failStatus, failStatuses, j, k, len, len1, passLocals, passStatus, passStatuses;
    if (!this.debug) {
      return;
    }
    if (reviewFailed) {
      failLocals = localStorage.getItem("TestsFailed");
      if (failLocals != null) {
        failStatuses = JSON.parse(failLocals);
        for (j = 0, len = failStatuses.length; j < len; j++) {
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
        for (k = 0, len1 = passStatuses.length; k < len1; k++) {
          passStatus = passStatuses[k];
          if (this.logToConsole) {
            console.log(passStatus);
          }
        }
      }
    }
  }

  // Override type.isIn() with addional Tester type arrays
  isIn(type, key) {
    if (Type[key] != null) {
      return Type[key].includes(type);
    } else if (Tester[key] != null) {
      return Tester[key].includes(type);
    } else {
      return this.isInfo(false, `key ${key} missing for`, type, []);
    }
  }

};

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

Tester.cards = [
  "n",
  "?",
  "*",
  "+",
  "min to max" // cards  1 required, ? optional, * 0 to many, + 1 to many, m:m range
];


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
