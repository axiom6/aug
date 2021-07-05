var stream, streamLog, subjects;

import {
  test
} from "../../test/Tester.js";

import Stream from "./Stream.js";

subjects = ["TestStream", "TestStatus", "TestString", "TestSummary"];

streamLog = {
  subscribe: false,
  publish: false,
  subjects: subjects
};

stream = new Stream(subjects, streamLog);

test().module("Stream", "A mininal Publish and Subscribe class libary");

test().describe("Stream", "Simple Publish and Subscribe");

test(`Subscribe to {a:"a",b:"b"} then Publish`, function(t) {
  var onSubscribe, pubObj, subObj;
  pubObj = {
    a: "a",
    b: "b"
  };
  subObj = {};
  onSubscribe = function(obj) {
    return subObj = obj;
  };
  stream.subscribe("TestStream", "Stream-unit", function(obj) {
    return onSubscribe(obj);
  });
  stream.publish("TestStream", pubObj);
  return t.eq(pubObj, subObj);
});

console.log(test().summary('Stream'));

//# sourceMappingURL=Stream-unit.js.map
