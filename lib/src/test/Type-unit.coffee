
import { type }         from "./Type.js"
import { test, tester } from "./Tester.js"
import Stream           from "../base/util/Stream.js"
import Vis              from '../base/draw/Vis.js'

subjects   = ["TestStatus","TestString","TestSummary"]
streamLog  = { subscribe:false, publish:false, subjects:subjects }
stream     = new Stream( subjects, streamLog )
func       = () ->
undef      = undefined

test().module( "Class Type assertion and conversion" ).on()

test().describe( """Enclose strings with '"', '()', '[]' '{}'""", "toEnclose()" ).on()
test( "", type.toEnclose( "abc",   '"'  ), '"abc"'   )             # returns "abc" - good for JSON keys and values
test( "", type.toEnclose( "123",   "'"  ), "'123'"   )             # returns '123'
test( "", type.toEnclose( "xyz",   "()" ), "(xyz)"   )             # returns (xyz)
test( "", type.toEnclose( "d,e,f", "[]" ), "[d,e,f]" )             # returns [d,e,f]
test( "", type.toEnclose( "a:x,b:y,c:z", "{}" ), "{a:x,b:y,c:z}" ) # returns {a:x,b:y,c:z}
test().log( test().summary() )

# "|string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date"
test().describe( "All 13 types" ).name("type()").on()  # all type(arg) tests needs better reporting
test( "'123'",        type.toType('123'),         'string'    )
test(  "123",         type.toType(123),           'int'       )
test( "123.1",        type.toType(123.1),         'float'     )
test( "123.0 float?", type.toType(123.0),         'int'       )
test( "true",         type.toType(true),          'boolean'   )
test( "[1,2,3]",      type.toType([1,2,3]),       'array'     )
test( "{a:'a'}",      type.toType({a:'a'}),       'object'    )
test( "|a|b|c|",      type.toType("|a|b|c|"),     'enums'     )
test( "|0-100|",      type.toType("|0-100|"),     'range'     )
test( "/x/",          type.toType(/x/),           'regexp'    )
test( "null",         type.toType(null),          'null'      )
test( "undef",        type.toType(undef),         'undefined' )
test( "func",         type.toType( () => ),       'function'  )
test( "BigInt(123)",  type.toType((BigInt(123))), 'bigint'    ) # 123n not working in CoffeeScript
test( "Symbol",       type.toType(Symbol()),      'symbol'    ) # Symbol not not new Symbol()
test( "new Date()",   type.toType(new Date()),    'date'      )
test( "stream",       type.toType(stream),        'object'    )
test( "Stream",       type.toType(Stream),        'function'  )
test( "tester",       type.toType(tester),        'object'    )
test( "Vis",          type.toType(Vis),           'function'  )
test().log( test().summary() )

test().describe( "klass types" ).name("klass()").on()
test( "true",       type.toKlass(true),        'Boolean'   )
test( "123",        type.toKlass(123),         'Int'       )
test( "'123'",      type.toKlass('123'),       'String'    )
test( "func",       type.toKlass(func),        'func'      )
test( "{a:'a'}",    type.toKlass({a:'a'}),     'Object'    )
test( "[1,2,3]",    type.toKlass([1,2,3]),     'Array'     )
test( "/x/",        type.toKlass(/x/),         'RegExp'    )
test( "new Date()", type.toKlass(new Date()),  'Date'      )
test( "undef",      type.toKlass(undef),       'Undefined' )
test( "null",       type.toKlass(null),        'Null'      )
test( "stream",     type.toKlass(stream),  'Stream' )
test( "Stream",     type.toKlass(Stream),  'Stream' )
test( "tester",     type.toKlass(tester),  'Tester' )
test( "Vis",        type.toKlass(Vis),     'Vis'    )
test().log( test().summary() )

