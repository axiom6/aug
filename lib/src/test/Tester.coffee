
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
    @run( text, result, expect ) # returns tester instance for chaining

  eq:( result, expect ) =>
    @run( @text, result, expect )

  # -- info reporting ---

  # A gem methods that appends text along with retrStr to @info for detailed reporting of inconsistence
  #  along with a vialble actual return specified by the caller
  toInfo:( method, text, arg, type, typeTo, retnStr, retn ) ->
    @info += "\n  Tester.#{method} #{text} #{@toString(arg)} of '#{type}' to'#{typeTo}' returning #{retnStr}"
    retn

  isInfo:( pass, text, type, types ) ->
    return true if pass
    @info += "\n  #{text} of type '#{type}' not in '#{types}'"
    false

  inInfo:( pass, result, expect, oper, spec, text ) ->
    prefix = if pass then "-- Passed --" else "-- Failed --"
    condit = if pass then "matches "      else "no match"
    @info += "\n  #{prefix} #{result} #{condit} #{expect} with oper #{oper} and spec #{spec} #{text}"
    false

  # -- run() scenario is @initStatus(...) @assert(...) @report(...)
  #     console.log( "Tester.run()", { text:text, result:result, expect:expect} ) if  @debug
  run:( text, result, expect ) ->
    return @ not @testing
    status = @initStatus( result, expect, text   )
    status = @assert(     result, expect, status )
    @report(              result, expect, status )
    @    # returns tester instance for chaining

  # Create a new status object for the current test
  initStatus:( result, schema, text ) ->
    module = text.split(".")[0]
    {
      assert:{ text:text, pass:true, module:module, code:@code, info:"" }
      result:{ text:"", type:@type(result), value:result }
      schema:{ text:"", type:schema.type,   value:schema.expect }  # Need to reconsider
    }

  # Performs all assertions even a deep equal on objects and arrays
  #   Strong type checking with @type(arg) so asserions are only test when types match
  #   Skips over @type(arg) = "function"
  assert:( result, expect, status, level=0, key=null, index=null ) ->

    # Check values and types
    status = @checkValuesTypes( result, expect, status, key, index )

    # Perform all schema based assertions
    if @isSchema( expect )
      schema = @toSchema(  expect )
      status.assert.pass = switch schema.oper
        when 'enums' then @inEnums(  result, schema )
        when "range" then @inRange(  result, schema )
        else @examine( false, result, schema.expect, status, "unknow schema.oper #{schema.oper}" )
      return status.assert.pass

    # Perform all comparisions
    type = @type( result )
    isValue = (type) -> @isIn( type, "values" )
    status = switch type
      when  isValue( type ) then @valuesEq(   result, expect, status, "eq"  )  # op is not passed aroung
      when "object"         then @objectsEq(  result, expect, status, level )
      when "array"          then @arraysEq(   result, expect, status, level )
      else                       @unknownsEq( result, expect, status )         # just a fallback
    @examine( status.assert.pass, result, expect, status, "", key, index )

    # Store status in @passed and @failed arrays
    if level is 0
       @passed.push(status) if     status.assert.pass
       @failed.push(status) if not status.assert.pass
    status

  # Check and report on values and types
  checkValuesTypes:( result, expect, status, key, index ) ->
    rType  = @type(result)
    eType  = @type(expect)
    info  = switch
      when @isNot(result)
        " Result of #{rType} is not defined\nExpect is type '#{eType}'"
      when @isNot(expect)
        " Expect of #{eType} is not defined\nResult is type '#{rType}'"
      when rType isnt eType and not @isIn( eType, "specs" )
        " Types do not match\nResult type is '#{rType}'\nExpect type is '#{eType}'"
      when rType is "function"
        " Result type is 'function'\nExpect type is '#{eType}'"
      when eType is "function"
        " Expect type is 'function'\nResult type is '#{rType}'"
      when not @isIn( rType, "results" )
        " Result is type '#{rType}' an unknown type is type '#{eType}'"
      when not @isIn( eType, "expects" )
        " Result is type '#{rType}'\nExpect is type '#{eType}' an unknown type"
      else
        ""
    if @isString(info)
      @examine( false, result, expect, status, info, key, index )
    else
      status

  valuesEq:( result, expect, status, oper ) ->
    return true if expect is "any"
    pass = switch oper
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
  unknownsEq:( result, schema, status ) ->
    status.assert.pass  = false
    status.assert.info += "unknown types for comparision"
    status

  # Deep object equality assertion where all matching keys are examined
  objectsEq:( result, expect, status, level ) ->

    # Check that the expect object has all the keys that the result object has
    for own key, arg of result when  expect[key]?
      status = @examine( false, arg, expect[key], status, "missing expect", key, null )

    # Check that the result object has all the keys that the expect object has
    #   ? or ( op is "schema" and arg.card is "1" ) )
    for own key, arg of expect when result[key]?
      status = @examine( false, result[key], arg, status, "missing result", key, null )

    # Assert each value for the set of keys that result and expect objects share in common
    for own key, obj of expect when result[key]? and expect[key]?
      status = @assert( result[key], arg, status, ++level, key, null )
    status

  # Deep array equality assertion
  arraysEq:( result, expect, status, level ) ->

    # Examine the array lengths
    if result.length isnt value.expect
      info   = " different array lengths"
      info  += " Result length is #{result.length}"
      info  += " Expect length is #{expect.length}"
      status = @examine( false, result, expect, status, info, null, null )

    # Assert each value within the minimum length of the result and expect arrays
    length = Math.min( result.length, expect.length )
    for i in [0...length]
      status = @assert( result[i], expect[i], status, ++level, null, i )

    status

  # Generates informative text in status
  examine:( pass, result, expect, status, info, key, index ) ->
    prefix = if pass then "-- Passed -- " else "-- Failed -- "
    status.assert.text   = prefix + status.assert.text
    status.assert.pass   = pass and status.assert.pass # Asserts a previous status.assert.pass is false
    status.assert.info  += info
    status.assert.code   = if @isString(@code) then @code else ""
    status.result.text  += @textResult( result, key, index )
    status.expect.text  += @textExpect( expect, key, index )
    status

  report:( result, expect, status ) ->
    pass = status.assert.pass
    eq   = if pass then "is" else "not"
    @blockText   = "" if @blockClear
    @statusText  = """\n#{status.assert.text} """
    @statusText += """#{eq} #{@toString(expect)}""" if status.result.type isnt "function"
    @statusText += status.assert.info if @isString(status.assert.info)
    @statusText += """\n   #{@textResult( result )}""" if @verbose or not pass
    @statusText += """\n   #{@textExpect( expect )}""" if @verbose or not pass
    #statusText += "\n"+@code                                 if @isString(@code) and ( @verbose or not pass )
    @blockText  += @statusText   # if not @statusClear # keep the status in the block for now
    @statusClear = false
    @blockClear  = false

    if @isDef(@stream)
      @stream.publish( @statusSubject, status )
      @stream.publish( @stringSubject, status )
    return

  textResult:( result, key=null, index=null ) ->
    ref   = " "
    ref   " at key:#{key} "      if @isString(key)
    ref = " at index: #{index} " if @isInt(index)
    "Result#{ref}where type is #{@type(result)} and value is #{@toString(result)}"

  textExpect:( expect, key=null, index=null ) ->
    ref   = " "
    ref   " at key:#{key} "      if @isString(key)
    ref = " at index: #{index} " if @isInt(index)
    "Expect#{ref}where type is #{@type(expect)} and value is #{@toString(expect)}"

  textSchema:( schema, key=null, index=null ) ->
    ref   = " "
    ref   " at key:#{key} "      if @isString(key)
    ref = " at index: #{index} " if @isInt(index)
    "Schema#{ref}where type is #{schema.type} and value is #{@toString(schema.expect)}"

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
    console.log( "Tester.path(path)", { path:path, dirs:dirs, module:module } ) if  @debug
    @modules[module]

  isEnums:( arg, oper, type ) ->
    oper is "enums" and @isArray(arg,type) and @isResultType(type)

  # Check if an arg like expect is a 'schema'
  verifySchema:( arg ) ->
    @conditions( @isObject(arg), @isResultType(arg.type), @isExpect(arg.expect,arg.oper), @isCard(arg.card) )

  isResultType:( type ) ->
    pass = @isDef(type) and @isIn( type,      "results" )
    @isInfo( pass, "Not a Result", type, Tester.results )

  isExpect:(expect,oper) ->
    @isOper(oper)
    @isDef(expect)
    type = @type(expect)
    pass = switch oper
      when "range" then @isRange(expect)
      when "enums" then @isEnums(expect,oper,type)
      when "eq"    then @isResultType(type)
      else @isInfo( false, "Not a Expect oper", oper, Tester.opers )
    @isInfo( pass, "Not a Expect", type, Tester.expects )

  isExpectType:( type ) ->
    pass = @isDef(type) and @isIn( type, "expects"      )
    @isInfo( pass, "Not a Expect", type, Tester.expects )

  isOper:( oper ) ->
    pass = @isDef(oper) and  @isIn( oper, "opers" )
    @isInfo( pass, "Not an 'oper'", oper, "opers" )

  isCard:( card ) ->
    pass = @isDef(card) and @isIn( card, "cards" )
    @isInfo( pass, "Not a 'card'", card, Tester.cards )

  # This approach insures that all conditions are checked and messages sent
  #   then all arg returns are anded together to determine a final pass or fail
  conditions:( args... ) ->
    pass = true
    pass = pass and arg for arg in args
    pass

  isSchema:( expect ) ->
    type = @type(expect)
    @isSchemaParse( expect, type ) or @isSchemaObject( expect, type )

  # In the first t
  toSchema:( expect ) ->
    type   = @type(expect)
    schema = { type:"any", oper:"any", expect:"any", card:"1", spec:""  }
    schema = switch type
      when @isSchemaParse(  expect, type ) then @toSchemaParse(  schema, expect )
      when @isSchemaObject( expect, type ) then @toSchemaObject( schema, expect )
      else @toInfo( "toSchema(expect)", "expect not schema 'string' or 'object'",
        expect, type, "schema", @toString(schema), schema )

  isSchemaParse:  ( arg, type ) ->
    type is "string" and arg includes(":")

  # toSchemaParse:( schema, arg )
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
  toSchemaParse:( schema, arg ) ->
    splits = arg.split(":")
    length = splits.length
    if length >= 1                                        # type
      schema.type = splits[0]
    if length >= 1                                        # expect
      schema.spec splits[1]
      if splits[1].includes("|")                         #   enum
        schema.oper   = "enums"
        schema.expect = @toEnums( splits[1] )
      else if @isStringEnclosed( "[", splits[1], "]" )  #    range array
        schema.oper   = "range"
        schema.expect = @toArray( splits[1] )
    else if @isStringEnclosed( "{", splits[1], "}" )   #    range object
      schema.oper   = "range"
      schema.expect = @toObject( splits[1] )
    else
      schema.oper   = "any"
      schema.expect = "any"
    if length >= 2                                        # card i.e cardinaliry
      schema.oper = splits[2]
    schema

  isSchemaObject: ( arg, type ) ->
    type is "object" and arg.oper? and arg.expect? # and arg.type? and arg.card?

  toSchemaObject:( schema, arg ) ->
    schema.type   = if arg.type?   then arg.type  else "any"
    schema.oper   = if arg.oper?   then arg.oper  else "any"
    schema.expect = if arg.expect? then arg.expect else "any"
    schema.card   = if arg.card?   then arg.card  else  "1"  # required
    schema.spec   = if arg.spec?   then arg.spec  else  ""   # required
    schema

  isSchemaValue:  ( type )  ->
    @isIn( type, "results" )

  # Holding off on this conversion. Instead we will just return an expect value
  toSchemaValue:( schema, arg, type ) ->
    schema.type   = type
    schema.oper   = "eq"
    schema.expect = arg
    schema.card   = "1"  # required
    schema.spec   = ""
    schema

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
  isDef:(d)         ->   @isIn( @type(d), "undefs"  )
  isNumber:(n)      ->   @isIn( @type(n), "numbers" )
  isNot:(d)         ->   not @isDef(d)
  isNaN:(n)         ->   Number.isNaN(n) # @isNumber(n) and

  # Containment assertions where args are always ( value, container )
  inString:(e,s)  ->  @isString(s) and @isDef(e) and s.includes(e)
  inArray:( e,a)  ->  @isArray(a)  and @isDef(e) and a.includes(e)
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
    @isString(str) and ( str is "true" or str is "false" )

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
    if not @isIn( type "manys" ) and enc.length > 0 then @enclose(str,enc) else str

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
        enums = @toInfo( "toEnums(arg)", "unable to convert", arg, type, "enums", "[]", [] )
    enums

  inEnums:(   arg, enums ) ->
    @inArray( arg, enums )

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

  # toRange:( type, min=null, max=null, tol=null ) -> in Tester.big.coffee


  # Adds 'range' 'enums' and 'schema' based on 'op' to @type(arg)
  typeExpect:( expect, op ) ->
    switch op
      when 'range'  and @isRange(expect)  then "range"
      when 'enums'  and @isEnums(expect)  then "enums"
      when 'schema' and @isSchema(expect) then "schema"
      else @type(expect)

  inRange:( result, range, op="range" ) ->
    pass       = @isRange(range)
    resultType = @type(result)
    rangeType  = @typeExpect(result,op)
    if not pass or resultType iant rangeType
      return @toInfo( "inRange(result,range,op)", result, resultType, rangeType, "false", false )

    inStringRange = ( string, range ) -> range[0]          <= string and string <= range[1]
    inIntRange    = ( int,    range ) -> range[0]          <= int    and int    <= range[1]
    inFloatRange  = ( float,  range ) -> range[0]-range[2] <= float  and float  <= range[1]+range[2]
    switch resultType
      when "string" then inStringRange(   result, range )
      when "int"    then inIntRange(      result, range )
      when "float"  then inFloatRange(    result, range )
      when "array"  then @inArrayRange(   result, range )
      when "object" and @isObject(rangeType) then @inObjectRange(  result, range )
      when "enums"  and @isEnums(rangeType)  then @inEnumsRange(   result, range )
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
  type:(arg,lowerCase=true) ->
    str = Object::toString.call(arg)
    tok = str.split(" ")[1]
    typ = tok.substring(0,tok.length-1)
    typ = if typ is "Number"
      if Number.isInteger(arg) then "Int" else "Float"
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

  # mdnType:( obj, showFullClass ) ->  in Tester.big.coffee

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

    isIn:( type, key ) ->
      if Tester[key]?
         Tester[key].includes(type)
      else
        @isInfo( false, "key #{key} missing for", type, [] )

