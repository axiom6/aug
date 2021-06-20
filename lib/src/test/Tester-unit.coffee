
import { unit, test, tester } from './Tester.js'     # Only importing tester to unit test it

# In this context all unit tests are executed immediately when this module is either
#   dynaically  imported i.e module = import(path) - recommended
# or statically imported i.e inport module from path

# Module.js transpiled from Module.coffee will dynamically import this module
#   using a glob pattern like "/src/**/*-unit.js"  or "/pub/**/*-unit.js" for transpiled
#   JavaScript .js



test().describe('tester-unit.js', 'unit tests' )

#Type tests ["Boolean", "Number", "String", "Function", "Object", "Array",
#  "RegExp", "Date", "Symbol", "Event", "Element", "Undefined", "Null"]

func  = () ->
undef = undefined # Not sure how to test for undefined

unit( "tester.type(true)",          tester.type(true),          'boolean'   )
unit( "tester.type(123)",           tester.type(123),           'number'    )
unit( "tester.type('123')",         tester.type('123'),         'string'    )
unit( "tester.type(func)",          tester.type(func),          'function'  )
unit( "tester.type({a:'a'})",       tester.type({a:'a'}),       'object'    )
unit( "tester.type([1,2,3]",        tester.type([1,2,3]),       'array'     )
unit( "tester.type(/x/)",           tester.type(/x/),           'regexp'    )
unit( "tester.type(new Date())",    tester.type(new Date()),    'date'      )
#nit( "tester.type(new Event())",   tester.type(new Event()),   'event'     )
#nit( "tester.type(new Element())", tester.type(new Element()), 'element'   )
unit( "tester.type(undef)",         tester.type(undef),         'undefined' )
unit( "tester.type(null)",          tester.type(null),          'null'      )

# Positive true tests

unit( "tester.isNul(null)",    tester.isNul(null),    true  )
unit( "tester.isUnd(xxxx)",    tester.isUnd(undef),   true  )
unit( "tester.isNot(null)",    tester.isNot(null),    true  )
unit( "tester.isStr('abc')",   tester.isStr('abc'),   true  )
unit( "tester.isNum(12345)",   tester.isNum(12345),   true  )
unit( "tester.isNaN(NaN)",     tester.isNaN(NaN),     true  )
unit( "tester.isObj({a:'a'})", tester.isObj({a:'a'}), true  )
unit( "tester.isVal( 123 )",   tester.isVal( 123 ),   true  )
unit( "tester.isVal('123')",   tester.isVal('123'),   true  )
unit( "tester.isVal(true)",    tester.isVal(true),    true  )
unit( "tester.isVal(false)",   tester.isVal(false),   true  )
unit( "tester.isArr([1,2,3])", tester.isArray([1,2,3]), true  )

# Negative true tests
unit( "tester.isNul('abc')",   tester.isNul('abc'),   false )
unit( "tester.isUnd(12345)",   tester.isUnd(12345),   false )
unit( "tester.isNot({a:'a'}",  tester.isNot({a:'a'}), false )
unit( "tester.isStr( 123 )",   tester.isStr( 123 ),   false )
unit( "tester.isNum('123')",   tester.isNum('123'),   false )
unit( "tester.isNaN( 123 )",   tester.isNaN( 123 ),   false )
unit( "tester.isObj(123)",     tester.isObj(123),     false )
unit( "tester.isVal({a:'a'})", tester.isVal({a:'a'}), false )
unit( "tester.isVal([1,2,3])", tester.isVal([1,2,3]), false )
unit( "tester.isVal([1,2,3])", tester.isVal([1,2,3]), false )
unit( "tester.isArr({a:'a'})", tester.isArray({a:'a'}), false )

five = () ->
  5

add  = ( a, b ) ->
  a + b

test(  "five() = 5", (t) ->
  t.eq( five(),  5 ) )

test(  "add(2,3) = 5", (t) ->
  t.eq( add(2,3),  5 ) )

test(  "tester.type(123)", (t) ->
  t.eq( tester.type(123),  'number' ) )

unit().summary('tester')







