var Tester, test,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } },
  hasProp = {}.hasOwnProperty;

import Spec from "./Spec.js";

// Type is also brought in by class Spec extends Type
Tester = class Tester extends Spec {
  constructor() {
    super();
    // -- test --

    //   import { test } from "../test/Tester.js"
    //   import Vis      from "../draw/Vis.js"

    //   test(  "2 + 3 = 5", (t) ->                # closure form
    //     t.eq( 2 + 3,  5 ) )

    //   test(  "2 + 3 = 5", 2 + 3, 5 )            # Direct result and expect arguments

    //   test( "Vis.rgb() converts hex color to rgb object",  Vis.rgb(0xFFFFFF), {r:255,g:255,b:255} )
    this.test = this.test.bind(this);
    this.eq = this.eq.bind(this);
    this.module = this.module.bind(this);
    this.describe = this.describe.bind(this);
    
    // No arg implies generate a module summary while an arg of "all" is for all tests
    //  for unit tests in @runUnitTests @complwte(arg) @complwte() is called automaticly
    //  when modules or all tests are completed.
    // @testingAllOff() or @testingModuleOff() determine if @complete(arg) should generate
    // publish and/or log summaries for a module or all the tests
    this.complete = this.complete.bind(this);
    this.summaryText = this.summaryText.bind(this);
    // Key settings that can be reconfigured through setOptions( options )
    this.testing = true; // When false all testing is turned off which allows tests to remain in code
    this.always = false; // When true  all testing is turned on  which overrides all other settings
    //logging        = true          # @logging is in class Type
    this.archive = true; // When true archives test status object to localStorage TestsPassed and TestFail
    this.verbose = false; // Adds addition and sometimes mind numbing detail to testStatus objects
    this.debug = false; // Turns on debugs call to console.log(...)
    this.schemaKey = "schema"; // Specifies the key in a JSON file to look up its argidating schema in JSON
    this.statusSubject = "TestStatus"; // Subject for publishing each test status object
    this.summarySubject = "TestSummary"; // Subject for publishing module and final summaries
    
    // Short hand for logging in a chained call i.e test(...).log( test().status )
    //  it is important that @log and @error be called in the modules being tested
    //  for viewing the code being tested rather that viewing code in the Tester itself
    this.log = console.log;
    this.error = console.error;
    // Set by @module(moduleTx)
    this.lastCalled = "";
    this.moduleUnit = "";
    this.moduleTx = "";
    this.moduleName = ""; // Set automaticall by @toPath()
    this.moduleId = 0; // Incremented each time @module(text) is called
    this.moduleOn = true; // Set by @on(sw=true) when chained to @module(moduleTx)
    
    // Set by @describe( methodTx )
    this.describeTx = "";
    this.describeName = ""; // Set by @name(name) chained to @describe(...)
    this.describeId = 0; // Incremented each time @describe(text) is called
    this.describeOp = "eq"; 
    this.describeOn = true; // Set by @on(sw=true) when chained to @describe(describeTx)
    this.summarized = false; // Indicates that @summary() has been on the last @describe()
    //   and wether @complete() should genrate a summarized text
    // Accumulated status objects
    this.text = ""; // set by test() that is passed inside eq() and sent to run()
    this.modulePaths = {};
    this.statusAs = {}; // Latest status from @assert(...)
    this.statuses = [];
    // optional instance for publishing each test status object to to UIs that subscripe to stream
    // set by @injectStream(stream) which enforces that it have @klass 'Stream'
    this.stream = null;
  }

  setOptions(options) {
    this.testing = options.testing != null ? options.testing : true;
    this.always = options.always != null ? options.always : false;
    this.logging = options.logging != null ? options.logging : true;
    this.archive = options.archive != null ? options.archive : true;
    this.verbose = options.verbose != null ? options.verbose : false;
    this.debug = options.debug != null ? options.debug : false;
    this.schemaKey = options.schemaKey != null ? options.schemaKey : "schema";
    this.statusSubject = options.statusSubject != null ? options.statusSubject : "TestStatus";
    this.summarySubject = options.summarySubject != null ? options.summarySubject : "TestSummary";
  }

  test(text, ...args) {
    var closure, expect, result;
    boundMethodCheck(this, Tester);
    if (arguments.length === 0 || this.testingOff()) {
      return this;
    } else if (arguments.length === 2 && this.isFunction(args[0])) {
      closure = args[0];
      this.text = text; // @text is latter referenced inside eq()
      closure(this); // Call closure with an injected tester instand
    } else if (arguments.length === 3 && !this.isFunction(args[0])) {
      result = args[0];
      expect = args[1];
      this.text = text;
      this.run(text, result, expect); // returns tester instance for chaining
    }
    return this;
  }

  
    // The strongest logic is the last where all 4 condition are checked where as
  //  'module' and 'all' admit larger group of tests
  testingOff(group = "test") {
    var toff;
    toff = (function() {
      switch (group) {
        case "all":
          return !(this.always || this.testing);
        case "module":
          return !(this.always || (this.testing && this.moduleOn));
        default:
          return !(this.always || (this.testing && this.moduleOn && this.describeOn));
      }
    }).call(this);
    return toff;
  }

  eq(result, expect) {
    boundMethodCheck(this, Tester);
    return this.run(this.text, result, expect);
  }

  // -- run() scenario is @initStatus(...) @assert(...)
  run(text, result, expect) {
    this.statusAs = this.initStatus(result, expect, text);
    this.statusAs = (function() {
      switch (this.describeOp) {
        case "to":
          return this.convert(result, expect, this.statusAs);
        default:
          return this.assert(result, expect, this.statusAs);
      }
    }).call(this);
    return this;
  }

  
    // Create a new status object for the current test
  //   each test status is imprinted with the current module and describe settings
  initStatus(result, expect, text) {
    return {
      assert: {
        text: text,
        pass: true,
        keys: "",
        moduleTx: this.moduleTx,
        moduleName: this.moduleName,
        moduleId: this.moduleId,
        moduleOn: this.moduleOn,
        describeTx: this.describeTx,
        describeName: this.describeName,
        describeId: this.describeId,
        describeOn: this.describeOn,
        describeOp: this.describeOp
      },
      warned: {
        text: ""
      },
      result: {
        text: "",
        type: this.type(result),
        value: result
      },
      expect: {
        text: "",
        type: this.type(expect),
        value: expect
      },
      errors: ""
    };
  }

  // Performs all assertions even a deep equal on objects and arrays
  //   Strong type checking with @type(arg) so asserions are only test when types match
  //   Skips over @type(arg) = "function"
  assert(result, expect, status, level = 0, key = null, index = null) {
    var pass, spec, type;
    // Check values and types
    status = this.verify(result, expect, status);
    if (!status.assert.pass) {
      status = this.examine(false, result, expect, status, key, index);
      return this.processStatus(status);
    }
    // Perform all spec based assertions
    if (this.isSpec(expect)) {
      spec = this.toSpec(expect);
      pass = this.inSpec(result, spec);
      status = this.examine(pass, result, spec, status, key, index);
      return this.processStatus(status);
    }
    // Perform all comparisions
    type = this.type(result);
    status = (function() {
      switch (type) {
        case "string":
        case "int":
        case "float":
        case "boolean":
          return this.valuesEq(result, expect, status, "eq"); // op is not passed aroung
        case "object":
          return this.objectsEq(result, expect, status, level, key);
        case "array":
          return this.arraysEq(result, expect, status, level, index);
        default:
          return this.unknownsEq(result, expect, status, level); // just a fallback
      }
    }).call(this);
    status = this.examine(status.assert.pass, result, expect, status, key, index);
    return this.processStatus(status);
  }

  // Store status in @statuses array and publish
  processStatus(status) {
    if (level === 0) {
      this.statuses.push(status);
      if (this.isDef(this.stream)) {
        this.stream.publish(this.statusSubject, status);
      }
    }
    return status;
  }

  convert(result, expect, status) {
    status = this.verify(result, expect, status);
    status = this.examine(status.assert.pass, result, expect, status);
    return this.processStatus(status);
  }

  // Check and report on values and types
  //   refactored on Wed July 7, 2021
  verify(result, expect, status) {
    var e, eIs, op, r, rIs;
    op = this.describeOp;
    r = this.type(result);
    e = this.type(expect);
    rIs = function() {
      return `\nResult is type '${r}'`;
    };
    eIs = function() {
      return `\nExpect is type '${e}'`;
    };
    status.errors += (function() {
      switch (false) {
        case !this.isNot(result):
          return ` Result of ${r} is not defined${eIs()}`;
        case !this.isNot(expect):
          return ` Expect of ${e} is not defined${rIs()}`;
        case !!this.isIn(r, "expects"):
          return `Expect of type '${e}' not in ${this.toIn('expects')}${rIs()}`;
        case !!this.isIn(r, "results"):
          return `Result of type '${r}' not in ${this.toIn('results')}${eIs()}`;
        case r !== "function":
          return ` Result type is 'function${rIs()}`;
        case e !== "function":
          return ` Expect type is 'function${eIs()}`;
        case !(r !== e && op !== "to"):
          return ` Types do not match${rIs()}${eIs()}`;
        default:
          return "";
      }
    }).call(this);
    return status;
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
  unknownsEq(result, expect, status) {
    this.noop(result, expect);
    status.assert.pass = false;
    status.assert.errors += "unknown types for comparision";
    return status;
  }

  // Deep object equality assertion where all matching keys are examined
  objectsEq(result, expect, status, level, key) {
    var arg, obj;
    // Insure that result and expect are objects
    if (!this.isObject(result) || !this.isObject(expect)) {
      status.errors += " either one or both result and expect are not objects";
      status.errors += ` Result type is ${this.type(result)}`;
      status.errors += ` Expect type is ${this.type(expect)}`;
      return this.examine(false, result, expect, status, key, null);
    }
    for (key in expect) {
      if (!hasProp.call(expect, key)) continue;
      arg = expect[key];
      if (!(result[key] == null)) {
        continue;
      }
      status.assert.pass = false;
      status.assert.keys += "\n   missing result " + key;
    }
    for (key in result) {
      if (!hasProp.call(result, key)) continue;
      arg = result[key];
      if (!(expect[key] == null)) {
        continue;
      }
      status.assert.pass = false;
      status.assert.keys += "\n   missing expect " + key;
    }
    for (key in expect) {
      if (!hasProp.call(expect, key)) continue;
      obj = expect[key];
      if ((result[key] != null) && (expect[key] != null)) {
        status = this.assert(result[key], obj, status, ++level, key, null);
      }
    }
    return status;
  }

  // Deep array equality assertion
  arraysEq(result, expect, status, level, index) {
    var i, j, length, ref1;
    // Insure that result and expect are arrays
    if (!this.isArray(result) || !this.isArray(expect)) {
      status.errors += " either one or both result and expect are not arrays";
      status.errors += ` Result type is ${this.type(result)}`;
      status.errors += ` Expect type is ${this.type(expect)}`;
      return this.examine(false, result, expect, status, null, index);
    }
    // Examine the array lengths
    if (result.length !== expect.length) {
      status.errors += " different array lengths";
      status.errors += ` Result length is ${result.length}`;
      status.errors += ` Expect length is ${expect.length}`;
      status = this.examine(false, result, expect, status, null, index);
    }
    // Assert each value within the minimum length of the result and expect arrays
    length = Math.min(result.length, expect.length);
    for (i = j = 0, ref1 = length; (0 <= ref1 ? j < ref1 : j > ref1); i = 0 <= ref1 ? ++j : --j) {
      status = this.assert(result[i], expect[i], status, ++level, null, i);
    }
    return status;
  }

  async runUnitTests(paths) {
    var j, len, modulePath, path;
    for (j = 0, len = paths.length; j < len; j++) {
      path = paths[j];
      modulePath = this.toPath(path); // also sets the @moduleName
      this.moduleUnit = `${modulePath.path} unit test`;
      this.summarized = false;
      await import( path /* @vite-ignore */ );
      this.complete(); // This is where we know that the unit test module has finished so summarize
    }
    this.complete("all"); // All tests complete so produce then log and publish the final summary
  }

  // Add a unit test file path to the @modulePaths object
  toPath(path) {
    var dirs;
    dirs = path.split("/");
    this.moduleName = this.tail(dirs).split("-")[0];
    this.modulePaths[this.moduleName] = {
      name: this.moduleName,
      path: path
    };
    // console.log( "Tester.path(path)", { path:path, dirs:dirs, module:@moduleName } ) if  @debug
    return this.modulePaths[this.moduleName];
  }

  module(moduleTx) {
    boundMethodCheck(this, Tester);
    this.moduleTx = moduleTx;
    this.moduleId += this.moduleId + 1; // ids are one based
    this.summarized = false; // set for functional tests when unit tests are not being run
    this.lastCalled = "module";
    return this;
  }

  describe(describeTx) {
    boundMethodCheck(this, Tester);
    this.describeTx = describeTx;
    this.describeId += this.describeId + 1; // ids are one based
    this.lastCalled = "describe";
    return this;
  }

  // Only chain to @describe(describeTx)
  name(name) {
    this.describeName = name;
    return this;
  }

  // Only chain to @describe(describeTx)
  op(op = "eq") {
    this.describeOp = op;
    return this;
  }

  // Can be chained to @describe(describeTx) and @module(moduleTx) to turn test blocks on and off
  on(sw = true) {
    if (this.lastCalled === "module") {
      this.moduleOn = sw;
    } else {
      this.describeOn = sw;
    }
    return this;
  }

  // Improved but still needs work
  statusAssertText(pass, result, status) {
    var describeName, text;
    describeName = status.assert.describeName;
    text = pass ? "\n-- Passed -- " : "\n-- Failed -- ";
    if (this.isStr(describeName)) {
      text += this.strip(describeName, "", "()") + "(" + this.toStr(result) + ") ";
      text += this.text + " "; // if not pass
    } else {
      text += this.text + " ";
    }
    return text;
  }

  textValue(name, value, key = null, index = null) {
    var ref, spec;
    ref = "";
    if (this.isStr(key)) {
      ref = ` at key:${key}`;
    }
    if (this.isInt(index)) {
      ref = ` at index: ${index}`;
    }
    if (name === "Spec") {
      spec = value;
      return `\n   ${name}${ref} type is '${spec.type}' with match '${spec.match}' and card '${spec.card}'`;
    } else {
      return `\n   ${name}${ref} type is '${this.type(value)}' with value ${this.toStr(value)}`;
    }
  }

  // Generates informative text in status
  examine(pass, result, expect, status, key = null, index = null) {
    var eq, isSpec;
    if (!this.verbose && ((key != null) || (index != null))) {
      return status;
    }
    isSpec = this.isSpec(expect);
    eq = pass ? "eq" : "not";
    status.assert.text = this.statusAssertText(pass, result, status);
    if (status.result.type !== "function") {
      status.assert.text += `${eq} ${this.toStr(expect)}`;
    }
    //tatus.assert.text  += " for " + @text
    status.assert.pass = pass && status.assert.pass; // Asserts a previous status.assert.pass is false
    status.result.text += this.textValue("Result", result, key, index);
    if (!isSpec) {
      status.expect.text += this.textValue("Expect", expect, key, index);
    }
    if (isSpec) {
      status.expect.text += this.textValue("Spec", expect, key, index);
    }
    //tatus.warned.text  += warn
    return status;
  }

  // Determine if a status is part of module set or part of a describe set
  //  pass = null implies that that status.assert.pass of true or false is
  //    to be ingored while pass = true or false signals that whether a
  //    test passed or failed is to be considered
  isGroup(group, status, pass = null) {
    var inSet;
    inSet = (status, pass) => {
      if (pass != null) {
        return status.assert.pass === pass;
      } else {
        return true;
      }
    };
    switch (group) {
      case "describe":
        return inSet(status, pass) && this.describeId === status.assert.describeId;
      case "module":
        return inSet(status, pass) && this.moduleId === status.assert.moduleId;
      case "all":
        return inSet(status, pass);
      default:
        return inSet(status, pass);
    }
  }

  // Aa describe / test() block status summary
  summary() {
    var summaryText;
    summaryText = "";
    if (!this.summarized) {
      summaryText += this.titleReport("module");
    }
    if (this.testingOff("describe")) { // returning a blank summaryText string turns off logging
      return summaryText;
    }
    summaryText += this.titleReport("describe");
    summaryText += this.summaryText("describe");
    summaryText += this.totals("describe");
    this.summarized = true;
    if (this.isDef(this.stream)) {
      this.stream.publish(this.summarySubject, summaryText);
    }
    this.reset(); // reset all @describe..  parameters
    return summaryText; // for log( test().summary() )
  }

  complete(arg = null) {
    var group, isAll, summaryText;
    boundMethodCheck(this, Tester);
    isAll = this.isDef(arg);
    group = isAll ? "all" : "module";
    if (this.testingOff(group)) {
      return this;
    }
    summaryText = "";
    if (!this.summarized) {
      summaryText += this.titleReport(group);
    }
    if (!this.summarized) {
      summaryText += this.summaryText("describe");
    }
    summaryText += this.totals(group);
    this.summarized = true;
    if (this.isDef(this.stream)) {
      this.stream.publish(this.summarySubject, summaryText);
    }
    if (this.logging) {
      this.log(summaryText);
    }
    // Archive since all tests are complete
    if (isAll && this.archive) {
      this.archiveLocal(this.statuses);
      this.reviewsLocal();
    }
    this.reset("module"); // reset all @describe..  and @module.. parameters
    return this;
  }

  
    // reset all @describe..  and if group is module the @module.. parameters
  //  this does not reset ids which are incremented by @describe(...) and @module()
  reset(group) {
    this.describeTx = "";
    this.describeName = "";
    this.describeOp = "eq";
    this.describeOn = true;
    this.moduleUnit = "";
    if (group === "module") {
      this.moduleTx = "";
      this.moduleName = "";
      this.moduleOn = true;
    }
  }

  summaryText(group) {
    var j, len, ref1, status, text;
    boundMethodCheck(this, Tester);
    text = "";
    ref1 = this.statuses;
    for (j = 0, len = ref1.length; j < len; j++) {
      status = ref1[j];
      if (this.isGroup(group, status)) {
        text += this.status(status);
      }
    }
    return text;
  }

  // Generate text from status arg or from @statusAs
  // @statusAs comes from @assert(...)  from the last test run
  // Example: console.log( test().status() )
  //   or      test().log( test().status() )
  status(status = null) {
    var text;
    status = status != null ? status : this.statusAs;
    text = "";
    text += status.assert.text;
    if (this.verbose || !status.assert.pass) {
      text += status.result.text;
    }
    if (this.verbose || !status.assert.pass) {
      text += status.expect.text;
    }
    if (this.verbose) {
      text += status.warned.text;
    }
    return text;
  }

  totals(group) {
    var failCount, fullCount, passCount, text;
    passCount = this.count(group, true);
    failCount = this.count(group, false);
    fullCount = passCount + failCount;
    text = this.titleTotals(group);
    text += `\n   ${this.pad(passCount, fullCount)} tests passed`;
    text += `\n   ${this.pad(failCount, fullCount)} tests failed`;
    text += `\n   ${this.pad(fullCount, fullCount)} tests total`;
    return text;
  }

  count(group, pass) {
    var j, len, n, ref1, status;
    n = 0;
    ref1 = tester.statuses;
    for (j = 0, len = ref1.length; j < len; j++) {
      status = ref1[j];
      if (this.isGroup(group, status, pass)) {
        n++;
      }
    }
    return n;
  }

  titleReport(group) {
    var path;
    path = group === "module" && (this.modulePaths[group] != null) ? this.modulePaths[group].path : "";
    switch (group) {
      case "module":
        return `\n-- Module -- ${this.moduleUnit}` + `\n-- Titled -- for ${this.moduleName} ${this.moduleTx}` + path + "\n";
      case "describe":
        if (this.isStr(this.describeName)) {
          return `\n-- Report -- for ${this.describeName} ${this.describeTx}`;
        } else {
          return `\n-- Report -- for ${this.describeTx}`;
        }
        break;
      default:
        return "";
    }
  }

  // Relies on describe and module instance variables
  titleTotals(group) {
    var path, text;
    path = group === "module" && (this.modulePaths[group] != null) ? this.modulePaths[group].path : "";
    text = "\n-- Totals -- ";
    text += (function() {
      switch (group) {
        case "describe":
          if (this.isStr(this.describeName)) {
            return `for ${this.describeName} ${this.describeTx}`;
          } else {
            return `for ${this.describeTx}`;
          }
          break;
        case "module":
          return `for ${this.moduleName} ${this.moduleTx}` + path;
        default:
          return "for all tests";
      }
    }).call(this);
    return text;
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

  archiveLocal(statuses) {
    localStorage.setItem("Tester", JSON.stringify(statuses));
  }

  reviewsLocal() {
    var j, len, locals, status, statuses;
    if (!(this.debug && this.logging)) {
      return;
    }
    locals = localStorage.getItem("Tester");
    statuses = JSON.parse(locals);
    for (j = 0, len = statuses.length; j < len; j++) {
      status = statuses[j];
      console.log(status);
    }
  }

};

// -- ES6 exports for single tester instance and its test() and unit() methods
//   tester is instanciates once on its first import subseqent imports
//   get this single instance that holds all testing state
export var tester = new Tester();

test = tester.test;

export {
  test
};

/*
 * Determine if a result is bounded witnin a range.
 * This method is here in Tester because it call @examine()
  inRangeTester:( result, spec, status, level, key, index ) ->
    range = spec.match
    pass  = @inRange( result, range )
    status.assert.text += "inRange(...)"
    @examine( pass, result, spec, status, key, index )

 * Determine if a result is enumerated.
 * This method is here in Tester because it call @examine()
  inEnumsTester:( result, spec, status, level=0, key=null, index=null ) ->
    @noop( level )
    enums = spec.expect
    pass  = @inArray( result, enums )
    status.assert.text +=  "inEnums(...)"
    @examine( pass, result, spec, status, key, index )

 * Determine if a result is enumerated.
 * This method is here in Tester because it call @examine()
  inRegexpTester:( result, spec, status, level=0, key=null, index=null ) ->
    @noop( level )
    regexp = spec.expect
    pass  = regexp.test(result)
    status.assert.text +=  "inRegexp(...)"
    @examine( pass, result, spec, status, key, index )
 */

//# sourceMappingURL=Tester.js.map
