import {
  type
} from "./Type.js";

import {
  test
} from "./Tester.js";

test().module("Deliberate edge case failures").on();

test().describe("Class Type to... conversions failures").op("to").on();

test("toObject( arg )", function(t) {
  var a, b;
  a = "1";
  b = "2";
  t.eq(type.toObject('{a:"1",b:"2")', {
    a: "1",
    b: "2" // Test fails because expect is not a seperate arg
  }));
  return t.eq(type.toObject('{a:a,b:b)', {
    a: a,
    b: b // Test fails because expect is not a seperate arg
  }));
});

test().log(test().summary());

//# sourceMappingURL=Type-fail.js.map
