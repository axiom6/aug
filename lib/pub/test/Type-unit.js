var a, args, b, func, i, j, klassExpects, len, len1, o, stream, streamLog, subjects, t, typeExpects, undef;

import {
  type
} from "./Type.js";

import {
  test,
  exam,
  tester
} from "./Tester.js";

import Stream from "../base/util/Stream.js";

//mport Vis              from '../base/draw/Vis.js'
subjects = ["TestStatus", "TestString", "TestSummary"];

streamLog = {
  subscribe: false,
  publish: false,
  subjects: subjects
};

stream = new Stream(subjects, streamLog);

func = function() {};

undef = void 0;

test().module("Class Type assertion and conversion").on();

test().describe(`Enclose strings with '"', '()', '[]' '{}'`).name("toEnclose()").on();

test("abc", type.toEnclose("abc", '"'), '"abc"'); // returns "abc"

test("123", type.toEnclose("123", "'"), "'123'"); // returns '123'

test("xyz", type.toEnclose("xyz", "()"), "(xyz)"); // returns (xyz)

test("d,e,f", type.toEnclose("d,e,f", "[]"), "[d,e,f]"); // returns [d,e,f]

test("a:x,b:y,c:z", type.toEnclose("a:x,b:y,c:z", "{}"), "{a:x,b:y,c:z}"); // returns {a:x,b:y,c:z}

test().log(test().summary());

// "|string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date"
test().describe(" toType()").obj(type).func(type.toType).on();

typeExpects = [
  ["123",
  'string'],
  [123,
  'int'],
  [123.1,
  'float'],
  [123.0,
  'int'],
  [true,
  'boolean'],
  [[1,
  2,
  3],
  'array'],
  [
    {
      a: 'a'
    },
    'object'
  ],
  ["|a|b|c|",
  'enums'],
  ["|0-100|",
  'enums'],
  ["|0-100|",
  'range'],
  [/x/,
  'regexp'],
  [null,
  'null'],
  [undef,
  'undefined'],
  [func,
  "function"],
  [BigInt(123),
  'bigint'],
  [Symbol(),
  'symbol'],
  [new Date(),
  'date']
];

// [stream,'object'], [Stream,'function'],[tester,'object'],[Vis,'function']]
for (i = 0, len = typeExpects.length; i < len; i++) {
  args = typeExpects[i];
  exam(args);
}

test().log(test().summary());

test().describe(" toKlass()").obj(type).func(type.toKlass).on();

klassExpects = [
  [true,
  'Boolean'],
  [123,
  'Int'],
  ['"123"',
  'String'],
  [func,
  'func'],
  [
    {
      a: 'a'
    },
    'Object'
  ],
  [[1,
  2,
  3],
  'Array'],
  [
    {
      a: 'a'
    },
    'Object'
  ],
  ["|a|b|c|",
  'Enums'],
  ["|0-100|",
  'Range'],
  [/x/,
  'RegExp'],
  [null,
  'Null'],
  [undef,
  'Undefined'],
  [null,
  "Null"]
];

// [stream,'Stream'], [Stream,'Stream'],[tester,'Tester'],[Vis,'Vis']]
for (j = 0, len1 = klassExpects.length; j < len1; j++) {
  args = klassExpects[j];
  exam(args);
}

test().log(test().summary());

test().describe("class Type is... assertions").on();

test('isType("abc","string")"', type.isType("abc", "string"), true);

test("isStr('abc')", type.isStr('abc'), true);

test("isInt(123)", type.isInt(123), true);

test('isInt("123")', type.isInt("123"), true);

test("isFloat(123.2)", type.isFloat(123.2), true);

test('isFloat("123.2")', type.isFloat("123.2"), true);

test("isBoolean(true)", type.isBoolean(true), true);

test('isBoolean("true")', type.isBoolean("true"), true);

test("isObject({a:'a'})", type.isObject({
  a: 'a'
}), true);

test("isArray([1,2,3])", type.isArray([1, 2, 3]), true);

test('isArrayTyped([1,2,3],"int")', type.isArrayTyped([1, 2, 3], "int"), true);

test('isArrayMixed([1,"2",3])', type.isArrayMixed([1, "2", 3]), true);

test('isEnums("|a|b|c|")', type.isEnums("|a|b|c|"), true);

test("isRegex(/^-?\\d+$/)", type.isRegexp(/^-?\d+$/), true);

test("isFunction(type.toStr)", type.isFunction(type.toStr), true);

test("isNull(null)", type.isNull(null), true);

test("isUndef(undef", type.isUndef(undef), true);

test("isNot(null)", type.isNot(null), true);

test("isNumber(12345)", type.isNumber(12345), true);

test("isBigInt((BigInt(123))", type.isBigInt(BigInt(123)), true);

test("isSymbol(Symbol())", type.isSymbol(Symbol()), true);

test("isNaN(NaN)", type.isNaN(0/0), true);

test('isType("|0-100|","range")', type.isType("|0-100|", "range"), true);

test().log(test().summary());

test().describe("Negative type assertsions").on();

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

test().describe("Class Type in... containments").on();

test('inStr("b","abc")', type.inStr("b", "abc"), true);

test('inArray(2,[1,2,3])', type.inArray(2, [1, 2, 3]), true);

test('inObject("b",{a:"1",b:"2"} )', type.inObject("b", {
  a: "1",
  b: "2"
}), true);

test().log(test().summary());

test().describe("Utilities").on();

test('head([1,2,3])', type.head([1, 2, 3]), 1);

test('tail("123")', type.tail("123"), "3");

