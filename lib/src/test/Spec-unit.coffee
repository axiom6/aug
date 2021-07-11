
import { spec } from "./Spec.js"
import { test } from "./Tester.js"

card    = "?"

expectA = [300, 30, 50]
resultA = [300, 30, 50]
resultE = "Innovate"
resultR = "x"
resultO = {a:"Innovate",b:"Embrace"}


range     = [[0,360],[0,100],[0,100]]
rangeInt    = "| a-z, 0-9, A-Z |"
rangeInt    = "| 0-360, 0-100, 0-100 |"
rangeFlt    = "| 0.0-360.0+0.001, 0.0-100.0+0.001, 0-100+0.001 |"
rangeFlo    = "| 0-360+0.001, 0-100+0.001, 0-100+0.001 |"
rangeFlo    = "| 0-360+0.001, 0-100+0.001, 0-100+0.001 |"

enums     = "|Embrace|Innovate|Encourage|"
regexp    = /x/

rangeTx      = spec.toStr(range)
enumsTx      = "|Embrace|Innovate|Encourage|"
regexpTx     = '/x/'

rangeStr   = "string:#{rangeTx}:1"
enumsStr   = "string:|Embrace|Innovate|Encourage|"
regexpStr  = "string:/x/"

rangeSpec  = { type:"array",  match:range,  card:"1" }
enumsSpec  = { type:"string", match:enums,  card:"1" }
regexpSpec = { type:"string", match:regexp, card:"1" }
objectSpec = { a:enumsSpec, b:enumsSpec }

rangeSpecStr  = spec.toStr(rangeSpec)
enumsSpecStr  = spec.toStr(enumsSpec)
regexpSpecStr = spec.toStr(regexpSpec)
objectSpecStr = spec.toStr(objectSpec)

expects = ["string","int","float","boolean","object","array","regexp","range","enums","amy"]

test().module( "the extended assertion and conversion class libary" ).on(true) # .name("Spec")

test().describe( "-- is... Spec assertions" ).on()
test( "isSpec(#{rangeStr})",              spec.isSpec(rangeStr),         true )
test( "isSpec(#{enumsStr})",              spec.isSpec(enumsStr),         true )
test( "isSpec(#{regexpStr})",             spec.isSpec(regexpStr),        true )
test( "isSpecParse(#{rangeStr})",         spec.isSpecParse(rangeStr),    true )
test( "isSpecParse(#{enumsStr})",         spec.isSpecParse(enumsStr),    true )
test( "isSpecParse(#{rangeStr})",         spec.isSpecParse(regexpStr),   true )
test( "isSpecObject(#{rangeSpecStr})",    spec.isSpecObject(rangeSpec),  true )
test( "isSpecObject(#{enumsSpecStr})",    spec.isSpecObject(enumsSpec),  true )
test( "isSpecObject(#{regexpSpecStr})",   spec.isSpecObject(regexpSpec), true )
test( "isMatch(#{rangeTx})",              spec.isMatch(range),           true )
test( "isMatch(#{enumsTx})",              spec.isMatch(range),           true )
test( "isMatch(#{regexpTx})",             spec.isMatch(regexp),          true )
test( "isRange(#{rangeTx})",              spec.isRange(range),           true )
test( "isEnums(#{enumsTx})",              spec.isEnums(enums),           true )
test( "isRegexp(#{regexpTx})",            spec.isRegexp(regexp),         true )
test( "isResult(#{spec.toStr(resultA)})", spec.isResult(resultA),        true )
test( "isExpect(#{spec.toStr(expectA)})", spec.isExpect(expectA),        true )
test( "isCard(#{"1"})",                   spec.isCard("1"),              true )
test( "isIn(type(#{spec.toStr(resultA)}),'results')", spec.isIn(spec.type(resultA),"results"),  true )
test().log( test().summary() )
  
test().describe( "-- to... Spec conversions" ).op("to").on()
test( "toSpec(#{rangeStr})",            spec.toSpec(rangeStr),         rangeSpec  )
test( "toSpec(#{enumsStr})",            spec.toSpec(enumsStr),         enumsSpec  )
test( "toSpec(#{regexpStr})",           spec.toSpec(regexpStr),        regexpSpec )
test( "toSpecParse(#{rangeStr})",       spec.toSpecParse(rangeStr),    rangeSpec  )
test( "toSpecParse(#{enumsStr})",       spec.toSpecParse(enumsStr),    enumsSpec  )
test( "toSpecParse(#{regexpStr})",      spec.toSpecParse(regexpStr),   regexpSpec )
test( "toSpecObject(#{rangeSpecStr})",  spec.toSpecObject(rangeSpec),  rangeSpec  )
test( "toSpecObject(#{enumsSpecStr})",  spec.toSpecObject(enumsSpec),  enumsSpec  )
test( "toSpecObject(#{regexpSpecStr})", spec.toSpecObject(regexpSpec), regexpSpec )
test( "toRange(#{rangeTx})",            spec.toRange(rangeTx),         range      )
test( "toEnums(#{enumsTx})",            spec.toEnums(enums),           enums      )
test( "toRegexp(#{regexpTx})",          spec.toRegexp(regexpTx),       regexp     )
test( "toMinMax(#{'3-6'})",             spec.toMinMax('3-6'),          [3,6]      )
test( "toIn(#{'expects'})",             spec.toIn('expects'),          expects    )
test( "toSpecInit()",     spec.toSpecInit(), {type:"any",match:"any",card:"1"} )
test().log( test().summary() )

test().describe( "-- in... Spec verify" ).on()
test( "inSpec(#{spec.toStr(resultA)},#{rangeSpecStr})",      spec.inSpec(resultA,rangeSpec),        true )
test( "inSpec(#{resultE},#{enumsSpecStr})",                  spec.inSpec(resultE,enumsSpec),        true )
test( "inSpec(#{resultR},#{regexpSpecStr})",                 spec.inSpec(resultR,regexpSpec),       true )
test( "inSpecArray(#{spec.toStr(resultA)},#{rangeSpecStr})", spec.inSpecArray(resultA,rangeSpec),   true )
test( "inSpecObject(#{resultO},#{objectSpecStr})",           spec.inSpecObject(resultO,objectSpec), true )
test( "inRange(#{spec.toStr(resultA)},#{range})",            spec.inRange(resultA,range),           true )
test( "inEnums(#{resultE},#{enums})",                        spec.inEnums(resultE,enums),           true )
test( "inRegexp(#{resultR},#{regexp})",                      spec.inRegexp(resultR,regexp),         true )
test( "inCard(#{resultA},#{rangeSpecStr})",                  spec.inCard(resultA,rangeSpec),        true )
test().log( test().summary() )

