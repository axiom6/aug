var arrayFlt, arrayHsv, arrayMat, arrayRgb, arraySpec, arraySpecStr, arrayStr, card, enums, enumsMat, enumsSpec, enumsSpecStr, expectA, expects, objectMat, objectSpec, objectSpecStr, rangeFlt, rangeHsv, rangeMat, rangeRgb, rangeSpec, rangeSpecStr, rangeStr, regexp, regexpMat, regexpSpec, regexpSpecStr, regexpTx, resultA, resultC, resultE, resultF, resultO, resultR;

import {
  spec
} from "./Spec.js";

import {
  test
} from "./Tester.js";

card = "?";

expectA = [300, 30, 50];

resultA = [300, 30, 50];

resultC = [200, 200, 200];

resultF = [200.1, 50.1, 50.1];

resultE = "Innovate";

resultR = "x";

resultO = {
  a: "Innovate",
  b: "Embrace"
};

rangeStr = "| a-z, 0-9, A-Z |";

arrayStr = [["a", "z"], [0, 9], ["A", "Z"]];

rangeRgb = "| 0-255 |";

arrayRgb = [0, 255];

rangeHsv = "| 0-360, 0-100, 0-100 |";

arrayHsv = [[0, 360], [0, 100], [0, 100]];

rangeFlt = "| 0-360+0.001, 0-100+0.001, 0-100+0.001 |";

arrayFlt = [[0, 360, 0.001], [0, 100, 0.001], [0, 100, 0.001]];

enums = "|Embrace|Innovate|Encourage|";

regexp = /x/;

regexpTx = '/x/';

rangeMat = `string:${rangeHsv}:1`;

enumsMat = "string:|Embrace|Innovate|Encourage|";

regexpMat = "string:/x/";

objectMat = {
  a: enumsMat,
  b: enumsMat
};

arrayMat = [enumsMat, enumsMat];

rangeSpec = {
  type: "array",
  match: rangeHsv,
  card: "1"
};

enumsSpec = {
  type: "string",
  match: enums,
  card: "1"
};

regexpSpec = {
  type: "string",
  match: regexpTx,
  card: "1"
};

objectSpec = {
  a: enumsSpec,
  b: enumsSpec
};

arraySpec = [enumsSpec, enumsSpec];

rangeSpecStr = spec.toStr(rangeSpec);

enumsSpecStr = spec.toStr(enumsSpec);

regexpSpecStr = spec.toStr(regexpSpec);

objectSpecStr = spec.toStr(objectSpec);

arraySpecStr = spec.toStr(arraySpec);

expects = ["string", "int", "float", "boolean", "object", "array", "regexp", "range", "enums", "amy"];

test().module("the extended assertion and conversion class libary").on(true); // .name("Spec")

test().describe("-- is... Spec assertions").on();

test(`isSpec(${rangeSpecStr})`, spec.isSpec(rangeSpecStr), true);

test(`isSpec(${enumsSpecStr})`, spec.isSpec(enumsSpecStr), true);

test(`isSpec(${regexpSpecStr})`, spec.isSpec(regexpSpecStr), true);

test(`isSpec(${objectSpecStr})`, spec.isSpec(objectSpecStr), true);

test(`isSpecParse(${rangeMat})`, spec.isSpecParse(rangeMat), true);

test(`isSpecParse(${enumsMat})`, spec.isSpecParse(enumsMat), true);

test(`isSpecParse(${regexpMat})`, spec.isSpecParse(regexpMat), true);

test(`isSpecParse(${objectMat})`, spec.isSpecParse(objectMat), true);

test(`isSpecObject(${rangeSpecStr})`, spec.isSpecObject(rangeSpec), true);

test(`isSpecObject(${enumsSpecStr})`, spec.isSpecObject(enumsSpec), true);

test(`isSpecObject(${regexpSpecStr})`, spec.isSpecObject(regexpSpec), true);

test(`isSpecObject(${regexpSpecStr})`, spec.isSpecObject(regexpSpec), true);

test(`isMatch(${rangeMat})`, spec.isMatch(rangeMat), true);

test(`isMatch(${enumsMat})`, spec.isMatch(enumsMat), true);

test(`isMatch(${regexpMat})`, spec.isMatch(regexpMat), true);

test(`isRange(${rangeStr})`, spec.isRange(rangeStr), true);

test(`isRange(${rangeRgb})`, spec.isRange(rangeRgb), true);

test(`isRange(${rangeHsv})`, spec.isRange(rangeHsv), true);

test(`isRange(${rangeFlt})`, spec.isRange(rangeHsv), true);

test(`isRanges(${rangeStr})`, spec.isRanges(rangeStr), true);

test(`isRanges(${rangeRgb})`, spec.isRanges(rangeRgb), true);

test(`isRanges(${rangeHsv})`, spec.isRanges(rangeHsv), true);

test(`isRanges(${rangeFlt})`, spec.isRanges(rangeHsv), true);

test(`isEnums(${enums})`, spec.isEnums(enums), true);

test(`isRegexp(${regexpTx})`, spec.isRegexp(regexp), true);

test(`isResult(${spec.toStr(resultA)})`, spec.isResult(resultA), true);

test(`isResult(${spec.toStr(resultE)})`, spec.isResult(resultE), true);

test(`isResult(${spec.toStr(resultR)})`, spec.isResult(resultR), true);

test(`isResult(${spec.toStr(resultO)})`, spec.isResult(resultO), true);

