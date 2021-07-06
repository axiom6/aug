
import Type from "./Type.js"

class Spec extends Type

  constructor:() ->
    super()

  isEnums:( arg, oper, type ) ->
    oper is "enums" and @isArray(arg,type) and @isResultType(type)

  # Check if an arg like expect is a 'spec'
  verifySpec:( arg ) ->
    @conditions( @isObject(arg), @isResultType(arg.type), @isSpec(arg.expect,arg.oper), @isCard(arg.card) )

  isResultType:( type ) ->
    pass = @isDef(type) and @isIn( type,    "results" )
    @isWarn( pass, "Not a Result", type, Type.results, (t) -> t.log( t.warn() ) )

  isExpectType:( type ) ->
    pass = @isDef(type) and @isIn( type, "expects"      )
    @isWarn( pass, "Not a Expect", type, Spec.expects, (t) -> t.log( t.warn() ) )

  isOper:( oper ) ->
    pass = @isDef(oper) and  @isIn( oper, "opers" )
    @isWarn( pass, "Not an 'oper'", oper, "opers", (t) -> t.log( t.warn() ) )

  isCard:( card ) ->
    pass = @isDef(card) and @isIn( card, "cards" )
    @isWarn( pass, "Not a 'card'", card, Spec.cards, (t) -> t.log( t.warn() ) )

  # This approach insures that all conditions are checked and messages sent
  #   then all arg returns are anded together to determine a final pass or fail
  conditions:( args... ) ->
    pass = true
    pass = pass and arg for arg in args
    pass

  isSpec:( expect ) ->
    type    = @type(expect)
    isParse = @isSpecParse(  expect, type )
    isObj   = @isSpecObject( expect, type )
    console.log( "isSpec(expect)", { expect:expect, type:type, isParse:isParse, isObj:isObj }) if @debug
    isParse or isObj

  # In the first t
  toSpec:( expect ) ->
    type   = @type(expect)
    spec = { type:"any", oper:"any", expect:"any", card:"1", spec:""  }
    spec = switch
      when @isSpecParse(  expect, type ) then @toSpecParse(  spec, expect )
      when @isSpecObject( expect, type ) then @toSpecObject( spec, expect )
      else @toWarn( "toSpec(expect)", "expect not spec 'string' or 'object'"
      , expect, type, "spec", spec, (t) -> t.log( t.warn() ) )

  isSpecParse:  ( arg, type ) ->
    type is "string" and arg.includes(":")

  # toSpecParse:( spec, arg )
  # Examples
  #   "array:[0,255]" }      { type:"array",   oper:"range", check:[0,255],         card="1" }
  #   "string:James"         { type:"string",  oper:"eq",    check:James,           card="1" }
  #   "string:a|b|c"         { type:"string",  oper:"enums", check:"a|b|c",         card="1" }
  #   "int:[0,100]"          { type:"int",     oper:"range", check:[0,100],         card="1" }
  #   "float:[0.0,100.0,1.0] { type:"float",   oper:"range", check:[0.0,100.0,1.0], card="1" }
  #   "string:["","zzz"]     { type:"string",  oper:"range", check:["","zzz"],      card="1" }
  #   "boolean"              { type:"boolean", oper:"any",   check:"any",           card="1" }
  #   "object:{r:[0,255],g:[0,255],b:[0,255]}
  #     { type:"object", oper:"range", range:{r:[0,255],g:[0,255],b:[0,255]}, card="1" }
  #  "array:[[0,360],[0,100],[0,100]]:?"
  #     { type:"array",  oper:"range", range:[[0,360],[0,100],[0,100]], card="?" }
  toSpecParse:( spec, arg ) ->
    splits = arg.split(":")
    length = splits.length
    if length >= 1                                        # type
      spec.type = splits[0]
    if length >= 1                                        # expect
      spec.spec = splits[1]
      if splits[1].includes("|")                         #   enum
        spec.oper   = "enums"
        spec.expect = @toEnums( splits[1] )
      else if @isStrEnclosed( "[", splits[1], "]" )  #    range array
        spec.oper   = "range"
        spec.expect = @toArray( splits[1] )
    else if @isStrEnclosed( "{", splits[1], "}" )   #    range object
      spec.oper   = "range"
      spec.expect = @toObject( splits[1] )
    else
      spec.oper   = "any"
      spec.expect = "any"
    if length >= 2                                        # card i.e cardinaliry
      spec.oper = splits[2]
    spec

  isSpecObject: ( arg, type ) ->
    type is "object" and arg.oper? and arg.expect? # and arg.type? and arg.card?

  toSpecObject:( spec, arg ) ->
    spec.type   = if arg.type?   then arg.type  else "any"
    spec.oper   = if arg.oper?   then arg.oper  else "any"
    spec.expect = if arg.expect? then arg.expect else "any"
    spec.card   = if arg.card?   then arg.card  else  "1"  # required
    spec.spec   = if arg.spec?   then arg.spec  else  ""   # required
    spec

  isSpecValue:  ( type )  ->
    @isIn( type, "results" )

  # Holding off on this conversion. Instead we will just return an expect value
  toSpecValue:( spec, arg, type ) ->
    spec.type   = type
    spec.oper   = "eq"
    spec.expect = arg
    spec.card   = "1"  # required
    spec.spec   = ""
    spec

  inEnums:(   result, spec, status, level=0, key=null, index=null ) ->
    @noop( level )
    enums = spec.expect
    pass  = @inArray( result, enums )
    @examine( pass, result, spec, status, "inEnums(...)", key, index )

  inRange:( result, spec, status, level, key, index ) ->
    range = spec.expect
    pass  = @isRange(range)
    type = @type(result)

    inStrRange    = ( string, range ) -> range[0]          <= string and string <= range[1]
    inIntRange    = ( int,    range ) -> range[0]          <= int    and int    <= range[1]
    inFloatRange  = ( float,  range ) -> range[0]-range[2] <= float  and float  <= range[1]+range[2]
    pass = switch type
      when "string" then inStrRange(    result, range )
      when "int"    then inIntRange(    result, range )
      when "float"  then inFloatRange(  result, range )
      when "array"  then @inArrayRange( result, range )
      when "object" then @objectsEq(    result, range, status, level )
      else @toWarn( "inRange()", "unknown range type", result, type, false, (t) -> t.log( t.warn() ) )
    @examine( pass, result, spec, status, "inRange(...)", key, index )

  # Camnot is @arraysEq(...) because a single ramge can be applied to all resuls in a result array
  inArrayRange:( result, range ) ->
    pass    = true
    type    = @type(result)
    nResult = result.length
    nRange  = range.length
    if nRange  is 1
      for i in [0...nResult] when @isArray(result[i])
        pass = pass and @inMyRange( result[i], range )
    else if nResult > nRange
      text = "not enough range tests #{nRange} for result so only will be #{nRange} tests on result"
      pass = @toWarn( "inRange()", text, result, type, false, (t) -> t.log( t.warn() ) )
    else if nResult < nRange
      text = "OK with more range bounds #{nRange} than needed for result #{nResult}"
      pass = @toWarn( "inRange()", result, text, type, true, (t) -> t.log( t.warn() ) )
      min = Math.min( nResult, nRange )
      for i in [0...min] when @isArray(result[i]) and @isArray(range[i])
        pass = pass and @inMyRange( result[i], range[i] )
    pass

  toEnums:( arg ) ->
    enums = []
    type  = type = @type(arg)
    switch type
      when "string" and arg.includes("|")
        splits = arg.split("|")
        for split in splits
          enums.push( split )
      when "array"
        enums = arg
      else
        enums = @toWarn( "toEnums(arg)", "unable to convert", arg, "enums", [], (t) -> t.log( t.warn() ) )
    enums

  rangeType:( range ) ->
    type = if range.length > 0 then @type(range[0]) else "null"
    if @isIn( type, "ranges" )
      if @isArray(range,type) then type else "mixed"
    else if type is "array"
      @rangeType(range[0])

  # -- Range Methods --

  # Asserts range with for types "string" or "int" or "float"
  isRange:(range)  ->

    # internal functions called after @rangeType(range) has verified that range
    #   is an array of type "string" or "int" or "float"
    isStrRamge = (r) -> r.length is 2 and r[0]      <= r[1]       # For 'string'
    isIntRange    = (r) -> r.length is 2 and r[0]      <= r[1]       # For 'int'
    isFloatRange  = (r) -> r.length is 3 and r[0]-r[2] <= r[1]+r[2]  # For 'float' r[2] is tol
    isArrayRange  = (r) ->
      pass = true
      for e in r
        pass = pass and @isRange(e)
      pass

    # @rangeType(...) checks array existence and asserts type with @isArray(range,type)
    type = @rangeType(range)

    switch type
      when 'string' then isStrRamge(range)
      when 'int'    then isIntRange(range)
      when 'float'  then isFloatRange(range)
      when 'array'  then isArrayRange(range)
      else  @toWarn( "isRange(range)", "not a range type", range, "", false, (t) -> t.log( t.warn() ) )

  # Override type.isIn() with addional Tester type arrays
  isIn:( type, key ) ->
    if      Type[key]? then Type[key].includes(type)     # Only reason for importing Type
    else if Spec[key]? then Spec[key].includes(type)
    else @isWarn( false, "key #{key} missing for", type, [], (t) -> t.log( t.warn() ) )

Spec.specs   = ["range","enums"]               # high level spec   based comparision specs
Spec.opers   = ["eq","le","lt","ge","gt","ne"] # low  level value  based comparison  ooers 'eq' default
Spec.cards   = ["n","?","*","+","min to max"]  # cards  1 required, ? optional, * 0 to many, + 1 to many, m:m range

export spec = new Spec() # Export a singleton instence of type
export default Spec