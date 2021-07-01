
import Type from "./Type.js"

class Tester extends Type

  constructor:() ->
    super()

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
    # @log   = console.log
    # @error = console.error

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
    @module  = ""
    @modules = {}
    @passed  = []
    @failed  = []

    # optional instance for publishing each test status object to to UIs that subscripe to stream
    # set by @injectStream(stream) which enforces that it have @klass 'Stream'
    @stream  = null

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

  # -- test --
  #
  #   import { test } from "../test/Tester.js"
  #   import Vis      from "../draw/Vis.js"

  #   test(  "2 + 3 = 5", (t) ->                # closure form
  #     t.eq( 2 + 3,  5 ) )
  #
  #   test(  "2 + 3 = 5", 2 + 3, 5 )            # Direct result and expect arguments
  #
  #   test( "Vis.rgb() converts hex color to rgb object",  Vis.rgb(0xFFFFFF), {r:255,g:255,b:255} )
  test:( text, args... ) =>
    if      arguments.length is 0 or not @testing
      return @
    else if arguments.length is 2 and @isFunction(args[0])
      closure = args[0]
      @text   = text               # @text is latter referenced inside eq()
      @code   = closure.toString() # @code is latter referenced inside eq()
      closure(@)                   # Call closure with an injected tester instand
    else if arguments.length is 3 and not @isFunction(args[0])
      result = args[0]
      expect = args[1]
      @text   = text
      @code   = ""
      @run( text, result, expect ) # returns tester instance for chaining
    @  # returns tester instance for chaining

  eq:( result, expect ) =>
    @run( @text, result, expect )



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
        when 'enums' then @inEnums(  result, schema, status, level, key, index )
        when "range" then @inRange(  result, schema, status, level, key, index )
        else @examine( false, result, schema, status, "unknown schema.oper #{schema.oper}", key, index )
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
    isSchema = @isSchema( expect )
    prefix = if pass then "-- Passed -- " else "-- Failed -- "
    status.assert.text   = prefix + status.assert.text
    status.assert.pass   = pass and status.assert.pass # Asserts a previous status.assert.pass is false
    status.assert.info  += info
    status.assert.code   = if @isString(@code) then @code else ""
    status.result.text  += @textResult( result, key, index )
    status.expect.text  += @textExpect( expect, key, index )  if not isSchema
    status.expect.text  += @textSchema( expect, key, index )  if     isSchema
    status


  report:( result, expect, status ) ->
    pass = status.assert.pass
    eq   = if pass then "is" else "not"
    @blockText   = "" if @blockClear
    @statusText  = """\n#{@module}.#{status.assert.text} """
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
    "Schema#{ref}where type is #{schema.type} and spec is #{schema.spec} with oper #{schema.oper}"

  # @runUnitTests(...) @describe(...) @summary(...)

  runUnitTests:( paths ) ->
    for path in paths
      modulePath = @path( path )
      console.log( "\n-- Started Unit Testing for: #{modulePath.name} in #{modulePath.path}" ) if @logToConsole
      await `import( path /* @vite-ignore */ )`
    @summary()
    return

  describe:( module, suite=null, description=null ) =>
    @module      = module
    @suite       = if suite?       then suite       else null
    @description = if description? then description else null
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
    pass = @isDef(type) and @isIn( type,    "results" )
    @isInfo( pass, "Not a Result", type, Type.results, (t) -> t.log( t.info() ) )

  isExpect:(expect,oper) ->
    @isOper(oper)
    @isDef(expect)
    type = @type(expect)
    pass = switch oper
      when "range" then @isRange(expect)
      when "enums" then @isEnums(expect,oper,type)
      when "eq"    then @isResultType(type)
      else @isInfo( false, "Not a Expect oper", oper, Type.opers, (t) -> t.log( t.info() ) )
    @isInfo( pass, "Not a Expect", type, Type.expects )

  isExpectType:( type ) ->
    pass = @isDef(type) and @isIn( type, "expects"      )
    @isInfo( pass, "Not a Expect", type, Tester.expects, (t) -> t.log( t.info() ) )

  isOper:( oper ) ->
    pass = @isDef(oper) and  @isIn( oper, "opers" )
    @isInfo( pass, "Not an 'oper'", oper, "opers", (t) -> t.log( t.info() ) )

  isCard:( card ) ->
    pass = @isDef(card) and @isIn( card, "cards" )
    @isInfo( pass, "Not a 'card'", card, Type.cards, (t) -> t.log( t.info() ) )

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
        expect, type, "schema", @toString(schema), schema, (t) -> t.log( t.info() ) )

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

  inEnums:(   result, schema, status, level, key, index ) ->
    @noop( level )
    enums = schema.expect
    pass  = @inArray( result, enums )
    @examine( pass, result, schema, status, "inEnums(...)", key, index )

  inRange:( result, schema, status, level, key, index ) ->
    range = schema.expect
    pass  = @isRange(range)
    type = @type(result)

    inStringRange = ( string, range ) -> range[0]          <= string and string <= range[1]
    inIntRange    = ( int,    range ) -> range[0]          <= int    and int    <= range[1]
    inFloatRange  = ( float,  range ) -> range[0]-range[2] <= float  and float  <= range[1]+range[2]
    pass = switch type
      when "string" then inStringRange(   result, range )
      when "int"    then inIntRange(      result, range )
      when "float"  then inFloatRange(    result, range )
      when "array"  then @inArrayRange(   result, range )
      when "object" then @objectsEq(      result, range, status, level )
      else @toInfo( "inRange()", "unknown range type", result, type, type, "false", false, (t) -> t.log( t.info() ) )
    @examine( pass, result, schema, status, "inRange(...)", key, index )

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
      pass = @toInfo( "inRange()", text, result, type, type, "false", false, (t) -> t.log( t.info() ) )
    else if nResult < nRange
      text = "OK with more range bounds #{nRange} than needed for result #{nResult}"
      pass = @toInfo( "inRange()", result, text, type, type, "true", true, (t) -> t.log( t.info() ) )
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
        enums = @toInfo( "toEnums(arg)", "unable to convert", arg, type, "enums", "[]", [], (t) -> t.log( t.info() ) )
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
      else  @toInfo( "isRange(range)", "not a range type", range, type, "", "false", false, (t) -> t.log( t.info() ) )

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

  # Override type.isIn() with addional Tester type arrays
  isIn:( type, key ) ->
    if        Type[key]? then   Type[key].includes(type)
    else if Tester[key]? then Tester[key].includes(type)
    else @isInfo( false, "key #{key} missing for", type, [], (t) -> t.log( t.info() ) )

Tester.specs   = ["range","enums"]               # high level schema based comparision specs
Tester.opers   = ["eq","le","lt","ge","gt","ne"] # low  level value  based comparison  ooers 'eq' default
Tester.cards   = ["n","?","*","+","min to max"]  # cards  1 required, ? optional, * 0 to many, + 1 to many, m:m range

# -- ES6 exports for single tester instance and its test() and unit() methods
#   tester is instanciates once on its first import subseqent imports
#   get this single instance that holds all testing state

export tester = new Tester()
test = tester.test
unit = tester.unit
fits = tester.fits
export { test, unit, fits }
