
import { test } from "../../test/Tester.js"
import Stream   from "./Stream.js"

subjects   = ["TestStream","TestStatus","TestString","TestSummary"]
streamLog  = { subscribe:false, publish:false, subjects:subjects }
stream     = new Stream( subjects, streamLog )

test().module( "Stream", "A mininal Publish and Subscribe class libary")

test().describe( "Stream", "Simple Publish and Subscribe" )
test( "Subscribe then Publish", (t) ->
  pubObj = { a:"a", b:"b" }
  subObj = {}
  onSubscribe = (obj) -> subObj = obj
  stream.subscribe( "TestStream", "Stream-unit", (obj) -> onSubscribe(obj) )
  stream.publish(   "TestStream", pubObj )
  t.eq( pubObj, subObj ) )
console.log( test().summary('Stream') )