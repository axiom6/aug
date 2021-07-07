var func, stream, streamLog, subjects, undef;

import {
  type
} from "./Type.js";

import {
  test,
  tester
} from "./Tester.js";

import Stream from "../base/util/Stream.js";

import Vis from '../base/draw/Vis.js';

subjects = ["TestStatus", "TestString", "TestSummary"];

streamLog = {
  subscribe: false,
  publish: false,
  subjects: subjects
};

stream = new Stream(subjects, streamLog);

func = function() {};

undef = void 0;

test().module("Type", "The type assertion and conversion class libary");

test().describe("-toStr()", "String conversions with toStr(arg)");

test('{a:"a",b:"b"}', type.toStr({
  a: "a",
  b: "b"
}), '{a:"a" b:"b"}'); // .log( test().status() )

test('[1,2,3]', type.toStr([1, 2, 3]), '[1,2,3]'); // .log( test().status() )

test('["1","2","3"]', type.toStr(["1", "2", "3"], true), '["1","2","3"]'); // .log( test().status() )

test().log(test().summary()); // Log the all the tests  that began with descripe(...)

test().describe("toEnclose()", `Enclose strings with '"', '()', '[]' '{}'`);

test("", type.toEnclose("abc", '"'), '"abc"'); // returns "abc" - good for JSON keys and values

test("", type.toEnclose("123", "'"), "'123'"); // returns '123'

test("", type.toEnclose("xyz", "()"), "(xyz)"); // returns (xyz)

test("", type.toEnclose("d,e,f", "[]"), "[d,e,f]"); // returns [d,e,f]

test("", type.toEnclose("a:x,b:y,c:z", "{}"), "{a:x,b:y,c:z}"); // returns {a:x,b:y,c:z}

test().log(test().summary());

test().describe("-type", "All 13 types", true); // all type(arg) tests needs better reporting

test("'123'", type.type('123'), 'string');

test("123", type.type(123), 'int');

test("123.1", type.type(123.1), 'float');

test("123.0 should be float", type.type(123.0), 'int');

test("true", type.type(true), 'boolean');

test("[1,2,3]", type.type([1, 2, 3]), 'array');

test("{a:'a'}", type.type({
  a: 'a'
}), 'object');

test("/x/", type.type(/x/), 'regexp');

test("func", type.type(() => {}), 'function');

test("null", type.type(null), 'null');

test("undef", type.type(undef), 'undefined');

test("new Date()", type.type(new Date()), 'date');

test("BigInt(123)", type.type(BigInt(123)), 'bigint'); // 123n not working in CoffeeScript

test("Symbol", type.type(Symbol()), 'symbol'); // Symbol not not new Symbol()

test("stream", type.type(stream), 'object');

test("Stream", type.type(Stream), 'function');

test("tester", type.type(tester), 'object');

test("Vis", type.type(Vis), 'function');

test().log(test().summary());

test().describe("-klass", "klass type on classed", true);

test("true", type.klass(true), 'Boolean');

test("123", type.klass(123), 'Int');

test("'123'", type.klass('123'), 'String');

test("func", type.klass(func), 'func');

test("{a:'a'}", type.klass({
  a: 'a'
}), 'Object');

test("[1,2,3]", type.klass([1, 2, 3]), 'Array');

test("/x/", type.klass(/x/), 'RegExp');

test("new Date()", type.klass(new Date()), 'Date');

test("undef", type.klass(undef), 'Undefined');

test("null", type.klass(null), 'Null');

test("stream", type.klass(stream), 'Stream');

test("Stream", type.klass(Stream), 'Stream');

test("tester", type.klass(tester), 'Tester');

test("Vis", type.klass(Vis), 'Vis');

test().log(test().summary());

test().describe("-is...", "Test all class Type is... assertions");

test("isType(v,t)", type.isType("abc", "string"), true);

test("isStr('abc')", type.isStr('abc'), true);

test("isInt(i)", type.isInt(123), true);

test("isInt(i)", type.isInt("123"), true);

test("isFloat(f)", type.isFloat(123.2), true);

test("isFloat(f)", type.isFloat("123.2"), true);

test("isBoolean(b)", type.isBoolean(true), true);

test("isBoolean(b)", type.isBoolean("true"), true);

test("isObject({a:'a'})", type.isObject({
  a: 'a'
}), true);

test("isArray([1,2,3])", type.isArray([1, 2, 3]), true);

