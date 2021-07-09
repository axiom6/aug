
import Spec from "./Spec.js"

# Type is also brought in by class Spec extends Type
class Tester extends Spec

  constructor:() ->
    super()

    # Key settings that can be reconfigured through setOptions( options )
    @testing        = true          # When false all testing is turned off which allows tests to remain in code
    @always         = false         # When true  all testing is turned on  which overrides all other settings
    #logging        = true          # @logging is in class Type
    @archive        = true          # When true archives test status object to localStorage TestsPassed and TestFail
    @verbose        = false         # Adds addition and sometimes mind numbing detail to testStatus objects
    @debug          = false         # Turns on debugs call to console.log(...)
    @schemaKey      = "schema"      # Specifies the key in a JSON file to look up its argidating schema in JSON
    @statusSubject  = "TestStatus"  # Subject for publishing each test status object
    @summarySubject = "TestSummary" # Subject for publishing module and final summaries

    # Short hand for logging in a chained call i.e test(...).log( test().status )
    #  it is important that @log and @error be called in the modules being tested
    #  for viewing the code being tested rather that viewing code in the Tester itself
    @log   = console.log
    @error = console.error

    # Set by @module(moduleTx)
    @lastCalled = ""
    @moduleUnit = ""
    @moduleTx   = ""
    @moduleName = ""    # Set automaticall by @toPath()
    @moduleId   = 0     # Incremented each time @module(text) is called
    @moduleOn   = true  # Set by @on(sw=true) when chained to @module(moduleTx)

    # Set by @describe( methodTx )
    @describeTx   = ""
    @describeName = ""     # Set by @name(name) chained to @describe(...)
    @describeId   = 0      # Incremented each time @describe(text) is called
    @describeOp   = "eq"   #
    @describeOn   = true   # Set by @on(sw=true) when chained to @describe(describeTx)
    @summarized   = false  # Indicates that @summary() has been on the last @describe()
                           #   and wether @complete() should genrate a summarized text
    # Accumulated status objects
    @text        = "" # set by test() that is passed inside eq() and sent to run()
    @modulePaths = {}
    @statusAs    = {}  # Latest status from @assert(...)
    @statuses    = []

    # optional instance for publishing each test status object to to UIs that subscripe to stream
    # set by @injectStream(stream) which enforces that it have @klass 'Stream'
    @stream  = null

  setOptions:( options ) ->
    @testing        = if options.testing?        then options.testing        else true
    @always         = if options.always?         then options.always         else false
    @logging        = if options.logging?        then options.logging        else true
    @archive        = if options.archive?        then options.archive        else true
    @verbose        = if options.verbose?        then options.verbose        else false
    @debug          = if options.debug?          then options.debug          else false
    @schemaKey      = if options.schemaKey?      then options.schemaKey      else "schema"
    @statusSubject  = if options.statusSubject?  then options.statusSubject  else "TestStatus"
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
    if      arguments.length is 0 or @testingOff()
      return @
    else if arguments.length is 2 and @isFunction(args[0])
      closure = args[0]
      @text   = text               # @text is latter referenced inside eq()
      closure(@)                   # Call closure with an injected tester instand
    else if arguments.length is 3 and not @isFunction(args[0])
      result = args[0]
      expect = args[1]
      @text   = text
      @run( text, result, expect ) # returns tester instance for chaining
    @  # returns tester instance for chaining

  # The strongest logic is the last where all 4 condition are checked where as
  #  'module' and 'all' admit larger group of tests
  testingOff:(group="test") ->
    toff = switch group
      when "all"    then not ( @always or   @testing   )
      when "module" then not ( @always or ( @testing and @moduleOn ) )
      else               not ( @always or ( @testing and @moduleOn and @describeOn ) )
    @log = @noop if toff and ( group is "module" or group is "describe" ) # This really shutdowns logging
    #log = @noop if toff and   group is "module"                          # This really shutdowns logging
    toff

  eq:( result, expect ) =>
    @run( @text, result, expect )

  # -- run() scenario is @initStatus(...) @assert(...)
  run:( text, result, expect ) ->
    @statusAs = @initStatus( result, expect, text      )
    @statusAs = switch @describeOp
      when "to" then  @convert( result, expect, @statusAs )
      else            @assert(  result, expect, @statusAs )
    @    # returns tester instance for chaining

  # Create a new status object for the current test
  #   each test status is imprinted with the current module and describe settings
  initStatus:( result, expect, text ) ->
    {
      assert:{ text:text, pass:true, keys:"",
      moduleTx:@moduleTx,       moduleName:  @moduleName,   moduleId:  @moduleId, moduleOn:    @moduleOn,
      describeTx:@describeTx, describeName:@describeName, describeId:@describeId, describeOn:@describeOn,
      describeOp:@describeOp }
      warned:{ text:"", }
      result:{ text:"",   type:@type(result), value:result }
      expect:{ text:"",   type:@type(expect), value:expect }
      errors:""
    }

  # Performs all assertions even a deep equal on objects and arrays
  #   Strong type checking with @type(arg) so asserions are only test when types match
  #   Skips over @type(arg) = "function"
  assert:( result, expect, status, level=0, key=null, index=null ) ->

    # Check values and types
    status = @checkValuesTypes( result, expect, status )
    if not status.assert.pass
     return @examine( false, result, expect, status, key, index )

    # Perform all spec based assertions
    if @isSpec( expect )
      spec = @toSpec(  expect )
      status = switch spec.oper
        when 'regexp' then @inRegexp( result, spec, status, level, key, index )
        when 'enums'  then @inEnums(  result, spec, status, level, key, index )
        when "range"  then @inRange(  result, spec, status, level, key, index )
        else
          status.errors += "unknown spec.oper #{spec.oper}"
          @examine( false, result, spec, status, key, index )
      return status

    # Perform all comparisions
    type = @type( result )
    status = switch type
      when  "string", "int", "float", "boolean"
                         @valuesEq(   result, expect, status, "eq"  )  # op is not passed aroung
      when "object" then @objectsEq(  result, expect, status, level, key   )
      when "array"  then @arraysEq(   result, expect, status, level, index )
      else               @unknownsEq( result, expect, status, level ) # just a fallback
    @examine( status.assert.pass, result, expect, status, key, index )

    # Store status in @statuses array and publish
    if level is 0
      @statuses.push(status)
      @stream.publish( @statusSubject, status )  if @isDef(@stream)
    status

  convert:( result, expect, status ) ->
    status = @checkValuesTypes(   result, expect, status )
    @examine( status.assert.pass, result, expect, status )

  # Check and report on values and types
  #   refactored on Wed July 7, 2021
  checkValuesTypes:( result, expect, status ) ->
    op  = @describeOp
    r   = @type(result)
    e   = @type(expect)
    rIs = () -> "\nResult is type '#{r}'"
    eIs = () -> "\nExpect is type '#{e}'"
    status.errors += switch
      when @isNot(result)            then " Result of #{r} is not defined#{eIs()}"
      when @isNot(expect)            then " Expect of #{e} is not defined#{rIs()}"
      when not @isIn(r,"expects")    then "Expect of type '#{e}' not in #{@toIn('expects')}#{rIs()}"
      when not @isIn(r,"results")    then "Result of type '#{r}' not in #{@toIn('results')}#{eIs()}"
      when r is "function"           then " Result type is 'function#{rIs()}"
      when e is "function"           then " Expect type is 'function#{eIs()}"
      when r isnt e and op isnt "to" then " Types do not match#{rIs()}#{eIs()}"
      else ""
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
  unknownsEq:( result, expect, status ) ->
    @noop(     result, expect )
    status.assert.pass  = false
    status.assert.errors += "unknown types for comparision"
    status

  # Deep object equality assertion where all matching keys are examined
  objectsEq:( result, expect, status, level, key ) ->

    # Insure that result and expect are objects
    if not @isObject(result) or not @isObject(expect)
      status.errors += " either one or both result and expect are not objects"
      status.errors += " Result type is #{@type(result)}"
      status.errors += " Expect type is #{@type(expect)}"
      return @examine( false, result, expect, status, key, null )

    # Check that the result object has all the keys that the expect object has
    #   ? or ( op is "spec" and arg.card is "1" ) )
    for own key, arg of expect when not result[key]?
      status.assert.pass  = false
      status.assert.keys += "\n   missing result " + key

    # Check that the expect object has all the keys that the result  object has
    for own key, arg of result when not expect[key]?
      status.assert.pass  = false
      status.assert.keys += "\n   missing expect " + key

    # Assert each value for the set of keys that result and expect objects share in common
    for own key, obj of expect when result[key]? and expect[key]?
      status = @assert( result[key], obj, status, ++level, key, null )
    status

  # Deep array equality assertion
  arraysEq:( result, expect, status, level, index ) ->

    # Insure that result and expect are arrays
    if not @isArray(result) or not @isArray(expect)
      status.errors += " either one or both result and expect are not arrays"
      status.errors += " Result type is #{@type(result)}"
      status.errors += " Expect type is #{@type(expect)}"
      return @examine( false, result, expect, status, null, index )

    # Examine the array lengths
    if result.length isnt expect.length
      status.errors += " different array lengths"
      status.errors += " Result length is #{result.length}"
      status.errors += " Expect length is #{expect.length}"
      status = @examine( false, result, expect, status, null, index )

    # Assert each value within the minimum length of the result and expect arrays
    length = Math.min( result.length, expect.length )
    for i in [0...length]
      status = @assert( result[i], expect[i], status, ++level, null, i )
    status

  # Determine if a result is enumerated.
  # This method is here in Tester because it call @examine()
  inRegexp:( result, spec, status, level=0, key=null, index=null ) ->
    @noop( level )
    regexp = spec.expect
    pass  = regexp.test(result)
    status.assert.text +=  "inRegexp(...)"
    @examine( pass, result, spec, status, key, index )

  # Determine if a result is enumerated.
  # This method is here in Tester because it call @examine()
  inEnums:( result, spec, status, level=0, key=null, index=null ) ->
    @noop( level )
    enums = spec.expect
    pass  = @inArray( result, enums )
    status.assert.text +=  "inEnums(...)"
    @examine( pass, result, spec, status, key, index )

  # Determine if a result is bounded witnin a range.
  # This method is here in Tester because it call @examine()
  inRange:( result, spec, status, level, key, index ) ->
    range = spec.expect
    pass  = @isRange(range)
    type = @type(result)
    inStrRange   = ( string, range ) -> range[0]          <= string and string <= range[1]
    inIntRange   = ( int,    range ) -> range[0]          <= int    and int    <= range[1]
    inFloatRange = ( float,  range ) -> range[0]-range[2] <= float  and float  <= range[1]+range[2]
    pass = switch type
      when "string" then inStrRange(    result, range )
      when "int"    then inIntRange(    result, range )
      when "float"  then inFloatRange(  result, range )
      when "array"  then @inArrayRange( result, range )
      when "object" then @objectsEq(    result, range, status, level )
      else @toWarn( "inRange()", "unknown range type", result, type, false, (t) -> t.log( t.warn() ) )
    status.assert.text += "inRange(...)"
    @examine( pass, result, spec, status, key, index )

  # @runUnitTests(...) @describe(...) @summary(...)

  runUnitTests:( paths ) ->
    for path in  paths
      modulePath  = @toPath(path) # also sets the @moduleName
      @moduleUnit = "#{modulePath.path} unit test"
      @summarized = false
      await `import( path /* @vite-ignore */ )`
      @complete()     # This is where we know that the unit test module has finished so summarize
    @complete("all")  # All tests complete so produce then log and publish the final summary
    return

  # Add a unit test file path to the @modulePaths object
  toPath:( path ) ->
    dirs        = path.split("/")
    @moduleName = @tail(dirs).split("-")[0]
    @modulePaths[@moduleName] = { name:@moduleName, path:path }
    # console.log( "Tester.path(path)", { path:path, dirs:dirs, module:@moduleName } ) if  @debug
    @modulePaths[@moduleName]

  module:( moduleTx ) =>
    @moduleTx   = moduleTx
    @moduleId  += @moduleId + 1 # ids are one based
    @summarized = false         # set for functional tests when unit tests are not being run
    @lastCalled = "module"
    @

  describe:( describeTx ) =>
    @describeTx  = describeTx
    @describeId += @describeId + 1 # ids are one based
    @lastCalled  = "describe"
    @

  # Only chain to @describe(describeTx)
  name:( name ) ->
    @describeName = name
    @

  # Only chain to @describe(describeTx)
  op:( op="eq" ) ->
    @describeOp = op
    @

  # Can be chained to @describe(describeTx) and @module(moduleTx) to turn test blocks on and off
  on:( sw=true ) ->
    if @lastCalled is "module" then @moduleOn = sw else @describeOn = sw
    @

  # Improved but still needs work
  statusAssertText:( pass, result, status ) ->
    describeName = status.assert.describeName
    text       = if pass then "\n-- Passed -- " else "\n-- Failed -- "
    if @isStr(describeName)
      text += @strip(describeName,"","()") + "(" + @toStr(result) + ") "
      text += @text + " " # if not pass
    else
      text += @text + " "
    text

  textValue:( name, value, key=null, index=null ) ->
    ref = ""
    ref = " at key:#{key}"      if @isStr(key)
    ref = " at index: #{index}" if @isInt(index)
    if name is "Spec"
      spec = value
      "\n   #{name}#{ref} type is '#{spec.type}' with spec '#{spec.spec}' and oper '#{spec.oper}'"
    else
      "\n   #{name}#{ref} type is '#{@type(value)}' with value #{@toStr(value)}"

  # Generates informative text in status
  examine:( pass, result, expect, status, key=null, index=null ) ->
    return status if not @verbose and ( key? or index? )
    isSpec = @isSpec( expect )
    eq                   = if pass then "eq" else "not"
    status.assert.text   = @statusAssertText( pass, result, status )
    status.assert.text  += """#{eq} #{@toStr(expect)}""" if status.result.type isnt "function"
    #tatus.assert.text  += " for " + @text
    status.assert.pass   = pass and status.assert.pass # Asserts a previous status.assert.pass is false
    status.result.text  += @textValue( "Result", result, key, index )
    status.expect.text  += @textValue( "Expect", expect, key, index )  if not isSpec
    status.expect.text  += @textValue( "Spec",   expect, key, index )  if     isSpec
    #tatus.warned.text  += warn
    status

  # Determine if a status is part of module set or part of a describe set
  #  pass = null implies that that status.assert.pass of true or false is
  #    to be ingored while pass = true or false signals that whether a
  #    test passed or failed is to be considered
  isGroup:( group, status, pass=null ) ->
    inSet = ( status, pass ) => if pass? then status.assert.pass is pass else true
    switch group
      when "describe" then inSet( status, pass ) and @describeId is status.assert.describeId
      when "module"   then inSet( status, pass ) and @moduleId is status.assert.moduleId
      when "all"      then inSet( status, pass )
      else                 inSet( status, pass )

  # Aa describe / test() block status summary
  summary:() ->
    return "" if @testingOff("describe")  # returning a blank summaryText string turns off logging
    summaryText  = ""
    summaryText += @titleReport( "module"   ) if not @summarized
    summaryText += @titleReport( "describe" )
    summaryText += @summaryText( "describe" )
    summaryText += @totals(      "describe" )
    @summarized  = true
    @stream.publish( @summarySubject, summaryText ) if @isDef(@stream)
    @reset()     # reset all @describe..  parameters
    summaryText  # for log( test().summary() )

  # No arg implies generate a module summary while an arg of "all" is for all tests
  #  for unit tests in @runUnitTests @complwte(arg) @complwte() is called automaticly
  #  when modules or all tests are completed.
  # @testingAllOff() or @testingModuleOff() determine if @complete(arg) should generate
  # publish and/or log summaries for a module or all the tests
  complete:( arg=null ) =>
    isAll  = @isDef(arg)
    group  = if isAll then "all" else "module"
    return @ if @testingOff(group)
    summaryText  = ""
    summaryText += @titleReport( group )    if not @summarized
    summaryText += @summaryText("describe") if not @summarized
    summaryText += @totals(      group )
    @summarized  = true
    @stream.publish( @summarySubject, summaryText ) if @isDef(@stream)
    @log( summaryText ) if @logging

    # Archive since all tests are complete
    if isAll and @archive
      @archiveLocal(  @statuses )
      @reviewsLocal()
      
    @reset( "module")  # reset all @describe..  and @module.. parameters
    @                  # return this for chaining

  # reset all @describe..  and if group is module the @module.. parameters
  #  this does not reset ids which are incremented by @describe(...) and @module()
  reset:( group ) ->
    @describeTx   = ""
    @describeName = ""
    @describeOp   = "eq"
    @describeOn   = true
    @moduleUnit   = ""
    @log          = console.log
    if group is "module"
      @moduleTx   = ""
      @moduleName = ""
      @moduleOn   = true
    return

  summaryText:( group ) =>
    text = ""
    for status in @statuses when @isGroup(group,status)
      text += @status( status )
    text

  # Generate text from status arg or from @statusAs
  # @statusAs comes from @assert(...)  from the last test run
  # Example: console.log( test().status() )
  #   or      test().log( test().status() )
  status:( status=null ) ->
    status = if status? then status else @statusAs
    text = ""
    text += status.assert.text
    text += status.result.text  if @verbose or not status.assert.pass
    text += status.expect.text  if @verbose or not status.assert.pass
    text += status.warned.text  if @verbose
    text

  totals:( group ) ->
    passCount    = @count( group, true  )
    failCount    = @count( group, false )
    fullCount    = passCount + failCount
    text  = @titleTotals( group )
    text += """\n   #{@pad(passCount,fullCount)} tests passed"""
    text += """\n   #{@pad(failCount,fullCount)} tests failed"""
    text += """\n   #{@pad(fullCount,fullCount)} tests total"""
    text

  count:( group, pass ) ->
    n = 0
    for status in tester.statuses when @isGroup(group,status,pass)
      n++
    n

  titleReport:( group ) ->
    path = if group is "module" and @modulePaths[group]? then @modulePaths[group].path else ""
    switch group
      when "module"
        @log = console.log
        "\n-- Module -- #{@moduleUnit}" +
        "\n-- Titled -- for #{@moduleName} #{@moduleTx}" + path + "\n"
      when "describe"
        if @isStr(@describeName)
          "\n-- Report -- for #{@describeName} #{@describeTx}"
        else
          "\n-- Report -- for #{@describeTx}"
      else
        ""

  # Relies on describe and module instance variables
  titleTotals:( group ) ->
    path = if group is "module" and @modulePaths[group]? then @modulePaths[group].path else ""
    text = "\n-- Totals -- "
    text += switch group
      when "describe"
        if @isStr(@describeName)
          "for #{@describeName} #{@describeTx}"
        else
          "for #{@describeTx}"
      when "module"   then "for #{@moduleName} #{@moduleTx}" + path
      else                 "for all tests"
    text

  # Stream is an optional libary for publising statusObject to UIs like RxJS
  injectStream:( stream ) ->
    type = @klass(stream)
    if type is "Stream"
      @stream  = stream
    else
      console.error( "Tester.injectStream( stream ) stream klass must be 'Stream' not", type )
    return

  archiveLocal:( statuses ) ->
    localStorage.setItem( "Tester", JSON.stringify( statuses ) )
    return

  reviewsLocal:( ) ->
    return if not ( @debug and @logging )
    locals   = localStorage.getItem( "Tester" )
    statuses = JSON.parse( locals )
    for status in statuses
      console.log( status )
    return

# -- ES6 exports for single tester instance and its test() and unit() methods
#   tester is instanciates once on its first import subseqent imports
#   get this single instance that holds all testing state
export tester = new Tester()
test = tester.test
export { test }
