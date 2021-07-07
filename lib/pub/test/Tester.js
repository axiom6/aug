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
    this.summaryText = this.summaryText.bind(this);
    this.complete = this.complete.bind(this);
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
    // Set by @module( moduleId, moduleTx, moduleOn=true )
    this.moduleId = "";
    this.moduleTx = "";
    this.moduleOn = true;
    // Set by @describe( methodId, methodTx, methodOn=true )
    this.methodId = "";
    this.methodTx = "";
    this.methodOn = true;
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
    if (arguments.length === 0 || !(this.always || (this.testing && this.moduleOn && this.methodOn))) {
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

  eq(result, expect) {
    boundMethodCheck(this, Tester);
    return this.run(this.text, result, expect);
  }

  // -- run() scenario is @initStatus(...) @assert(...) @report(...)
  //     console.log( "Tester.run()", { text:text, result:result, expect:expect} ) if  @debug
  run(text, result, expect) {
    if (!this.testing) {
      return this;
    }
    this.statusAs = this.initStatus(result, expect, text);
    this.statusAs = this.assert(result, expect, this.statusAs);
    return this;
  }

  
    // Create a new status object for the current test
  initStatus(result, expect, text) {
    return {
      assert: {
        text: text,
        pass: true,
        module: this.moduleId,
        method: this.methodId,
        keys: ""
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
      }
    };
  }

  // Performs all assertions even a deep equal on objects and arrays
  //   Strong type checking with @type(arg) so asserions are only test when types match
  //   Skips over @type(arg) = "function"
  assert(result, expect, status, level = 0, key = null, index = null) {
    var spec, type;
    // Check values and types
    status = this.checkValuesTypes(result, expect, status, key, index);
    // Perform all spec based assertions
    if (this.isSpec(expect)) {
      spec = this.toSpec(expect);
      status = (function() {
        switch (spec.oper) {
          case 'regexp':
            return this.inRegexp(result, spec, status, level, key, index);
          case 'enums':
            return this.inEnums(result, spec, status, level, key, index);
          case "range":
            return this.inRange(result, spec, status, level, key, index);
          default:
            return this.examine(false, result, spec, status, `unknown spec.oper ${spec.oper}`, key, index);
        }
      }).call(this);
      return status.assert.pass;
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
    this.examine(status.assert.pass, result, expect, status, "", key, index);
    // Store status in @statuses array and publish
    if (level === 0) {
      this.statuses.push(status);
      if (this.isDef(this.stream)) {
        this.stream.publish(this.statusSubject, status);
      }
    }
    return status;
  }

  // Check and report on values and types
  // Needs refactoring
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
    if (this.isStr(info)) {
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
  unknownsEq(result, expect, status) {
    this.noop(result, expect);
    status.assert.pass = false;
    status.assert.warn += "unknown types for comparision";
    return status;
  }

  // Deep object equality assertion where all matching keys are examined
  objectsEq(result, expect, status, level, key) {
    var arg, info, obj;
    // Insure that result and expect are objects
    if (!this.isObject(result) || !this.isObject(expect)) {
      info = " either one or both result and expect are not objects";
      info += ` Result type is ${this.type(result)}`;
      info += ` Expect type is ${this.type(expect)}`;
      return this.examine(false, result, expect, status, info, key, null);
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
    var i, info, j, length, ref1;
    // Insure that result and expect are arrays
    if (!this.isArray(result) || !this.isArray(expect)) {
      info = " either one or both result and expect are not arrays";
      info += ` Result type is ${this.type(result)}`;
      info += ` Expect type is ${this.type(expect)}`;
      return this.examine(false, result, expect, status, info, null, index);
    }
    // Examine the array lengths
    if (result.length !== expect.length) {
      info = " different array lengths";
      info += ` Result length is ${result.length}`;
      info += ` Expect length is ${expect.length}`;
      status = this.examine(false, result, expect, status, info, null, index);
    }
    // Assert each value within the minimum length of the result and expect arrays
    length = Math.min(result.length, expect.length);
    for (i = j = 0, ref1 = length; (0 <= ref1 ? j < ref1 : j > ref1); i = 0 <= ref1 ? ++j : --j) {
      status = this.assert(result[i], expect[i], status, ++level, null, i);
    }
    return status;
  }

  // Determine if a result is enumerated.
  // This method is here in Tester because it call @examine()
  inRegexp(result, spec, status, level = 0, key = null, index = null) {
    var pass, regexp;
    this.noop(level);
    regexp = spec.expect;
    pass = regexp.test(result);
    return this.examine(pass, result, spec, status, "inRegexp(...)", key, index);
  }

  // Determine if a result is enumerated.
  // This method is here in Tester because it call @examine()
  inEnums(result, spec, status, level = 0, key = null, index = null) {
    var enums, pass;
    this.noop(level);
    enums = spec.expect;
    pass = this.inArray(result, enums);
    return this.examine(pass, result, spec, status, "inEnums(...)", key, index);
  }

  // Determine if a result is bounded witnin a range.
  // This method is here in Tester because it call @examine()
  inRange(result, spec, status, level, key, index) {
    var inFloatRange, inIntRange, inStrRange, pass, range, type;
    range = spec.expect;
    pass = this.isRange(range);
    type = this.type(result);
    inStrRange = function(string, range) {
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
          return inStrRange(result, range);
        case "int":
          return inIntRange(result, range);
        case "float":
          return inFloatRange(result, range);
        case "array":
          return this.inArrayRange(result, range);
        case "object":
          return this.objectsEq(result, range, status, level);
        default:
          return this.toWarn("inRange()", "unknown range type", result, type, false, function(t) {
            return t.log(t.warn());
          });
      }
    }).call(this);
    return this.examine(pass, result, spec, status, "inRange(...)", key, index);
  }

  // @runUnitTests(...) @describe(...) @summary(...)
  async runUnitTests(paths) {
    var j, len, modulePath, path, text;
    for (j = 0, len = paths.length; j < len; j++) {
      path = paths[j];
      modulePath = this.toPath(path);
      text = `\n-- Started Unit Testing for: ${modulePath.name} in ${modulePath.path}`;
      if (this.logging) {
        console.log(text);
      }
      if (this.isDef(this.stream)) {
        this.stream.publish(this.summarySubject, text);
      }
      await import( path /* @vite-ignore */ );
    }
    this.complete(); // All tests complete so produce then log and publish the final summary
  }

  module(moduleId, moduleTx, moduleOn = true) {
    boundMethodCheck(this, Tester);
    this.moduleId = moduleId;
    this.moduleTx = moduleTx;
    this.moduleOn = moduleOn;
    return this;
  }

  describe(methodId, methodTx, methodOn = true) {
    boundMethodCheck(this, Tester);
    this.methodId = methodId;
    this.methodTx = methodTx;
    this.methodOn = methodOn;
    return this;
  }

  // Improved buy still needs work
  statusAssertText(pass, result) {
    var text;
    text = pass ? "\n-- Passed -- " : "\n-- Failed -- ";
    if (this.isStr(this.methodId) && this.head(this.methodId) !== "-" && this.tail(this.methodId) === ")") {
      text += this.strip(this.methodId, "", "()") + "(" + this.toStr(result) + ") ";
      if (!pass) {
        text += this.text + " ";
      }
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
      return `\n   ${name}${ref} type is '${spec.type}' with spec '${spec.spec}' and oper '${spec.oper}'`;
    } else {
      return `\n   ${name}${ref} type is '${this.type(value)}' with value ${this.toStr(value)}`;
    }
  }

  // Generates informative text in status
  examine(pass, result, expect, status, warn, key, index) {
    var eq, isSpec;
    if (!this.verbose && ((key != null) || (index != null))) {
      return status;
    }
    isSpec = this.isSpec(expect);
    eq = pass ? "eq" : "not";
    status.assert.text = this.statusAssertText(pass, result);
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
    status.warned.text += warn;
    return status;
  }

  isGroup(status, group, pass = null) {
    var passed;
    passed = (status, pass) => {
      if (pass != null) {
        return status.assert.pass === pass;
      } else {
        return true;
      }
    };
    switch (group) {
      case "all":
        return passed(status, pass);
      case "method":
        return passed(status, pass) && status.assert.method === this.methodId;
      default:
        return passed(status, pass) && status.assert.module === this.moduleId;
    }
  }

  // Needs to become more of a method / test() block status summary
  summary(module = null) {
    var group, summaryText;
    if (this.summaryReturn(module)) { // blank string turns off logging
      return "";
    }
    group = module != null ? "module" : "method";
    summaryText = this.title(group, "Summary");
    summaryText += this.summaryText(group);
    summaryText += this.totals(group);
    if (this.isDef(this.stream)) {
      this.stream.publish(this.summarySubject, summaryText);
    }
    return summaryText; // for log( test().summary() )
  }

  summaryReturn(module) {
    var isReturn;
    isReturn = ((module != null) && !this.moduleOn) || !this.methodOn;
    if (module != null) {
      this.moduleOn = true;
    }
    this.methodOn = true;
    return isReturn;
  }

  summaryText(group) {
    var j, len, ref1, status, text;
    boundMethodCheck(this, Tester);
    text = "";
    ref1 = this.statuses;
    for (j = 0, len = ref1.length; j < len; j++) {
      status = ref1[j];
      if (this.isGroup(status, group)) {
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
    text = this.title(group, "Totals");
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
      if (this.isGroup(status, group, pass)) {
        n++;
      }
    }
    return n;
  }

  title(group, name) {
    var path, text;
    path = group === "module" && (this.modulePaths[group] != null) ? this.modulePaths[group].path : "";
    text = name === "Totals" ? "\n-- Totals -- for " : "\n-- Summary - for ";
    text += (function() {
      switch (group) {
        case "method":
          return `${this.methodId} ${this.methodTx}`;
        case "module":
          return `${this.moduleId} ${this.moduleTx}` + path;
        default:
          return `for all tests`;
      }
    }).call(this);
    return text;
  }

  complete() {
    var summaryText;
    boundMethodCheck(this, Tester);
    summaryText = this.totals("all");
    this.moduleOn = true;
    this.methodOn = true;
    if (this.isDef(this.stream)) {
      this.stream.publish(this.summarySubject, summaryText);
    }
    if (this.logging) {
      this.log(summaryText);
    }
    // Archive since all tests are complete
    if (this.archive) {
      this.archiveLocal(this.statuses);
      this.reviewsLocal();
    }
    return this;
  }

  
    // Add a unit test file path to the @modulePaths object  - not called
  toPath(path) {
    var dirs, module;
    dirs = path.split("/");
    module = this.tail(dirs).split("-")[0];
    this.modulePaths[module] = {
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
    return this.modulePaths[module];
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

//# sourceMappingURL=Tester.js.map