//est( 'pad("1",2)',                  type.pad( "1", 2 ),                "  1" )  # getting crunched
test('isIn( "string", "types"   )', type.isIn("string", "types"), true);

test('isIn( "string", "typeofs" )', type.isIn("string", "typeofs"), true);

test().log(test().summary());

test().describe("Warnings", "methods @toWarn(...) @isWarn(...) @inWarn(...)").on();

test("toWarn(method,text,arg,typeTo,retn, (t)=>t.log(@warn()) )", type.toWarn("toStr()", "bad arg", "undefined", "string", '""', (t) => {
  return t.log(this.warn());
}), '""');

test("isWarn(fail,text,string,[array.object],(t)=>t.log(@warn()) )", type.isWarn(false, "bad type", "string", ["array", "object"], (t) => {
  return t.log(this.warn());
}), false);

test("inWarn(pass,result,expect,oper,spec,text,(t)=>t.log(@warn()) )", type.inWarn(false, "4", "1|2|3", "eq", "1|2|3", "enums", (t) => {
  return t.log(this.warn());
}), false);

test().log(test().summary());

test().describe("Class Type to... conversions").op("to").on();

test('toConvert(123,"string")', type.toConvert(123, "string"), "123");

test('toConvert("123","int")', type.toConvert("123", "int"), 123);

test('toConvert("123.1","float")', type.toConvert("123.1", "float"), 123.1);

test('toConvert("true","boolean")', type.toConvert("true", "boolean"), true);

test('toConvert("[1,2,3]","array")', type.toConvert("[1,2,3]", "array"), [1, 2, 3]);

test('toConvert("{a:"1",b:"2"}","object")', type.toConvert('{a:"1",b:"2"}', "object"), {
  a: "1",
  b: "2"
});

test('toConvert("/x/","string")', type.toConvert("/x/", "string"), "none");

test('toValue(abc)', type.toValue("abc"), "abc");

test('toValue("123")', type.toValue("123"), 123);

test('toValue("123.1")', type.toValue("123.1"), 123.1);

test('toValue("true")', type.toValue("true"), true);

test('toValue("[1,2,3]")', type.toValue("[1,2,3]"), [1, 2, 3]);

test('toValue("{a:"1",b:"2"}")', type.toValue('{a:"1",b:"2"}'), {
  a: "1",
  b: "2"
});

test('toValue("/x/")', type.toValue("/x/"), /x/);

test("toFloat(1)", type.toFloat(1), 1.0);

test("toInt(1.0)", type.toInt(1.0), 1);

test("toFixed(1.0,2)", type.toFixed(1.0, 2), "1.00");

test("toKeys(o)", type.toKeys({
  x: "1",
  y: "2"
}), ["x", "y"]);

test("toCap( str )", type.toCap("cap"), "Cap");

test("unCap( str )", type.unCap("Cap"), "cap");

test('"123456",3,4)', type.slice("123456", 3, 4), "34");

test('toArray("[1,2,3]")', type.toArray("[1,2,3]"), [1, 2, 3]);

test().log(test().summary());

test().describe("String conversions").name("toStr()").op("to").on();

test("abc", type.toStr("abc"), "abc");

test(123, type.toStr(123), "123");

test(1.1, type.toStr(1.1), "1.1");

test(true, type.toStr(true), "true");

test('{a:"a",b:"b"}', type.toStr({
  a: "a",
  b: "b"
}), '{a:"a" b:"b"}');

test("[1,2,3]", type.toStr([1, 2, 3]), '[1,2,3]');

test('["1","2","3"]', type.toStr(["1", "2", "3"]), '["1","2","3"]');

test("null", type.toStr(null), "null");

test("undefined", type.toStr(undef), "undefined");

test(func, type.toStr(func), "function");

test("/x/", type.toStr(/x/), "/x/");

test(BigInt(123), type.toStr(BigInt(123)), "123");

test('Symbol("desc")', type.toStr(Symbol("desc")), 'Symbol(desc)');

test('new Date("August 19, 1975 23:15:30")', type.toStr(new Date("August 19, 1975 23:15:30")), "Tue Aug 19 1975 23:15:30 GMT+0200 (CEST)");

test().log(test().summary());

test().describe("toObject(arg) conversions").name("toObject()").op("to").on();

t = tester;

a = "a";

b = "b";

test("{a:a,b:b}", type.toObject(`{a:${t.v(a)},b:${t.v(b)})`), {
  a: '"a"',
  b: '"b"'
});

a = 3;

b = 4;

test("{a:3,b:4}", type.toObject(`{a:${t.v(a)},b:${t.v(b)})`), {
  a: 3,
  b: 4
});

a = [5, 6];

o = {
  q: 7,
  r: "8"
};

test(`{a:${t.v(a)},b:${t.v(b)})`, type.toObject(`{a:${t.v(a)},b:${t.v(b)})`), {
  a: [5, 6],
  b: {
    q: 7,
    r: '"8"'
  }
});

test(`{a:${t.v(a)},b:${t.v(o)})`, type.toObject(`{a:${t.v(a)},b:${t.v(o)})`), {
  a: [5, 6],
  b: {
    q: 7,
    r: '"8"'
  }
});

test('{a:"x",b:"y")', type.toObject('{a:"x",b:"y")'), {
  a: '"x"',
  b: '"y"'
});

test("{a:1,b:2}", type.toObject('{a:1,b:2 }'), {
  a: 1,
  b: 2
});

test().log(test().summary());

//# sourceMappingURL=Type-unit.js.map