test("isArrayTyped(a,t)", type.isArrayTyped([1, 2, 3], "int"), true);

test("isArrayMixed(a)", type.isArrayMixed([1, "2", 3]), true);

test("isRegex(r)", type.isRegexp(/^-?\d+$/), true);

test("isFunction(f)", type.isFunction(type.toStr), true);

test("isNull(null)", type.isNull(null), true);

test("isUndef(xxxx)", type.isUndef(undef), true);

test("isNot(null)", type.isNot(null), true);

test("isNumber(12345)", type.isNumber(12345), true);

test("isBigInt(b)", type.isBigInt(BigInt(123)), true);

test("isSymbol(s)", type.isSymbol(Symbol()), true);

test("isNaN(NaN)", type.isNaN(0/0), true);

test().log(test().summary());

test().describe("-Negative", "Negative false test failure");

test("isNull('abc')", type.isNull('abc'), false);

test("isUndef(12345)", type.isUndef(12345), false);

test("isNot({a:'a'}", type.isNot({
  a: 'a'
}), false);

test("isStr( 123 )", type.isStr(123), false);

test("isNumber('123')", type.isNumber('123'), false);

test("isNaN( 123 )", type.isNaN(123), false);

test("isObject(123)", type.isObject(123), false);

test('isArray({a:"a"})', type.isArray({
  a: "a"
}), false);

test("isArray({a:'a'})", type.isArray({
  a: 'a'
}), false);

test().log(test().summary());

test().describe("-to...", "Test all class Type to... assertions");

test("toType( arg, type )", type.toType("123", "int"), 123);

test("toStr( arg )", type.toStr(123), "123");

test("toFloat( arg )", type.toFloat(1), 1.0);

test("toInt( arg )", type.toInt(1.0), 1);

test("toArray( arg )", type.toArray("[1,2,3]"), [1, 2, 3]);

test("toObject( arg )", function(t) {
  var a, b;
  a = "1";
  b = "2";
  t.eq(type.toObject('{a:"1",b:"2")', {
    a: "1",
    b: "2"
  }));
  return t.eq(type.toObject('{a:a,b:b)', {
    a: a,
    b: b
  }));
});

test("toFixed(arg,dec=2)", type.toFixed(1.0), 1.00);

test('toEnclose(str,enc="")', type.toEnclose('abc', '""'), "abc");

test("toKeys(o)", type.toKeys({
  x: "1",
  y: "2"
}), ["x", "y"]);

test("toCap( str )", type.toCap("cap"), "Cap");

test("unCap( str )", type.unCap("Cap"), "cap");

test("toSlice(v,beg,end=null,remove=false)", type.slice("123456", 3, 4), "34");

test().log(test().summary());

test().describe("-in...", "Test all class Type in... containmentt");

test("inString(e,s)", type.inStr("b", "abc"), true);

test("inArray( e,a)", type.inArray(2, [1, 2, 3]), true);

test("inObject(k,o)", type.inObject("b", {
  a: "1",
  b: "2"
}), true);

test().log(test().summary());

test().describe("-Utilities", "Utilitiy methods");

test('head([1,2,3])', type.head([1, 2, 3]), 1);

test('tail("123")', type.tail("123"), "3");

//est( 'pad(n,m)',                    type.pad( "1", 2 ),                "  1" )  # getting crunched
test('isIn( "string", "types"   )', type.isIn("string", "types"), true);

test('isIn( "string", "typeofs" )', type.isIn("string", "typeofs"), true);

test().log(test().summary());

test().describe("-Warnings", "methods @toWarn(...) @isWarn(...) @inWarn(...)");

test("toWarn(method,text,arg,typeTo,retn, (t)=>t.log(@warn()) )", type.toWarn("toStr()", "bad arg", "undefined", "string", '""', (t) => {
  return t.log(this.warn());
}), "");

test("isWarn(fail,text,string,[array.object],(t)=>t.log(@warn()) )", type.isWarn(false, "bad type", "string", ["array", "object"], (t) => {
  return t.log(this.warn());
}), true);

test("inWarn(pass,result,expect,oper,spec,text,(t)=>t.log(@warn()) )", type.inWarn(false, "4", "1|2|3", "eq", "1|2|3", "enums", (t) => {
  return t.log(this.warn());
}), true);

test().log(test().summary());

//# sourceMappingURL=Type-unit.js.map
