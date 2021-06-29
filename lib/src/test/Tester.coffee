
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
    @text         = "" # set by test() that is passed inside eq() and sent to run()
    @info         = ""
    @code         = ""
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
    @run( text, result, expect, "eq" ) # returns tester instance for chaining

  # Validate and diagnose a result that fits a schema both of type 'object' or 'array'
  #  Very usefull for a result originating from a'.json' file and parsed by JSON.parse(...)
  #  Very usefull for a schema originating from a'.json' file and parsed by JSON.parse(...)
  fits:( text, result, schema ) =>
    return @ if arguments.length is 0 or not @testing
    @text   = text
    @code   = ""
    # if @debug
    #  console.log( "Tester.fits(result,schema)", { type:@type(result), result:result, schema:schema, status:status } )
    @run( text, result, schema, "schema" )  # returns tester for chaining  is expect = @toSchema( expect, op ) needed?

  eq:( result, expect ) =>
    @run( @text, result, expect, "eq" )

  inRange:( result, range ) =>
    @run( @text, result, range, "range" )

  # -- run() scenario is @initStatus(...) @assert(...) @report(...)

  run:( text, result, expect, op ) ->
    return @ not @testing
    console.log( "Tester.run()", { text:text, result:result, expect:expect, op:op } ) if  @debug
    status = @initStatus( result, expect, op, text   )
    status = @assert(     result, expect, op, status )
    @report(              result, expect, op, status )
    @    # returns tester instance for chaining

  initStatus:( result, expect, op, text ) ->
    module = text.split(".")[0]
    eType  = if op is "schema" then "schema" else @type(expect)
    {
      assert:{ text:text, pass:true, module:module, op:op, code:@code, info:"" }
      result:{ text:"", type:@type(result), value:result }
      expect:{ text:"", type:eType,         value:expect }
    }

  # Performs all assertions even a deep equal on objects and arrays
  #   Strong type checking with @type(arg) so asserions are only test when types match
  #   Skips over @type(arg) = "function"
  assert:( result, expect, op, status, level=0, key=null, index=null ) ->

    # Covert expect to a schema object if op is schema
    expect = @toSchema(expect,op)

    # Check values and types
    status = @checkValuesTypes( result, expect, op, status, key, index )

    # Perform all comparisions
    if status.assert.pass
       status = switch @type(result)
         when "string","int","float","boolean" then @valuesEq(   result, expect, op, status )
         when "object"                         then @objectsEq(  result, expect, op, status, level )
         when "array"                          then @arraysEq(   result, expect, op, status, level )
         else                                       @unknownsEq( result, expect, op, status )  # just a fallback
       @examine( status.assert.pass, result, expect, op, status, "", key, index )

    # Store status in @passed and @failed arrays
    if level is 0
       @passed.push(status) if     status.assert.pass
       @failed.push(status) if not status.assert.pass
    status

  # Generates informative text in status
  examine:( pass, result, expect, op, status, info, key, index ) ->
    rType  = @type(result)
    eType  = @typeExpect(expect)
    prefix = if pass then "-- Passed -- " else "-- Failed -- "
    status.assert.text   = prefix + status.assert.text
    status.assert.pass   = pass and status.assert.pass # Asserts a previous status.assert.pass is false
    status.assert.info  += info
    status.assert.code   = if @isString(@code) then @code else ""
    status.result.text  += @textValue( "Result", rType, result, key, index )
    status.expect.text  += @textValue( "Expect", eType, expect, key, index )
    status

  checkValuesTypes:( result, expect, op, status, key, index ) ->
    rType =@type(result)
    eType = @typeExpect(expect,op)
    types = ["string","int","float","boolean","object","array","range","schema"]
    info  = switch
      when @isNot(result)
        " Result of #{rType} is not defined\nExpect is type '#{eType}'"
      when @isNot(expect)
        " Expect of #{eType} is not defined\nResult is type '#{rType}'"
      when rType isnt eType and eType isnt "range" and eType isnt "schema"
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
      @examine( false, result, expect, op, status, info, key, index )
    else
      status

  # Equality check for Tester.opEnums[]
  Tester.opEnums = ["schema","range","eq","le","lt","ge","gt","ne"]
  valuesEq:( result, expect, op, status ) ->
    return true if expect is "any"
    pass = switch op
      when "schema" then @inSchema( result, expect )  # expect is schema
      when "range"  then @inRange(  result, expect )  # expect is range
      when "eq" then result is   expect
      when "le" then result <=   expect
      when "lt" then result <    expect
      when "ge" then result >=   expect
      when "gt" then result >    expect
      when "ne" then result isnt expect
      else           false
    status.assert.pass = pass
    status

  # Just a fallback when types are not fully  screened
  unknownsEq:( result, expect, op, status ) ->
    status.assert.pass  = false
    status.assert.info += "unknown types for comparision"
    status

  textValue:( name, value, key, index ) ->
    ref   = " "
    ref   " at key:#{key} "      if @isString(key)
    ref = " at index: #{index} " if @isNumber(index)
    "#{name}#{ref}where type is #{@type(value)} and value is #{@toString(value)}"

  # Deep object equality assertion where all matching keys are examined
  objectsEq:( result, expect, op, status, level ) ->

    # Check that the expect object has all the keys that the result object has
    for own key, arg of result when  expect[key]?
      status = @examine( false, arg, expect[key], op, status, "missing expect", key, null )

    # Check that the result object has all the keys that the expect object has
    for own key, arg of expect when ( result[key]? or ( op is "schema" and arg.opt is "1" ) )
      status = @examine( false, result[key], arg, op, status, "missing result", key, null )

    # Assert each value for the set of keys that result and expect objects share in common
    for own key, obj of expect when result[key]? and expect[key]?
      status = @assert( result[key], arg, op, status, ++level, key, null )
    status

  # Deep array equality assertion
  arraysEq:( result, expect, op, status, level ) ->
    value = expect

    # Check against the schema when present
    if op is "schema"
      value = expect.value
      if value is "any"
         status.assert.pass = true
         return status
      else if value.size isnt "any" and result.length > value.size
         info   = " Result length exceeds the maximum size #{value.size}"
         info  += " Result length is #{result.length}"
         info  += " Size is #{value.size}"
         return @examine( false, result, expect, op, status, info, null, null )
      else if not @isArray(value)
         return status

    # Examine the array lengths
    if result.length isnt value.length
      info   = " different array lengths"
      info  += " Result length is #{result.length}"
      info  += " Expect length is #{value.length}"
      status = @examine( false, result, expect, op, status, info, null, null )

    # Assert each value within the minimum length of the result and expect arrays
    length = Math.min( result.length, expect.length )
    for i in [0...length]
      status = @assert( result[i], expect[i], op, status, ++level, null, i )

    status

  report:( result, expect, op, status ) ->
    pass = status.assert.pass
    eq   = if pass then "is" else "not"
    @blockText   = "" if @blockClear
    @statusText  = """\n#{status.assert.text} """
    @statusText += """#{eq} #{@toString(expect)}""" if status.result.type isnt "function"
    @statusText += status.assert.info if @isString(status.assert.info)
    @statusText += """\n   #{@textValue( "Result", @type(result),       result )}""" if @verbose or not pass
    @statusText += """\n   #{@textValue( "Expect", @typeExpect(expect), expect )}""" if @verbose or not pass
    #statusText += "\n"+@code                                 if @isString(@code) and ( @verbose or not pass )
    @blockText  += @statusText   # if not @statusClear # keep the status in the block for now
    @statusClear = false
    @blockClear  = false

    if @isDef(@stream)
      @stream.publish( @statusSubject, status )
      @stream.publish( @stringSubject, status )
    return

  # @runUnitTests(...) @describe(...) @summary(...)

  runUnitTests:( paths ) ->
    for path in paths
      modulePath = @path( path )
      console.log( "\n-- Started Unit Testing for: #{modulePath.name} in #{modulePath.path}" ) if @logToConsole
      await `import( path /* @vite-ignore */ )`
    @summary()
    return

  describe:( description, suite=null ) =>
    @description = description
    @suite       = if suite? then suite else null
    @

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

  # Returns a single text status fron the last test run when called in a unit test module like Tester-unit.coffee
  # Example: console.log( unit().status() )
  #   or      unit().log( unit().status() )
  status:() ->
    # @statusClear = true
    @statusText

  # Returns a block of text statuses when callrd in a unit test module like Tester-unit.coffee
  # Example: console.log( unit().block() )
  #   or      unit().log( unit().block() )
  block:() ->
    @blockClear = true
    @blockText

  # Add a unit test file path to the @modules object
  path:( path ) ->
    dirs   = path.split("/")
    module = @tail(dirs).split("-")[0]
    @modules[module] = { name:module, path:path }
    console.log( "Tester.path(path)", { path:path, dirs:dirs, module:module } ) if @debug
    @modules[module]

  # Convert expect to a schema object if op is schema
  isSchema:( v ) ->
    v.cardinality? and v.type? and v.value? and v.range? and v.oper?

    # Cardinality ? = optional 1 = required * = 0 to many + = 1 to many min:max is a range
    Tester.cardinalityEnums = ["?","1","*","+","min:max"]

  # Format "type:ranges or value:length:oper?"
  # Examples:
  #   "array:[[0,360],[0,100],[0,100]]:eq?"
  #   { type:"array", ranges:[[0,360],[0,100],[0,100]], oper:"eq", opt="?" }
  #   "array:[0,255]" } # Range is applies to all array values
  #   { type:"array", ranges:[0,255]
  #   "object:{r:[0,255],g:[0,255],b:[0,255]}
  #   "string:James"
  #   "number:[0,100]"
  #   "boolean"

  toSchema:( expect, op ) ->

    typeExpect = @typeExpect(expect,op)
    schema     = { cardinaly:"1", type:"any", range:["any"], value:"any", oper:"eq",  }

    switch typeExpect
      when "schema","stringRange","intRange","floatRange"
        schema.cardinaly  = "1" # "1" implies key required
        schema.type       = op  # ???
        schema.value      = expect
        schema.range      = if @isArray(  expect  ) then expect else ["any"] # ???
        schema.oper       = op
      when "string"
        schema = @parseSchema( expect, schema )
      when "object"
        schema.cardinaly  = if expect.opt is "?"           then expect.opt    else  "1" # "1" implies key required
        schema.type       = if @isString( expect.type   )  then expect.type   else  "any"
        schema.value      = if expect.value?               then expect.value  else  "any"
        schema.range      = if @isArray(   expect.range  ) then expect.ranges else ["any"]
    schema

  # IN progress
  inSchema:( result, schema ) ->

  # parseSchemaStr
  parseSchema:( expect, schema ) ->
    schema.opt  = if @tail(expect,"?",true) is "?" then "?" else "1" # @tail() pops the '?'
    splits      = expect.split(":")
    length      = splits.length
    schema.type = if length >= 1 then splits[0]
    if length >= 1
      if splits[1][0] is "["
        schema.ranges = @parseRange( splits[1] )
        schema.value  = "any"
      else if splits[1].includes("|")
        schema.ranges = @toEnums( splits[1] )
        schema.value  = "any"
      else
        schema.ranges = "any"
        schema.value  = @toType( splits[1], schema.type )
      schema.length    = if length >= 2 then @toInt( splits[2] ) else "any"
      schema.oper      = if length >= 3 then @toString( splits[3] ) else "eq"
      schema

  # Range parser for @toSchema(expect,op)
  parseRange:( splits ) ->
    range = []
    for split in splits
      switch @type(split)
        when "string"
          for split in splits
            if @head(split,"[[",false) is "[[" and @tail(split,"]]",false) is "]]"
              strs = @toArray(split)
              for str in strs
                range.push[@toArray(str)]
              return range
            else if @head(split) is "[" and @tail(split) is "]"
              range.push[@toArray(split)]
              return range
        when "array"
          if @isArray(split[0])
            for array in split
              range.push(array)
            return range
          else
            range.push[split]
            return range
    range

  # The 9 fundamental type Assertions that leverage @type(arg) the improved typeof(arg)
  # In addition isInt isFloat isBoolean isArray isObject can optionally chech strings
  isString:(s)           ->   @isType(s,"string") and s.length > 0 and s isnt "None"
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
  # isArrayOfType called within @isArray(...) because it assumes array exists
  #   and returns true for 'null' that signifies that the type assertions
  #   on the elements should be skipped
  isArray:( a, type=null, sc=false ) ->
    return @isStringArray(a) if sc
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
  isDef:(d)         ->   @type(d) isnt ( "null" or "undefined" )
  isNumber:(n)      ->   @type(n) is   ( "int"  or "float"     )

  isNot:(d)         ->   not @isDef(d)
  isNaN:(n)         ->   Number.isNaN(n) # @isNumber(n) and

  # Containment assertions where args are always ( value, container )
  inString:(e,s)  ->  @isString(s) and s.includes(e)
  inArray:( e,a)  ->  @isArray(a)  and a.includes(e)
  inObject:(k,o)  ->  @isObject(o) and @isDef(o[k]) and o.hasOwnProperty(k)

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
      when "function"   then @toInfo( "toString(arg)", "unable to convert", arg, "function", "string", "?function?", "?function?" )
      when "null"       then "null"
      when "undefined"  then "undefined"
      when "bigint"     then arg.toString()
      when "symbol"     then arg.toString()   # return of arg.toString() could be a hail mary
      else  @toInfo( "toString(arg)", "unable to convert", arg, type, "string", arg.toString(), arg.toString() )
    if type isnt ( "object" or "array" ) and enc.length > 0 then @enclose(str,enc) else str

  toFloat:( arg ) ->
    type = @type(arg)
    switch type
      when "float" then arg
      when "int"   then parseFloat(arg.toFixed(1)) # Coerces an 'int' like '1' to a 'float' like '1.0'
      when "string"
        if @isStringFloat(arg)  then parseFloat(arg)
        else @toInfo( "toFloat(arg)", "unable to convert", arg, "string", "float", "NaN", NaN )
      else   @toInfo( "toFloat(arg)", "unable to convert", arg,   type,   "float", "NaN", NaN )

  toInt:( arg ) ->
    type = @type(arg)
    switch type
      when "int"    then arg
      when "float"  then Math.round(arg)
      when "string"
        if @isStringInt(arg)  then parseInt(arg)
        else @toInfo( "toInt(arg)", "unable to convert", arg, "string", "int", "NaN", NaN )
      else   @toInfo( "toInt(arg)", "unable to convert", arg,   type,   "int", "NaN", NaN )

  toBoolean:( arg ) ->
    type = @type(arg)
    switch type
      when "boolean" then arg
      when "string"
        switch arg 
          when "true"  then  true
          when "false" then false
          else @toInfo( "toBoolean(arg)", "unable to convert", arg, type, "boolean", "false", false )
      when "int"   then arg isnt 0   # check 0   false may not be a convention
      when "float" then arg isnt 0.0 # check 0.0 false may not be a convention
      else     @toInfo( "toBoolean(arg)", "unable to convert", arg, type, "boolean", "false", false )

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
      else @toInfo( "toArray(arg)", "unable to convert", arg, type, "array", "[]", [] )

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
        @toInfo( "toObject(arg)", "unable to convert", arg, type, "object", "{}", {} )
    obj

  # A gem of method that appends text along with retrStr to @info for detailed reporting of inconsistence
  #  along with a vialble actual return specified by the caller
  toInfo:( method, text, arg, type, typeTo, retnStr, retn ) ->
    @info += "\n  Tester.#{method} #{text} #{@toString(arg)} of '#{type}' to'#{typeTo}' returning #{retnStr}"
    retn

  rangeType:( range ) ->
    type = if range.length > 0 then @type(range[0]) else "null"
    if type is ( "string" or "int" or "float" )
      if @isArray(range,type) then type else "mixed"
    else if type is "array"
      @rangeType(range[0])

  # -- Range Methods --

  # Asserts range with for types "string" or "int" or "float"
  isRange:(range)  ->

    # internal functions called after @rangeType(range) has verified that range
    #   is an array of type "string" or "int" or "float"
    isStringRamge = (r) -> r.length is 2 and r[0]      <= r[1]       # For 'string'
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
      when 'string' then isStringRamge(range)
      when 'int'    then isIntRange(range)
      when 'float'  then isFloatRange(range)
      when 'array'  then isArrayRange(range)
      else  @toInfo( "isRange(range)", "not a range type", range, type, "", "false", false )

  toRange:( type, min=null, max=null, tol=null ) ->
    minType = @type(min)
    maxType = @type(max)
    tolType = @type(tol)
    switch type
      when 'string'
        min = if minType isnt "null" and minType is "string" then min else ""   # need to see if "" is a string min
        max = if maxType isnt "null" and maxType is "string" then max else "z"  # not a good max string
        [ min, max ]
      when 'int'
        min = if minType isnt "null" and minType is "int"    then min else   0
        max = if maxType isnt "null" and maxType is "int"    then max else 100
        [ min, max ]
      when 'float'
        min = if minType isnt "null" and minType is "float"   then min else   0.0
        max = if maxType isnt "null" and maxType is "float"   then max else 100.0
        max = if tolType isnt "null" and tolType is "float"   then tol else max*0.001
        [ min, max, tol ]
      else
        allType  = "#{minType}|#{maxType}"
        allType +="|#{tolType}" if type is "float"
        range    = [min,max]
        range.push(tol) if type is "float"
        @toInfo( "toRange(arg)", "unable to create range for", type, range, allType, "[]", [] )

  inMyRange:(result,range) ->
    pass       = @isRange(range)
    resultType = @type(result)
    rangeType  = @type(result)
    if not pass or resultType iant rangeType
      return @toInfo( "inRange(result,range)", result, resultType, rangeType, "false", false )

    inStringRange = ( string, range ) -> range[0]          <= string and string <= range[1]
    inIntRange    = ( int,    range ) -> range[0]          <= int    and int    <= range[1]
    inFloatRange  = ( float,  range ) -> range[0]-range[2] <= float  and float  <= range[1]+range[2]
    switch resultType
      when "string" then inStringRange(  result, range )
      when "int"    then inIntRange(     result, range )
      when "float"  then inFloatRange(   result, range )
      when "array"  then @inArrayRange(  result, range )
      else @toInfo( "inRamge()", "unknown range type", result, resultType, rangeType, "false", false )

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
      pass = @toInfo( "inRange()", text, result, type, type, "false", false )
    else if nResult < nRange
      text = "OK with more range bounds #{nRange} than needed for result #{nResult}"
      pass = @toInfo( "inRange()", result, text, type, type, "true", true )
      min = Math.min( nResult, nRange )
      for i in [0...min] when @isArray(result[i]) and @isArray(range[i])
        pass = pass and @inMyRange( result[i], range[i] )
    pass

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

  # A deliberate do nothing consumer of arguments and variables
  noop:( ...args ) ->
    if args then false
    return

  # An improved typeof() that follows the convention by returning types in lower case by default.
  # The basic types similar to typeof() returned are:
  Tester.typeEnums   = ["string","int","float","boolean","array","object","regex","date","function","bigint","symbol","null","undefined"]
  Tester.typeofEnums = ["string",  "number",   "boolean",        "object",               "function","bigint","symbol","null","undefined"]
  type:(arg,lowerCase=true) ->
    str = Object::toString.call(arg)
    tok = str.split(" ")[1]
    typ = tok.substring(0,tok.length-1)
    typ = if typ is "Number"
      if Number.isInteger(arg) then "Int" else "Float"
    if lowerCase then typ.toLowerCase() else typ

  # Adds 'range' and 'schema' based on 'op' to @type(arg)
  typeExpect:( expect, op ) ->
    switch op
      when 'range'  then "range"
      when 'schema' then "schema"
      else @type(expect)

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
###