test(`isExpect(${spec.toStr(expectA)})`, spec.isExpect(expectA), true);

test(`isCard(${"1"})`, spec.isCard("1"), true);

test(`isIn(type(${spec.toStr(resultA)}),'results')`, spec.isIn(spec.toType(resultA), "results"), true);

test(`isIn(type(${spec.toStr(resultE)}),'results')`, spec.isIn(spec.toType(resultE), "results"), true);

test(`isIn(type(${spec.toStr(resultR)}),'results')`, spec.isIn(spec.toType(resultR), "results"), true);

test(`isIn(type(${spec.toStr(resultO)}),'results')`, spec.isIn(spec.toType(resultO), "results"), true);

test().log(test().summary());

test().describe("-- to... Spec conversions").op("to").on();

test(`toSpec(${rangeSpecStr})`, spec.toSpec(rangeSpecStr), rangeSpec);

test(`toSpec(${enumsSpecStr})`, spec.toSpec(enumsSpecStr), enumsSpec);

test(`toSpec(${regexpSpecStr})`, spec.toSpec(regexpSpecStr), regexpSpec);

test(`toSpec(${objectSpecStr})`, spec.toSpec(objectSpecStr), objectSpec);

test(`toSpecParse(${rangeMat})`, spec.toSpecParse(rangeMat), rangeSpec);

test(`toSpecParse(${enumsMat})`, spec.toSpecParse(enumsMat), enumsSpec);

test(`toSpecParse(${regexpMat})`, spec.toSpecParse(regexpMat), regexpSpec);

//est( "toSpecParse(#{objectMat})",      spec.toSpecParse(objectMat),   regexpSpec )
test(`toSpecObject(${rangeSpecStr})`, spec.toSpecObject(rangeSpec), rangeSpec);

test(`toSpecObject(${enumsSpecStr})`, spec.toSpecObject(enumsSpec), enumsSpec);

test(`toSpecObject(${regexpSpecStr})`, spec.toSpecObject(regexpSpec), regexpSpec);

test(`toSpecObject(${objectSpecStr})`, spec.toSpecObject(objectSpec), objectSpec);

test(`toRange(${rangeStr})`, spec.toRange(rangeStr), rangeStr); // Trivial

test(`toRange(${rangeRgb})`, spec.toRange(rangeRgb), rangeRgb);

test(`toRange(${rangeHsv})`, spec.toRange(rangeHsv), rangeHsv);

test(`toRange(${rangeFlt})`, spec.toRange(rangeFlt), rangeFlt);

test(`toRanges(${rangeStr})`, spec.toRanges(rangeStr), arrayStr); // ???

test(`toRanges(${rangeRgb})`, spec.toRanges(rangeRgb), arrayRgb);

test(`toRanges(${rangeHsv})`, spec.toRanges(rangeHsv), arrayHsv);

test(`toRanges(${rangeFlt})`, spec.toRanges(rangeFlt), arrayFlt);

test(`toRangeArray(${rangeStr})`, spec.toRangeArray(rangeStr), arrayStr); // Important

test(`toRangeArray(${rangeRgb})`, spec.toRangeArray(rangeRgb), arrayRgb);

test(`toRangeArray(${rangeHsv})`, spec.toRangeArray(rangeHsv), arrayHsv);

test(`toRangeArray(${rangeFlt})`, spec.toRangeArray(rangeFlt), arrayFlt);

test(`toEnums(${enums})`, spec.toEnums(enums), enums);

test(`toRegexp(${regexpTx})`, spec.toRegexp(regexpTx), regexp);

test(`toMinMax(${'3-6'})`, spec.toMinMax('3-6'), [3, 6]);

test("toSpecInit()", spec.toSpecInit(), {
  type: "any",
  match: "any",
  card: "1"
});

test().log(test().summary());

test().describe("-- in... Spec verify").on();

test(`inSpec(${spec.toStr(resultA)},${rangeSpecStr})`, spec.inSpec(resultA, rangeSpec), true);

test(`inSpec(${spec.toStr(resultE)},${enumsSpecStr})`, spec.inSpec(resultE, enumsSpec), true);

test(`inSpec(${spec.toStr(resultR)},${regexpSpecStr})`, spec.inSpec(resultR, regexpSpec), true);

test(`inSpec(${spec.toStr(resultO)},${regexpSpecStr})`, spec.inSpec(resultO, objectSpec), true);

test(`inSpecArray(${spec.toStr(resultA)},${arraySpecStr})`, spec.inSpecArray(resultA, arraySpec), true);

test(`inSpecObject(${resultO},${objectSpecStr})`, spec.inSpecObject(resultO, objectSpec), true);

test(`inRange(${spec.toStr(resultA)},${rangeHsv})`, spec.inRange(resultA, rangeHsv), true);

test(`inRange(${spec.toStr(resultC)},${rangeRgb})`, spec.inRange(resultC, rangeRgb), true);

test(`inRange(${spec.toStr(resultF)},${rangeFlt})`, spec.inRange(resultF, rangeFlt), true);

test(`inEnums(${resultE},${enums})`, spec.inEnums(resultE, enums), true);

test(`inRegexp(${resultR},${regexp})`, spec.inRegexp(resultR, regexp), true);

test(`inCard(${resultA},${rangeSpecStr})`, spec.inCard(resultA, rangeSpec), true);

test().log(test().summary());

//# sourceMappingURL=Spec-unit.js.map
