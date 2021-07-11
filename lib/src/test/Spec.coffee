
import Type from "./Type.js"

class Spec extends Type

  constructor:() ->
    super()

  # -- is... Spec assertions

  isSpec:( arg ) ->
    type = @type(arg)
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
    type = @type( arg )
    @isDef(arg) and type isnt("object") and ( type is "regexp" or ( type is "string" and arg.includes(":") ) )

  isSpecObject: ( arg ) ->
    @conditions( @isObject(arg), @isIn(arg.type,"results"), @isMatch(arg.match), @isCard(arg.card) )

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
  isRange:(range)  ->
    return false                if not  @isArray(range)
    return @isRangeArray(range) if @isArrayTyped(range,'array')
    isStrRange    = (r) -> r.length is 2 and r[0]      <= r[1]       # For 'string'
    isIntRange    = (r) -> r.length is 2 and r[0]      <= r[1]       # For 'int'
    isFloatRange  = (r) -> r.length is 3 and r[0]-r[2] <= r[1]+r[2]  # For 'float' r[2] is tol
    switch @type(range[0])
      when 'string' then isStrRange(range)
      when 'int'    then isIntRange(range)
      when 'float'  then isFloatRange(range)
      else               false

  isRangeArray:(ranges) ->
    pass = true
    pass = pass and @isRange(range) for range in ranges
    pass

  # Moved to Type.coffee
  isEnums:( arg ) ->
    super.isEnums(arg)

  isResult:( result ) ->
    type =  @type(result)
    @isDef(result) and @isIn( type, "results" )

  isExpect:( expect ) ->
    type =  @type(expect)
    @isDef(expect) and @isIn( type, "expects" )

  # This approach insures that all conditions are checked and messages sent
  #   then all arg returns are anded together to determine a final pass or fail
  conditions:( args... ) ->
    pass = true
    pass = pass and arg for arg in args
    pass

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
      type = @type(splits[1])
      spec.match = switch type
        when "regexp"  then  "regexp"           # regex
        when "string"
          switch
            when splits[1].includes("|")                then @toEnums(  splits[1] )  # enums
            when @isStrEnclosed( "[", splits[1], "]" )  then @toArray(  splits[1] )  # range
            when @isStrEnclosed( "{", splits[1], "}" )  then @toObject( splits[1] )  # object?
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
    switch @type(arg)
      when "array"  then arg
      when "string" then @toArray(arg)
      else "any"

  # Moved to Type.coffee
  toEnums:( arg ) ->
    super.toEnums(arg)

  # Arg types must be 'regexp' or 'string', otherwise returns 'any'
  toRegexp:( arg ) ->
    switch @type(arg)
      when "regexp" then arg
      when "string" then new RegExp(arg)
      else "any"

# -- in... Spec matches

  inSpec:( result, spec ) =>
    return false if not ( @isSpec(spec) and @type(result) is spec.type and @inCard(result,spec) )
    match = spec.match
    switch
      when  @isArray(result) and  @isArray(spec) then  @inSpecArray( result, spec  )
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
    return false if not  @isRange(range)
    return @inRangeArray(result,range) if @isArrayTyped(range,'array')
    range = @toRange(range) # Convers the 'string' represention of range if necessary
    inStrRange   = ( string, range ) -> range[0]          <= string and string <= range[1]
    inIntRange   = ( int,    range ) -> range[0]          <= int    and int    <= range[1]
    inFloatRange = ( float,  range ) -> range[0]-range[2] <= float  and float  <= range[1]+range[2]
    switch @type(result)
      when "string" then inStrRange(     result, range )
      when "int"    then inIntRange(     result, range )
      when "float"  then inFloatRange(   result, range )
      else false

  inRangeArray:( results, ranges ) ->
    return false if not @isArrayTyped(results,'array')
    pass = true
    min  = Math.min( results.length, ranges.length )
    pass = pass and @inRange(results[i],ranges[i]) for i in [0...min]
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

  # Override Type.isIn() with addional Spec type arrays
  isIn:( type, arg ) ->
    switch
     when @isArray(arg) then @inArray( type, arg )
     when @isEnums(arg) then @inArray( type, @toEnums(arg) )
     when @isStr(arg)   then @toIn(arg).includes(type)
     else @isWarn( false, "arg #{arg} not 'array', 'enums' or 'string'", type, false )

  # Override Type.isIn() with addional Spec type arrays
  toIn:( arg ) ->
    switch
      when  not  arg? then []
      when Type[arg]? then Type[arg]
      when Spec[arg]? then Spec[arg]
      else []

Spec.matches = ["range","enums","regexp"]           # high level matches
Spec.opers   = ["to","eq","le","lt","ge","gt","ne"] # low  level value  based comparison  ooers 'eq' default
Spec.cards   = ["1","?","*","+"]  # cards  1 required, ? optional, * 0 to many, + 1 to many

export spec = new Spec() # Export a singleton instence of type
export default Spec