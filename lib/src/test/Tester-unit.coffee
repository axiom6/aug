
import { unit, test, tester } from './Tester.js'     # Only importing tester to unit test it
import Stream from "../base/util/Stream.js"
import Vis    from '../base/draw/Vis.js'

# In this context all unit tests are executed immediately when this module is either
#   dynaically  imported i.e module = import(path) - recommended
# or statically imported i.e inport module from path

# runUnitTestModulesFromPaths:( paths ) will dynamically import this module
#   with paths = ["/lib/pub/test/Tester-unitester.js"]
# For glob file patterns running in ViteJS there is
# runUnitTestModulesWithViteJS:() will dynamically import this module
#   using a glob pattern like "/src/**/*-unitester.js"  or "/pub/**/*-unitester.js"

# t = tester
test().describe('Tester-unitester.js', 'unit tests' )

five = () ->
  5

add  = ( a, b ) ->
  a + b

test(  "Tester.five() = 5", (t) ->
  t.eq( five(), 5 ) )

test(  "Tester.add(2,3) = 5", (t) ->
  t.eq( add(2,3), 5 ) )

test(  "Tester.type(123)", (t) ->
  t.eq( tester.type(123), 'number' ) )

test(  "Tester.type('123')", (t) ->
  t.eq( tester.type('123'), 'string' ) )

func  = () ->
undef = undefined

class Main
  @init = () =>

subjects   = ["TestStatus","TestString","TestSummary"]
streamLog  = { subscribe:false, publish:false, subjects:subjects }
stream     = new Stream( subjects, streamLog )

unit( "Tester.type(true)",       tester.type(true),          'boolean'   )
unit( "Tester.type(123)",        tester.type(123),           'number'    )
unit( "Tester.type('123')",      tester.type('123'),         'string'    )
unit( "Tester.type(func)",       tester.type(func),          'function'  )
unit( "Tester.type({a:'a'})",    tester.type({a:'a'}),       'object'    )
unit( "Tester.type([1,2,3]",     tester.type([1,2,3]),       'array'     )
unit( "Tester.type(/x/)",        tester.type(/x/),           'regexp'    )
unit( "Tester.type(new Date())", tester.type(new Date()),    'date'      )
unit( "Tester.type(undef)",      tester.type(undef),         'undefined' )
unit( "Tester.type(null)",       tester.type(null),          'null'      )
console.log( unit().block() ) # Log the current block of tests

unit( "Tester.type(stream)",     tester.type(stream),        'object'    )
unit( "Tester.type(Stream)",     tester.type(Stream),        'function'  )
unit( "Tester.type(tester)",     tester.type(tester),        'object'    )
unit( "Tester.type(Vis)",        tester.type(Vis),           'function'  )
console.log( unit().block() ) # Log the current block of tests

unit( "Tester.klass(true)",       tester.klass(true),        'Boolean'   )
unit( "Tester.klass(123)",        tester.klass(123),         'Number'    )
unit( "Tester.klass('123')",      tester.klass('123'),       'String'    )
unit( "Tester.klass(func)",       tester.klass(func),        'func'      )
unit( "Tester.klass({a:'a'})",    tester.klass({a:'a'}),     'Object'    )
unit( "Tester.klass([1,2,3]",     tester.klass([1,2,3]),     'Array'     )
unit( "Tester.klass(/x/)",        tester.klass(/x/),         'RegExp'    )
unit( "Tester.klass(new Date())", tester.klass(new Date()),  'Date'      )
unit( "Tester.klass(undef)",      tester.klass(undef),       'Undefined' )
unit( "Tester.klass(null)",       tester.klass(null),        'Null'      )
console.log( unit().block() ) # Log the current block of tests

unit( "Tester.klass(stream)",     tester.klass(stream),      'Stream'     )
unit( "Tester.klass(Stream)",     tester.klass(Stream),      'Stream'     )
unit( "Tester.klass(tester)",     tester.klass(tester),      'Tester'     )
unit( "Tester.klass(tester)",     tester.klass(tester.type), 'bound type' )
unit( "Tester.klass(Vis)",        tester.klass(Vis),         'Vis'        )
console.log( unit().block() ) # Log the current block of tests

# Positive true tests
unit( "Tester.isNull(null)",     tester.isNull(null),     true  )
unit( "Tester.isUndef(xxxx)",    tester.isUndef(undef),   true  )
unit( "Tester.isNot(null)",      tester.isNot(null),      true  )
unit( "Tester.isStr('abc')",     tester.isStr('abc'),     true  )
unit( "Tester.isNum(12345)",     tester.isNum(12345),     true  )
unit( "Tester.isNaN(NaN)",       tester.isNaN(NaN),       true  )
unit( "Tester.isObj({a:'a'})",   tester.isObj({a:'a'}),   true  )
unit( "Tester.isVal( 123 )",     tester.isVal( 123 ),     true  )
unit( "Tester.isVal('123')",     tester.isVal('123'),     true  )
unit( "Tester.isVal(true)",      tester.isVal(true),      true  )
unit( "Tester.isVal(false)",     tester.isVal(false),     true  )
unit( "Tester.isArray([1,2,3])", tester.isArray([1,2,3]), true  )
console.log( unit().block() ) # Log the current block of tests

# Negative true tests
unit( "Tester.isNull('abc')",    tester.isNull('abc'),    false )
unit( "Tester.isUndef(12345)",   tester.isUndef(12345),   false )
unit( "Tester.isNot({a:'a'}",    tester.isNot({a:'a'}),   false )
unit( "Tester.isStr( 123 )",     tester.isStr( 123 ),     false )
unit( "Tester.isNum('123')",     tester.isNum('123'),     false )
unit( "Tester.isNaN( 123 )",     tester.isNaN( 123 ),     false )
unit( "Tester.isObj(123)",       tester.isObj(123),       false )
unit( "Tester.isVal({a:'a'})",   tester.isVal({a:'a'}),   false )
unit( "Tester.isVal([1,2,3])",   tester.isVal([1,2,3]),   false )
unit( "Tester.isVal([1,2,3])",   tester.isVal([1,2,3]),   true  )
unit( "Tester.isArray({a:'a'})", tester.isArray({a:'a'}), true  )

test( 'Tester.eq( {a:"a"})', (t) -> t.eq(  {a:"a"}, {a:"a"} ) )
test( 'Tester.eq( {a:"a"})', (t) -> t.eq(  {a:"a"}, {a:"b"} ) )
test( 'Tester.eq( {a:"a"})', (t) -> t.eq(  {a:"a"}, {b:"a"} ) )

test( "Tester.eq([1,2,3])",  (t) -> t.eq([1,2,3],[1,2,3]    ) )
test( "Tester.eq([1,2,3])",  (t) -> t.eq([1,2,3],[1,2,3,4]  ) )

test( 'Tester.eq( (x) ->, (y) -> ) )', (t) -> t.eq(  (x) ->, (y) -> ) )

# String conversions
unit( 'Tester.toStr({ a:"a", b:"b" })',  tester.toStr({ a:"a", b:"b" }), '{ a:"a", b:"b" }' )
unit( 'Tester.toStr([ 1, 2, 3 ])',       tester.toStr([ 1, 2, 3 ]),      '[ 1, 2, 3 ]'      )
unit( 'Tester.toStr([ "1", "2", "3" ])', tester.toStr([ "1", "2", "3" ]),  '[ "1", "2", "3" ]'  )

# Log the current block of tests and then the summary for 't'
console.log( unit().summary('Tester') )









