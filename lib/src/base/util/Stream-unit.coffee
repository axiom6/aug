
import { test } from "../../test/Tester.js"
import Stream   from "./Stream.js"

subjects   = ["TestStream","TestStatus","TestString","TestSummary"]
streamLog  = { subscribe:false, publish:false, subjects:subjects }
stream     = new Stream( subjects, streamLog )

test( "Stream.Simple Publish and Subscribe", (t) ->
  pubObj = { a:"a", b:"b" }
  subObj = {}
  onSubscribe = (obj) -> subObj = obj
  stream.subscribe( "TestStream", "Stream-unit", (obj) -> onSubscribe(obj) )
  stream.publish(   "TestStream", pubObj )
  t.eq( pubObj, subObj ) )

console.log( test().block() ) # Should not be needed
console.log( test().summary('Stream') )