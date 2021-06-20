
class Tester

  constructor:() ->

    # Key settings that are reconfigured through setOptions( options )
    @testing        = true
    @logToConsole   = true
    @archive        = true
    @verbose        = false
    @debug          = false
    @inViteJS       = @isDef(`import.meta.env`)

    @module       = ""
    @suite        = ""
    @text         = null # set by test() that is passed inside eq() and sent to run()
    @passed       = []
    @failed       = []
    @nav          = null
    @stream       = null
    @mix          = null
    @batch        = null

  setOptions:( options ) ->
    @testing        = if options.testing?        then options.testing        else true
    @logToConsole   = if options.logToConsole?   then options.logToConsole   else true
    @archive        = if options.archive?        then options.archive        else true
    @verbose        = if options.verbose?        then options.verbose        else false
    @debug          = if options.debug?          then options.debug          else false
    return

  injectStream:( stream ) ->
    return
    @stream  = stream
    return

  injectNav:(  nav ) ->
    return
    @nav     = nav
    @stream  = nav.stream
    @mix     = nav.mix
    @batch   = nav.batch
    return

  # -- unit -- For invoking the result argument immediately in a module-unit.js file
  #
  # Imports: import { unit } from "../test/Tester.js"
  #          import Vis      from "../draw/Vis.js"
  # Specify: unit( text, result, expect )
  # Example: unit( "can convert hex color to rgb object",  Vis.rgb(0xFFFFFF), {r:255,g:255,b:255} )

  unit:(  text, result, expect ) =>   # unit(...) is always @testing
    return @ if arguments.length == 0 # or not @testing -
    @run( text, result, expect )      # unit() is actually a synonym for run()

  unitLine:(  text, result, expect, error = new Error() ) =>   # unit(...) is always @testing
    return @ if arguments.length == 0 # or not @testing -
    @line( error )
    @run( text, result, expect )      # unit() is actually a synonym for run()

  # -- test -- Pass a closeure in the form of  (t) => { code... }
  # Modeled like the Ava JavaScipt test framework
  # Imports: import { test }     from "../test/Tester.js"
  # Specify: test( text, (t) => { code... }
  # Example:
  #   const add = ( a, b ) ->
  #     a + b
  #   test('2 + 3 = 5', (t) ->
  #     t.eq( add(2,3), 5 ) )

  test:( text, closure ) =>
    return @ if arguments.length == 0 or not @testing
    @text  = text     # @text is latter referenced inside eq()
    @func( closure )
    @

  func:( closure ) =>
    str    = closure.toString()
    tokens = str.split("return t.")
    eqCall = if tokens[1]? then tokens[1].substring( 0, tokens[1].length-3 ) else "?"
    console.log( eqCall, closure, str, tokens[1] )

  eq:( result, expect ) =>
    console.log( "Tester.eq()", { text:@text, result:result, expect:expect } ) if @debug
    @run( @text, result, expect )  # @text is set by test()

  run:( text, result, expect ) =>
    return @ if arguments.length == 0 or not @testing
    console.log( "Tester.run()", { text:text, result:result, expect:expect } ) if @debug
    if @isNot(text) or @isNot(result) or @isNot(expect)
      console.error( "Tester.run() undefine arg(s)", { text:text, result:result, expect:expect } )
      return @
    status = @initStatus( result, expect, text   )
    status = @assert(     result, expect, status )
    @report( status )
    @ # Provides access to tester instance for chaining

  describe:(  module, suite=null ) =>
    @module = module
    @suite  = if suite? then suite else null
    @

  summary:( module=null ) =>
    if module?
      passCount = 0
      failCount = 0
      ++passCount for pass in @passed when pass.assert.module is module
      ++failCount for fail in @failed when fail.assert.module is module
      fullCount = passCount + failCount
      console.log( '-- Summary - for', module )
      console.log( '   ', @pad(passCount,fullCount) + ' tests passed' )
      console.log( '   ', @pad(failCount,fullCount) + ' tests failed' )
      console.log( '   ', @pad(fullCount,fullCount) + ' tests total'  )
    else
      fullCount = @passed.length + @failed.length
      console.log( '-- Summary - for all tests' )
      console.log( '   ', @pad(@passed.length,fullCount) + ' tests passed' )
      console.log( '   ', @pad(@failed.length,fullCount) + ' tests failed' )
      console.log( '   ', @pad(fullCount,     fullCount) + ' tests total'  )
      if @archive
         @archiveLocal(  @failed,     @passed )  # Good place to archive with all tests complete
         @reviewsLocal( { failed:true, passed:false } )
    @

  archiveLocal:( failed, passed ) =>
    localStorage.setItem( 'TestsFailed', JSON.stringify( failed ) )
    localStorage.setItem( 'TestsPassed', JSON.stringify( passed ) )
    return

  reviewsLocal:( reviewFailed, reviewPassed ) ->

    if reviewFailed
      failLocals = localStorage.getItem( 'TestsFailed' )
      if failLocals?
        failStatuses = JSON.parse( failLocals )
        console.log( failStatus ) for failStatus in failStatuses

    if reviewPassed
      passLocals = localStorage.getItem( 'TestsPassed' )
      if passLocals?
        passStatuses = JSON.parse( passLocals )
        console.log( passStatus ) for passStatus in passStatuses

    return

  # At present this is vite.js dependent with import.meta.glob() and its dynamic await importer
  runUnitTestModulesWithViteJS:() =>
    globPtn = "/lib/**/*-unit.js"
    modules = `import.meta.glob("/lib/**/*-unit.js")` # vite.js dependent with nack tics for non standard import
    console.log( "Tester.runUnitTestModulesWithViteJS()", modules, globPtn ) if @debug
    count = 0
    total = Object.keys(modules).length
    for own path, importer of modules
      modules[path]().then( (importer) =>
        console.log( path,   importer ) if @debug
        await importer
        count++
        @summary() if count is total
        return )

  runUnitTestModulesFromPaths:( paths ) =>
    console.log( "Tester.runUnitTestModulesFromPaths()", paths ) if @debug
    count = 0
    total = paths.length
    for path in paths
        console.log( "Tester.runUnitTestModulesFromPaths()", path ) if @debug
        await `import( path /* @vite-ignore */ )`
        count++
        @summary() if count is total
    return

  pad:( n, m ) ->
    len = @numDigits( n )
    tot = @numDigits( m )
    str = n.toString()
    for i in [len...tot]
      str = ' ' + str
    str

  numDigits:( n ) ->
    Math.max( Math.floor( Math.log10( Math.abs(n) ) ), 0 ) + 1

  initStatus:( result, expect, text ) ->
    resultType  = @type(result)
    expectType  = @type(expect)
    resultValue = if resultType isnt 'function' then result else '? function(args...) ?'
    expectValue = if expectType isnt 'function' then expect else '? function(args...) ?'
    module      = text.split('.')[0]
    {
      assert:{ text:text, pass:true, module:module }
      result:{ text:"", type:resultType, value:resultValue }
      expect:{ text:"", type:expectType, value:expectValue }
    }

  assert:( result, expect, status, level=0 ) =>

    # Define checks
    if @isNot(result) or @isNot(expect)
       status.assert.pass = false
       status.assert.text = "-- Failed -- because of null or undefined values fot" + status.assert.text
       status.result.text = @textResult( status, result )
       status.expect.text = @textExpect( status, expect )
       @failed.push( status )
       return status

    # Type checks
    if status.result.type isnt status.expect.type
       status.assert.pass = false
       status.assert.text = "-- Failed -- Result type does match Expect tyoe for " + status.assert.text
       status.result.text = @textResult( status, result )
       status.expect.text = @textExpect( status, expect )
       @failed.push( status )
       return status

    # String, Number, Object and Array check
    # May want to factor in unknowns
    switch status.result.type
      when 'string'   then status.assert.pass = result is expect
      when 'number'   then status.assert.pass = result is expect
      when 'boolean'  then status.assert.pass = result is expect
      when 'object'   then status = @objsEq( result, expect, status, level )
      when 'array'    then status = @arrsEq( result, expect, status, level )
      when 'function' then status.assert.pass = true   # Indicates a skip over when in a recursion
      else                 status.assert.pass = false

    # Update status at only level 0
    if status.assert.pass and level is 0
       status.assert.text = "-- Passed -- " + status.assert.text
       status.result.text = @textResult( status, result )
       status.expect.text = @textExpect( status, expect )
       @passed.push( status )
    else if level is 0
       status.assert.text = "-- Failed -- " + status.assert.text
       status.result.text = @textResult( status, result )
       status.expect.text = @textExpect( status, expect )
       @failed.push( status )
    status

  report:( status ) ->
    @stream.publish( status ) if @isDef(@stream)
    if @logToConsole
       eq = if status.assert.pass then ' = ' else ' != '
       console.log(         status.assert.text + eq, status.expect.value )
       console.log( "   " + status.result.text, status.result.value ) if @verbose or not status.assert.pass
       console.log( "   " + status.expect.text, status.expect.value ) if @verbose or not status.assert.pass
    return

  objsEq:( result, expect, status, level ) ->
    for own key, obj of expect
      if not  result[key]?
        status.assert.pass  = false
        status.assert.text  = "-- Failed -- Result key:#{key} is missing for " + status.assert.text
        status.expect.text  = "Expect type is #{@type(result)} with value #{expect}" # Does no work on objects
        status.result.text  = "Result key:#{key} is missing"
        return status
      else
        status = @assert( result[key], expect[key], status, ++level )
    status.assert.pass  = true
    return status

  arrsEq:( result, expect, status, level ) ->
    if result.length isnt expect.length
      status.assert.pass = false
      status.assert.text = "-- Failed -- Different array lengths fot" + status.assert.text
      status.result.text = "Result length is #{result.length} value is"
      status.expect.text = "Expect length is #{expect.length} value is"
      return status
    for i in [0...expect.length]
      status = @assert( result[i], expect[i], status, ++level )
    status.assert.pass  = true
    return status

  isNul:(d)       =>  @type(d) is   'null'
  isUnd:(d)       =>  @type(d) is   'undefined'
  isDef:(d)       =>  @type(d) isnt 'null' and @type(d) isnt 'undefined'
  isNot:(d)       =>  not @isDef(d)
  isStr:(s)       =>  @isDef(s) and @type(s) is "string" and s.length > 0 and s isnt 'None'
  inStr:(s,e)     =>  @isStr(s) and s.indexOf(e) > -1
  isNum:(n)       =>  @isDef(n) and @type(n) is "number"
  isNaN:(n)       =>  @isNum(n) and Number.isNaN(n)
  isObj:(o)       =>  @isDef(o) and @type(o) is "object"
  inObj:(o,k)     =>  @isObj(o) and @isDef(o[k]) and o.hasOwnProperty(k)
  toKeys:(o)      =>  if @isObj(o) then Object.keys(o) else []
  isVal:(v)       =>  @type(v) is "number" or @type(v) is "string" or typeof(v) is "boolean"
  isFunc:(f)      =>  @isDef(f) and @type(f) is "function"
  isSym:(s)       =>  @isDef(s) and @type(s) is "symbol"
  isEvent:(e)     =>  @isDef(e) and @type(e) is "event"
  isArray:(a)     =>  @isDef(a) and @type(a) is "array" and a.length? and a.length > 0
  inArray:(a,e)   =>  @isArray(a) and a.includes(e)
  inRange:(a,i)   =>  @isArray(a) and 0 <= i and i < a.length
  atIndex:(a,e)   =>  if @isArray(a) then a.indexOf(e) else -1
  head:(a)        =>  if @isArray(a) then a[0]          else null
  tail:(a)        =>  if @isArray(a) then a[a.length-1] else null
  time:()         =>  new Date().getTime()
  hasInteger:(s)  => @isStr(s) and /^\s*(\+|-)?\d+\s*$/.test(s)
  hasFloat:(s)    => @isStr(s) and /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s)
  hasCurrency:(s) => @isStr(s) and /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s)
  hasEmail:(s)    => @isStr(s) and /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)

  # Check if an object or array or string is empty
  isEmpty:(e) =>
    return false if @isNot(e)
    switch @type(e)
      when 'object' then Object.getOwnPropertyNames(e).length is 0
      when 'array'  then e.length is 0
      when 'string' then e.length is 0
      else               false

  # Checks for offical child key which starts with capital letter and isnt an _ or $
  isChild: (key) =>
    a = key.charAt(0)
    b = key.charAt(key.length - 1)
    a is a.toUpperCase() and a isnt '$' and b isnt '_'

  isElement:(e)   =>
    @isDef(e) and @type(e) is 'element' and @isDef(e['clientHeight']) and  e['clientHeight'] > 0

  textResult:( status ) ->
    "Result type is #{status.result.type} with value"

  textExpect:( status ) ->
    "Expect type is #{status.expect.type} with value"

  # Will full implement later
  log:( msg, args... ) ->
    return if not @debug
    console.log( msg, args )
    return

  line:() ->
    console.log( 'Tester.line()', @error )
    return

  # Need to understand type() more and optimize performance
  # We many want to consider class types and   unknowns
  type1:(obj) =>
    key = Object::toString.call(obj).toLowerCase()
    Tester.typeObjects[key] or "object"

  type: do () =>
    classToType = {}

    for name in ["Boolean", "Number", "String", "Function", "Object", "Array", "Date",
      "RegExp", "Symbol", "Event", "Element", "Undefined", "Null"]
      classToType["[object " + name + "]"] = name.toLowerCase()

    (obj) ->
      strType = Object::toString.call(obj)
      classToType[strType] or "object"