test().describe( "class Type is... assertions" ).on()
test( "isType(v,t)",               type.isType("abc","string"),       true )
test( "isStr('abc')",              type.isStr('abc'),                 true )
test( "isInt(i)",                  type.isInt(  123 ),                true )
test( "isInt(i)",                  type.isInt( "123"),                true )
test( "isFloat(f)",                type.isFloat(123.2),               true )
test( "isFloat(f)",                type.isFloat("123.2"),             true )
test( "isBoolean(b)",              type.isBoolean( true ),            true )
test( "isBoolean(b)",              type.isBoolean("true"),            true )
test( "isObject({a:'a'})",         type.isObject({a:'a'}),            true )
test( "isArray([1,2,3])",          type.isArray([1,2,3]),             true )
test( "isArrayTyped(a,t)",         type.isArrayTyped([1,2,3],"int") , true )
test( "isArrayMixed(a)",           type.isArrayMixed([1,"2",3]),      true )
test( 'isEnums("|a|b|c|")',        type.isEnums("|a|b|c|"),           true )
test( "isRegex(r)",                type.isRegexp(/^-?\d+$/),          true )
test( "isFunction(f)",             type.isFunction(type.toStr),       true )
test( "isNull(null)",              type.isNull(null),                 true )
test( "isUndef(xxxx)",             type.isUndef(undef),               true )
test( "isNot(null)",               type.isNot(null),                  true )
test( "isNumber(12345)",           type.isNumber(12345),              true )
test( "isBigInt(b)",               type.isBigInt(BigInt(123)),        true )
test( "isSymbol(s)",               type.isSymbol(Symbol()),           true )
test( "isNaN(NaN)",                type.isNaN(NaN),                   true )
test( 'isType("|0-100|","range")', type.isType("|0-100|","range"), true )
test().log( test().summary() )

test().describe( "Negative type assertsions" ).on()
test( "isNull('abc')",    type.isNull('abc'),    false )
test( "isUndef(12345)",   type.isUndef(12345),   false )
test( "isNot({a:'a'}",    type.isNot({a:'a'}),   false )
test( "isStr( 123 )",     type.isStr( 123 ),     false )
test( "isNumber('123')",  type.isNumber('123'),  false )
test( "isNaN( 123 )",     type.isNaN( 123 ),     false )
test( "isObject(123)",    type.isObject(123),    false )
test( 'isArray({a:"a"})', type.isArray({a:"a"}), false )
test( "isArray({a:'a'})", type.isArray({a:'a'}), false )
test().log( test().summary() )

test().describe( "Class Type in... containments" ).on()
test( "inString(e,s)", type.inStr(    "b", "abc" ),         true )
test( "inArray( e,a)", type.inArray(   2,  [1,2,3] ),       true )
test( "inObject(k,o)", type.inObject( "b", {a:"1",b:"2"} ), true )
test().log( test().summary() )

test().describe( "Utilities" ).on()
test( 'head([1,2,3])',               type.head([1,2,3]),  1  )
test( 'tail("123")',                 type.tail("123", ), "3" )
#est( 'pad(n,m)',                    type.pad( "1", 2 ),                "  1" )  # getting crunched
test( 'isIn( "string", "types"   )', type.isIn( "string", "types"   ),   true )
test( 'isIn( "string", "typeofs" )', type.isIn( "string", "typeofs" ),   true )
test().log( test().summary() )

test().describe( "Warnings", "methods @toWarn(...) @isWarn(...) @inWarn(...)" ).on()
test( "toWarn(method,text,arg,typeTo,retn, (t)=>t.log(@warn()) )",
  type.toWarn("toStr()","bad arg", "undefined","string",'""', (t)=>t.log(@warn()) ), '""' )
test( "isWarn(fail,text,string,[array.object],(t)=>t.log(@warn()) )"
  type.isWarn(false,"bad type","string",["array","object"],(t)=>t.log(@warn()) ), false )
test( "inWarn(pass,result,expect,oper,spec,text,(t)=>t.log(@warn()) )"
  type.inWarn(false,"4","1|2|3","eq","1|2|3","enums",(t)=>t.log(@warn()) ), false )
test().log( test().summary() )

