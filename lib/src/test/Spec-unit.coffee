
import { spec } from "./Spec.js"
import { test } from "./Tester.js"

arg    = ""
oper   = "eq"
type   = "string"
result = ""
expect = ""
range  = ""
enums  = ""
card   = "?"
args   = ""
key    = null
index  = null
tkey   = ""
results = [300, 30, 50]
range   = [360.100,100]
rangeStr = "string:[360.100,100]:1"

enumStr   = "Embrace|Innovate|Encourage"
enums     = ["Embrace","Innovate","Encourage"]
specObj   = { type:"string", oper:"range", expect:"string:[360.100,100]:1", card:"1", spec:""  }
rangeSpec = { type:"array",  oper:"range", expect:"string:[360.100,100]:1", card:"1", spec:""  }
enumsSpec = { type:"string", oper:"enums", expect:"#{enums}:1",             card:"1", spec:""  }
specStr   = spec.toStr(specObj)

test().module( "the extended assertion and conversion class libary" ).on(true)
                                                                                    
test().describe( "Initial run through" ).on()
test( "isEnums(#{enumStr},#{oper},#{type})", spec.isEnums(enumStr,oper,type),     true    )
test( "verifySpec(#{specObj})",              spec.verifySpec(specObj),            specObj )
test( "isResult(#{result})",                 spec.isResult(result),               true    )
test( "isExpect(#{expect})",                 spec.isExpect(expect),               true    )
test( "isOper('eq')",                        spec.isOper(oper),                   true    )
test( "isCard('?')",                         spec.isCard(card),                   true    )
test( "isSpec(#{rangeStr})",                 spec.isSpec(rangeStr),               true    )
test( "toSpec(#{rangeStr})",                 spec.toSpec(rangeStr),               specObj )
test( "isSpecParse(#{rangeStr})",            spec.isSpecParse(rangeStr,),         true    )
test( "toSpecParse(#{rangeStr})",            spec.toSpecParse(rangeStr,"string"), specObj )
test( "isSpecObject(#{specStr})",            spec.isSpecObject(specObj),          true    )
test( "toSpecObject(#{specStr},#{specStr})", spec.toSpecObject(specObj,specObj),  specObj )
test( "isSpecValue('string')",               spec.isSpecValue("string"),           true   )
test( "inArrayRange(#{results},#{range})",   spec.inArrayRange(results,range),     true   )
test( "toEnums(#{enumStr})",                 spec.toEnums(enumStr),                enums  )
test( "rangeType(#{range})",                 spec.rangeType(range),               "range" )
test( "isRange(#{range})",                   spec.isRange(range),                  true   )
test( "isIn('range','ranges')",              spec.isIn("range","ranges"),          true   )
test( "toSpecValue(#{specStr},#{rangeStr},#{type})", spec.toSpecValue(specObj,rangeStr,type),      specObj   )
test().log( test().summary() )  # Not needed because