
import { type } from "./Type.js"
import { test } from "./Tester.js"

func  = () ->
undef = undefined

# Prefix 'Type.' to the text output like "Type.type(true)"

test().describe( "type", "All 13 types", false )

test( "type('123')",        type.type('123'),         'string'    )
test( "type(123)",          type.type(123),           'int'       )
test( "type(123.0)",        type.type(123.0),         'float'     )
test( "type(true)",         type.type(true),          'boolean'   )
test( "type([1,2,3]",       type.type([1,2,3]),       'array'     )
test( "type({a:'a'})",      type.type({a:'a'}),       'object'    )
test( "type(/x/)",          type.type(/x/),           'regexp'    )
test( "type(func)",         type.type( () => ),       'function'  )
test( "type(null)",         type.type(null),          'null'      )
test( "type(undef)",        type.type(undef),         'undefined' )
test( "type(new Date())",   type.type(new Date()),    'date'      )
test( "type(BigInt(123)))", type.type((BigInt(123))), 'bigint'    ) # 123n not working in CoffeeScript
test( "type(123n)",         type.type(Symbol),        'symbol'    ) # Symbol not Symbol

test().summary().log( test().block() ) # Log the current block of tests

test().describe( "Type", "toStr", "String conversions with toStr(arg)" )

# String conversions
test( 'toStr({ a:"a", b:"b" })',  type.toStr({ a:"a", b:"b" }),  '{a:"a" b:"b"}'  )
test( 'toStr([ 1, 2, 3 ])',       type.toStr([ 1, 2, 3 ]),       '[1,2,3]'       )
test( 'toStr([ "1", "2", "3" ])', type.toStr([ "1", "2", "3" ]), '["1","2","3"]'  )

test().summary().log( test().block() )

test().describe( "klass", "types", false )

test( "klass(true)",       type.klass(true),        'Boolean'   )
test( "klass(123)",        type.klass(123),         'Number'    )
test( "klass('123')",      type.klass('123'),       'String'    )
test( "klass(func)",       type.klass(func),        'func'      )
test( "klass({a:'a'})",    type.klass({a:'a'}),     'Object'    )
test( "klass([1,2,3]",     type.klass([1,2,3]),     'Array'     )
test( "klass(/x/)",        type.klass(/x/),         'RegExp'    )
test( "klass(new Date())", type.klass(new Date()),  'Date'      )
test( "klass(undef)",      type.klass(undef),       'Undefined' )
test( "klass(null)",       type.klass(null),        'Null'      )

test().log( test().block() )

test().describe( "Type", "Positive true tests" )

test( "isNull(null)",      type.isNull(null),     true  )
test( "isUndef(xxxx)",     type.isUndef(undef),   true  )
test( "isNot(null)",       type.isNot(null),      true  )
test( "isStr('abc')",      type.isStr('abc'),     true  )
test( "isNum(12345)",      type.isNumber(12345),  true  )
test( "isNaN(NaN)",        type.isNaN(NaN),       true  )
test( "isObject({a:'a'})", type.isObject({a:'a'}),   true  )
test( "isArray([1,2,3])",  type.isArray([1,2,3]), true  )
console.log( test().block() ) # Log the current block of tests

test().describe( "Type", "Negative false test failuer" )

test( "isNull('abc')",    type.isNull('abc'),    false )
test( "isUndef(12345)",   type.isUndef(12345),   false )
test( "isNot({a:'a'}",    type.isNot({a:'a'}),   false )
test( "isStr( 123 )",     type.isStr( 123 ),     false )
test( "isNumber('123')",  type.isNumber('123'),  false )
test( "isNaN( 123 )",     type.isNaN( 123 ),     false )
test( "isObject(123)",    type.isObject(123),    false )
test( "isArray({a:'a'})", type.isArray({a:'a'}), true  )

test().log( test().block() )

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