var Main, add, five, func, mix, nav, stream, streamLog, subjects, t, undef;

import {
  unit,
  test,
  tester
} from './Tester.js';

import Stream from "../base/util/Stream.js";

import Mix from "../base/nav/Mix.js";

import Nav from "../base/nav/Nav.js";

import Vis from '../base/draw/Vis.js';

// In this context all unit tests are executed immediately when this module is either
//   dynaically  imported i.e module = import(path) - recommended
// or statically imported i.e inport module from path

// Module.js transpiled from Module.coffee will dynamically import this module
//   using a glob pattern like "/src/**/*-unit.js"  or "/pub/**/*-unit.js" for transpiled
//   JavaScript .js
t = tester;

test().describe('t-unit.js', 'unit tests');

func = function() {};

undef = void 0; // Not sure how to test for undefined

Main = class Main {
  static init() {}

};

subjects = ["Nav", "Test"];

streamLog = {
  subscribe: false,
  publish: false,
  subjects: subjects
};

stream = new Stream(subjects, streamLog);

mix = new Mix(Main);

nav = new Nav(stream, mix);

unit("t.type(true)", t.type(true), 'boolean');

unit("t.type(123)", t.type(123), 'number');

unit("t.type('123')", t.type('123'), 'string');

unit("t.type(func)", t.type(func), 'function');

unit("t.type({a:'a'})", t.type({
  a: 'a'
}), 'object');

unit("t.type([1,2,3]", t.type([1, 2, 3]), 'array');

unit("t.type(/x/)", t.type(/x/), 'regexp');

unit("t.type(new Date())", t.type(new Date()), 'date');

unit("t.type(undef)", t.type(undef), 'undefined');

unit("t.type(null)", t.type(null), 'null');

unit("t.type(stream)", t.type(stream), 'object');

unit("t.type(Stream)", t.type(Stream), 'function');

unit("t.type(tester)", t.type(tester), 'object');

unit("t.type(Vis)", t.type(Vis), 'function');

unit("t.klass(true)", t.klass(true), 'Boolean');

unit("t.klass(123)", t.klass(123), 'Number');

unit("t.klass('123')", t.klass('123'), 'String');

unit("t.klass(func)", t.klass(func), 'func');

unit("t.klass({a:'a'})", t.klass({
  a: 'a'
}), 'Object');

unit("t.klass([1,2,3]", t.klass([1, 2, 3]), 'Array');

unit("t.klass(/x/)", t.klass(/x/), 'RegExp');

unit("t.klass(new Date())", t.klass(new Date()), 'Date');

unit("t.klass(undef)", t.klass(undef), 'Undefined');

unit("t.klass(null)", t.klass(null), 'Null');

unit("t.klass(stream)", t.klass(stream), 'Stream');

unit("t.klass(Stream)", t.klass(Stream), 'Stream');

unit("t.klass(tester)", t.klass(tester), 'Tester');

unit("t.klass(tester)", t.klass(tester.type), 'bound type');

unit("t.klass(Vis)", t.klass(Vis), 'Vis');

// Positive true tests
unit("t.isNull(null)", t.isNull(null), true);

unit("t.isUndef(xxxx)", t.isUndef(undef), true);

unit("t.isNot(null)", t.isNot(null), true);

unit("t.isStr('abc')", t.isStr('abc'), true);

unit("t.isNum(12345)", t.isNum(12345), true);

unit("t.isNaN(NaN)", t.isNaN(0/0), true);

unit("t.isObj({a:'a'})", t.isObj({
  a: 'a'
}), true);

unit("t.isVal( 123 )", t.isVal(123), true);

unit("t.isVal('123')", t.isVal('123'), true);

unit("t.isVal(true)", t.isVal(true), true);

unit("t.isVal(false)", t.isVal(false), true);

unit("t.isArray([1,2,3])", t.isArray([1, 2, 3]), true);

// Negative true tests
unit("t.isNull('abc')", t.isNull('abc'), false);

unit("t.isUndef(12345)", t.isUndef(12345), false);

unit("t.isNot({a:'a'}", t.isNot({
  a: 'a'
}), false);

unit("t.isStr( 123 )", t.isStr(123), false);

unit("t.isNum('123')", t.isNum('123'), false);

unit("t.isNaN( 123 )", t.isNaN(123), false);

unit("t.isObj(123)", t.isObj(123), false);

unit("t.isVal({a:'a'})", t.isVal({
  a: 'a'
}), false);

unit("t.isVal([1,2,3])", t.isVal([1, 2, 3]), false);

unit("t.isVal([1,2,3])", t.isVal([1, 2, 3]), false);

unit("t.isArray({a:'a'})", t.isArray({
  a: 'a'
}), false).log(unit().status());

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
}).log(test().status());

test("tester.type(123)", function(t) {
  return t.eq(tester.type(123), 'number');
});

unit().summary('t');

//# sourceMappingURL=Tester-unit.js.map
