
import { test } from "../test/Tester.js"
import Stream   from "./Stream.js"

subjects   = ["TestStream","TestStatus","TestString","TestSummary"]
streamLog  = { subscribe:false, publish:false, subjects:subjects }
stream     = new Stream( subjects, streamLog )

test().module( "A mininal Publish and Subscribe class libary" ).on(false)

test().describe( "Publish and Subscribe" ).on()

# This demonstates an elaborate setup before t.eq(pubObj,subObj)
test( 'Subscribe to {a:"a",b:"b"} then Publish', (t) ->
  pubObj = { a:"a", b:"b" }
  subObj = {}
  onSubscribe = (obj) -> subObj = obj
  stream.subscribe( "TestStream", "Stream-unit", (obj) -> onSubscribe(obj) )
  stream.publish(   "TestStream", pubObj )
  t.eq( pubObj, subObj )  )
test().log( test().summary() )