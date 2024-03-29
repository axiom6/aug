
class Type
  
  comstructor:() ->
    @warned  = ""
    @lasted  = ""
    @logging = true
    @debug   = false
    @log     = console.log
    @error   = console.error

  # An improved typeof() that follows the convention by returning types in lower case by default.
  # The 15 types similar to typeof() returned are:
  # "|string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date"
  toType:(arg,lowerCase=true) ->
    str = Object::toString.call(arg)
    tok = str.split(' ')[1]
    typ = tok.substring(0,tok.length-1)
    typ = @toMoreTypes( typ, arg )
    if lowerCase then typ.toLowerCase() else typ

  # Detects and converts to 'Int' "Float' 'Range' 'Enums' types
  toMoreTypes:( typ, arg ) ->
    switch
      when typ is "Number"
        if Number.isInteger(arg) then "Int"   else "Float"
      when typ is "String" and @isEnclosed("|",arg,"|")        # @isEnclosed("|",arg,"|") avoids infinite recursion
        if arg.includes("-")     then "Range" else "Enums"
      else
        typ

  # A more detailrf type that returns basic types, class, object and function name in upper case
  toKlass:(arg) ->
    typ = @toType(arg,false) # Start with basic type to catch "Null" and "Undefined"
    switch typ
      when "Null"      then "Null"
      when "Undefined" then "Undefined"
      when "Function"  then arg.name
      when "Object"    then arg.constructor.name
      else                  typ
    
  # The 9 fundamental type Assertions that leverage @toType(arg) the improved typeof(arg)
  # In addition isInt isFloat isBoolean isArray isObject can optionally chech strings
  isStr:(s)      ->   @isType(s,"string") and s.length > 0 and s isnt "none"
  isInt:(i)      -> ( @isType(i,"int")   and not isNaN(i) ) or ( @isType(i,"string") and @isStrInt(i)     )
  isFloat:(f)    -> ( @isType(f,"float") and not isNaN(f) ) or ( @isType(f,"string") and @isStrFloat(f)   )
  isBoolean:(b)  ->   @isType(b,"boolean")                  or ( @isType(b,"string") and @isStrBoolean(b) )
  isArray:(a)    -> ( @isType(a,"array") and a.length > 0 ) or ( @isType(a,"string") and @isStrArray(a)   )
  isObject:(o)   ->   @isType(o,"object")                   or ( @isType(o,"string") and @isStrObject(o)  )
  isRegexp:(r)   ->   @isType(r,"regexp")
  isFunction:(f) ->   @isType(f,"function")
  isNull:(m)     ->   @isType(m,"null")
  isUndef:(u)    ->   @isType(u,"undefined")
  isNone:(s)     ->   @isType(s,"string") and s is "none"
  isBigInt:(b)   ->   typeof(b) is "bigint" # Will incorporate into type
  isSymbol:(s)   ->   typeof(s) is "symbol" # Will incorporate into type

  # General purpose since if checks the array's existence and interate over all the elements
  isArrayTyped:(a,t) ->
    return false if not @isArray(a)
    for e in a
      return false if @toType(e) isnt t
    true

  # General purpose since if checks the array's existence and interate over all the elements
  isArrayMixed:(a) ->
    return false if not @isArray(a)
    type = @toType(a[0])
    for e in a
      return true if @toType(e) isnt type
    false

  # Aggregate and special value assertions
  #   For now ww treat 'none' as a defined type
  isType:(v,t)      ->   @toType(v) is t
  isDef:(d)         ->   not @isIn( @toType(d), "undefs"  )
  isNumber:(n)      ->   @isIn( @toType(n), "numbers" )
  isNot:(d)         ->   not @isDef(d)
  isNaN:(n)         ->   Number.isNaN(n) # @isNumber(n) and

  # Containment assertions where args are always ( value, container )
  inStr:(e,s)     ->  @isStr(s)    and @isDef(e) and s.includes(e)
  inArray:( e,a)  ->  @isArray(a)  and @isDef(e) and a.includes(e)
  inObject:(k,o)  ->  @isObject(o) and @isDef(o[k]) and o.hasOwnProperty(k)

  # -- More assertions --

  # Checks for offical child key which starts with capital letter and isnt an _ or $
  isChild: (key) ->
    a = key.charAt(0)
    b = key.charAt(key.length - 1)
    a is a.toUpperCase() and a isnt "$" and b isnt "_"

  # Check if an object or array or string is empty
  isEmpty:(e) ->
    return false if @isNot(e)
    switch @isType(e)
      when "object" then Object.getOwnPropertyNames(e).length is 0
      when "array"  then e.length is 0
      when "string" then e.length is 0
      else               false  # Look into

  isStrInt:( str ) ->
    if @isStr( str )
      regexp = /^-?\d+$/
      regexp.test(str)
    else false

  isStrFloat:( str ) ->
    if @isStr( str )
       regexp = /^-?\d+(?:[.,]\d*?)?$/
       regexp.test(str)
    else false

  isStrBoolean:( str ) ->
    @isStr(str) and ( str is "true" or str is "false" )

  isStrArray:( str ) ->
    @isEnclosed( "[", str, "]" )

  isStrObject:( str ) ->
    @isEnclosed( "{", str, "}" )

  # A coerced conversion that can return a value of 'none'
  # |string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date
  # Still need |regexp|null|undefined|function|bigint|symbol|date|
  toConvert:( arg, type ) ->
    switch type
      when "string","enums","range" then @toStr(arg)
      when "int"     then @toInt(     arg )
      when "float"   then @toFloat(   arg )
      when "boolean" then @toBoolean( arg )
      when "array"   then @toArray(   arg )
      when "object"  then @toObject(  arg )
      else
        @log( "Type.toConvert(arg,type)", { arg:arg, type:type } )
        "none"

    ###
    obj = @toObject(  arg )
    if not @isType(obj,"object")
      console.log( "Test.toConvert(arg,type)", { arg:arg, obj:obj, type:type } )
    ###

  # A value conversion from a 'string' that can return a value of 'none'
  # |string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date
  # Still need |regexp|null|undefined|function|bigint|symbol|date
  toValue:( str, encloseValue=false ) ->
    if not  @isStr(str)
      val = @toStr(str, 0, encloseValue )
      @log( "Type.toValue(str) nots", { str:str, val:val, type:@toType(str) } ) if @debug
      return val
    val = switch
      when @isStrInt(str)     then @toInt(str)
      when @isStrFloat(str)   then @toFloat(str)
      when @isStrBoolean(str) then @toBoolean(str)
      when @isStrArray(str)   then @toArray(str)
      when @isStrObject(str)  then @toObject(str)
      when @isStr(str)        then str     # Also gets 'enums' 'range'
      else
        @log( "Type.toValue(str) else", { str:str, type:@toType(str) } ) if @debug
        "none"
    console.log( "Type.toValue(str) retn", { str:str, val:val, type:@toType(str) } ) if @debug
    val

  inside:(  str ) ->
    @slice( str, 2, str.length-1 )

  # First onvert \' to \" then cnclose an arg in single quotes when double quotes are inside
  toSingleQuote:( arg ) ->
    str = if not @isStr(arg) then @toStr(arg,0,true) else arg
    str = if str.includes("'") then str.replaceAll("'",'"') else str  # Needs to be more precise
    has = str.includes('"')
    str = if has then @toEnclose( "'", str, "'" ) else str
    console.log( "Type.toSingleQuote(arg)", { arg:arg, str:str, has:has } ) if @debug
    str

  # Can't assert @isStr(str) because of possible infinite recursion
  #  isEnclose can not determine if a final string has been wrapped with " or '
  isEnclosed:( beg, str, end ) ->
    str.charAt(0) is beg and str.charAt(str.length-1) is end

  # toEnclose a "string'
  # toEnclose("abc",   '"'  )       # returns "abc" - ? good for JSON keys and values
  # toEnclose("123",   "'"  )       # returns '123'
  # toEnclose("xyz",   "()" )       # returns (xyz)
  # toEnclose("d,e,f", "[]" )       # returns [d,e,f]
  # toEnclose("a:x,b:y,c:z", "{}" ) # returns {a:x,b:y,c:z}
  toEnclose:( beg, str, end ) ->
    switch
      when @isEnclosed( beg, str, end ) then str   # avoids enclosing twice
      else """#{beg}#{str}#{end}"""

