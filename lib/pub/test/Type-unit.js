var func, undef;

import {
  type
} from "./Type.js";

import {
  test
} from "./Tester.js";

func = function() {};

undef = void 0;

test().module("Type", "The type assertion and conversion class libary");

test().describe("toStr()", "String conversions with toStr(arg)");

test('{a:"a",b:"b"}', type.toStr({
  a: "a",
  b: "b"
}), '{a:"a" b:"b"}'); // .log( test().status() )

test('[1,2,3]', type.toStr([1, 2, 3]), '[1,2,3]'); // .log( test().status() )

test('["1","2","3"]', type.toStr(["1", "2", "3"]), '["1","2","3"]'); // .log( test().status() )

test().log(test().summary()); // Log the all the tests  that began with descripe(...)

test().describe("toEnclose()", `Enclose strings with '"', '()', '[]' '{}'`);

test("", type.toEnclose("abc", '"'), '"abc"'); // returns "abc" - good for JSON keys and values

test("", type.toEnclose("123", "'"), "'123'"); // returns '123'

test("", type.toEnclose("xyz", "()"), "(xyz)"); // returns (xyz)

test("", type.toEnclose("d,e,f", "[]"), "[d,e,f]"); // returns [d,e,f]

test("", type.toEnclose("a:x,b:y,c:z", "{}"), "{a:x,b:y,c:z}"); // returns {a:x,b:y,c:z}

test().log(test().summary());

test().describe("type()", "All 13 types", true); // false turns off this block of

test("'123'", type.type('123'), 'string');

test("123", type.type(123), 'int');

test("123.0", type.type(123.0), 'float');

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

test("Symbol", type.type(Symbol), 'symbol'); // Symbol not not Symbol()

test().log(test().summary());

test().describe("klass()", "types", true);

test("true", type.klass(true), 'Boolean');

test("123", type.klass(123), 'Number');

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

test().log(test().summary());

test().describe("-Positive", "Positive true tests", true);

test("isNull(null)", type.isNull(null), true);

test("isUndef(xxxx)", type.isUndef(undef), true);

test("isNot(null)", type.isNot(null), true);

test("isStr('abc')", type.isStr('abc'), true);

test("isNum(12345)", type.isNumber(12345), true);

test("isNaN(NaN)", type.isNaN(0/0), true);

test("isObject({a:'a'})", type.isObject({
  a: 'a'
}), true);

test("isArray([1,2,3])", type.isArray([1, 2, 3]), true);

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

test("isArray({a:'a'})", type.isArray({
  a: 'a'
}), true);

test().log(test().summary());

test().describe("-is...", "Test all class Type is... assertions");

/*
isType(v,t)
isString(s)
isInt(i,sc=false)
isFloat(f,sc=false)
isBoolean(b,sc=false)
isArray( a, type=null, sc=false )
isObject(o,sc=false)
isRegex(r)
isFunction(f)
isNull(m)
isUndef(u)
isBigInt(b)
isSymbol(s)
isDef(d)
isNumber(n)
isNot(d)
isNaN(n)
isArrayTyped(a,t)
isArrayMixed(a)
isChild (key)
isEmpty(e)
isStringFloat( str )
isStringInt( str )
isStringBoolean( str )
isStringArray( str )
isStringObject( str )
isStringEnclosed( beg, str, end )
*/
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

test("toFixed( arg, dec=2 )", type.toFixed(1.0), 1.00);

test('toEnclose( str, enc="" )', type.toEnclose('abc', ""), "abc");

test("toKeys(o)", type.toKeys({
  x: "1",
  y: "2"
}), ["x", "y"]);

test("toCap( str )", type.toCap("cap"), "Cap");

test("unCap( str )", type.unCap("Cap"), "cap");

test("toSlice( v, beg, end=null, remove=false )", type.toSlice("123456", 3, 4), "34");

test().log(test().summary());

test().describe("-in...", "Test all class Type in... containmentt");

test("inString(e,s)", type.inString(b, "abc"), true);

test("inArray( e,a)", type.inArray(2, [1, 2, 3]), true);

test("inObject(k,o)", type.inObject(b, {
  a: "1",
  b: "2"
}), true);

test().log(test().summary());

test().describe("-Utilities", "Test all class Type in... containmentt");

test('head(v,action=false,pop=false)', type.head("BEGabc", "BEG", true), "BEG");

test('tail(v,action=false,pop=false)', type.tail("abcEND", "END", true), "END");

test('pad(n,m)', type.pad("1", 2), "  1");

test('isIn( "string", "types"   )', type.isIn("string", "types"), true);

test('isIn( "string", "typeofs" )', type.isIn("string", "typeofs"), true);

test().log(test().summary());

test().describe("-Warnings", "methods @toWarn(...) @isWarn(...) @inWarn(...)");

test("toWarn(method,text,arg,typeTo,retn, (t)=>t.log(@warn()) )", type.toWarn("toStr()", "bad arg", "undefined", "string", '""', (t) => {
  return t.log(this.warn());
}), "");

test("isWarn(fail,text,string,[array.object],(t)=>t.log(@warn()) )", type.isWarn(fail, text, "string", ["array", "object"], (t) => {
  return t.log(this.warn());
}), true);

test("inWarn(pass,result,expect,oper,spec,text,(t)=>t.log(@warn()) )", type.inWarn(fail, "4", "1|2|3", "eq", "1|2|3", "enums", (t) => {
  return t.log(this.warn());
}), true);

test().log(test().summary());

//# sourceMappingURL=Type-unit.js.map