# All Tester[key] arrays
Tester.undefs  = ["null","undefined"]
Tester.numbers = ["int","float"]
Tester.ranges  = ["string","int","float"]
Tester.values  = ["string","int","float","boolean"]
Tester.manys   = ["object","array"]
Tester.results = ["string","int","float","boolean","object","array"]
Tester.expects = Tester.results.concat(["schema","range","enums","amy"])
Tester.typeofs = ["string","number","boolean","object","function","bigint","symbol","null","undefined"]
Tester.types   = Tester.typeofs.concat(["int","float","array","regex","date"])
Tester.types   = Tester.remove("number", Tester.types ) # number is now either 'int' or 'float'
Tester.specs   = ["range","enums"]               # high level schema based comparision specs
Tester.opers   = ["eq","le","lt","ge","gt","ne"] # low  level value  based comparison  ooers 'eq' default
Tester.cards   = ["n","?","*","+","min to max"]
     # cards  1 required, ? optional, * 0 to many, + 1 to many, min:max a range

Tester.remove( e, a ) ->
  index = a.indexOf(e)
  a.splice( index, 1 ) if index > -1
  a

# -- ES6 exports for single tester instance and its test() and unit() methods
#   tester is instanciates once on its first import subseqent imports
#   get this single instance that holds all testing state

export tester = new Tester()
test = tester.test
unit = tester.unit
fits = tester.fits
export { test, unit, fits }