Tester.types = ["Boolean", "Number", "String", "Function", "Object", "Array", "Date",
  "RegExp", "Symbol", "Event", "Element", "Undefined", "Null"]

Tester.typeVal = (key) =>
  ["[object " + key + "]"]

Tester.typeObjects = {
  "boolean": Tester.typeVal("Boolean"),  "number":Tester.typeVal("Number"),   "string":Tester.typeVal("String"),
  "function":Tester.typeVal("Function"), "object":Tester.typeVal("Object"),   "array": Tester.typeVal("Array"),
  "date":    Tester.typeVal("Date"),     "regexp":Tester.typeVal("RegExp"),   "symbol":Tester.typeVal("Symbol"),
  "event":   Tester.typeVal("Event"),    "element":Tester.typeVal("Element"), "undefined":Tester.typeVal("Undefined"),
  "null":    Tester.typeVal("Null") }

export tester = new Tester()
test    = tester.test
unit    = tester.unit
log     = tester.log

export { test, unit, log }


###

  # -- bdd -- Behavion Driven Design like Jasmine --
  # Imports: import { bdd }     from "../test/Tester.js"
  #          import Calculator  from "../calculator/Calculator.js"
  #          const  calculator = new Calculator()
  # Specify: bdd( text, closure )
  # Example: bdd( 'can add two positive numbers', =>
  #      result = calculator.add( 2, 3 )
  #      bdd().expect(result).toBe( 5 )

  status.assert.text = "-- Passed -- #{status.result.type}s are equal for " + status.assert.text
  status.assert.text = "-- Failed -- #{status.result.type}s are not equal for " + status.assert.text

  expect:( result ) ->
    @result = result
    @

  toBe:( expect ) =>
    @expect = expect
    @

###