var arg, args, card, enumStr, enums, enumsSpec, expect, index, key, oper, range, rangeSpec, result, resultArray, specObj, specStr, tkey, type;

import {
  spec
} from "./Spec.js";

import {
  test
} from "./Tester.js";

arg = "";

oper = "eq";

type = "";

result = "";

expect = "";

range = "";

enums = "";

card = "?";

args = "";

key = null;

index = null;

tkey = "";

resultArray = [300, 30, 50];

range = [360.100, 100];

specStr = "string:[360.100,100]:1";

enumStr = "Embrace|Innovate|Encourage";

enums = ["Embrace", "Innovate", "Encourage"];

specObj = {
  type: "string",
  oper: "range",
  expect: "string:[360.100,100]:1",
  card: "1",
  spec: ""
};

rangeSpec = {
  type: "array",
  oper: "range",
  expect: "string:[360.100,100]:1",
  card: "1",
  spec: ""
};

enumsSpec = {
  type: "string",
  oper: "enums",
  expect: `${enums}:1`,
  card: "1",
  spec: ""
};

test().module("The extended assertion and conversion class libary").on();

test().describe("Initial run through").on();

test("isEnums(arg,oper,type)", spec.isEnums(enumStr, oper, type), true);

test("verifySpec(arg)", spec.verifySpec(specObj), specObj);

test("isResultType(type)", spec.isResultType("string"), true);

test("isOper(oper)", spec.isOper(oper), true);

test("isCard(card)", spec.isCard(card), true);

test("isSpec(expect)", spec.isSpec(specStr), true);

test("toSpec(expect)", spec.toSpec(specStr), specObj);

test("isSpecParse(arg)", spec.isSpecParse(specStr), true);

test("toSpecParse(arg)", spec.toSpecParse(specStr, "string"), specObj);

test("isSpecObject (arg)", spec.isSpecObject(specObj), true);

test("toSpecObject(spec,arg)", spec.toSpecObject(specObj, specObj), specObj);

test("isSpecValue(type)", spec.isSpecValue("string"), true);

test("inArrayRange(result,range)", spec.inArrayRange(resultArray, range), true);

test("toEnums(arg)", spec.toEnums(enumStr), enums);

test("rangeType(range)", spec.rangeType(range), "range");

test("isRange(range)", spec.isRange(range), true);

test("isIn(type,tkey)", spec.isIn("range", "ranges"), true);

test("toSpecValue(spec,arg,type)", spec.toSpecValue(spec, arg, type), true);

test().log(test().summary());

//# sourceMappingURL=Spec-unit.js.map
