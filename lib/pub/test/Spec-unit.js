var card, enums, enumsSpec, enumsStr, enumsTx, expectA, expects, objectSpec, range, rangeSpec, rangeStr, rangeTx, regexp, regexpSpec, regexpStr, regexpTx, resultA, resultE, resultO, resultR;

import {
  spec
} from "./Spec.js";

import {
  test
} from "./Tester.js";

test().listFunctions(spec);

card = "?";

expectA = [300, 30, 50];

resultA = [300, 30, 50];

resultE = "innovate";

resultR = "x";

resultO = {
  a: "Innovate",
  b: "Embrace"
};

range = [360.100, 100];

enums = ["Embrace", "Innovate", "Encourage"];

regexp = /x/;

rangeTx = '[360.100,100]';

enumsTx = '["Embrace","Innovate","Encourage"]';

regexpTx = '/x/';

rangeStr = "string:[360.100,100]:1";

enumsStr = "string:Embrace|Innovate|Encourage";

regexpStr = "string:/x/";

rangeSpec = {
  type: "array",
  match: [360.100, 100],
  card: "1"
};

enumsSpec = {
  type: "string",
  match: `${enums}:1`,
  card: "1"
};

regexpSpec = {
  type: "string",
  match: "/x/",
  card: "1"
};

objectSpec = {
  a: enumsSpec,
  b: enumsSpec
};

expects = ["string", "int", "float", "boolean", "object", "array", "regexp", "range", "enums", "amy"];

test().module("the extended assertion and conversion class libary").on(true);

test().describe("-- is... Spec assertions").on();

test(`isSpec(${rangeStr})`, spec.isSpec(rangeStr), true);

test(`isSpec(${enumsStr})`, spec.isSpec(enumsStr), true);

test(`isSpec(${regexpStr})`, spec.isSpec(regexpStr), true);

test(`isSpecParse(${rangeStr})`, spec.isSpecParse(rangeStr), true);

test(`isSpecParse(${enumsStr})`, spec.isSpecParse(enumsStr), true);

test(`isSpecParse(${rangeStr})`, spec.isSpecParse(regexpStr), true);

test(`isSpecObject(${rangeSpec})`, spec.isSpecObject(rangeSpec), true);

test(`isSpecObject(${enumsSpec})`, spec.isSpecObject(enumsSpec), true);

test(`isSpecObject(${regexpSpec})`, spec.isSpecObject(regexpSpec), true);

test(`isMatch(${range})`, spec.isMatch(range), true);

test(`isMatch(${enums})`, spec.isMatch(range), true);

test(`isMatch(${regexp})`, spec.isMatch(regexp), true);

test(`isRange(${range})`, spec.isRange(range), true);

test(`isEnums(${enums})`, spec.isEnums(range), true);

test(`isRegexp(${regexp})`, spec.isRegexp(regexp), true);

test(`isResult(${resultA})`, spec.isResult(resultA), true);

test(`isExpect(${expectA})`, spec.isExpect(expectA), true);

test(`isCard(${"1"})`, spec.isCard("1"), true);

test(`isIn(${resultA},'results')`, spec.isIn(resultA, "results"), true);

test().log(test().summary());

test().describe("-- to... Spec conversions").op("to").on();

test(`toSpec(${rangeStr})`, spec.toSpec(rangeStr), rangeSpec);

test(`toSpec(${enumsStr})`, spec.toSpec(enumsStr), enumsSpec);

test(`toSpec(${regexpStr})`, spec.toSpec(regexpStr), regexpSpec);

test(`toSpecParse(${rangeStr})`, spec.toSpecParse(rangeStr), rangeSpec);

test(`toSpecParse(${enumsStr})`, spec.toSpecParse(enumsStr), enumsSpec);

test(`toSpecParse(${regexpStr})`, spec.toSpecParse(regexpStr), regexpSpec);

test(`toSpecObject(${rangeSpec})`, spec.toSpecObject(rangeSpec), rangeSpec);

test(`toSpecObject(${enumsSpec})`, spec.toSpecObject(enumsSpec), enumsSpec);

test(`toSpecObject(${regexpSpec})`, spec.toSpecObject(regexpSpec), regexpSpec);

test(`toRange(${rangeTx})`, spec.toRange(rangeTx), range);

test(`toEnums(${enumsTx})`, spec.toEnums(enumsTx), enums);

test(`toRegexp(${regexpTx})`, spec.toRegexp(regexpTx), regexp);

test(`toMinMax(${'3-6'})`, spec.toMinMax('3-6'), [3, 6]);

test(`toIn(${'expects'})`, spec.toIn('expects'), expects);

test("toSpecInit()", spec.toSpecInit(), {
  type: "any",
  match: "any",
  card: "1"
});

test().log(test().summary());

test().describe(" -- in... Spec verify").on();

test(`inSpec(${resultA},${rangeSpec})`, spec.inSpec(resultA, rangeSpec), true);

test(`inSpec(${resultE},${enumsSpec})`, spec.inSpec(resultE, enumsSpec), true);

test(`inSpec(${resultR},${regexpSpec})`, spec.inSpec(resultR, regexpSpec), true);

test(`inSpecArray(${resultA},${rangeSpec})`, spec.inSpecArray(resultA, rangeSpec), true);

test(`inSpecObject(${resultO},${objectSpec})`, spec.inSpecObject(resultO, objectSpec), true);

test(`inRange(${resultA},${range})`, spec.inRange(resultA, range), true);

test(`inEnums(${resultE},${enums})`, spec.inEnums(resultE, range), true);

test(`inRegexp(${resultR},${regexp})`, spec.inRegexp(resultR, regexp), true);

test(`inCard(${resultA},${card})`, spec.inCard(resultA, card), true);

test().log(test().summary());

//# sourceMappingURL=Spec-unit.js.map
