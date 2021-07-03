var Main, add, five, stream, streamLog, subjects;

import {
  test,
  tester
} from './Tester.js';

import Stream from "../base/util/Stream.js";

import Vis from '../base/draw/Vis.js';

// In this context all unit tests are executed immediately when this module is either
//   dynaically  imported i.e module = import(path) - recommended
// or statically imported i.e inport module from path

// runUnitTestModulesFromPaths:( paths ) will dynamically import this module
//   with paths = ["/lib/pub/test/Tester-unitester.js"]
// For glob file patterns running in ViteJS there is
// runUnitTestModulesWithViteJS:() will dynamically import this module
//   using a glob pattern like "/src/**/*-unitester.js"  or "/pub/**/*-unitester.js"

// t = tester
test().describe('Tester', 'unit tests');

five = function() {
  return 5;
};

add = function(a, b) {
  return a + b;
};

test("five() = 5", function(t) {
  return t.eq(five(), 5);
});

test("add(2,3) = 5", function(t) {
  return t.eq(add(2, 3), 5);
});

test("type(123)", function(t) {
  return t.eq(tester.type(123), 'number');
});

test("type('123')", function(t) {
  return t.eq(tester.type('123'), 'string');
});

Main = class Main {
  static init() {}

};

subjects = ["TestStatus", "TestString", "TestSummary"];

streamLog = {
  subscribe: false,
  publish: false,
  subjects: subjects
};

stream = new Stream(subjects, streamLog);

test().module("Tester", "Tester Unit tests", false);

test().describe("klass()", "klass type on classed", false);

test("stream", tester.klass(stream), 'Stream');

test("Stream", tester.klass(Stream), 'Stream');

test("tester", tester.klass(tester), 'Tester');

test("Vis", tester.klass(Vis), 'Vis');

test().log(test().summary());

test().describe("eq()", "eq() assertion inside test( text, (t) -> ...", false);

test('eq( {a:"a"})', function(t) {
  return t.eq({
    a: "a"
  }, {
    a: "a"
  });
});

test('eq( {a:"a"})', function(t) {
  return t.eq({
    a: "a"
  }, {
    a: "b"
  });
});

test('eq( {a:"a"})', function(t) {
  return t.eq({
    a: "a"
  }, {
    b: "a"
  });
});

test("eq([1,2,3])", function(t) {
  return t.eq([1, 2, 3], [1, 2, 3]);
});

test("eq([1,2,3])", function(t) {
  return t.eq([1, 2, 3], [1, 2, 3, 4]);
});

test('eq((x)->,(y)->))', function(t) {
  return t.eq(function(x) {}, function(y) {});
});

test().log(test().summary());

test().describe("type()", "Positive true type tests", false);

test("stream)", tester.type(stream), 'object');

test("Stream)", tester.type(Stream), 'function');

test("tester)", tester.type(tester), 'object');

test("Vis)", tester.type(Vis), 'function');

test().log(test().summary());

/*
  constructor:()
  setOptions:( options )
  test:( text, closure )
  unit:( text, result, expect )
  fits:( text, result, schema )
  eq:( result, expect )
  run:( text, result, expect, op )
  describe:( description, suite=null )
  initStatus:( result, expect, op )
  assert:( result, expect, status, op, level=0, key=null, index=null )
  examine:( pass, result, expect, status, op, info, key, index )
  isSchema:( v )
  toSchema:( expect,   op )
  parseSchema:( expect, schema )
  toRanges:( splits )
  checkValuesTypes:( result, expect, status, op, key, index )
  valuesEq:( result, expect, status, op )
  unknownsEq:( result, expect, status )
  textValue:( name, argue, key, index )
  objectsEq:( result, expect, status, op, level )
  arraysEq:( result, expect, status, op, level )
  report:( result, expect, op, status )
  status:()
  block:()
  runUnitTests:( paths )
  path:( path )
  summary:( module=null )
  injectStream:( stream )
  archiveLocal:( failed, passed )
  reviewsLocal:( reviewFailed, reviewPassed )
  isRange:(r)
  toRange:(arg)
  inRange:(arg,range)   
*/
// Log the current block of tests and then the summary for 't'
console.log(test().summary('Tester'));

//# sourceMappingURL=Tester-unit.js.map
