
import { unit, test, tester } from './Tester.js'     # Only importing tester to unit test it
import Stream from "../base/util/Stream.js"
import Mix    from "../base/nav/Mix.js"
import Nav    from "../base/nav/Nav.js"
import Vis    from '../base/draw/Vis.js'

# In this context all unit tests are executed immediately when this module is either
#   dynaically  imported i.e module = import(path) - recommended
# or statically imported i.e inport module from path

# runUnitTestModulesFromPaths:( paths ) will dynamically import this module
#   with paths = ["/lib/pub/test/Tester-unit.js"]
# For glob file patterns running in ViteJS there is
# runUnitTestModulesWithViteJS:() will dynamically import this module
#   using a glob pattern like "/src/**/*-unit.js"  or "/pub/**/*-unit.js"

# t = tester
test().describe('Tester-unit.js', 'unit tests' )

unit( "Tester.type(true)",  tester.type(true), 'boolean' )

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

# Log each status and the summary for Tester
unit().log( test().summary('Tester') )

func  = () ->
undef = undefined

class Main
  @init = () =>

subjects   = ["Nav","Test"]
streamLog  = { subscribe:false, publish:false, subjects:subjects }
stream     = new Stream( subjects, streamLog )
mix        = new Mix( Main )
nav        = new Nav( stream, mix )

t          = tester

unit( "t.type(true)",       t.type(true),          'boolean'   )
unit( "t.type(123)",        t.type(123),           'number'    )
unit( "t.type('123')",      t.type('123'),         'string'    )
unit( "t.type(func)",       t.type(func),          'function'  )
unit( "t.type({a:'a'})",    t.type({a:'a'}),       'object'    )
unit( "t.type([1,2,3]",     t.type([1,2,3]),       'array'     )
unit( "t.type(/x/)",        t.type(/x/),           'regexp'    )
unit( "t.type(new Date())", t.type(new Date()),    'date'      )
unit( "t.type(undef)",      t.type(undef),         'undefined' )
unit( "t.type(null)",       t.type(null),          'null'      )
console.log( unit().status() ) # Log the current block of tests

unit( "t.type(stream)",     t.type(stream),        'object'    )
unit( "t.type(Stream)",     t.type(Stream),        'function'  )
unit( "t.type(tester)",     t.type(tester),        'object'    )
unit( "t.type(Vis)",        t.type(Vis),           'function'  )
console.log( unit().status() ) # Log the current block of tests

unit( "t.klass(true)",       t.klass(true),        'Boolean'   )
unit( "t.klass(123)",        t.klass(123),         'Number'    )
unit( "t.klass('123')",      t.klass('123'),       'String'    )
unit( "t.klass(func)",       t.klass(func),        'func'      )
unit( "t.klass({a:'a'})",    t.klass({a:'a'}),     'Object'    )
unit( "t.klass([1,2,3]",     t.klass([1,2,3]),     'Array'     )
unit( "t.klass(/x/)",        t.klass(/x/),         'RegExp'    )
unit( "t.klass(new Date())", t.klass(new Date()),  'Date'      )
unit( "t.klass(undef)",      t.klass(undef),       'Undefined' )
unit( "t.klass(null)",       t.klass(null),        'Null'      )
console.log( unit().status() ) # Log the current block of tests

unit( "t.klass(stream)",     t.klass(stream),      'Stream'     )
unit( "t.klass(Stream)",     t.klass(Stream),      'Stream'     )
unit( "t.klass(tester)",     t.klass(tester),      'Tester'     )
unit( "t.klass(tester)",     t.klass(tester.type), 'bound type' )
unit( "t.klass(Vis)",        t.klass(Vis),         'Vis'        )
console.log( unit().status() ) # Log the current block of tests

# Positive true tests
unit( "t.isNull(null)",     t.isNull(null),     true  )
unit( "t.isUndef(xxxx)",    t.isUndef(undef),   true  )
unit( "t.isNot(null)",      t.isNot(null),      true  )
unit( "t.isStr('abc')",     t.isStr('abc'),     true  )
unit( "t.isNum(12345)",     t.isNum(12345),     true  )
unit( "t.isNaN(NaN)",       t.isNaN(NaN),       true  )
unit( "t.isObj({a:'a'})",   t.isObj({a:'a'}),   true  )
unit( "t.isVal( 123 )",     t.isVal( 123 ),     true  )
unit( "t.isVal('123')",     t.isVal('123'),     true  )
unit( "t.isVal(true)",      t.isVal(true),      true  )
unit( "t.isVal(false)",     t.isVal(false),     true  )
unit( "t.isArray([1,2,3])", t.isArray([1,2,3]), true  )
console.log( unit().status() ) # Log the current block of tests

# Negative true tests
unit( "t.isNull('abc')",    t.isNull('abc'),    false )
unit( "t.isUndef(12345)",   t.isUndef(12345),   false )
unit( "t.isNot({a:'a'}",    t.isNot({a:'a'}),   false )
unit( "t.isStr( 123 )",     t.isStr( 123 ),     false )
unit( "t.isNum('123')",     t.isNum('123'),     false )
unit( "t.isNaN( 123 )",     t.isNaN( 123 ),     false )
unit( "t.isObj(123)",       t.isObj(123),       false )
unit( "t.isVal({a:'a'})",   t.isVal({a:'a'}),   false )
unit( "t.isVal([1,2,3])",   t.isVal([1,2,3]),   false )
unit( "t.isVal([1,2,3])",   t.isVal([1,2,3]),   true  )
unit( "t.isArray({a:'a'})", t.isArray({a:'a'}), true  )

# Log the current block of tests and then the summary for 't'
console.log( unit().summary('t') )









