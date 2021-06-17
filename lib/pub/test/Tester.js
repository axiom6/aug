var Tester, log, test, unit,
  hasProp = {}.hasOwnProperty;

Tester = (function() {
  class Tester {
    constructor() {
      // -- unit -- For invoking the result argument immediately in a module-unit.js file

      // Imports: import { unit } from "../test/Tester.js"
      //          import Vis      from "../draw/Vis.js"
      // Specify: unit( text, result, expect )
      // Example: unit( "can convert hex color to rgb object",  Vis.rgb(0xFFFFFF), {r:255,g:255,b:255} )
      this.unit = this.unit.bind(this);
      this.unitLine = this.unitLine.bind(this);
      
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
      this.func = this.func.bind(this);
      this.eq = this.eq.bind(this);
      this.run = this.run.bind(this);
      this.describe = this.describe.bind(this);
      this.summary = this.summary.bind(this);
      this.archiveLocal = this.archiveLocal.bind(this);
      // At present this is vite.js dependent with import.meta.glob() and its dynamic await importer
      this.runUnitTestModulesWithViteJS = this.runUnitTestModulesWithViteJS.bind(this);
      this.runUnitTestModulesFromPaths = this.runUnitTestModulesFromPaths.bind(this);
      this.assert = this.assert.bind(this);
      this.isNul = this.isNul.bind(this);
      this.isUnd = this.isUnd.bind(this);
      this.isDef = this.isDef.bind(this);
      this.isNot = this.isNot.bind(this);
      this.isStr = this.isStr.bind(this);
      this.isNum = this.isNum.bind(this);
      this.isNaN = this.isNaN.bind(this);
      this.isObj = this.isObj.bind(this);
      this.isVal = this.isVal.bind(this);
      this.isArr = this.isArr.bind(this);
      // Key settings that are reconfigured through setOptions( options )
      this.testing = true;
      this.logToConsole = true;
      this.archive = true;
      this.verbose = false;
      this.debug = false;
      this.inViteJS = this.isDef(import.meta.env);
      this.module = "";
      this.suite = "";
      this.text = null; // set by test() that is passed inside eq() and sent to run()
      this.passed = [];
      this.failed = [];
      this.nav = null;
      this.stream = null;
      this.mix = null;
      this.batch = null;
    }

    setOptions(options) {
      this.testing = options.testing != null ? options.testing : true;
      this.logToConsole = options.logToConsole != null ? options.logToConsole : true;
      this.archive = options.archive != null ? options.archive : true;
      this.verbose = options.verbose != null ? options.verbose : false;
      this.debug = options.debug != null ? options.debug : false;
    }

    injectStream(stream) {
      return;
      this.stream = stream;
    }

    injectNav(nav) {
      return;
      this.nav = nav;
      this.stream = nav.stream;
      this.mix = nav.mix;
      this.batch = nav.batch;
    }

    unit(text, result, expect) { // unit(...) is always @testing
      if (arguments.length === 0) { // or not @testing -
        return this;
      }
      return this.run(text, result, expect); // unit() is actually a synonym for run()
    }

    unitLine(text, result, expect, error = new Error()) { // unit(...) is always @testing
      if (arguments.length === 0) { // or not @testing -
        return this;
      }
      this.line(error);
      return this.run(text, result, expect); // unit() is actually a synonym for run()
    }

    test(text, closure) {
      if (arguments.length === 0 || !this.testing) {
        return this;
      }
      this.text = text; // @text is latter referenced inside eq()
      this.func(closure);
      return this;
    }

    func(closure) {
      var eqCall, str, tokens;
      str = closure.toString();
      tokens = str.split("return t.");
      eqCall = tokens[1] != null ? tokens[1].substring(0, tokens[1].length - 3) : "?";
      return console.log(eqCall, closure, str, tokens[1]);
    }

    eq(result, expect) {
      if (this.debug) {
        console.log("Tester.eq()", {
          text: this.text,
          result: result,
          expect: expect
        });
      }
      return this.run(this.text, result, expect); // @text is set by test()
    }

    run(text, result, expect) {
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
      status = this.initStatus(result, expect, text);
      status = this.assert(result, expect, status);
      this.report(status);
      return this;
    }

    describe(module, suite = null) {
      this.module = module;
      this.suite = suite != null ? suite : null;
      return this;
    }

    summary(module = null) {
      var fail, failCount, fullCount, j, k, len1, len2, pass, passCount, ref, ref1;
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
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          fail = ref1[k];
          if (fail.assert.module === module) {
            ++failCount;
          }
        }
        fullCount = passCount + failCount;
        console.log('-- Summary - for', module);
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
            failed: true,
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
      var failLocals, failStatus, failStatuses, j, k, len1, len2, passLocals, passStatus, passStatuses;
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
          for (k = 0, len2 = passStatuses.length; k < len2; k++) {
            passStatus = passStatuses[k];
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

    initStatus(result, expect, text) {
      var expectType, expectValue, module, resultType, resultValue;
      resultType = this.type(result);
      expectType = this.type(expect);
      resultValue = resultType !== 'function' ? result : '? function(args...) ?';
      expectValue = expectType !== 'function' ? expect : '? function(args...) ?';
      module = text.split('.')[0];
      return {
        assert: {
          text: text,
          pass: true,
          module: module
        },
        result: {
          text: "",
          type: resultType,
          value: resultValue
        },
        expect: {
          text: "",
          type: expectType,
          value: expectValue
        }
      };
    }

    assert(result, expect, status, level = 0) {
      // Define checks
      if (this.isNot(result) || this.isNot(expect)) {
        status.assert.pass = false;
        status.assert.text = "-- Failed -- because of null or undefined values fot" + status.assert.text;
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
        status.result.text = this.textResult(status, result);
        status.expect.text = this.textExpect(status, expect);
        this.passed.push(status);
      } else if (level === 0) {
        status.assert.text = "-- Failed -- " + status.assert.text;
        status.result.text = this.textResult(status, result);
        status.expect.text = this.textExpect(status, expect);
        this.failed.push(status);
      }
      return status;
    }

    report(status) {
      var eq;
      if (this.isDef(this.stream)) {
        this.stream.publish(status);
      }
      if (this.logToConsole) {
        eq = status.assert.pass ? ' = ' : ' != ';
        console.log(status.assert.text + eq, status.expect.value);
        if (this.verbose || !status.assert.pass) {
          console.log("   " + status.result.text, status.result.value);
        }
        if (this.verbose || !status.assert.pass) {
          console.log("   " + status.expect.text, status.expect.value);
        }
      }
    }

    objsEq(result, expect, status, level) {
      var key, obj;
      for (key in expect) {
        if (!hasProp.call(expect, key)) continue;
        obj = expect[key];
        if (!result[key]) {
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

    isNul(d) {
      return this.type(d) === 'null';
    }

    isUnd(d) {
      return this.type(d) === 'undefined';
    }

    isDef(d) {
      return this.type(d) !== 'null' && this.type(d) !== 'undefined';
    }

    isNot(d) {
      return !this.isDef(d);
    }

    isStr(s) {
      return this.isDef(s) && this.type(s) === "string" && s.length > 0 && s !== 'None';
    }

    isNum(n) {
      return this.isDef(n) && this.type(n) === "number";
    }

    isNaN(n) {
      return this.isNum(n) && Number.isNaN(n);
    }

    isObj(o) {
      return this.isDef(o) && this.type(o) === "object";
    }

    isVal(v) {
      return this.type(v) === "number" || this.type(v) === "string" || typeof v === "boolean";
    }

    isArr(a) {
      return this.isDef(a) && this.type(a) === "array" && (a.length != null) && a.length > 0;
    }

    textResult(status) {
      return `Result type is ${status.result.type} with value`;
    }

    textExpect(status) {
      return `Expect type is ${status.expect.type} with value`;
    }

    // Will full implement later
    log(msg, ...args) {
      if (!this.debug) {
        return;
      }
      console.log(msg, args);
    }

    line() {
      console.log('Tester.line()', this.error);
    }

  };

  // Need to understand type() more
  // We many want to consider class types and unknowns
  Tester.prototype.type = (function() {
    var classToType, j, len1, name, ref;
    classToType = {};
    ref = "Boolean Number String Function Object Array Date RegExp Undefined Null".split(" ");
    for (j = 0, len1 = ref.length; j < len1; j++) {
      name = ref[j];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    return function(obj) {
      var strType;
      strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object";
    };
  })();

  return Tester;

}).call(this);

export var tester = new Tester();

test = tester.test;

unit = tester.unit;

log = tester.log;

export {
  test,
  unit,
  log
};

/*

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
