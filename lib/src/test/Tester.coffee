
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

    # Set by @module( moduleId, moduleTx, moduleOn=true )
    @moduleId = ""
    @moduleTx = ""
    @moduleOn = true

    # Set by @describe( methodId, methodTx, methodOn=true )
    @methodId = ""
    @methodTx = ""
    @methodOn = true

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
    if      arguments.length is 0 or not ( @always or ( @testing and @moduleOn and @methodOn ) )
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

  eq:( result, expect ) =>
    @run( @text, result, expect )

  # -- run() scenario is @initStatus(...) @assert(...) @report(...)
  #     console.log( "Tester.run()", { text:text, result:result, expect:expect} ) if  @debug
  run:( text, result, expect ) ->
    return @ if not @testing
    @statusAs = @initStatus( result, expect, text      )
    @statusAs = @assert(     result, expect, @statusAs )
    @    # returns tester instance for chaining

  # Create a new status object for the current test
  initStatus:( result, expect, text ) ->
    {
      assert:{ text:text, pass:true, module:@moduleId, method:@methodId, keys:"" }
      warned:{ text:"", }
      result:{ text:"",   type:@type(result), value:result }
      expect:{ text:"",   type:@type(expect), value:expect }
    }

  # Performs all assertions even a deep equal on objects and arrays
  #   Strong type checking with @type(arg) so asserions are only test when types match
  #   Skips over @type(arg) = "function"
  assert:( result, expect, status, level=0, key=null, index=null ) ->

    # Check values and types
    status = @checkValuesTypes( result, expect, status, key, index )

    # Perform all spec based assertions
    if @isSpec( expect )
      spec = @toSpec(  expect )
      status = switch spec.oper
        when 'enums' then @inEnums(  result, spec, status, level, key, index )
        when "range" then @inRange(  result, spec, status, level, key, index )
        else @examine( false, result, spec, status, "unknown spec.oper #{spec.oper}", key, index )
      return status.assert.pass

    # Perform all comparisions
    type = @type( result )
    status = switch type
      when  "string", "int", "float", "boolean"
                         @valuesEq(   result, expect, status, "eq"  )  # op is not passed aroung
      when "object" then @objectsEq(  result, expect, status, level )
      when "array"  then @arraysEq(   result, expect, status, level )
      else               @unknownsEq( result, expect, status )         # just a fallback
    @examine( status.assert.pass, result, expect, status, "", key, index )

    # Store status in @statuses array and publish
    if level is 0
      @statuses.push(status)
      @stream.publish( @statusSubject, status )  if @isDef(@stream)
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
    if @isStr(info)
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
  unknownsEq:( result, expect, status ) ->
    @noop(     result, expect )
    status.assert.pass  = false
    status.assert.warn += "unknown types for comparision"
    status

  # Deep object equality assertion where all matching keys are examined
  objectsEq:( result, expect, status, level ) ->

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
  arraysEq:( result, expect, status, level ) ->

    # Examine the array lengths
    if result.length isnt expect.length
      info   = " different array lengths"
      info  += " Result length is #{result.length}"
      info  += " Expect length is #{expect.length}"
      status = @examine( false, result, expect, status, info, null, null )

    # Assert each value within the minimum length of the result and expect arrays
    length = Math.min( result.length, expect.length )
    for i in [0...length]
      status = @assert( result[i], expect[i], status, ++level, null, i )
    status

  # @runUnitTests(...) @describe(...) @summary(...)

  runUnitTests:( paths ) ->
    for path in paths
      modulePath = @toPath( path )
      text = "\n-- Started Unit Testing for: #{modulePath.name} in #{modulePath.path}"
      console.log( text )                      if @logging
      @stream.publish( @summarySubject, text ) if @isDef(@stream)
      await `import( path /* @vite-ignore */ )`
    @complete()  # All tests complete so produce then log and publish the final summary
    return

  module:( moduleId, moduleTx, moduleOn=true ) =>
    @moduleId = moduleId
    @moduleTx = moduleTx
    @moduleOn = moduleOn
    @

  describe:( methodId, methodTx, methodOn=true ) =>
    @methodId = methodId
    @methodTx = methodTx
    @methodOn = methodOn
    @

  statusAssertText:( pass, result ) ->
    text = if pass then "\n-- Passed -- " else "\n-- Failed -- "
    if @isStr(@methodId) and @methodId.charAt(0) isnt "-" and @tail(@methodId) is ")"
      text += @strip(@methodId,"","()") + "(" + @toStr(result) + ") "
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
  examine:( pass, result, expect, status, warn, key, index ) ->
    return status if not @verbose and ( key? or index? )
    isSpec = @isSpec( expect )
    eq                   = if pass then "eq" else "not"
    status.assert.text   = @statusAssertText( pass, result )
    status.assert.text  += """#{eq} #{@toStr(expect)}""" if status.result.type isnt "function"
    #tatus.assert.text  += " for " + @text
    status.assert.pass   = pass and status.assert.pass # Asserts a previous status.assert.pass is false
    status.result.text  += @textValue( "Result", result, key, index )
    status.expect.text  += @textValue( "Expect", expect, key, index )  if not isSpec
    status.expect.text  += @textValue( "Spec",   expect, key, index )  if     isSpec
    status.warned.text  += warn
    status

  isGroup:( status, group, pass=null ) ->
    passed = ( status, pass ) => if pass? then status.assert.pass is pass else true
    switch group
      when "all"    then true
      when "method" then status.assert.method is @methodId and passed( status, pass )
      else               status.assert.module is @moduleId and passed( status, pass )

  # Needs to become more of a method / test() block status summary
  summary:( module=null ) ->
    return ""      if @summaryReturn( module )   # blank string turns off logging
    group        = if module? then "module" else "method"
    summaryText  = @title( group, "Summary" )
    summaryText +=  @summaryText( group  )
    summaryText += @totals( group )
    @stream.publish( @summarySubject, summaryText ) if @isDef(@stream)
    summaryText  # for log( test().summary() )

  summaryReturn:( module ) ->
    isReturn =  ( module? and not @moduleOn ) or not @methodOn
    @moduleOn = true if module?
    @methodOn = true
    isReturn

  summaryText:( group ) =>
    text = ""
    for status in @statuses when @isGroup(status,group)
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
    text  = @title( group, "Totals" )
    text += """\n   #{@pad(passCount,fullCount)} tests passed"""
    text += """\n   #{@pad(failCount,fullCount)} tests failed"""
    text += """\n   #{@pad(fullCount,fullCount)} tests total"""
    text

  count:( group, pass ) ->
    n = 0
    for status in tester.statuses when @isGroup(status,group,pass )
      n++
    n

  title:( group, name ) ->
    path   = if group is "module" and @modulePaths[group]? then @modulePaths[group].path else ""
    text = if name is "Totals" then "\n-- Totals -- for " else "\n-- Summary - for "
    text += switch group
      when "method" then """#{@methodId} #{@methodTx}"""
      when "module" then """#{@moduleId} #{@moduleTx}""" + path
      else               """for all tests"""
    text

  complete:() =>
    summaryText  = @totals( "all" )
    @moduleOn    = true
    @methodOn    = true
    @stream.publish( @summarySubject, summaryText ) if @isDef(@stream)
    @log( summaryText ) if @logging

    # Archive since all tests are complete
    if @archive
      @archiveLocal(  @statuses )
      @reviewsLocal()
    @  # for chaining

  # Add a unit test file path to the @modulePaths object  - not called
  toPath:( path ) ->
    dirs   = path.split("/")
    module = @tail(dirs).split("-")[0]
    @modulePaths[module] = { name:module, path:path }
    console.log( "Tester.path(path)", { path:path, dirs:dirs, module:module } ) if  @debug
    @modulePaths[module]

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
