
import Type from "./Type.js"

class Spec extends Type

  constructor:() ->
    super()

  # -- is... Spec assertions

  isSpec:( arg ) ->
    type = @toType(arg)
    switch type
      when "string"
        @isSpecParse(  arg )
      when "object"
         if @isSpecObject( arg )
           true
         else
           pass = true
           pass = pass and @isSpec(val) for own key, val of arg
           pass
      when "array"
        pass = true
        pass = pass and @isSpec(val)  for val in arg
        pass
      else
        false

  isSpecParse:(   arg ) ->
    type = @toType( arg )
    @isDef(arg) and type isnt("object") and ( type is "regexp" or ( type is "string" and arg.includes(":") ) )

  isSpecObject: ( arg ) ->
    @isObject(arg) and @isIn(arg.type,"results") and arg.match? and @isMatch(arg.match) and arg.card? and @isCard(arg.card)

  isMatch:( match ) ->
    switch
      when @isRegexp(match) then true
      when  @isEnums(match) then true
      when  @isRange(match) then true
      else  false

  # let re = /ab+c/i; // literal notation
  # let re = new RegExp('ab+c', 'i') // constructor with string pattern as first argument
  # let re = new RegExp(/ab+c/, 'i') // constructor with regular express
  isRegexp:( arg  ) ->
    @isType(arg,"regexp")

  # Asserts range with for types "string" or "int" or "float"
  # internal functions verify an array of type "string" or "int" or "float"
  #   is an array of type "string" or "int" or "float"
  # rangeStr    = "| a-z, 0-9, A-Z |"
  # rangeRgb    = "| 0-255 |"
  # rangeHsv    = "| 0-360, 0-100, 0-100 |"
  # rangeFlt    = "| 0-360+0.001, 0-100+0.001, 0-100+0.001 |"
  isRange:(range)  ->
    return @isRanges(@toRanges(range)) if range.includes(",")
    a = @toRangeArray(range)
    isStrRange    = (a) -> a.length is 2 and a[0]      <= a[1]       # Foa 'staing'
    isIntRange    = (a) -> a.length is 2 and a[0]      <= a[1]       # Foa 'int'
    isFloatRange  = (a) -> a.length is 3 and a[0]-a[2] <= a[1]+a[2]  # Foa 'float' a[2] is tol
    switch @toType(a[0])
      when 'string' then isStrRange(a)
      when 'int'    then isIntRange(a)
      when 'float'  then isFloatRange(a)
      else               false

  isRanges:(ranges) ->
    pass = true
    pass = pass and @isRange(range) for range in ranges
    pass

  # Moved to Type.coffee
  isEnums:( arg ) ->
    super.isEnums(arg)

  isResult:( result ) ->
    type =  @toType(result)
    @isDef(result) and @isIn( type, "results" )

  isExpect:( expect ) ->
    type =  @toType(expect)
    @isDef(expect) and @isIn( type, "expects" )

  # -- to... Spec conversions

  toSpec:( arg ) ->
    switch
      when @isSpecParse(  arg )
           @toSpecParse(  arg )
      when @isSpecObject( arg )
           @toSpecObject( arg )
      when      @isArray( arg )
        array = []
        array.push(@toSpec(val)) for val in arg
        array
      when     @isObject( arg )
        obj = {}
        obj[key] = @toSpec(val) for own key, val of arg
        obj
      else @toSpecInit()  # @toSpecInit() creates a do nothing spec

  # toSpecParse:( spec, arg )
  # Examples
  #   "array:[0,255]" }      { type:"array",   oper:"range", match:[0,255],         card="1" }
  #   "string:James"         { type:"string",  oper:"eq",    match:James,           card="1" }
  #   "string:a|b|c"         { type:"string",  oper:"enums", match:"a|b|c",         card="1" }
  #   "int:[0,100]"          { type:"int",     oper:"range", match:[0,100],         card="1" }
  #   "float:[0.0,100.0,1.0] { type:"float",   oper:"range", match:[0.0,100.0,1.0], card="1" }
  #   "string:["","zzz"]     { type:"string",  oper:"range", match:["","zzz"],      card="1" }
  #   "boolean"              { type:"boolean", oper:"any",   match:"any",           card="1" }
  #   "object:{r:[0,255],g:[0,255],b:[0,255]}
  #     { type:"object", oper:"range", match:{r:[0,255],g:[0,255],b:[0,255]}, card="1" }
  #  "array:[[0,360],[0,100],[0,100]]:?"
  #     { type:"array",  oper:"range", match:[[0,360],[0,100],[0,100]], card="?" }
  toSpecParse:( arg ) ->
    spec   = @toSpecInit()
    splits = arg.split(":")
    length = splits.length
    if length >= 1  then spec.type = splits[0]  # type
    if length >= 1                              # match
      type = @toType(splits[1])
      spec.match = switch type
        when "regexp"  then  "regexp"           # regex
        when "string"
          switch
            when splits[1].includes("|")             then @toEnums(  splits[1] )  # enums
            when @isEnclosed( "[", splits[1], "]" )  then @toArray(  splits[1] )  # range
            when @isEnclosed( "{", splits[1], "}" )  then @toObject( splits[1] )  # object?
            else  "any"
        else "any"
    if length >= 2 then spec.card = splits[2]  # card i.e cardinaliry
    spec

  toSpecObject:( arg ) ->
    spec       = @toSpecInit()
    spec.type  = if arg.type?  then arg.type  else "any"
    spec.match = if arg.match? then arg.match else "any"
    spec.card  = if arg.card?  then arg.card  else  "1"  # required
    spec

  toSpecInit:() ->
    { type:"any", match:"any", card:"1" }

  toRange:( arg ) ->
     if @isType(arg,"range") then arg else "any"

  toRanges:(range) ->
    range = @strip( range, "|", "|")
    range = range.replaceAll( " ", "" ) # remove white space
    range.split(",")

  # |a-z| |0-100|  |0-100+0.001|
  toRangeArray:( range ) ->
    a      = []
    range  = @strip( range, "|", "|")
    range  = range.replaceAll( " ", "" )  # remove white space
    splits = range.split("-")
    # Append the optional 3rd parameter tolerance for 'float' ranges
    if splits.length is 2 and splits[1].includes("+")
      splits2   = splits[1].split("+")
      splits[1] = splits2[0]
      splits.push(splits2[1])
    switch @toType(splits[0])
      when "string" and splits.length is 2     # 'string'
        a.push(splits[0])
        a.push(splits[1])
      when "int"    and splits.length is 2     # 'int'
        a.push(@toInt(splits[0]))
        a.push(@toInt(splits[1]))
      when "float"  and splits.length is 3     # 'float'
        a.push(@toFloat(splits[0]))
        a.push(@toFloat(splits[1]))
        a.push(@toFloat(splits[2]))
      else
        a

  # Moved to Type.coffee
  toEnums:( arg ) ->
    super.toEnums(arg)

  # Arg types must be 'regexp' or 'string', otherwise returns 'any'
  toRegexp:( arg ) ->
    switch @toType(arg)
      when "regexp" then arg
      when "string" then new RegExp(arg)
      else "any"

