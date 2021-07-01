
import { type } from "./Type.js"
import { unit } from "./Tester.js"

func  = () ->
undef = undefined

unit().describe( "Type" )

unit( "type(true)",       type.type(true),          'boolean'   )
unit( "type(123)",        type.type(123),           'number'    )
unit( "type('123')",      type.type('123'),         'string'    )
unit( "type(func)",       type.type(func),          'function'  )
unit( "type({a:'a'})",    type.type({a:'a'}),       'object'    )
unit( "type([1,2,3]",     type.type([1,2,3]),       'array'     )
unit( "type(/x/)",        type.type(/x/),           'regexp'    )
unit( "type(new Date())", type.type(new Date()),    'date'      )
unit( "type(undef)",      type.type(undef),         'undefined' )
unit( "type(null)",       type.type(null),          'null'      )
console.log( unit().block() ) # Log the current block of tests

# String conversions
unit( 'toStr({ a:"a", b:"b" })',  type.toStr({ a:"a", b:"b" }),  '{ a:"a", b:"b" }'   )
unit( 'toStr([ 1, 2, 3 ])',       type.toStr([ 1, 2, 3 ]),       '[ 1, 2, 3 ]'        )
unit( 'toStr([ "1", "2", "3" ])', type.toStr([ "1", "2", "3" ]), '[ "1", "2", "3" ]'  )

unit( "klass(true)",       type.klass(true),        'Boolean'   )
unit( "klass(123)",        type.klass(123),         'Number'    )
unit( "klass('123')",      type.klass('123'),       'String'    )
unit( "klass(func)",       type.klass(func),        'func'      )
unit( "klass({a:'a'})",    type.klass({a:'a'}),     'Object'    )
unit( "klass([1,2,3]",     type.klass([1,2,3]),     'Array'     )
unit( "klass(/x/)",        type.klass(/x/),         'RegExp'    )
unit( "klass(new Date())", type.klass(new Date()),  'Date'      )
unit( "klass(undef)",      type.klass(undef),       'Undefined' )
unit( "klass(null)",       type.klass(null),        'Null'      )
console.log( unit().block() ) # Log the current block of tests


# Positive true tests
unit( "isNull(null)",     type.isNull(null),     true  )
unit( "isUndef(xxxx)",    type.isUndef(undef),   true  )
unit( "isNot(null)",      type.isNot(null),      true  )
unit( "isStr('abc')",     type.isStr('abc'),     true  )
unit( "isNum(12345)",     type.isNum(12345),     true  )
unit( "isNaN(NaN)",       type.isNaN(NaN),       true  )
unit( "isObj({a:'a'})",   type.isObj({a:'a'}),   true  )
unit( "isVal( 123 )",     type.isVal( 123 ),     true  )
unit( "isVal('123')",     type.isVal('123'),     true  )
unit( "isVal(true)",      type.isVal(true),      true  )
unit( "isVal(false)",     type.isVal(false),     true  )
unit( "isArray([1,2,3])", type.isArray([1,2,3]), true  )
console.log( unit().block() ) # Log the current block of tests

# Negative true tests
unit( "isNull('abc')",    type.isNull('abc'),    false )
unit( "isUndef(12345)",   type.isUndef(12345),   false )
unit( "isNot({a:'a'}",    type.isNot({a:'a'}),   false )
unit( "isStr( 123 )",     type.isStr( 123 ),     false )
unit( "isNum('123')",     type.isNum('123'),     false )
unit( "isNaN( 123 )",     type.isNaN( 123 ),     false )
unit( "isObj(123)",       type.isObj(123),       false )
unit( "isVal({a:'a'})",   type.isVal({a:'a'}),   false )
unit( "isVal([1,2,3])",   type.isVal([1,2,3]),   false )
unit( "isVal([1,2,3])",   type.isVal([1,2,3]),   true  )
unit( "isArray({a:'a'})", type.isArray({a:'a'}), true  )
###  
    scheme:( arg,op="eq" )
  type:(arg,lowerCase=true)
  klass:(arg)
  isString:(s)
  isInt:(i,sc=false)
  isFloat:(f,sc=false)
  isBoolean:(b,sc=false)
  isObject:(o,sc=false)
  isRegex:(r)
  isFunction:(f)
  isNull:(m)
  isUndef:(u)
  isBigInt:(b)
  isSymbol:(s)
  isArray:( a, type=null, sc=false )
  isType:(v,t)
  isDef:(d)
  isNumber:(n)
  isNot:(d)
  isNaN:(n)
  isArrayTyped:(a,t)
  sArrayMixed:(a)
  inString:(e,s)
  inArray:( e,a)
  inObject:(k,o)

  toKeys:(o)
  time:()
  isChild: (key)
  isEmpty:(e)
  isStringFloat:( str )
  isStringInt:( str )
  isStringBoolean:( str )
  isStringArray:( str )
  isStringObject:( str )
  isStringEnclosed:( beg, str, end )
  toType:( arg, type )
  enclose:( str, enc="" )
  toString:( arg, enc="" )
  toFloat:( arg )
  toInt:( arg )
  toInfo:( method, arg, type, typeTo, retnStr, retn )
  toArray:( arg, type, sep="," )
  toObject:( arg )
  toFixed:( arg, dec=2 )
  toCap:( str )
  unCap:( str )
  head:(v,action=false,pop=false)
  tail:(v,action=false)
  slice:( v, beg, end=null, remove=false )
  pad:( n, m )
  noop:( ...args )
  types
  typeofs
###