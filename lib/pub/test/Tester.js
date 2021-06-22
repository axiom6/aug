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
    this.summary = this.summary.bind(this);
    this.archiveLocal = this.archiveLocal.bind(this);
    // At present this is vite.js dependent with import.meta.glob() and its dynamic await importer
    this.runUnitTestModulesWithViteJS = this.runUnitTestModulesWithViteJS.bind(this);
    this.runUnitTestModulesFromPaths = this.runUnitTestModulesFromPaths.bind(this);
    this.assert = this.assert.bind(this);
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
    // Check if an object or array or string is empty
    this.isEmpty = this.isEmpty.bind(this);
    // Checks for offical child key which starts with capital letter and isnt an _ or $
    this.isChild = this.isChild.bind(this);
    // A big improvement over typeof() that follows the convention by returning types in lower case by default
    // For basic types returned are boolean number string function object array date regexp undefined null
    this.type = this.type.bind(this);
    // A more detail type that returns basic types, class, object and function name in upper case
    this.klass = this.klass.bind(this);
    // Key settings that are reconfigured through setOptions( options )
    this.testing = true; // When false all testing is turned which allows tests to remain in code
    this.logToConsole = true; // Contols logging to console
    this.archive = true; // When true archived test status object to localStorage TestsPassed and TestFail
    this.verbose = false; // Adds addition and sometimes mind numbing detail to testStatus objects
    this.debug = false; // Turns on debugs call to console.log(...)
    
    // When true Tester leverage addiion ViteJS capabilies
    this.inViteJS = true; // @isDef(`import.meta.env`)
    
    // Short hand in @test closures and chained calls that reference codes in modules being tested
    this.log = console.log;
    this.error = console.error;
    // Set by @describe()
    this.description = "";
    this.suite = "";
    // Test status values
    this.text = null; // set by test() that is passed inside eq() and sent to run()
    this.statusText = "";
    this.statusCalled = false;
    this.code = "";
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
    this.run(text, result, expect);
    this.status(true);
    return this;
  }

  eq(result, expect) {
    return this.run(this.text, result, expect, this.code); // @text and @code are set by @test() and @unit()
  }

  run(text, result, expect, code) {
    var status;
    if (arguments.length === 0 || !this.testing) {
      return this;
    }
    if (this.debug) {
      console.log("Tester.run()", {
        text: text,
        result: result,
        expect: expect
      });
    }
    if (this.isNot(text) || this.isNot(result) || this.isNot(expect)) {
      console.error("Tester.run() undefine arg(s)", {
        text: text,
        result: result,
        expect: expect
      });
      return this;
    }
    status = this.initStatus(result, expect, text, code);
    status = this.assert(result, expect, status);
    this.report(status, result, expect);
    return this;
  }

  describe(description, suite = null) {
    this.description = description;
    this.suite = suite != null ? suite : null;
    return this;
  }

  summary(module = null) {
    var fail, failCount, fullCount, j, l, len1, len2, pass, passCount, ref, ref1;
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
      console.log("-- Summary - for", module);
      console.log('   ', this.pad(passCount, fullCount) + ' tests passed');
      console.log('   ', this.pad(failCount, fullCount) + ' tests failed');
      console.log('   ', this.pad(fullCount, fullCount) + ' tests total');
    } else {
      fullCount = this.passed.length + this.failed.length;
      console.log('-- Summary - for all tests');
      console.log('   ', this.pad(this.passed.length, fullCount) + ' tests passed');
      console.log('   ', this.pad(this.failed.length, fullCount) + ' tests failed');
      console.log('   ', this.pad(fullCount, fullCount) + ' tests total');
      if (this.archive) {
        this.archiveLocal(this.failed, this.passed); // Good place to archive with all tests complete
        this.reviewsLocal({
          failed: false,
          passed: false
        });
      }
    }
    return this;
  }

  archiveLocal(failed, passed) {
    localStorage.setItem('TestsFailed', JSON.stringify(failed));
    localStorage.setItem('TestsPassed', JSON.stringify(passed));
  }

  reviewsLocal(reviewFailed, reviewPassed) {
    var failLocals, failStatus, failStatuses, j, l, len1, len2, passLocals, passStatus, passStatuses;
    if (reviewFailed) {
      failLocals = localStorage.getItem('TestsFailed');
      if (failLocals != null) {
        failStatuses = JSON.parse(failLocals);
        for (j = 0, len1 = failStatuses.length; j < len1; j++) {
          failStatus = failStatuses[j];
          console.log(failStatus);
        }
      }
    }
    if (reviewPassed) {
      passLocals = localStorage.getItem('TestsPassed');
      if (passLocals != null) {
        passStatuses = JSON.parse(passLocals);
        for (l = 0, len2 = passStatuses.length; l < len2; l++) {
          passStatus = passStatuses[l];
          console.log(passStatus);
        }
      }
    }
  }

  runUnitTestModulesWithViteJS() {
    var count, globPtn, importer, modules, path, results, total;
    globPtn = "/lib/**/*-unit.js";
    modules = import.meta.glob("/lib/**/*-unit.js"); // vite.js dependent with nack tics for non standard import
    if (this.debug) {
      console.log("Tester.runUnitTestModulesWithViteJS()", modules, globPtn);
    }
    count = 0;
    total = Object.keys(modules).length;
    results = [];
    for (path in modules) {
      if (!hasProp.call(modules, path)) continue;
      importer = modules[path];
      results.push(modules[path]().then(async(importer) => {
        if (this.debug) {
          console.log(path, importer);
        }
        await importer;
        count++;
        if (count === total) {
          this.summary();
        }
      }));
    }
    return results;
  }

  async runUnitTestModulesFromPaths(paths) {
    var count, j, len1, path, total;
    if (this.debug) {
      console.log("Tester.runUnitTestModulesFromPaths()", paths);
    }
    count = 0;
    total = paths.length;
    for (j = 0, len1 = paths.length; j < len1; j++) {
      path = paths[j];
      if (this.debug) {
        console.log("Tester.runUnitTestModulesFromPaths()", path);
      }
      await import( path /* @vite-ignore */ );
      count++;
      if (count === total) {
        this.summary();
      }
    }
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

  initStatus(result, expect, text, code) {
    var expectType, module, resultType;
    resultType = this.type(result);
    expectType = this.type(expect);
    module = text.split('.')[0];
    return {
      assert: {
        text: text,
        pass: true,
        module: module,
        code: code
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
    // Define checks
    if (this.isNot(result) || this.isNot(expect)) {
      status.assert.pass = false;
      status.assert.text = "-- Failed -- because of null or undefined values for" + status.assert.text;
      status.result.text = this.textResult(status, result);
      status.expect.text = this.textExpect(status, expect);
      this.failed.push(status);
      return status;
    }
    // Type checks
    if (status.result.type !== status.expect.type) {
      status.assert.pass = false;
      status.assert.text = "-- Failed -- Result type does match Expect tyoe for " + status.assert.text;
      status.result.text = this.textResult(status, result);
      status.expect.text = this.textExpect(status, expect);
      this.failed.push(status);
      return status;
    }
    // String, Number, Object and Array check
    // May want to factor in unknowns
    switch (status.result.type) {
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
        status.assert.pass = false;
    }
    // Update status at only level 0
    if (status.assert.pass && level === 0) {
      status.assert.text = "-- Passed -- " + status.assert.text;
      status.assert.code = this.code;
      status.result.text = this.textResult(status, result);
      status.expect.text = this.textExpect(status, expect);
      this.passed.push(status);
    } else if (level === 0) {
      status.assert.text = "-- Failed -- " + status.assert.text;
      status.assert.code = this.code;
      status.result.text = this.textResult(status, result);
      status.expect.text = this.textExpect(status, expect);
      this.failed.push(status);
    }
    return status;
  }

  report(status, result, expect) {
    var eq;
    if (this.isDef(this.stream)) {
      this.stream.publish(status);
    }
    eq = status.assert.pass ? 'is' : 'not';
    this.statusText = `${status.assert.text} ${eq} ${expect} `;
    if (this.verbose || !status.assert.pass) {
      this.statusText += `"\n   ${this.textResult(status, result)}`;
    }
    if (this.verbose || !status.assert.pass) {
      this.statusText += `"\n   ${this.textExpect(status, expect)}`;
    }
    if (this.isStr(this.code) && (this.verbose || !status.assert.pass)) {
      this.statusText += "\n" + this.code;
    }
    this.statusCalled = false;
  }

  // Need to work on another way to console.log( @statusText ) when @status is not called in a unit test
  status(wait = null) {
    if (this.isNull(wait)) {
      this.statusCalled = true;
    } else if (this.logToConsole) {
      if (!this.statusCalled) {
        // @sleep( 1000 ).then( console.log( @statusText )  )
        console.log(this.statusText);
      }
    }
    return this.statusText;
  }

  sleep(ms) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  }

  textResult(status, result) {
    return `Result type is ${status.result.type} with value ${result}`;
  }

  textExpect(status, expect) {
    return `Expect type is ${status.expect.type} with value ${expect}`;
  }

  // Deep object equality assertion
  objsEq(result, expect, status, level) {
    var key, obj;
    for (key in expect) {
      if (!hasProp.call(expect, key)) continue;
      obj = expect[key];
      if (result[key] == null) {
        status.assert.pass = false;
        status.assert.text = `-- Failed -- Result key:${key} is missing for ` + status.assert.text;
        status.expect.text = `Expect type is ${this.type(result)} with value ${expect}`;
        status.result.text = `Result key:${key} is missing`;
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
      status.assert.text = "-- Failed -- Different array lengths fot" + status.assert.text;
      status.result.text = `Result length is ${result.length} value is`;
      status.expect.text = `Expect length is ${expect.length} value is`;
      return status;
    }
    for (i = j = 0, ref = expect.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      status = this.assert(result[i], expect[i], status, ++level);
    }
    status.assert.pass = true;
    return status;
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
      console.error("Tester.injectStream( stream ) stream klass must be 'Stream not", type);
    }
  }

};

// -- ES6 exports for single tester instance and its test() and unit() methods

// This construct only instanciates tester once on its first import
//   subseqent imports get this single instance that holds all testing state
export var tester = new Tester();

test = tester.test;

unit = tester.unit;

export {
  test,
  unit
};

/*
    resultValue = if resultType isnt 'function' then result else '? function(args...) ?'
    expectValue = if expectType isnt 'function' then expect else '? function(args...) ?'

  injectNav:(  nav ) ->
    return
    @nav     = nav
    @stream  = nav.stream
    @mix     = nav.mix
    @batch   = nav.batch
    return

  toFunc:( closure ) =>
    @code = @codeClosure( closure )
    cstr = closure.toString()
    toks = cstr.split( "return ")
    body = toks[1].substring( 0, toks[1].length-3 )  # Removes trailing ;
    body = body + ".log( t.status() );"
    func = new Function( "t", body ) # "func = function(t) {" + body + "}"
    console.log( { cstr:cstr, body:body, fstr:func.toString(), ftype:@type(func) } ) if @debug
    func

  toCode:( closure ) =>
    str  = closure.toString()
    toks = str.split("return t.")
    code = if toks[1]? then toks[1].substring( 0, toks[1].length-3 ) else ""
    console.log( "Tester.codeClosure(closure)", { code:code, closur:closure } ) if @debug
    code

  unitLine:(  text, result, expect, error = new Error() ) =>
    return @ if arguments.length == 0 # or not @testing -
    @line( error )
    @run( text, result, expect )      # unit() is actually a synonym for run()

  line:() ->
    console.log( 'Tester.line()', @error )
    return

 * Will full implement later
  logStatus:( msg, args... ) ->
    return if not @debug
    console.log( msg, args )
    return

  type:(val,lowerCase=true) =>
    str = Object::toString.call(val)
    tok = str.split(' ')[1]
    typ = tok.substring(0,tok.length-1)
    if if lowerCase then typ.toLowerCase() else type

  klass:(val) =>
    typ = "Unknown"
    try
      typ = val.constructor.name
    catch error
      console.log( "Tester.class(val) name error", { val:val, error:error } )
      typ = @type(val,false)
    typ

  type:(val) =>
    str = Object::toString.call(val).toLowerCase()
    tok = str.split(' ')[1]
    typ = tok.substring(0,tok.length-1)
 * console.log( "Tester.type(val)", { val:val, str:str, tok:tok, typ:typ } )
    typ

 * Tester.types = ['Boolean','Number','String','Function','Object','Array','Date','RegExp','Undefined','Null']

 * Experimental
 * Return basic and class types in their original camel case
 * Instances are return as Object
  typeClass:(val) =>
    typ = "Unknown"
    try
      typ = Object::toString.call(val)
      typ = typ.split(' ')[1].substring(0,typ.length-1)
    catch error
      console.error( 'Tester.klass(val) call(val) error', { val:val, error:error } )
    typ

  type: do () =>
    classToType = {}

    for name in ["Boolean", "Number", "String", "Function", "Object", "Array", "Date",
      "RegExp", "Symbol", "Event", "Element", "Undefined", "Null"]
      classToType["[object " + name + "]"] = name.toLowerCase()

    (val) ->
      key = Object::toString.call(val)
      typ = classToType[key] or "object"
      console.log( "Tester.type()", { key:key, val:val, typ:typ } )
      typ

 * -- bdd -- Behavion Driven Design like Jasmine --
 * Imports: import { bdd }     from "../test/Tester.js"
 *          import Calculator  from "../calculator/Calculator.js"
 *          const  calculator = new Calculator()
 * Specify: bdd( text, closure )
 * Example: bdd( 'can add two positive numbers', =>
 *      result = calculator.add( 2, 3 )
 *      bdd().expect(result).toBe( 5 )

status.assert.text = "-- Passed -- #{status.result.type}s are equal for " + status.assert.text
status.assert.text = "-- Failed -- #{status.result.type}s are not equal for " + status.assert.text

expect:( result ) ->
@result = result
@

toBe:( expect ) =>
@expect = expect
@

 */

//# sourceMappingURL=Tester.js.map