# -- in... Spec matches

  inSpec:( result, spec ) =>
    return false if @isNot(spec) or not ( @isSpec(spec) and @toType(result) is spec.type and @inCard(result,spec) )
    match = spec.match
    switch
      when  @isArray(result) and  @isArray(spec) then @inSpecArray(  result, spec  )
      when @isObject(result) and @isObject(spec) then @inSpecObject( result, spec  )
      when @isRange(  match )                    then @isRange(      result, match )
      when @isEnums(  match )                    then @isEnums(      result, match )
      when @isRegexp( match )                    then @isRegexp(     result, match )
      else false

  # Here only minimum length of spec and result are checked
  inSpecArray:( result, spec ) ->
    pass = true
    min  = Math.min( result.length, spec.length )
    pass = pass and @inSpec(result[i],spec[i]) for i in [0...min]
    pass

  # Here only the keys common to both spec and result are checked
  inSpecObject:( result, spec ) ->
    pass = true
    for own key, val of spec when result[key]?  
      pass = pass and @inSpec(result[key],spec[key])
    pass

  # Determine if a result is bounded witnin a range.
  # This method is here in Tester because it call @examine()
  inRange:( result, range ) ->
    return  @inRanges(result,@toRanges(range)) if range.includes(",")
    return false if not @isType(range) # @isRange(range)
    a = @toRangeArray(range) # Convers the range to an array
    inStrRange   = ( string, a ) -> a[0]      <= string and string <= a[1]
    inIntRange   = ( int,    a ) -> a[0]      <= int    and int    <= a[1]
    inFloatRange = ( float,  a ) -> a[0]-a[2] <= float  and float  <= a[1]+a[2]
    switch @toType(result)
      when "string" then inStrRange(   result, a )
      when "int"    then inIntRange(   result, a )
      when "float"  then inFloatRange( result, a )
      else false

  # Ony apply the ranges we have are applied
  # if ranges is just a single range applied then it is applied to each result
  inRanges:( results, ranges ) ->
    pass = true
    switch
      when  @isArray(results) and @isArray(ranges)
        min  = Math.min( results.length, ranges.length ) # Ony apply the ranges we ga
        pass = pass and @inRange(results[i],ranges[i]) for i in [0...min]
      when  @isArray(results)
        pass = pass and @inRange(results,ranges) for result in results
      else
        pass = false
    pass

  # Determine if a result is enumerated.
  # inEnums:( result, enums ) ->
  #   super.toEnums( result, enums )

  inRegexp:( result, regexp ) ->
    return false if not @isRegexp(regexp)
    regexp = @toRegexp( regexp )
    regexp.test(result)

  isCard:( card ) ->
    @isStr(card) and ( @isType(card,"int") or card.includes(":") or @isIn(card,"cards") )

  # ... more to come for checking cardinallity
  inCard:( result, spec ) ->
    card = spec.card
    switch
      when @isType(card,"int")     then true
      when @isStr(card) and card.includes("-")
        minMax = @toMinMax(card)
        num = minMax[0] # Dummy number
        minMax[0] <= num <= minMax[1]
      else switch card
        when "1" then true
        when "?" then true
        when "*" then true
        when "+" then true
        else          false

  toMinMax:( card ) ->
    splits = card.split(":")
    min    = @toInt(splits[0])
    max    = @toInt(splits[1])
    [min,max]

export spec = new Spec() # Export a singleton instence of type
export default Spec