test().describe( "Class Type to... conversions" ).op("to").on()
test( 'toConvert(123,"string")',             type.toConvert(  123,            "string"  ), "123"         )
test( 'toConvert("123","int")',              type.toConvert( "123",           "int"     ),  123          )
test( 'toConvert("123.1","float")',          type.toConvert( "123.1",         "float"   ),  123.1        )
test( 'toConvert("true","boolean")',         type.toConvert( "true",          "boolean" ), true          )
test( 'toConvert("[1,2,3]","array")',        type.toConvert( "[1,2,3]",       "array"   ), [1,2,3]       )
test( 'toConvert("{a:"1",b:"2"}","object")', type.toConvert( '{a:"1",b:"2"}', "object"  ), {a:"1",b:"2"} )
test( 'toConvert("/x/","string")',           type.toConvert( "/x/",           "string"  ), "none"        )
test( 'toValue(123)',             type.toValue( "abc"           ), "abc"         )
test( 'toValue("123")',           type.toValue( "123"           ),  123          )
test( 'toValue("123.1")',         type.toValue( "123.1"         ),  123.1        )
test( 'toValue("true")',          type.toValue( "true"          ), true          )
test( 'toValue("[1,2,3]")',       type.toValue( "[1,2,3]"       ), [1,2,3]       )
test( 'toValue("{a:"1",b:"2"}")', type.toValue( '{a:"1",b:"2"}' ), {a:"1",b:"2"} )
test( 'toValue("/x/")',           type.toValue( "/x/"           ), /x/           )
test( "toFloat(1)",          type.toFloat( 1 ),           1.0    )
test( "toInt(1.0)",          type.toInt( 1.0 ),           1      )
test( "toFixed(1.0,2)",      type.toFixed( 1.0, 2 ),     "1.00" )
test( "toKeys(o)",           type.toKeys({x:"1",y:"2"}), ["x","y"] )
test( "toCap( str )",        type.toCap("cap"), "Cap" )
test( "unCap( str )",        type.unCap("Cap"), "cap" )
test( '"123456",3,4)',       type.slice( "123456",3,4), "34" )
test( 'toArray("[1,2,3]")',  type.toArray("[1,2,3]"), [1,2,3] )

t = tester
a = "a"
b = "b"
test( "type.toObject( {a: a, b: b } enc", type.toObject( "{a:#{t.v(a)},b:#{t.v(b)})" ), {a:'"a"',b:'"b"'} )
a = 3
b = 4
test( "type.toObject( {a: 3, b: 4 } var", type.toObject( "{a:#{t.v(a)},b:#{t.v(b)})" ), {a:  3,  b:  4  } )
a = [5,6]
o = {q:7,r:"8"}
test( "type.toObject( {a:#{t.v(a)},b:#{t.v(b)}) qqq", type.toObject( "{a:#{t.v(a)},b:#{t.v(b)})" ), {a: [5,6], b:{q:7,r:'"8"'}  } )
test( "type.toObject( {a:#{t.s(a)},b:#{t.s(o)}) mix", type.toObject( "{a:#{t.v(a)},b:#{t.v(o)})" ), {a: [5,6], b:{q:7,r:'"8"'}  } )
test( 'type.toObject( {a:"x",b:"y") str', type.toObject( '{a:"x", b: "y")' ),           {a:'"x"',  b:'"y"'          } )
test( "type.toObject( {a: 1, b: 2 } int", type.toObject( '{a: 1,  b:  2 }' ),           {a:  1,    b:  2            } )
test().log( test().summary() )

test().describe( "String conversions", "toStr()" ).op("to").on()
test( "abc 'string'",                    type.toStr("abc"),              "abc"           )
test( "123 'int'",                       type.toStr(123),                "123"           )
test( "1.1 'float'",                     type.toStr(1.1),                "1.1"           )
test( "true 'boolean'",                  type.toStr(true),               "true"          )
test( '{a:"a",b:"b"} \'object\'',        type.toStr({a:"a",b:"b"}),     '{a:"a" b:"b"}' )
test( "[1,2,3] 'array[int]'",            type.toStr([1,2,3]),            '[1,2,3]'       )
test( '["1","2","3"] \'array[string]\'', type.toStr(["1","2","3"]),      '["1","2","3"]' )
test( "null",                            type.toStr(null),               "null"          )
test( "undefined",                       type.toStr(undef),              "undefined"     )
test( "function",                        type.toStr(func),               "function"      )
test( "/x/ 'regexp'",                    type.toStr(/x/),                 "/x/"          )
test( "BigInt(123) no 'n'",              type.toStr(BigInt(123)),         "123"          )
test( 'Symbol("desc")',                  type.toStr(Symbol("desc")),     'Symbol(desc)'  )
test(         'new Date("August 19, 1975 23:15:30")',
  type.toStr( `new Date("August 19, 1975 23:15:30")` ),
  "Tue Aug 19 1975 23:15:30 GMT+0200 (CEST)"  )
test().log( test().summary() ) # Log the all the tests  that began with descripe(...)