# toStr(arg) avoids conflicts with arg.toString()
  #  returns "none" if unsuccesful
  # This combination of travesal and recursion is cleaner than JSON.stringify()
  # A super set of typeof with far all vaild 15 types detected by @toType() plus 'none' and 'any'
  # "|string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date|any|none|"
  toStr:( arg, level=0, encloseValue=false, encloseKey=false ) ->
    type = @toType(arg)
    str = switch type
      when "string","enums","range","any"
        if encloseValue then @toEnclose('"',arg,'"') else arg # will not enclose more than once
      when "int"        then parseInt(arg)
      when "float"      then parseFloat(arg)
      when "boolean"    then if arg then "true" else "false"
      when "array"      then @toStrArray(  arg, level, encloseValue )
      when "object"     then @toStrObject( arg, level, encloseValue, encloseKey )
      when "null"       then "null"
      when "undefined"  then "undefined"
      when "function"   then "function"
      when "bigint"     then @toEnclose('"',arg.toString(),'"')  # Needs work
      when "regexp","date","symbol" then arg.toString()  # hail marys
      else
        console.log( "Type.toStr(arg?", { arg:arg, type:@toType(arg) } )
        "none"
    str

  toStringify:( arg ) ->
    @toStr( arg, 0, true, true )

  # str = if not @isIn(type,"manys") and enc.length > 0 then @toEnclose(str,enc) else str
  # else  console.log( "toStr(arg)", "unable to convert", arg, type, "string", arg.toString(), arg.toString() )
  # else  @toWarn( "toStr(arg)", "unable to convert", arg, type,
  #              "string", arg.toString(), arg.toString(), (t) => t.log( t.warn() ) )
  # str += key+":"+@toEnclose(@toStr(val),'"')+","
  # Puts single quotes ' around string objects that have double quotes inside
  toStrObject:( obj, level=0, encloseValue=false, encloseKey=false ) ->
    str = "{"
    for own key, val of obj
      okey = if encloseKey then @toEnclose('"',key,'"') else key
      str += okey + ":" + @toStr(val,++level,encloseValue,encloseKey) + ","
    str = str.substring(0,str.length-1) # remove trailing comma
    str += "}"
    if level is 0 then @toSingleQuote(str) else str

  # Puts single quotes ' around string objects that have double quotes inside
  toStrArray:( array, level=0, encloseValue=false ) ->
    str = "["
    for i in [0...array.length]
      str += @toStr(array[i],++level, encloseValue )
      str += if i < array.length-1 then "," else ""
    str += "]"
    if level is 0 then @toSingleQuote(str) else str # Single quotes added nnly when double quotes inside

  toFloat:( arg ) ->
    type = @toType(arg)
    switch type
      when "float" then arg
      when "int"   then parseFloat(arg.toFixed(1)) # Coerces an 'int' like '1' to a 'float' like '1.0'
      when "string"
        if @isStrFloat(arg)  then parseFloat(arg)
        #lse @toWarn( "toFloat(arg)", "unable to convert", arg, "float", NaN, (t) -> t.log( t.warn() ) )
        else NaN
      #lse   @toWarn( "toFloat(arg)", "unable to convert", arg, "float", NaN, (t) -> t.log( t.warn() ) )
      else NaN

  toInt:( arg ) ->
    type = @toType(arg)
    switch type
      when "int"    then arg
      when "float"  then Math.round(arg)
      when "string"
        if @isStrInt(arg) then parseInt(arg)
        #lse @toWarn( "toInt(arg)", "unable to convert", arg, "int", NaN, (t) -> t.log( t.warn() ) )
        else NaN
      #lse   @toWarn( "toInt(arg)", "unable to convert", arg, "int", NaN, (t) -> t.log( t.warn() ) )
      else NaN

  toBoolean:( arg ) ->
    type = @toType(arg)
    switch type
      when "boolean" then arg
      when "string"
        switch arg 
          when "true"  then  true
          when "false" then false
          else @toWarn( "toBoolean(arg)", "unable to convert", arg, "boolean", false, (t) -> t.log( t.warn() ) )
      when "int"   then arg isnt 0   # check 0   false may not be a convention
      when "float" then arg isnt 0.0 # check 0.0 false may not be a convention
      #lse     @toWarn( "toBoolean(arg)", "unable to convert", arg, "boolean", false, (t) -> t.log( t.warn() ) )
      else false

  toArray:( arg ) ->
    switch  @toType(arg)
      when "array" then arg
      when "string"  and @isEnclosed( "[", arg, "]" )
        arg    = @strip( arg, "[", "]" )
        array  = []
        values = arg.split(",")
        for value in values
          array.push( @toValue(value) )
        array
      when "object"
        array = []
        for own key, obj of arg
          obj['name'] = key
          array.push(obj)
        array
      else []

  toObject:( arg ) ->
    obj  = {}
    type = @toType(arg)
    switch
      when type is "object"
        obj = arg
      when type is "string" and @isEnclosed( "{", arg, "}")
        arg = @strip( arg, "{", "}" )
        obj = {}
        keyValues = arg.split(",")
        for keyValue in keyValues
          [key,value] = keyValue.split(":")
          obj[key]    = value
      else
        obj = {}
    obj

  toObjectName:( obj ) ->
    if @isObject(obj) then obj.constructor.name else "none"

  # Assert that func is a 'fuction' then returns name with the annoying 'bound ' removed
  toFunctionName:(  func, unCap=true ) ->
    name = if @isFunction( func ) then func.name.replace( "bound ", "" ) else "none"
    name = if unCap then @unCap(name) else name
    name

  # For extenal use to insure val is expossed to the outside environment
  #   to have all strings are wrapped in "".
  #   This is accomplished by setting excloseValue true for:
  #    @toStr(arg,excloseValue) and @toValue(arg,excloseValue)
  v:(val) ->
    ret = if @isType(val,'string') then @toStr(val,0,true) else @toValue(val,true)
    @log( { v:"v", ret:ret, val:val, type:@toType(val) } ) if @debug
    ret

  toKeys:(o)      ->
    if @isObject(o) then Object.keys(o) else []

  hasChild:( obj ) ->
    for own key, val of obj
      return true if @isChild(key)
    false

  childKeys:( obj ) ->
    vals = []
    for own key, val of obj
      vals.push(key) if @isChild(key)
    vals

  # Return a number with a fixed number of decimal places
  toFixed:( arg, dec=2 ) ->
    num = switch @toType(arg)
      when "int","float" then arg
      when "string"      then parseFloat(arg)
    num.toFixed(dec)

  toCap:( str ) ->
    str.charAt(0).toUpperCase() + str.substring(1)

  unCap:( str ) ->
    str.charAt(0).toLowerCase() + str.substring(1)

  head:(arg) ->
    switch @toType(arg)
      when "array"  then arg[0]
      when "string" then arg.charAt(0)
      #lse @toWarn( "head(arg)", "unable to get the first element of", arg, @toType(arg), null, (t) -> t.log( t.warn() ) )
      else "none"

  tail:(arg) ->
    switch @toType(arg)
      when "array"  then arg[arg.length-1]
      when "string" then arg.charAt(arg.length-1)
      #lse @toWarn( "tail(arg)", "unable to get the last element of", arg, @toType(arg), null, (t) -> t.log( t.warn() ) )
      else "none"

  strip:( str, beg, end ) ->
    str = str.trim()
    if @isStr(beg) and str.startsWith(beg)
       str = str.substring(beg.length)
    if @isStr(end) and str.endsWith(end)
      str = str.substring(0,str.length-end.length)
    str

  # Unlike the built in Array v.slice(beg,end) where beg is a zero-based index and end
  #  here beg starts at 1 and end includes the last position or is set to beg if ommitted
  #  an array slice( "[a","b","c"], 1, 2 ) returns "[a","b"]
  #  an array slice( "[a","b","c"], 2    ) returns "[b"]
  #  a string slice( "[abc"],       1, 2 ) returns   "ab"
  #  a string slice( "[abc"],       2    ) returns   "b"
  # where with Array.slice() it is open
  slice:( v, beg, end=null ) ->
    end = if @isDef(end) and beg <= beg then end else beg
    switch
      when @isArray(v) then v.slice(beg-1,end)
      when @isStr(v)   then v.slice(beg-1,end)
      else ""

  pad:( n, m ) ->
    len = @numDigits( n )
    tot = @numDigits( m )
    str = n.toString()
    for i in [len...tot]
      str = " " + str
    str

  numDigits:( n ) ->
    Math.max( Math.floor( Math.log10( Math.abs(n) ) ), 0 ) + 1

  time:()  ->
    new Date().getTime()

  # A deliberate do nothing consumer of arguments and variables
  noop:( ...args ) ->
    if args then false
    return

  # -- Warnings ---

  # A gem methods that appends text along with retrStr to @warn for detailed reporting of inconsistence
  #  along with a vialble actual return specified by the caller
  toWarn:( method, text, arg, typeTo, retn, closure=null ) ->
    warn  = "#{method} #{text} #{@toStr(arg)} of '#{@toType(arg)}' to'#{typeTo}' returning #{@toStr(arg)}"
    @doWarn( warn, closure, retn )

  isWarn:( pass, text, type, types, closure=null ) ->
    return true if pass
    warn = "#{text} of type '#{type}' not in '#{types}'"
    @doWarn( warn, closure, pass )

  inWarn:( pass, result, expect, oper, spec, text, closure=null ) ->
    prefix = if pass then "-- Passed --" else "-- Failed --"
    condit = if pass then "matches "     else "no match"
    warn   = "#{prefix} #{result} #{condit} #{expect} with oper #{oper} and spec #{spec} #{text}"
    @doWarn( warn, closure, pass )

  # (t) -> t.log( t.info() )
  doWarn:( warn, closure, retn ) ->
     @lasted  = warn
     @warned += warn
     closure(@) if @logging and @isFunction(closure)
     retn

  warn:() ->
    @lasted

  # Moved from Spec.coffee
  isEnums:( arg ) ->
    @isType(arg,"enums")

  # Leverage the stronger assertions @isStr(arg) and @isArray(arg)
  toEnums:( arg ) ->
    switch
      when @isType(arg,"enums")
        arg
      when @isArray(arg)
        enums = "|"
        for i in [0...arg.length]
          enums += @toStr(arg[i]) + "|"
        enums
      else
        "||"

  inEnums:( result, enums ) ->
    enums.includes("|"+result+"|")

  isIn:( type, arg ) ->
    switch
      when @isArray(arg) then @inArray( type, arg )
      when @isEnums(arg) then @inArray( type, @toEnums(arg) )
      when @isStr(arg)   then @toIn(arg).includes(type)
      #lse @isWarn( false, "arg #{arg} not 'array', 'enums' or 'string'", type, false )
      else false

  isInTypeKey:( key, arg ) ->
    type = @toType(arg)
    if Type[key]? then Type[key].includes(type) else false

  isInTypeKeyArgs:( key, args ) ->
    isn = true
    isn = isn and @isInTypeEnum(key,arg) for arg in args
    isn

  toIn:( arg ) ->
    switch
      when  not  arg? then "||"
      when Type[arg]? then Type[arg]
      else "||"

# All Type[key] 'enums'. Considering if "none" belongs
Type.undefs  = "|null|undefined|none|"
Type.numbers = "|int|float|"
Type.values  = "|string|int|float|boolean|"
Type.manys   = "|object|array|"
Type.basics  = "|string|int|float|boolean|object|array|"
Type.ranges  = "|string|int|float|"
Type.matches = "|regexp|range|enums|amy|"
Type.results = "|string|int|float|boolean|array|object|enums|range|regexp|"
Type.expects = "|string|int|float|boolean|array|object|enums|range|regexp|any|"
Type.typeofs = "|number|string|boolean|object|function|bigint|symbol|null|undefined|"
Type.types   = "|string|int|float|boolean|array|object|enums|range|regexp|null|undefined|"
Type.types  += "function|bigint|symbol|date|any|none|"
Type.opers   = "|to|eq|le|lt|ge|gt|ne|" # low  level value  based comparison  ooers 'eq' default
Type.cards   = "|1|?|*|+|"              # cards  1 required, ? optional, * 0 to many, + 1 to many

export type = new Type() # Export a singleton instence of type
export default Type
