
class Tester

  constructor:() ->

    @stream = null # Optional streaming publisher module that is set by @injectStream( stream )

    # Key settings that can be reconfigured through setOptions( options )
    @testing        = true          # When false all testing is turned which allows tests to remain in code
    @logToConsole   = true
    @archive        = true          # When true archives test status object to localStorage TestsPassed and TestFail
    @verbose        = false         # Adds addition and sometimes mind numbing detail to testStatus objects
    @debug          = false         # Turns on debugs call to console.log(...)
    @schemaKey      = "schema"      # Specifies the key in a JSON file to look up its argidating schema in JSON
    @statusSubject  = "TestStatus"  # Subject for publishing each test status object
    @stringSubject  = "TestString"  # Subject for publishing each test status string
    @summarySubject = "TestSummary" # Subject for publishing module and final summaries

    # Short hand for logging in a chained call i.e test(...).log( test().status )
    #  it is important that @log and @error be called in the modules being tested
    #  for viewing the code being tested rather that viewing code in the Tester itself
    @log   = console.log
    @error = console.error

    # Set by @describe( description, suite )
    @description = ""
    @suite       = ""

    # Accummulate test status state
    @textText     = "" # set by test() that is passed inside eq() and sent to run()
    @infoText     = ""
    @codeText     = ""
    @statusText   = ""
    @statusClear  = true
    @blockText    = ""
    @blockClear   = true

    # Accumulated status objects
    @modules      = {}
    @passed       = []
    @failed       = []

    # optional instance for publishing each test status object to to UIs that subscripe to stream
    # set by @injectStream(stream) which enforces that it have @klass 'Stream'
    @stream       = null

  setOptions:( options ) ->
    @testing        = if options.testing?        then options.testing        else true
    @logToConsole   = if options.logToConsole?   then options.logToConsole   else true
    @archive        = if options.archive?        then options.archive        else true
    @verbose        = if options.verbose?        then options.verbose        else false
    @debug          = if options.debug?          then options.debug          else false
    @schemaKey      = if options.schemaKey?      then options.schemaKey      else "schema"
    @statusSubject  = if options.statusSubject?  then options.statusSubject  else "TestStatus"
    @stringSubject  = if options.stringSubject?  then options.stringSubject  else "TestString"
    @summarySubject = if options.summarySubject? then options.summarySubject else "TestSummary"
    return

  # -- test -- Pass a closeure in the form of  (t) -> { code... }
  # Modeled like the Ava JavaScipt test framework
  # Imports: import { test }     from "../test/Tester.js"
  # Specify: test( text, (t) -> { code... }
  # Example:
  #   const add = ( a, b ) ->
  #     a + b
  #   test("2 + 3 = 5", (t) ->
  #     t.eq( add(2,3), 5 ) )
  test:( text, closure ) =>
    return @ if arguments.length is 0 or not @testing
    @text     = text               # @text is latter referenced inside eq()
    @code     = closure.toString() # @code is latter referenced inside eq()
    closure(@)
    @  # returns tester instance for chaining

  # -- unit -- For invoking the result argument immediately in a module-unit.js file
  #
  # Imports: import { unit } from "../test/Tester.js"
  #          import Vis      from "../draw/Vis.js"
  # Specify: unit( text, result, expect )
  # Example: unit( "can convert hex color to rgb object",  Vis.rgb(0xFFFFFF), {r:255,g:255,b:255} )
  unit:( text, result, expect ) =>   # unit(...) is always @testing
    return @ if arguments.length is 0 or not @testing
    @text   = text
    @code   = ""
    @run( result, expect, "eq" ) # returns tester instance for chaining

  # Validate and diagnose a result that fits a schema both of type 'object' or 'array'
  #  Very usefull for a result originating from a'.json' file and parsed by JSON.parse(...)
  #  Very usefull for a schema originating from a'.json' file and parsed by JSON.parse(...)
  fits:( text, result, schema ) =>
    return @ if arguments.length is 0 or not @testing
    @text   = text
    @code   = ""
    # if @debug
    #  console.log( "Tester.fits(result,schema)", { type:@type(result), result:result, schema:schema, status:status } )
    @run( result, schema, "schema" )  # returns tester for chaining  is expect = @toSchema( expect, op ) needed?

  eq:( result, expect ) =>
    @run( result, expect, "eq" )

  run:( text, result, expect, op ) ->
    return @ not @testing
    console.log( "Tester.run()", { text:text, result:result, expect:expect, op:op } ) if  @debug
    status = @initStatus( result, expect, op )
    status = @assert(     result, expect, op, status )
    @report(              result, expect, op, status )
    @    # returns tester instance for chaining

  describe:( description, suite=null ) ->
    @description = description
    @suite       = if suite? then suite else null
    @

  initStatus:( result, expect, op ) ->
    module = text.split(".")[0]
    eType  = if op is "schema" then "schema" else @type(expect)
    {
      assert:{ text:@text, pass:true, module:module, op:op, code:@code, info:"" }
      result:{ text:"", type:@type(result), argue:result }
      expect:{ text:"", type:eType,         argue:expect }
    }

  # Performs all assertions even a deep equal on objects and arrays
  #   Strong type checking with @type(arg) so asserions are only test when types match
  #   Skips over @type(arg) = "function"
  assert:( result, expect, status, op, level=0, key=null, index=null ) ->

    # Covert expect to a schema object if op is schema
    expect = @toSchema(expect,op)

    # Check argues and types
    status = @checkValuesTypes( result, expect, status, op, key, index )

    # Perform all comparisions
    if status.assert.pass
       status = switch @type(result)
         when "string","number","boolean" then @arguesEq(   result, expect, status, op )
         when "object"                    then @objectsEq(  result, expect, status, op, level )
         when "array"                     then @arraysEq(   result, expect, status, op, level )
         else                                  @unknownsEq( result, expect, status )  # just a fallback
       @examine( status.assert.pass, result, expect, status, op, "", key, index )

    # Store status in @passed and @failed arrays
    if level is 0
       @passed.push(status) if     status.assert.pass
       @failed.push(status) if not status.assert.pass
    status

  # Generates informative text in status
  examine:( pass, result, expect, status, op, info, key, index ) ->
    expect = if op is "schema" and not @isSchema(expect) then @toSchema(expect,op) else expect
    argue  = if op is "schema" then expect.argue else expect
    eType  = if op is "schema" then expect.type  else @type(expect)
    prefix = if pass then "-- Passed -- " else "-- Failed -- "
    status.assert.text   = prefix + status.assert.text
    status.assert.pass   = pass and status.assert.pass # Asserts a previous status.assert.pass is false
    status.assert.info  += info
    status.assert.code   = if @isString(@code) then @code else ""
    status.result.text  += @textValue( "Result", @type(result), result, key, index )
    status.expect.text  += @textValue( "Expect", eType,         argue,  key, index )
    status

  # Convert expect to a schema object if op is schema
  isSchema:( v ) ->
    v.op? and v.type? and v.argue? and v.range? and v.op? and v.size?

  # Format "type:ranges or argue:length:oper?"
  # Examples:
  #   "array:[[0,360],[0,100],[0,100]]:eq?"
  #   { type:"array", ranges:[[0,360],[0,100],[0,100]], oper:"eq", opt="?" }
  #   "array:[0,255]" } # Range is applies to all array argues
  #   { type:"array", ranges:[0,255]
  #   "object:{r:[0,255],g:[0,255],b:[0,255]}
  #   "string:James"
  #   "number:[0,100]"
  #   "boolean"
  toSchema:( expect,   op ) ->
    return   expect if op isnt "schema"
    schema = { type:"any", ranges:["any"], argue:"any", length:"any", oper:"eq", opt:"1" }
    switch @type(expect)
      when "string"
        schema = @parseSchema( expect, schema )

      when "object"
        schema.opt    = if expect.opt is "?"        then expect.opt    else  "1" # "1" implies key required
        schema.type   = if @isString(expect.type)      then expect.type   else  "any"
        schema.argue  = if expect.argue?            then expect.argue  else  "any"
        schema.ranges = if @isArray(expect.ranges ) then expect.ranges else ["any"]
        schema.length = if @isNumber(  expect.length ) then expect.length else  "any"
        schema.oper   = if @isString(  expect.oper   ) then expect.oper   else  "eq"
    schema

  # parseSchemaStr
  parseSchema:( expect, schema ) ->
    schema.opt  = if @tail(expect,"?",true) is "?" then "?" else "1" # @tail() pops the '?'
    splits      = expect.split(":")
    length      = splits.length
    schema.type = if length >= 1 then splits[0]
    if length >= 1
      if splits[1][0] is "["
        schema.ranges = @toRanges( splits[1] )
        schema.argue  = "any"
      else if splits[1].includes("|")
        schema.ranges = @toEnums( splits[1] )
        schema.argue  = "any"
      else
        schema.ranges = "any"
        schema.argue  = @toType( splits[1], schema.type )
      schema.length    = if length >= 2 then @toInt( splits[2] ) else "any"
      schema.oper      = if length >= 3 then @toString( splits[3] ) else "eq"
      schema

  # Range parser for @toSchema(expect,op)
  toRanges:( splits ) ->
    ranges = []
    for split in splits
      switch @type(split)
        when "string"
          for split in splits
            if @head(split,"[[",false) is "[[" and @tail(split,"]]",false) is "]]"
              strs = @toArray(split)
              for str in strs
                ranges.push[@toArray(str)]
              return ranges
            else if @head(split) is "[" and @tail(split) is "]"
              ranges.push[@toArray(split)]
              return ranges
        when "array"
          if @isArray(split[0])
            for array in split
              ranges.push(array)
            return ranges
          else
            ranges.push[split]
            return ranges
    ranges

  checkValuesTypes:( result, expect, status, op, key, index ) ->
    rType =                          @type(result)
    eType = if op isnt "schema" then @type(expect) else expect.type
    types = ["string","number","boolean","object","array"]
    info  = switch
      when @isNot(result)
        " Result of #{rType} is not defined\nExpect is type '#{eType}'"
      when @isNot(expect)
        " Expect of #{eType} is not defined\nResult is type '#{rType}'"
      when op is "schema"
        if eType is "any"
          ""
        else if etype includes("|")
          eTypes = eType.split("|")
          if @inArray(rType,eTypes)
            ""
          else
            " Result type is '#{rType}' that is not in\nExpect schema types '#{eType}'"
        else if rType isnt eType
          " Result type is '#{rType}'\nExpect type is '#{eType}' from schema"
      when rType isnt eType
        " Types do not match\nResult type is '#{rType}'\nExpect type is '#{eType}'"
      when rType is "function"
        " Result type is 'function'\nExpect type is '#{eType}'"
      when eType is "function"
        " Expect type is 'function'\nResult type is '#{rType}'"
      when not @inArray(rType,types)
        " Result is type '#{rType}' an unknown type is type '#{eType}'"
      when not @inArray(eType,types)
        " Result is type '#{rType}'\nExpect is type '#{eType}' an unknown type"
      else
        ""
    if @isString(info)
      @examine( false, result, expect, status, op, info, key, index )
    else
      status

  # Equality check for "string","number","boolean" types
  arguesEq:( result, expect, status, op ) ->

    argue = expect
    if op is "schema"
      argue  = expect.argue
      ranges = expect.ranges
      oper   = switch
        when ranges is "any" then "eq"
        when @isArray(ranges)
          if @isArray(ranges[0]) then "ranges" else "range"

    status.assert.pass = switch oper
      when argue is "any" then true
      when op is "range" then @inRange( result, ranges )
      when op is "ranges" and @isArray( result )
        pass   = true
        length = Math.min( result.length, ranges.length )
        for i in [0...length]
          if @isArray(result[i]) and @isArray(ranges[i])
            pass = pass and @inRange( result[i], ranges[i] )
        pass
      when "eq" then result is   argue
      when "le" then result <=   argue
      when "lt" then result <    argue
      when "ge" then result >=   argue
      when "lt" then result >    argue
      when "ne" then result isnt argue
      else           false
    status



  # Just a fallback when types are not fully screened
  unknownsEq:( result, expect, status ) ->
    status.assert.pass  = false
    status.assert.info += "unknown types for comparision"
    status

  textValue:( name, argue, key, index ) ->
    ref   = " "
    ref   " at key:#{key} "      if @isString(key)
    ref = " at index: #{index} " if @isNumber(index)
    "#{name}#{ref}where type is #{@type(argue)} and argue is #{@toString(argue)}"

  # Deep object equality assertion where all matching keys are examined
  objectsEq:( result, expect, status, op, level ) ->

    # Check that the expect object has all the keys that the result object has
    for own key, arg of result when  expect[key]?
      status = @examine( false, arg, expect[key], status, op, "missing expect", key, null )

    # Check that the result object has all the keys that the expect object has
    for own key, arg of expect when ( result[key]? or ( op is "schema" and arg.opt is "1" ) )
      status = @examine( false, result[key], arg, status, op, "missing result", key, null )

    # Assert each argue for the set of keys that result and expect objects share in common
    for own key, obj of expect when result[key]? and expect[key]?
      status = @assert( result[key], arg, status, op, ++level, key, null )
    status

  # Deep array equality assertion
  arraysEq:( result, expect, status, op, level ) ->
    argue = expect

    # Check against the schema when present
    if op is "schema"
      argue = expect.argue
      if argue is "any"
         status.assert.pass = true
         return status
      else if argue.size isnt "any" and result.length > argue.size
         info   = " Result length exceeds the maximum size #{argue.size}"
         info  += " Result length is #{result.length}"
         info  += " Size is #{argue.size}"
         return @examine( false, result, expect, status, op, info, null, null )
      else if not @isArray(argue)
         return status

    # Examine the array lengths
    if result.length isnt argue.length
      info   = " different array lengths"
      info  += " Result length is #{result.length}"
      info  += " Expect length is #{argue.length}"
      status = @examine( false, result, expect, status, op, info, null, null )

    # Assert each argue within the minimum length of the result and expect arrays
    length = Math.min( result.length, expect.length )
    for i in [0...length]
      status = @assert( result[i], expect[i], status, op, ++level, null, i )

    status

  report:( status, result, expect ) ->
    eq = if status.assert.pass then "is" else "not"
    @blockText   = "" if @blockClear
    @statusText  = """\n#{status.assert.text} """
    @statusText += """#{eq} #{@toString(expect)}""" if status.result.type isnt "function"
    @statusText += status.assert.info if @isString(status.assert.info)
    @statusText += """\n   #{@textResult( status, result )}""" if @verbose or not status.assert.pass
    @statusText += """\n   #{@textExpect( status, expect )}""" if @verbose or not status.assert.pass
    #statusText += "\n"+@code              if @isString(@code) and ( @verbose or not status.assert.pass )
    @blockText  += @statusText if not @statusClear
    @statusClear = false
    @blockClear  = false

    if @isDef(@stream)
      @stream.publish( @statusSubject, status )
      @stream.publish( @stringSubject, status )
    return

  status:() ->
    @statusClear = true
    @statusText

  block:() ->
    @blockClear = true
    @blockText

  runUnitTests:( paths ) ->
    for path in paths
      modulePath = @path( path )
      console.log( "\n-- Started Unit Testing for: #{modulePath.name} in #{modulePath.path}" ) if @logToConsole
      await `import( path /* @vite-ignore */ )`
    @summary()
    return

  path:( path ) ->
    dirs   = path.split("/")
    module = @tail(dirs).split("-")[0]
    @modules[module] = { name:module, path:path }
    console.log( "Tester.path(path)", { path:path, dirs:dirs, module:module } ) if @debug
    @modules[module]

  summary:( module=null ) ->
    path = if module? and @modules[module]? then @modules[module].path else "?"
    if @debug
      console.log( "Tester.summary(module)", { module:module, modules:@modules, key:@modules[module], path:path } )
    summaryText = ""
    if module?
      passCount = 0
      failCount = 0
      ++passCount for pass in @passed when pass.assert.module is module
      ++failCount for fail in @failed when fail.assert.module is module
      fullCount = passCount + failCount
      summaryText += """\n\n-- Summary - for #{module} in #{path}"""
      summaryText += """\n   #{@pad(passCount,fullCount)} tests passed"""
      summaryText += """\n   #{@pad(failCount,fullCount)} tests failed"""
      summaryText += """\n   #{@pad(fullCount,fullCount)} tests total"""
    else
      fullCount = @passed.length + @failed.length
      summaryText += """\n\n-- Summary - for all tests"""
      summaryText += """\n   #{@pad(@passed.length,fullCount)} tests passed"""
      summaryText += """\n   #{@pad(@failed.length,fullCount)} tests failed"""
      summaryText += """\n   #{@pad(fullCount,     fullCount)} tests total"""

    if @isDef(@stream) and @stream.hasSubscribers( @summarySubject )
      @stream.publish( @summarySubject, summaryText )

    summaryText = @block() + summaryText # Prepend any block statuses

    # Archive since all tests are complete
    if @archive
      @archiveLocal(  @failed,      @passed )
      @reviewsLocal( { failed:false, passed:false } )
      
    summaryText

  # The 9 fundamental type Assertions that leverage @type(arg) the improved typeof(arg)
  # In addition isInt isFloat isBoolean isArray isObject can optionally chech strings
  isString:(s)          ->   @isType(s,"string") and s.length > 0 and s isnt "None"
  isInt:(i,sc=false)     -> ( @isType(i,"int")   and not isNaN(i) ) or ( sc and @isStringInt(i)   )
  isFloat:(f,sc=false)   -> ( @isType(f,"float") and not isNaN(f) ) or ( sc and @isStringFloat(f) )
  isBoolean:(b,sc=false) ->   @isType(b,"boolean") or ( sc and @isStringBoolean(b) )
  isObject:(o,sc=false)  ->   @isType(o,"object")  or ( sc and @isStringObject(o) )
  isRegex:(r)            ->   @isType(r,"regex")
  isFunction:(f)         ->   @isType(f,"function")
  isNull:(m)             ->   @isType(m,"null")
  isUndef:(u)            ->   @isType(u,"undefined")
  isBigInt:(b)           ->   typeof(b) is "bigint" # Will incorporate into type
  isSymbol:(s)           ->   typeof(s) is "symbol" # Will incorporate into type

  # Set type for asserting uniformly typed arrays and sc=true for determining if a string is an array
  isArray:( a, type=null, sc=false ) ->  
    ( @isType(a,"array") and a.length? and a.length > 0 and @isArrayTyped(a,type) ) or ( sc and @isStringArray(a) )  

  # Aggregate and special argue assertions
  isType:(v,t)      ->   @type(v) is t
  isDef:(d)         ->   @type(d) isnt ( "null" or "undefined" )
  isNumber:(n)      ->   @type(n) is   ( "int"  or "float"     )

  isNot:(d)         ->   not @isDef(d)
  isNaN:(n)         ->   Number.isNaN(n) # @isNumber(n) and
  
  isArrayTyped:(a,t) ->
    return true  if     @isNull(t)
    return false if not @isArray(a)
    for e in a
      return false if @type(e) isnt t
    true

  isArrayMixed:(a) ->
    return false if not @isArray(a)
    type = @type(a[0])
    for e in a
      return false if @type(e) isnt type
    false

  # Containment assertions where args are always ( argue, container )
  inString:(e,s)  ->  @isString(s) and s.includes(e)
  inArray:( e,a)  ->  @isArray(a)  and a.includes(e)
  inObject:(k,o)  ->  @isObject(o) and @isDef(o[k]) and o.hasOwnProperty(k)
  
  inRange:(i,r)     ->  @isRange(r)     and @isType(i,"int")    and r[0]      <= i and i <= r[1]
  inTolerance:(f,t) ->  @isTolerance(t) and @isType(f,"float")  and t[0]-t[2] <= f and f <= t[1]+t[2]
  inBetween:(s,b)   ->  @isBetween(r)   and @isType(s,"string") and b[0]-b[2] <= s and s <= b[1]+b[2]

  toKeys:(o)      ->  if @isObject(o) then Object.keys(o) else []
  time:()         ->  new Date().getTime()

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

  isStringFloat:( str ) ->
    if @isString( str )
       regex = /^-?\d+(?:[.,]\d*?)?$/
       regex.test(str)
    else false

  isStringInt:( str ) ->
    if @isString( str )
       regex = /^-?\d+$/
       regex.test(str)
    else false

  isStringBoolean:( str ) ->
    @isString(str) and ( str is "true" or str "false" )

  isStringArray:( str ) ->
    @isStringEnclosed( "[", str, "]" )

  isStringObject:( str ) ->
    @isStringEnclosed( "{", str, "}" )

  # Tests if string is enclosed good for [array] and {object}
  isStringEnclosed:( beg, str, end ) ->
    if @isString( str )
      s = str.trim()
      s.startsWith(beg) and s.endsWith(end)
    else false

  # Converters
  toType:( arg, type ) ->
    switch type
      when "string"  then @toString(  arg )
      when "int"     then @toInt(     arg )
      when "float"   then @toFloat(   arg )
      when "boolean" then @toBoolean( arg )
      when "array"   then @toArray(   arg )
      when "object"  then @toObject(  arg )
      else
        console.error( "Tester.toType(type,arg) unknown type", { type:type, arg:arg } )
        null

  # enclose a 'string'
  # enclose("abc",   '"'  )       # returns "abc" - good for JSON keys and values
  # enclose("123",   "'"  )       # returns '123'
  # enclose("xyz",   "()" )       # returns (xyz)
  # enclose("d,e,f", "[]" )       # returns [d,e,f]
  # enclose("a:x,b:y,c:z", "[]" ) # returns {a:x,b:y,c:z}
  enclose:( str, enc="" ) ->
    if enc.length is 2 then "#{enc.charAt(0)}#{str}#{enc.charAt(1)}"
    if enc.length is 1 then "#{enc.charAt(0)}#{str}#{enc.charAt(0)}"
    else str

  toString:( arg, enc="" ) ->
    str  = ""
    type = @type(arg)
    switch type
      when "string"   then arg
      when "int"      then parseInt(arg)
      when "float"    then parseFloat(arg)
      when "boolean"  then if arg then "true" else "false"
      when "object" # This combination of travesal and recursion is cleaner than JSON.stringify()
        str += "{ "
        for own key, val of arg
          str += key+":"+@enclose(@toString(val),'"')+", "
        str = str.substring( 0, str.length-2 ) # remove trailing comma and space
        str += " }"
      when "array"  # This combination of travesal and recursion is cleaner than JSON.stringify()
        str += "[ "
        for arg in arg
          str += @toString(arg)+", "
        str = str.substring( 0, str.length-2 ) # remove trailing comma  and space
        str += " ]"
      when "function"   then @toInfo( "toString(arg)", arg, "function", "string", "?function?" )
      when "null"       then "null"
      when "undefined"  then "undefined"
      when "bigint"     then arg.toString()
      when "symbol"     then arg.toString()
      else  @toInfo( "toString(arg)", arg, type, "string", arg.toString() ) # return of arg.toString() is a hail mary
    if type isnt ( "object" or "array" ) and enc.length > 0 then @enclose(str,enc) else str

  toFloat:( arg ) ->
    type = @type(arg)
    switch type
      when "float" then arg
      when "int"   then parseFloat(arg.toFixed(1)) # Coerces an 'int' like '1' to a 'float' like '1.0'
      when "string"
        if @isStringFloat(arg)  then parseFloat(arg)
        else @toInfo( "toFloat(arg)", arg, "string", "float", NaN )
      else   @toInfo( "toFloat(arg)", arg,   type,   "float", NaN )

  toInt:( arg ) ->
    type = @type(arg)
    switch type
      when "int"    then arg
      when "float"  then Math.round(arg)
      when "string"
        if @isStringInt(arg)  then parseInt(arg)
        else @toInfo( "toInt(arg)", arg, "string", "int", NaN )
      else   @toInfo( "toInt(arg)", arg,   type,   "int", NaN )

  toInfo:( method, arg, type, typeTo, retn ) ->
    @infoText += "\n  Tester.#{method} unable to convert #{@toString(arg)} of '#{type}' to'#{typeTo}' returning '#{@toString(retn)}'"
    retn

  toBoolean:( arg ) ->
    type = @type(arg)
    switch type
      when "boolean" then arg
      when "string"
        switch arg 
          when "true"  then  true
          when "false" then false
          else @toInfo( "toBoolean(arg)", arg, type, "boolean", false )
      when "int"   then arg isnt 0   # check 0   false may not be a convention
      when "float" then arg isnt 0.0 # check 0.0 false may not be a convention
      else     @toInfo( "toBoolean(arg)", arg, type, "boolean", false )

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
      else @toInfo( "toArray(arg)", arg, type, "array", [] )

  toObject:( arg ) ->
    obj  = {}
    type = @type(arg)
    switch type
      when "object" then obj = arg
      when "array"  then obj[i] = arg[i] for i in [0...arg.length]
      when "number","boolean","function"
        obj[type] = arg
      when "string"
        obj = arg.split(",")
                 .map( (keyVal) => keyVal.split(":").map( (arg) => arg.trim() ) )
                 .reduce( (acc,cur) => acc[cur[0]] = cur[1]; acc {} )  # acc accumulator cur current
      else @toInfo( "toObject(arg)", arg, type, "object", {} )

  # -- Assertion for range with type='int', tolerane with type='float' and 'between' with type='string'
  isRange:(r)       ->   @isArray(r,"int")    and r.length is 2 and r[0]      <= r[1]       # For 'int'
  isTolerance:(w)   ->   @isArray(r,"float")  and w.length is 3 and w[0]-w[2] <= w[1]+w[2]  # For 'float' w[2] is tol
  isBetween:(b)     ->   @isArray(r,"string") and r.length is 2 and r[0]      <= r[1]       # For 'string'

  toRange:(arg) ->
    type = @type(arg)
    if      @isRange(arg)    then arg
    else if type is "int"    then [0,arg]
    else if type is "float"  then [0,@toInt(arg)]
    else if @isArray(arg,'int') and arg.length is 1 then [0,arg[0]]  # zero is  the default minimum
    else @toInfo( "toRange(arg)", arg, type, "range", [] )

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

  # An improved typeof() that follows the convention by returning types in lower case by default.
  # The basic types similar to typeof() returned are:
  Tester.types   = ["string","int","float","boolean","array","object","regex","date","function","bigint","symbol","null","undefined"]
  Tester.typeofs = ["string",  "number",   "boolean",        "object",               "function","bigint","symbol","null","undefined"]
  type:(arg,lowerCase=true) ->
    str = Object::toString.call(arg)
    tok = str.split(" ")[1]
    typ = tok.substring(0,tok.length-1)
    typ = if typ is "Number"
      if Number.isInteger(arg) then "Int" else "Float"
    if lowerCase then typ.toLowerCase() else typ

  scheme:( arg,op="eq" ) ->
    if op is "schema" then "schema" else @type(arg)

  # A more detail type that returns basic types, class, object and function name in upper case
  klass:(arg) ->
    typ = @type(arg,false) # Start with basic type to catch "Null" and "Undefined"
    switch typ
      when "Null"      then "Null"
      when "Undefined" then "Undefined"
      when "Function"  then arg.name
      when "Object"    then arg.constructor.name
      else                  typ

  # mdnType from
  mdnType:( obj, showFullClass ) ->

    # get toPrototypeString() of obj (handles all types)
    if showFullClass and typeof(obj) is "object" 
      return Object.prototype.toString.call(obj)

    if obj is null then return (obj + '').toLowerCase()  # implicit toString() conversion

    deepType = Object.prototype.toString.call(obj).slice(8,-1).toLowerCase()
    if deepType is "generatorfunction" then return "function"

    # Prevent overspecificity (for example, [object HTMLDivElement], etc).
    # Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
    # String.prototype.match is universally supported.

    if deepType.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/)
       deepType
    else
      if (typeof(obj) is 'object' or typeof(obj) is 'function') then 'object' else typeof(obj)

  # Stream is an optional libary for publising statusObject to UIs like RxJS
  injectStream:( stream ) ->
    type = @klass(stream)
    if type is "Stream"
      @stream  = stream
    else
      console.error( "Tester.injectStream( stream ) stream klass must be 'Stream' not", type )
    return

  archiveLocal:( failed, passed ) ->
    localStorage.setItem( "TestsFailed", JSON.stringify( failed ) )
    localStorage.setItem( "TestsPassed", JSON.stringify( passed ) )
    return

  reviewsLocal:( reviewFailed, reviewPassed ) ->
    return if not @debug
    if reviewFailed
      failLocals = localStorage.getItem( "TestsFailed" )
      if failLocals?
        failStatuses = JSON.parse( failLocals )
        for failStatus in failStatuses
          console.log( failStatus ) if @logToConsole
    if reviewPassed
      passLocals = localStorage.getItem( "TestsPassed" )
      if passLocals?
        passStatuses = JSON.parse( passLocals )
        for passStatus in passStatuses
          console.log( passStatus ) if @logToConsole
    return



# -- ES6 exports for single tester instance and its test() and unit() methods
#   tester is instanciates once on its first import subseqent imports
#   get this single instance that holds all testing state

export tester = new Tester()
test = tester.test
unit = tester.unit
fits = tester.fits
export { test, unit, fits }

###
    isOrdered:(o)     -> ( @isNumber(o) and not isNaN(i) ) or @isString(o)
    # if range.length = 3 min=range[0], max=range[1] and tol=range[2]
  # if range.length = 2 min=range[0], max=range[1] and tol=0
  # if range.length = 1 min=0,        max=range[0] and  tol=0
  inRange:( result, range ) ->
    pass  = true
    rType = @type(result)
    if @inArray(rType,["string","number"])
      len = range.length
      min = 0
      max = range[0]
      tol = 0
      if len >= 2
        min = range[0]
        max = range[1]
        tol = range[2] if len is 3
      pass = pass and ( min-tol <= result and result <= max+tol )
    else if rType is "array" and @inArray(@type(result[0]),["string","number"])
      for arg in result
        pass = pass and @inRange( arg, range )
    pass
###