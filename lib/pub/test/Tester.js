var Tester, test, unit,
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
    this.eq = this.eq.bind(this);
    this.run = this.run.bind(this);
    this.describe = this.describe.bind(this);
    // Performs all assertions even a deep equal on objects and arrays
    //   Strong type checking with @type(val) so asserions are only test when types match
    //   Skips over @type(val) = "function"
    this.assert = this.assert.bind(this);
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
    this.inArray = this.inArray.bind(this);
    this.inRange = this.inRange.bind(this);
    this.atIndex = this.atIndex.bind(this);
    this.head = this.head.bind(this);
    this.tail = this.tail.bind(this);
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
    if (arguments.length === 0) { // or not @testing -
      return this;
    }
    this.text = text;
    this.code = "";
    this.run(text, result, expect, "eq", this.code);
    return this;
  }

  eq(result, expect) {
    return this.run(this.text, result, expect, "eq", this.code);
  }

  run(text, result, expect, op, code) {
    /*
    if @isNot(text) or @isNot(result) or @isNot(expect)  or @isNot(op)
      console.error( "Tester.run() undefine arg(s)", { text:text, result:result, expect:expect, op:op } )
      return @
    */
    var status;
    if (arguments.length === 0 || !this.testing) {
      return this;
    }
    if (this.debug) {
      console.log("Tester.run()", {
        text: text,
        result: result,
        expect: expect,
        op: op
      });
    }
    status = this.initStatus(result, expect, text, op, code);
    status = this.assert(result, expect, status);
    this.report(status, result, expect);
    return this;
  }

  describe(description, suite = null) {
    this.description = description;
    this.suite = suite != null ? suite : null;
    return this;
  }

  pad(n, m) {
    var i, j, len, ref, ref1, str, tot;
    len = this.numDigits(n);
    tot = this.numDigits(m);
    str = n.toString();
    for (i = j = ref = len, ref1 = tot; (ref <= ref1 ? j < ref1 : j > ref1); i = ref <= ref1 ? ++j : --j) {
      str = ' ' + str;
    }
    return str;
  }

  numDigits(n) {
    return Math.max(Math.floor(Math.log10(Math.abs(n))), 0) + 1;
  }

  initStatus(result, expect, text, op, code) {
    var expectType, module, resultType;
    resultType = this.type(result);
    expectType = this.type(expect);
    module = text.split('.')[0];
    return {
      assert: {
        text: text,
        pass: true,
        module: module,
        op: op,
        code: code,
        info: "",
        exam: false
      },
      result: {
        text: "",
        type: resultType,
        value: result
      },
      expect: {
        text: "",
        type: expectType,
        value: expect
      }
    };
  }

  assert(result, expect, status, level = 0) {
    var expectType, resultType;
    // Set types
    resultType = this.type(result);
    expectType = this.type(expect);
    // Define checks
    if (this.isNot(result) || this.isNot(expect)) {
      status.assert.pass = false;
      status.assert.info = " null or undefined values";
      status.result.text = this.textResult(status, result);
      status.expect.text = this.textExpect(status, expect);
      this.failed.push(status);
      return status;
    }
    // Type checks
    if (resultType !== expectType || (resultType === "function" || expectType === "function")) {
      status.assert.pass = false;
      status.assert.text = resultType !== expectType ? "-- Failed -- " + status.assert.text + " types do not match" : "-- Failed -- " + status.assert.text + " both types are functions";
      status.result.text = this.textResult(status, result);
      status.expect.text = this.textExpect(status, expect);
      this.failed.push(status);
      return status;
    }
    // string, number, boolean, object, array and check
    // May want to factor in unknowns
    if (level > 0 && resultType === 'string') {
      console.log('assert()', {
        resultType: resultType,
        result: result,
        expect: expect
      });
    }
    switch (resultType) {
      case 'string':
        status.assert.pass = result === expect;
        break;
      case 'number':
        status.assert.pass = result === expect;
        break;
      case 'boolean':
        status.assert.pass = result === expect;
        break;
      case 'object':
        status = this.objsEq(result, expect, status, level);
        break;
      case 'array':
        status = this.arrsEq(result, expect, status, level);
        break;
      case 'function':
        status.assert.pass = true; // Indicates a skip over when in a recursion
        break;
      default:
        status.assert.pass = false; // Unknown type for comparision
    }
    
    // Update pass status only  at level 0
    if (status.assert.pass && level === 0 && !status.assert.exam) {
      status.assert.exam = true;
      status.assert.text = "-- Passed -- " + status.assert.text;
      status.assert.code = this.code;
      status.result.text = this.textResult(status, result);
      status.expect.text = this.textExpect(status, expect);
      this.passed.push(status);
    } else if (!status.assert.pass && !status.assert.exam) {
      status.assert.exam = true;
      status.assert.text = "-- Failed -- " + status.assert.text;
      status.assert.code = this.code;
      status.result.text = this.textResult(status, result);
      status.expect.text = this.textExpect(status, expect);
      this.failed.push(status);
    }
    return status;
  }

  textResult(status, result) {
    return `Result type is ${status.result.type} with value ${this.toStr(result)}`;
  }

  textExpect(status, expect) {
    return `Expect type is ${status.expect.type} with value ${this.toStr(expect)}`;
  }

  // Deep object equality assertion
  objsEq(result, expect, status, level) {
    var key, obj;
    for (key in expect) {
      if (!hasProp.call(expect, key)) continue;
      obj = expect[key];
      if (result[key] == null) {
        status.assert.pass = false;
        status.assert.info = ` result key '${key}' is missing`;
        status.result.text = this.textResult(status, result);
        status.expect.text = this.textExpect(status, expect);
        return status;
      } else {
        status = this.assert(result[key], expect[key], status, ++level);
      }
    }
    status.assert.pass = true;
    return status;
  }

  // Deep array equality assertion
  arrsEq(result, expect, status, level) {
    var i, j, ref;
    if (result.length !== expect.length) {
      status.assert.pass = false;
      status.assert.info = " different array lengths";
      status.result.text = `Result length is ${result.length} with value ` + this.toStr(result);
      status.expect.text = `Expect length is ${expect.length} with value ` + this.toStr(expect);
      return status;
    }
    for (i = j = 0, ref = expect.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      status = this.assert(result[i], expect[i], status, ++level);
    }
    status.assert.pass = true;
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
    var fail, failCount, fullCount, j, l, len1, len2, pass, passCount, path, ref, ref1, summaryText;
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
      ref = this.passed;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        pass = ref[j];
        if (pass.assert.module === module) {
          ++passCount;
        }
      }
      ref1 = this.failed;
      for (l = 0, len2 = ref1.length; l < len2; l++) {
        fail = ref1[l];
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

  head(a) {
    if (this.isArray(a)) {
      return a[0];
    } else {
      return null;
    }
  }

  tail(a) {
    if (this.isArray(a)) {
      return a[a.length - 1];
    } else {
      return null;
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

export {
  test,
  unit
};

//# sourceMappingURL=Tester.js.map
