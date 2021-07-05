
import { type } from "./Type.js"
import { test } from "./Tester.js"

func  = () ->
undef = undefined

test().module( "Type", "The type assertion and conversion class libary")

test().describe( "toStr()", "String conversions with toStr(arg)" )
test( '{a:"a",b:"b"}',  type.toStr({ a:"a", b:"b" }), '{a:"a" b:"b"}' ) # .log( test().status() )
test( '[1,2,3]',        type.toStr([1,2,3]),          '[1,2,3]'       ) # .log( test().status() )
test( '["1","2","3"]',  type.toStr(["1","2","3"]),    '["1","2","3"]' ) # .log( test().status() )
test().log( test().summary() ) # Log the all the tests  that began with descripe(...)

test().describe( "toEnclose()", """Enclose strings with '"', '()', '[]' '{}'""" )
test( "", type.toEnclose( "abc",   '"'  ), '"abc"'   )             # returns "abc" - good for JSON keys and values
test( "", type.toEnclose( "123",   "'"  ), "'123'"   )             # returns '123'
test( "", type.toEnclose( "xyz",   "()" ), "(xyz)"   )             # returns (xyz)
test( "", type.toEnclose( "d,e,f", "[]" ), "[d,e,f]" )             # returns [d,e,f]
test( "", type.toEnclose( "a:x,b:y,c:z", "{}" ), "{a:x,b:y,c:z}" ) # returns {a:x,b:y,c:z}
test().log( test().summary() )

test().describe( "type()", "All 13 types", true )  # false turns off this block of
test( "'123'",        type.type('123'),         'string'    )
test(  "123",         type.type(123),           'int'       )
test( "123.0",        type.type(123.0),         'float'     )
test( "true",         type.type(true),          'boolean'   )
test( "[1,2,3]",      type.type([1,2,3]),       'array'     )
test( "{a:'a'}",      type.type({a:'a'}),       'object'    )
test( "/x/",          type.type(/x/),           'regexp'    )
test( "func",         type.type( () => ),       'function'  )
test( "null",         type.type(null),          'null'      )
test( "undef",        type.type(undef),         'undefined' )
test( "new Date()",   type.type(new Date()),    'date'      )
test( "BigInt(123)",  type.type((BigInt(123))), 'bigint'    ) # 123n not working in CoffeeScript
test( "Symbol",       type.type(Symbol),        'symbol'    ) # Symbol not not Symbol()
test().log( test().summary() )

test().describe( "klass()", "types", true )
test( "true",       type.klass(true),        'Boolean'   )
test( "123",        type.klass(123),         'Number'    )
test( "'123'",      type.klass('123'),       'String'    )
test( "func",       type.klass(func),        'func'      )
test( "{a:'a'}",    type.klass({a:'a'}),     'Object'    )
test( "[1,2,3]",    type.klass([1,2,3]),     'Array'     )
test( "/x/",        type.klass(/x/),         'RegExp'    )
test( "new Date()", type.klass(new Date()),  'Date'      )
test( "undef",      type.klass(undef),       'Undefined' )
test( "null",       type.klass(null),        'Null'      )
test().log( test().summary() )

test().describe( "-Positive", "Positive true tests", true )
test( "isNull(null)",      type.isNull(null),     true  )
test( "isUndef(xxxx)",     type.isUndef(undef),   true  )
test( "isNot(null)",       type.isNot(null),      true  )
test( "isStr('abc')",      type.isStr('abc'),     true  )
test( "isNum(12345)",      type.isNumber(12345),  true  )
test( "isNaN(NaN)",        type.isNaN(NaN),       true  )
test( "isObject({a:'a'})", type.isObject({a:'a'}),   true  )
test( "isArray([1,2,3])",  type.isArray([1,2,3]), true  )
test().log( test().summary() )

test().describe( "-Negative", "Negative false test failure" )
test( "isNull('abc')",    type.isNull('abc'),    false )
test( "isUndef(12345)",   type.isUndef(12345),   false )
test( "isNot({a:'a'}",    type.isNot({a:'a'}),   false )
test( "isStr( 123 )",     type.isStr( 123 ),     false )
test( "isNumber('123')",  type.isNumber('123'),  false )
test( "isNaN( 123 )",     type.isNaN( 123 ),     false )
test( "isObject(123)",    type.isObject(123),    false )
test( "isArray({a:'a'})", type.isArray({a:'a'}), true  )
test().log( test().summary() )

test().log( test().summary("Type") )

###  
  -- Type determination --
  type:(arg,lowerCase=true)
  klass:(arg)

  -- is Assertions ---
  isType:(v,t)
  isString:(s)
  isInt:(i,sc=false)
  isFloat:(f,sc=false)
  isBoolean:(b,sc=false)
  isArray:( a, type=null, sc=false )
  isObject:(o,sc=false)
  isRegex:(r)
  isFunction:(f)
  isNull:(m)
  isUndef:(u)
  isBigInt:(b)
  isSymbol:(s)

  isDef:(d)
  isNumber:(n)
  isNot:(d)
  isNaN:(n)
  isArrayTyped:(a,t)
  isArrayMixed:(a)
  isChild: (key)
  isEmpty:(e)
  isStringFloat:( str )
  isStringInt:( str )
  isStringBoolean:( str )
  isStringArray:( str )
  isStringObject:( str )
  isStringEnclosed:( beg, str, end )

  -- to Conversions --
  toType:( arg, type )
  toString:( arg, enc="" )
  toFloat:( arg )
  toInt:( arg )

  toArray:( arg, type, sep="," )
  toObject:( arg )
  toFixed:( arg, dec=2 )
  toEnclose:( str, enc="" )
  toKeys:(o)
  toSlice:( v, beg, end=null, remove=false )
  toCap:( str )
  unCap:( str )

  == in Containment --
  inString:(e,s)
  inArray:( e,a)
  inObject:(k,o)

  -- Info messaging --
  isInfo:( pass, text, type, types )
  toInfo:( method, arg, type, typeTo, retnStr, retn )
  inInfo:( pass, result, expect, oper, spec, text ) ->

  -- Utilities --
  head:(v,action=false,pop=false)
  tail:(v,action=false)

  pad:( n, m )
  noop:( ...args )
  time:()
  types
  typeofs
###

###
{
  "stream": {
    "subjectNames": [
      "TestStatus",
      "TestString",
      "TestSummary"
    ],
    "info": {
      "subscribe": false,
      "publish": false,
      "subjects": [
        "TestStatus",
        "TestString",
        "TestSummary"
      ]
    },
    "subjects": {
      "TestStatus": {
        "subscribers": {}
      },
      "TestString": {
        "subscribers": {}
      },
      "TestSummary": {
        "subscribers": {}
      }
    }
  },
  "testing": true,
  "archive": true,
  "verbose": false,
  "debug": false,
  "schemaKey": "schema",
  "statusSubject": "TestStatus",
  "stringSubject": "TestString",
  "summarySubject": "TestSummary",
  "description": null,
  "suite": "unit tests",
  "text": "five() = 5",
  "code": "",
  "statusText": "",
  "statusClear": true,
  "blockText": "",
  "blockClear": true,
  "module": "Tester",
  "modules": {
    "Tester": {
      "name": "Tester",
      "path": "/lib/pub/test/Tester-unit.js"
    }
  },
  "passed": [],
  "failed": [],
  "logging": true
}
  
###