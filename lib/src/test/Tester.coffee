
import Spec from "./Spec.js"

# Type is also brought in by class Spec extends Type
class Tester extends Spec

  constructor:() ->
    super()

    # Key settings that can be reconfigured through setOptions( options )
    @testing        = true          # When false all testing is turned off which allows tests to remain in code
    @always         = false         # When true  all testing is turned on  which overrides all other settings
    #logging        = true          # @logging is in class Type
    @archive        = false         # When true archives test status object to localStorage TestsPassed and TestFail
    @verbose        = false         # Adds addition and sometimes mind numbing detail to testStatus objects
    #debug          = false         # Turns on debugs call to console.log(...)  in Type class
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
    @o           = null
    @f           = null
    @a           = null
    @arg0        = "" # set by test() that is passed inside eq() and sent to run()
    @modulePaths = {}
    @statusAs    = {}  # Latest status from @assert(...)
    @statuses    = []

    # optional instance for publishing each test status object to to UIs that subscripe to stream
    # set by @injectStream(stream) which enforces that it have @toKlass 'Stream'
    @stream  = null

  setOptions:( options ) ->
    @testing        = if options.testing?        then options.testing        else true
    @always         = if options.always?         then options.always         else false
    @logging        = if options.logging?        then options.logging        else true
    @archive        = if options.archive?        then options.archive        else false
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
  test:( args... ) =>
    return @ if args.length is 0 or @testingOff()
    if args.length is 2 and @isFunction(args[1])
      @arg0   = args[0] # @arg0 is latter referenced inside eq()
      closure = args[1]
      closure(@)        # Call closure with an injected tester instance
    else if args.length is 2 and @isObjFuncArgs(args[0]) and not @isFunction(args[1])
      # @log( "test()", {args:args, isArgs:@isObjFuncArgs(args[0]) } ) if @debug
      @arg0  = args[0]
      result = @applyFuncArgs(@arg0)
      expect = args[1]
    else if args.length is 3 and not @isFunction(args[1])
      @arg0  = args[0]
      result = args[1]
      expect = args[2]
      @run( @arg0, result, expect ) # returns tester instance for chaining
    @  # returns tester instance for chaining

  exam:( args ) =>
    @log( "args() one ", { o:@o, f:@f, args:args } )  if @debug
    return @ if args.length is 0 or @testingOff()
    expect = args.pop()
    arg0   = {o:@o,f:@f,a:args}
    @log( "args() two ", { arg0:arg0, expect } )      if @debug
    @test( arg0, expect )

  # typeof is used for the object instance becauses isType(...) provides class type names
  isObjFuncArgs:( arg0 ) =>
    @isObject( arg0 ) and
      arg0.o? and @isType(arg0.o,"object")   and
      arg0.f? and @isType(arg0.f,"function") and
      arg0.a? and @isType(arg0.a,"array")

  applyFuncArgs:( q ) ->
    o  = if q.o? then q.o else @o
    f  = if q.f? then q.f else @f
    a  = if q.a? then q.a else []    
    r  = af.apply( o, a )
    rs = @toStr(r)
    os = @toStr(o.constructor.name)
    fs = f.name()
    as = @toStr(a)
    @log( "apply", "#{rs}=#{os}.#{fs}(#{as})")
    r

  # The strongest logic is the last where all 4 condition are checked where as
  #  'module' and 'all' admit larger group of tests
  testingOff:(group="test") ->
    toff = switch group
      when "all"    then not ( @always or   @testing   )
      when "module" then not ( @always or ( @testing and @moduleOn ) )
      else               not ( @always or ( @testing and @moduleOn and @describeOn ) )
    toff

  eq:( result, expect ) =>
    @run( @arg0, result, expect )

  # -- run() scenario is @initStatus(...) @assert(...)
  run:( arg0, result, expect ) ->
    @statusAs = @initStatus( result, expect, arg0 )
    @statusAs = switch @describeOp
      when "to" then  @convert( result, expect, @statusAs )
      else            @assert(  result, expect, @statusAs )
    @    # returns tester instance for chaining

  # Create a new status object for the current test
  #   each test status is imprinted with the current module and describe settings
  initStatus:( result, expect, arg0 ) ->
    {
      assert:{ text:"", arg0:arg0, pass:true, keys:"",
      moduleTx:@moduleTx,       moduleName:  @moduleName,   moduleId:  @moduleId, moduleOn:    @moduleOn,
      describeTx:@describeTx, describeName:@describeName, describeId:@describeId, describeOn:@describeOn,
      describeOp:@describeOp }
      result:{ text:"", def:true, type:@toType(result), value:result }
      expect:{ text:"", def:true, type:@toType(expect), value:expect }
      warned:{ text:"" }
      errors:{ text:"" }
    }

  # Performs all assertions even a deep equal on objects and arrays
  #   Strong type checking with @toType(arg) so asserions are only test when types match
  #   Skips over @toType(arg) = "function"
  assert:( result, expect, status, level=0, key=null, index=null ) ->

    # Check values and types
    status = @verify( result, expect, status )
    if not status.assert.pass
      status = @examine( false, result, expect, status, key, index )
      return @processStatus( status, level  )

    # Perform all spec based assertions
    if @isSpec( expect )
      spec   = @toSpec( expect )
      pass   = @inSpec( result, spec )
      status = @examine( pass, result, spec, status, key, index )
      return @processStatus( status )

    # Perform all comparisions
    type = @toType( result )
    status = switch type
      when  "string", "int", "float", "boolean"
                         @valuesEq(   result, expect, status, "eq"  )  # op is not passed aroung
      when "object" then @objectsEq(  result, expect, status, level, key   )
      when "array"  then @arraysEq(   result, expect, status, level, index )
      else               @unknownsEq( result, expect, status, level ) # just a fallback
    status = @examine( status.assert.pass, result, expect, status, key, index )
    @processStatus( status, level )

  # Store status in @statuses array and publish
  processStatus:( status, level  ) ->
    if level is 0
      @statuses.push(status)
      @stream.publish( @statusSubject, status )  if @isDef(@stream)
    status

  convert:( result, expect, status ) ->
    status = @verify(                      result, expect, status )
    status = @examine( status.assert.pass, result, expect, status )
    @processStatus( status, 0 )

  # Check and report on values and types
  #   refactored on Wed July 7, 2021
  verify:( result, expect, status ) ->
    op  = @describeOp
    r   = @toType(result)
    e   = @toType(expect)
    rIs = () -> "\nResult is type '#{r}'"
    eIs = () -> "\nExpect is type '#{e}'"
    status.errors.text += switch
      when @isNot(result) and @isNot(expect)
        status.result.def = false
        status.expect.def = false
        " Result of #{r} is not defined#{eIs()}" + "\n"
        " Expect of #{e} is not defined#{rIs()}"
      when @isNot(result)
        status.result.def = false
        " Result of #{r} is not defined#{eIs()}"
      when @isNot(expect)
        status.expect.def = false
        " Expect of #{e} is not defined#{rIs()}"
      when not @isIn(r,"expects")    then "Expect of type '#{e}' not in #{@toIn('expects')}#{rIs()}"
      when not @isIn(r,"results")    then "Result of type '#{r}' not in #{@toIn('results')}#{eIs()}"
      when r is "function"           then " Result type is 'function#{rIs()}"
      when e is "function"           then " Expect type is 'function#{eIs()}"
      when r isnt e and op isnt "to" then " Types do not match#{rIs()}#{eIs()}"
      else ""
    if @isStr(status.errors.text)
      console.log( "Tester.verify(result,expect,status)", { errors:status.errors.text, result:result, expect:expect, status:status } )
      status.assert.pass  = false
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
    status.assert.errors.text += "unknown types for comparision"
    status

  # Deep object equality assertion where all matching keys are examined
  objectsEq:( result, expect, status, level, key ) ->

    # Insure that result and expect are objects
    if not @isObject(result) or not @isObject(expect)
      status.errors.text += " either one or both result and expect are not objects"
      status.errors.text += " Result type is #{@toType(result)}"
      status.errors.text += " Expect type is #{@toType(expect)}"
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
      status.errors.text += " either one or both result and expect are not arrays"
      status.errors.text += " Result type is #{@toType(result)}"
      status.errors.text += " Expect type is #{@toType(expect)}"
      return @examine( false, result, expect, status, null, index )

    # Examine the array lengths
    if result.length isnt expect.length
      status.errors.text += " different array lengths"
      status.errors.text += " Result length is #{result.length}"
      status.errors.text += " Expect length is #{expect.length}"
      status = @examine( false, result, expect, status, null, index )

    # Assert each value within the minimum length of the result and expect arrays
    length = Math.min( result.length, expect.length )
    for i in [0...length]
      status = @assert( result[i], expect[i], status, ++level, null, i )
    status

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
  name:( name ) =>
    @describeName = name
    @

  # Only chain to @describe(describeTx)
  op:( op="eq" ) =>
    @describeOp = op
    @

  obj:(  o ) =>
    @o = o
    @

  func:( f ) =>
    @f = f
    @

