
import { spec } from "./Spec.js"
import { test } from "./Tester.js"

arg    = ""
oper   = "eq"
type   = ""
result = ""
expect = ""
range  = ""
enums  = ""
card   = "?"
args   = ""
key    = null
index  = null
tkey   = ""
resultArray = [300, 30, 50]
range       = [360.100,100]
specStr = "string:[360.100,100]:1"

enumStr   = "Embrace|Innovate|Encourage"
enums     = ["Embrace","Innovate","Encourage"]
specObj   = { type:"string", oper:"range", expect:"string:[360.100,100]:1", card:"1", spec:""  }
rangeSpec = { type:"array",  oper:"range", expect:"string:[360.100,100]:1", card:"1", spec:""  }
enumsSpec = { type:"string", oper:"enums", expect:"#{enums}:1",             card:"1", spec:""  }

test().module( "Spec","The extended assertion and conversion class libary" )

test().describe( "", "Initial run through of 19 tests" )
test( "isEnums(arg,oper,type)",     spec.isEnums(enumStr,oper,type),     true    )
test( "verifySpec(arg)",            spec.verifySpec(specObj),           specObj  )  # Also test @conditions(...)
test( "isResultType(type)",         spec.isResultType("string"),         true    )
test( "isExpectType(type)",         spec.isExpectType("string"),         true    )
test( "isOper(oper)",               spec.isOper(oper),                   true    )
test( "isCard(card)",               spec.isCard(card),                   true    )
test( "isSpec(expect)",             spec.isSpec(specStr),                true    )
test( "toSpec(expect)",             spec.toSpec(specStr),                specObj )
test( "isSpecParse(arg,type)",      spec.isSpecParse(specStr,"string"),  true    )
test( "toSpecParse(spec,arg)",      spec.toSpecParse(specStr,"string"),  specObj )
test( "isSpecObject (arg,type)",    spec.isSpecObject(specObj,"object"), true    )
test( "toSpecObject(spec,arg)",     spec.toSpecObject(specObj,specObj),  specObj )
test( "isSpecValue(type)",          spec.isSpecValue("string"),           true   )
test( "inArrayRange(result,range)", spec.inArrayRange(resultArray,range), true   )
test( "toEnums(arg)",               spec.toEnums(enumStr),                enums  )
test( "rangeType(range)",           spec.rangeType(range),               "range" )
test( "isRange(range)",             spec.isRange(range),                  true   )
test( "isIn(type,tkey)",            spec.isIn("range","ranges"),          true   )
test( "toSpecValue(spec,arg,type)", spec.toSpecValue(spec,arg,type),      true   )

test().log( test().summary("Spec") )