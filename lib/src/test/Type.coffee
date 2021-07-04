
class Type
  
  comstructor:() ->
    @warned  = ""
    @lasted  = ""
    @logging = true
    @log     = console.log
    @error   = console.error

  # An improved typeof() that follows the convention by returning types in lower case by default.
  # The basic types similar to typeof() returned are:

  type:(arg,lowerCase=true) =>
    str = Object::toString.call(arg)
    tok = str.split(' ')[1]
    typ = tok.substring(0,tok.length-1)
    typ = if typ is "Number" and     Number.isInteger(arg) then "Int"   else typ # Previous CoffeeScript issue
    typ = if typ is "Number" and not Number.isInteger(arg) then "Float" else typ  #  with return on nested if's
    if lowerCase then typ.toLowerCase() else typ

  # A more detail type that returns basic types, class, object and function name in upper case
  klass:(arg) ->
    typ = @type(arg,false) # Start with basic type to catch "Null" and "Undefined"
    switch typ
      when "Null"      then "Null"
      when "Undefined" then "Undefined"
      when "Function"  then arg.name
      when "Object"    then arg.constructor.name
      else                  typ
    
  # The 9 fundamental type Assertions that leverage @type(arg) the improved typeof(arg)
  # In addition isInt isFloat isBoolean isArray isObject can optionally chech strings
  isStr:(s)              ->   @isType(s,"string") and s.length > 0 and s isnt "None"
  isInt:(i,sc=false)     -> ( @isType(i,"int")   and not isNaN(i) ) or ( sc and @isStrInt(i)   )
  isFloat:(f,sc=false)   -> ( @isType(f,"float") and not isNaN(f) ) or ( sc and @isStrFloat(f) )
  isBoolean:(b,sc=false) ->   @isType(b,"boolean") or ( sc and @isStrBoolean(b) )
  isObject:(o,sc=false)  ->   @isType(o,"object")  or ( sc and @isStrObject(o) )
  isRegex:(r)            ->   @isType(r,"regex")
  isFunction:(f)         ->   @isType(f,"function")
  isNull:(m)             ->   @isType(m,"null")
  isUndef:(u)            ->   @isType(u,"undefined")
  isBigInt:(b)           ->   typeof(b) is "bigint" # Will incorporate into type
  isSymbol:(s)           ->   typeof(s) is "symbol" # Will incorporate into type

  # Set type for asserting uniformly typed arrays and sc=true for determining if a string is an array
  # isArrayOfType called within @isArray(...) because it assumes array exists
  #   and returns true for 'null' that signifies that the type assertions
  #   on the elements should be skipped
  isArray:( a, type=null, sc=false ) ->
    return @isStrArray(a) if sc
    # Internal function that assert that an viable is uniformly types
    isArrayOfType = (a,t) =>
      return true if t is 'null'
      for e in a
        return false if @type(e) isnt t
      true

    if @isType(a,"array") and a.length? and a.length > 0
      type = @type( a[0] )
      isArrayOfType(a,type)

  # General purpose since if checks the array's existence and interate over all the elements
  isArrayType:(a,t) ->
    return false if not @isArray(a)
    for e in a
      return false if @type(e) isnt t
    true

  # General purpose since if checks the array's existence and interate over all the elements
  isArrayMixed:(a) ->
    return false if not @isArray(a)
    type = @type(a[0])
    for e in a
      return false if @type(e) isnt type
    false

  # Aggregate and special value assertions
  isType:(v,t)      ->   @type(v) is t
  isDef:(d)         ->   @type(d) isnt 'null' and @type(d) isnt 'undefined'
  isNumber:(n)      ->   @isIn( @type(n), "numbers" )
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

  isStrFloat:( str ) ->
    if @isStr( str )
       regex = /^-?\d+(?:[.,]\d*?)?$/
       regex.test(str)
    else false

  isStrInt:( str ) ->
    if @isStr( str )
       regex = /^-?\d+$/
       regex.test(str)
    else false

  isStrBoolean:( str ) ->
    @isStr(str) and ( str is "true" or str is "false" )

  isStrArray:( str ) ->
    @isStrEnclosed( "[", str, "]" )

  isStrObject:( str ) ->
    @isStrEnclosed( "{", str, "}" )

  # Tests if string is enclosed good for [array] and {object}
  isStrEnclosed:( beg, str, end ) ->
    if @isStr( str )
      s = str.trim()
      s.startsWith(beg) and s.endsWith(end)
    else false

  # Converters
  toType:( arg, type ) ->
    switch type
      when "string"  then @toStr(  arg )
      when "int"     then @toInt(     arg )
      when "float"   then @toFloat(   arg )
      when "boolean" then @toBoolean( arg )
      when "array"   then @toArray(   arg )
      when "object"  then @toObject(  arg )
      else
        console.error( "Type.toType(type,arg) unknown type", { type:type, arg:arg } )
        null

  # toEnclose a "string'
  # toEnclose("abc",   '"'  )       # returns "abc" - good for JSON keys and values
  # toEnclose("123",   "'"  )       # returns '123'
  # toEnclose("xyz",   "()" )       # returns (xyz)
  # toEnclose("d,e,f", "[]" )       # returns [d,e,f]
  # toEnclose("a:x,b:y,c:z", "{}" ) # returns {a:x,b:y,c:z}
  toEnclose:( str, enc="" ) ->
    if enc.length is 2 then "#{enc.charAt(0)}#{str}#{enc.charAt(1)}"
    if enc.length is 1 then "#{enc.charAt(0)}#{str}#{enc.charAt(0)}"
    else str

  # toStr(arg) avoids conflicts with arg.toString()
  # This combination of travesal and recursion is cleaner than JSON.stringify()
  # So far all vaild 13 Type.types a super set of Type.typeofs has been accounted for
  # Type.typeofs = ["string","number","boolean","object","function","bigint","symbol","null","undefined"]
  # Type.types   = Type.typeofs.concat(["int","float","array","regex","date"])
  toStr:( arg ) ->       # , enc=""
    type = @type(arg)
    str = switch type
      when "string"     then arg
      when "int"        then parseInt(arg)
      when "float"      then parseFloat(arg)
      when "boolean"    then if arg then "true" else "false"
      when "object"     then @toStrObject(arg)
      when "array"      then @toStrArray(arg)
      when "null"       then "null"
      when "undefined"  then "undefined"
      when "function"   then "?function?"
      when "regex","date","bigint","symbol" then arg.toString()  # hail marys
      else @toWarn( "toStr(arg)", "unable to convert", arg, "sting", "", (t) => t.log( t.warn() ) )
    # console.log( "toStr(arg)", { arg:arg, str:str, type:type } )
    str

    # str = if not @isIn(type,"manys") and enc.length > 0 then @toEnclose(str,enc) else str
    # else  console.log( "toStr(arg)", "unable to convert", arg, type, "string", arg.toString(), arg.toString() )
    # else  @toWarn( "toStr(arg)", "unable to convert", arg, type,
    #              "string", arg.toString(), arg.toString(), (t) => t.log( t.warn() ) )
    # str += key+":"+@toEnclose(@toStr(val),'"')+","

  toStrObject:( obj ) ->
    str = "{"
    for own key, val of obj
      str += key + ":" + @toStr(val) + ","
    str = str.substring(0,str.length-1) # remove trailing comma
    str += "}"
    str

  toStrArray:( array ) ->
    str = "["
    for i in [0...array.length-1]
      str += @toStr(array[i]) + if i < array.length-2 then "," else ""
    str += "]"
    str

  toFloat:( arg ) ->
    type = @type(arg)
    switch type
      when "float" then arg
      when "int"   then parseFloat(arg.toFixed(1)) # Coerces an 'int' like '1' to a 'float' like '1.0'
      when "string"
        if @isStrFloat(arg)  then parseFloat(arg)
        else @toWarn( "toFloat(arg)", "unable to convert", arg, "float", NaN, (t) => t.log( t.warn() ) )
      else   @toWarn( "toFloat(arg)", "unable to convert", arg, "float", NaN, (t) => t.log( t.warn() ) )

  toInt:( arg ) ->
    type = @type(arg)
    switch type
      when "int"    then arg
      when "float"  then Math.round(arg)
      when "string"
        if @isStrInt(arg) then parseInt(arg)
        else @toWarn( "toInt(arg)", "unable to convert", arg, "int", NaN, (t) => t.log( t.warn() ) )
      else   @toWarn( "toInt(arg)", "unable to convert", arg, "int", NaN, (t) => t.log( t.warn() ) )

  toBoolean:( arg ) ->
    type = @type(arg)
    switch type
      when "boolean" then arg
      when "string"
        switch arg 
          when "true"  then  true
          when "false" then false
          else @toWarn( "toBoolean(arg)", "unable to convert", arg, "boolean", false, (t) => t.log( t.warn() ) )
      when "int"   then arg isnt 0   # check 0   false may not be a convention
      when "float" then arg isnt 0.0 # check 0.0 false may not be a convention
      else     @toWarn( "toBoolean(arg)", "unable to convert", arg, "boolean", false, (t) => t.log( t.warn() ) )

  toArray:( arg, type, sep="," ) ->
    type = @type(arg)
    switch  type
      when "array" then arg
      when "string"
        str = arg.trim()
        if @head(arg) is "[" and @tail(arg) is "]" # Strip off brackets
          arg = @slice(arg,2,arg.length-1)
        array = []
        strs  = @slice(arg,2,arg.length-1).split(sep)
        for str in strs
          array.push( @toType( str, type ) )
        array
      else @toWarn( "toArray(arg)", "unable to convert", arg, "array", [], (t) => t.log( t.warn() ) )

  toObject:( arg ) ->
    obj  = {}
    type = @type(arg)
    switch type
      when "object"
        obj = arg
      when "array"
        obj[i] = arg[i] for i in [0...arg.length]
      when "int","float","boolean","function"
        obj[type] = arg
      when "string"
        obj = arg.split(",")
                 .map( (keyVal) => keyVal.split(":").map( (arg) => arg.trim() ) )
                 .reduce( (acc,cur) => acc[cur[0]] = cur[1]; acc {} )  # acc accumulator cur current
      else
        @toWarn( "toObject(arg)", "unable to convert", arg, "object", {}, (t) => t.log( t.warn() ) )
    obj

  toJSOM:( key, arg ) ->
    json = {}
    type = @type(arg)
    switch type
      when "string"
        '"' + arg + '"'
      when "object"
        for own key, val of arg
          json[key] = @toJSON(key,val)
      when "array"
        for i in [0...arg.length]
          json[i] = arg[i]
      else
        arg
    obj

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
    num = switch @type(arg)
      when "int","float" then arg
      when "string"      then parseFloat(arg)
    num.toFixed(dec)

  toCap:( str ) ->
    str.charAt(0).toUpperCase() + str.substring(1)

  unCap:( str ) ->
    str.charAt(0).toLowerCase() + str.substring(1)

  head:(v,action=false,pop=false) ->
    arg = null
    switch @type(v)
      when "array"
        switch @type(action)
          when "boolean"
            arg = v[0]
            v   = v.shift() if action
      when "string"
        switch @type(action)
          when "boolean"
            arg = v.charAt(0)
            v   = v.substring(1) if action
          when "string" and v.startsWith(action)
            arg = action
            v   = v.substring(action.length) if pop
    pop

  tail:(v,action=false) ->
    pop = null
    switch @type(v)
      when "array"
        pop = v[v.length-1]
        v   = v.pop() if @isType(action,"boolean") and action
      when "string"
        switch @type(action)
          when "boolean"
            pop = v.charAt(v.length-1)
            v   = v.substring( 0, v.length-1 ) if action
          when "string" and v.endsWith(action)
            pop = action
            v   = v.substring(0,v.length-action.length)
    pop

  # Unlike the built in Array v.slice(beg,end) where beg is a zero-based index and end

  # Here beg starts at 1 and end includes the last position or is set to beg if ommitted
  #  an array slice( ["a","b","c"], 1, 2 ) returns ["a","b"]
  #  an array slice( ["a","b","c"], 2    ) returns ["b"]
  #  a string slice( ["abc"],       1, 2 ) returns   "ab"
  #  a string slice( ["abc"],       2    ) returns   "b"
  # where with Array.slice() it is open
  slice:( v, beg, end=null, remove=false ) ->
    end if @isDef(end) then end else beg
    pop = null
    switch @type(v)
      when "array"
        pop = if remove then v.splice(beg-1,end+1) else v.slice(beg-1,end+1)
      when "string"
        pop = v.splice(beg-1,end+1)
        v   = v.substring(0,beg-1) + v.substring(end+1) if remove
    pop

  pad:( n, m ) ->
    len = @numDigits( n )
    tot = @numDigits( m )
    str = n.toString()
    for i in [len...tot]
      str = " " + str
    str

  numDigits:( n ) ->
    Math.max( Math.floor( Math.log10( Math.abs(n) ) ), 0 ) + 1

  time:()  ->  new Date().getTime()

  # A deliberate do nothing consumer of arguments and variables
  noop:( ...args ) ->
    if args then false
    return

  # -- Warnings ---

  # A gem methods that appends text along with retrStr to @warn for detailed reporting of inconsistence
  #  along with a vialble actual return specified by the caller
  toWarn:( method, text, arg, typeTo, retn, closure=null ) =>
    warn  = "#{method} #{text} #{@toStr(arg)} of '#{@type(arg)}' to'#{typeTo}' returning #{@toStr(arg)}"
    @doWarn( warn, closure, retn )

  isWarn:( pass, text, type, types, closure=null ) =>
    return true if pass
    warn = "#{text} of type '#{type}' not in '#{types}'"
    @doWarn( warn, closure, pass )

  inWarn:( pass, result, expect, oper, spec, text, closure=null ) =>
    prefix = if pass then "-- Passed --" else "-- Failed --"
    condit = if pass then "matches "     else "no match"
    warn   = "#{prefix} #{result} #{condit} #{expect} with oper #{oper} and spec #{spec} #{text}"
    @doWarn( warn, closure, pass )

  # (t) => t.log( t.info() )
  doWarn:( warn, closure, retn ) =>
     @lasted  = warn
     @warned += warn
     closure(@) if @logging and @isFunction(closure)
     retn

  warn:() =>
    @lasted

  # console.log( "Type.isIn(type,key)", { type:type, key:key, isIn:Type[key].includes(type), types:Type[key] } )
  isIn:( type, key ) ->
    if Type[key]?
       Type[key].includes(type)
    else
      @isWarn( false, "key #{key} missing for", type, [] )
      false

Type.remove = ( e, a ) ->
  index = a.indexOf(e)
  a.splice( index, 1 ) if index > -1
  a

# All Type[key] arrays
Type.undefs  = ["null","undefined"]
Type.numbers = ["int","float"]
Type.ranges  = ["string","int","float"]
Type.values  = ["string","int","float","boolean"]
Type.manys   = ["object","array"]
Type.results = ["string","int","float","boolean","object","array"]
Type.expects = Type.results.concat(["schema","range","enums","amy"])
Type.typeofs = ["string","number","boolean","object","function","bigint","symbol","null","undefined"]
Type.types   = Type.typeofs.concat(["int","float","array","regex","date"])
Type.types   = Type.remove("number", Type.types ) # number is now either 'int' or 'float'

export type = new Type() # Export a singleton instence of type
export default Type