# Can be chained to @describe(describeTx) and @module(moduleTx) to turn test blocks on and off
  on:( sw=true ) ->
    if @lastCalled is "module" then @moduleOn = sw else @describeOn = sw
    @

  # Improved but still needs work
  statusAssertText:( pass, result, status ) ->
    describeName = status.assert.describeName
    text       = if pass then "\n-- Passed -- " else "\n-- Failed -- "
    if @isNot(result)
      text += @textValue( "Result", result )
    else if @isStr(describeName)
      console.log( "Tester.statusAssertText()", { arg0:@arg0 } ) if @debug
      text += @strip(describeName,"","()") + "(" + @toStr(@arg0) + ") "
    else
      text += @arg0 + " "
    text

  textValue:( name, value, key=null, index=null ) ->
    ref = ""
    ref = " at key:#{key}"      if @isStr(key)
    ref = " at index: #{index}" if @isInt(index)
    if name is "Spec"
      spec = value
      "\n   #{name}#{ref} type is '#{spec.type}' with match '#{spec.match}' and card '#{spec.card}'"
    else
      "\n   #{name}#{ref} type is '#{@toType(value)}' with value #{@toStr(value)}"

  # Generates informative text in status
  examine:( pass, result, expect, status, key=null, index=null ) ->
    #eturn status if not ( status.result.def and status.expect.def )
    return status if not @verbose and ( key? or  index? )
    isSpec               = @isSpec( expect )
    eq                   = if pass then "eq" else "not"
    status.assert.text   = @statusAssertText( pass, result, status )
    status.assert.text  += """#{eq} #{@toStr(expect)}""" if status.result.type isnt "function"
    #tatus.assert.text  += " " + @arg0
    status.assert.pass   = pass and status.assert.pass # Asserts a previous status.assert.pass is false
    status.result.text  += @textValue( "Result", result, key, index )
    status.expect.text  += @textValue( "Expect", expect, key, index )  if not isSpec
    status.expect.text  += @textValue( "Spec",   expect, key, index )  if     isSpec
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
    summaryText  = ""
    summaryText += @titleReport( "module"   ) if not @summarized
    return summaryText if @testingOff("describe")  # returning a blank summaryText string turns off logging
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
    @o            = null
    @f            = null
    @a            = null
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
    text += status.warned.text  if @verbose # Need to look into this further
    text += status.errors.text  if @verbose # Need to look into this further
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
    type = @toKlass(stream)
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
exam = tester.exam
export { test, exam }
