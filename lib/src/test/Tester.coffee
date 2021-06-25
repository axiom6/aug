
class Tester

  constructor:() ->

    @stream = null # Optional streaming publisher module that is set by @injectStream( stream )

    # Key settings that can be reconfigured through setOptions( options )
    @testing        = true          # When false all testing is turned which allows tests to remain in code
    @logToConsole   = true
    @archive        = true          # When true archives test status object to localStorage TestsPassed and TestFail
    @verbose        = false         # Adds addition and sometimes mind numbing detail to testStatus objects
    @debug          = false         # Turns on debugs call to console.log(...)
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
    @text         = null # set by test() that is passed inside eq() and sent to run()
    @statusText   = ""
    @statusClear  = true
    @blockText    = ""
    @blockClear   = true
    @code         = ""
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
    @statusSubject  = if options.statusSubject?  then options.statusSubject  else "TestStatus"
    @stringSubject  = if options.stringSubject?  then options.stringSubject  else "TestString"
    @summarySubject = if options.summarySubject? then options.summarySubject else "TestSummary"
    return

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
    return @ if arguments.length is 0 or not @testing
    @text     = text               # @text is latter referenced inside eq()
    @code     = closure.toString() # @code is latter referenced inside eq()
    closure(@)
    @

  # -- unit -- For invoking the result argument immediately in a module-unit.js file
  #
  # Imports: import { unit } from "../test/Tester.js"
  #          import Vis      from "../draw/Vis.js"
  # Specify: unit( text, result, expect )
  # Example: unit( "can convert hex color to rgb object",  Vis.rgb(0xFFFFFF), {r:255,g:255,b:255} )

  unit:(  text, result, expect ) =>   # unit(...) is always @testing
    return @ if arguments.length is 0 # or not @testing -
    @text   = text
    @code   = ""
    @run( text, result, expect, "eq", @code )
    @

  eq:( result, expect ) =>
    @run( @text, result, expect, "eq", @code )

  run:( text, result, expect, op, code ) =>
    return @ if arguments.length == 0 or not @testing
    console.log( "Tester.run()", { text:text, result:result, expect:expect, op:op } ) if  @debug
    ###
    if @isNot(text) or @isNot(result) or @isNot(expect)  or @isNot(op)
      console.error( "Tester.run() undefine arg(s)", { text:text, result:result, expect:expect, op:op } )
      return @
    ###
    status = @initStatus( result, expect, text, op, code )
    status = @assert(     result, expect, status )
    @report( status, result, expect )
    @ # Provides access to tester instance for chaining

  describe:( description, suite=null ) =>
    @description = description
    @suite       = if suite? then suite else null
    @

  pad:( n, m ) ->
    len = @numDigits( n )
    tot = @numDigits( m )
    str = n.toString()
    for i in [len...tot]
      str = ' ' + str
    str

  numDigits:( n ) ->
    Math.max( Math.floor( Math.log10( Math.abs(n) ) ), 0 ) + 1

  initStatus:( result, expect, text, op, code ) ->
    resultType  = @type(result)
    expectType  = @type(expect)
    module      = text.split('.')[0]
    {
      assert:{ text:text, pass:true, module:module, op:op, code:code, info:"", exam:false }
      result:{ text:"", type:resultType, value:result }
      expect:{ text:"", type:expectType, value:expect }
    }

  # Performs all assertions even a deep equal on objects and arrays
  #   Strong type checking with @type(val) so asserions are only test when types match
  #   Skips over @type(val) = "function"
  assert:( result, expect, status, level=0 ) =>

    # Set types
    resultType  = @type(result)
    expectType  = @type(expect)

    # Define checks
    if @isNot(result) or @isNot(expect)
       status.assert.pass = false
       status.assert.info = " null or undefined values"
       status.result.text = @textResult( status, result )
       status.expect.text = @textExpect( status, expect )
       @failed.push( status )
       return status

    # Type checks
    if resultType isnt expectType or ( resultType is "function" or expectType is "function" )
       status.assert.pass = false
       status.assert.text = if resultType isnt expectType
         "-- Failed -- " + status.assert.text + " types do not match"
       else
         "-- Failed -- " + status.assert.text + " both types are functions"
       status.result.text = @textResult( status, result )
       status.expect.text = @textExpect( status, expect )
       @failed.push( status )
       return status

    # string, number, boolean, object, array and check
    # May want to factor in unknowns
    if level > 0 and resultType is 'string'
      console.log( 'assert()', { resultType:resultType, result:result, expect:expect } )
    switch resultType
      when 'string'   then status.assert.pass = result is expect
      when 'number'   then status.assert.pass = result is expect
      when 'boolean'  then status.assert.pass = result is expect
      when 'object'   then status = @objsEq( result, expect, status, level )
      when 'array'    then status = @arrsEq( result, expect, status, level )
      when 'function' then status.assert.pass = true   # Indicates a skip over when in a recursion
      else                 status.assert.pass = false  # Unknown type for comparision

    # Update pass status only  at level 0
    if status.assert.pass and level is 0  and not status.assert.exam
       status.assert.exam = true
       status.assert.text = "-- Passed -- " + status.assert.text
       status.assert.code = @code
       status.result.text = @textResult( status, result )
       status.expect.text = @textExpect( status, expect )
       @passed.push( status )
    else if not status.assert.pass and not status.assert.exam
       status.assert.exam = true
       status.assert.text = "-- Failed -- " + status.assert.text
       status.assert.code = @code
       status.result.text = @textResult( status, result )
       status.expect.text = @textExpect( status, expect )
       @failed.push( status )
    status

  textResult:( status, result ) ->
    """Result type is #{status.result.type} with value #{@toStr(result)}"""

  textExpect:( status, expect ) ->
    """Expect type is #{status.expect.type} with value #{@toStr(expect)}"""

  # Deep object equality assertion
  objsEq:( result, expect, status, level ) ->
    for own key, obj of expect
      if not  result[key]?
        status.assert.pass  = false
        status.assert.info  = " result key '#{key}' is missing"
        status.result.text  = @textResult( status, result )
        status.expect.text  = @textExpect( status, expect )
        return status
      else
        status = @assert( result[key], expect[key], status, ++level )
    status.assert.pass  = true
    return status

  # Deep array equality assertion
  arrsEq:( result, expect, status, level ) ->
    if result.length isnt expect.length
      status.assert.pass = false
      status.assert.info = " different array lengths"
      status.result.text = "Result length is #{result.length} with value " + @toStr(result)
      status.expect.text = "Expect length is #{expect.length} with value " + @toStr(expect)
      return status
    for i in [0...expect.length]
      status = @assert( result[i], expect[i], status, ++level )
    status.assert.pass  = true
    return status

  report:( status, result, expect ) ->
    eq = if status.assert.pass then 'is' else 'not'
    @blockText   = "" if @blockClear
    @statusText  = """\n#{status.assert.text} """
    @statusText += """#{eq} #{@toStr(expect)}""" if status.result.type isnt "function"
    @statusText += status.assert.info if @isStr(status.assert.info)
    @statusText += """\n   #{@textResult( status, result )}""" if @verbose or not status.assert.pass
    @statusText += """\n   #{@textExpect( status, expect )}""" if @verbose or not status.assert.pass
    #statusText += "\n"+@code              if @isStr(@code) and ( @verbose or not status.assert.pass )
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

  runUnitTests:( paths ) =>
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
    console.log( 'Tester.path(path)', { path:path, dirs:dirs, module:module } ) if @debug
    @modules[module]

  summary:( module=null ) =>
    path = if module? and @modules[module]? then @modules[module].path else "?"
    if @debug
      console.log( 'Tester.summary(module)', { module:module, modules:@modules, key:@modules[module], path:path } )
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

  # Type Assertions that leverage @type(arg) the improved typeof(arg)
  isType:(v,t)    =>  @type(v) is t
  isNull:(d)      =>  @isType(d,'null')
  isUndef:(d)     =>  @isType(d,'undefined')
  isDef:(d)       =>  @type(d) isnt 'null' and @type(d) isnt 'undefined'
  isNot:(d)       =>  not @isDef(d)
  isStr:(s)       =>  @isType(s,"string") and s.length > 0 and s isnt 'None'
  inStr:(s,e)     =>  @isStr(s) and s.indexOf(e) > -1
  isNum:(n)       =>  @isType(n,"number")
  isNaN:(n)       =>  @isNum(n) and Number.isNaN(n)
  isObj:(o)       =>  @isType(o,"object")
  inObj:(o,k)     =>  @isObj(o) and @isDef(o[k]) and o.hasOwnProperty(k)
  toKeys:(o)      =>  if @isObj(o) then Object.keys(o) else []
  isVal:(v)       =>  @isType(v,"number") or @isType(v,"string") or @isType(v,"boolean")
  isFunc:(f)      =>  @isType(f,"function")
  isArray:(a)     =>  @isType(a,"array") and a.length? and a.length > 0
  inArray:(a,e)   =>  @isArray(a) and a.includes(e)
  inRange:(a,i)   =>  @isArray(a) and 0 <= i and i < a.length
  atIndex:(a,e)   =>  if @isArray(a) then a.indexOf(e) else -1
  head:(a)        =>  if @isArray(a) then a[0]          else null
  tail:(a)        =>  if @isArray(a) then a[a.length-1] else null
  time:()         =>  new Date().getTime()
  hasInteger:(s)  =>  @isStr(s) and /^\s*(\+|-)?\d+\s*$/.test(s)
  hasFloat:(s)    =>  @isStr(s) and /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s)
  hasCurrency:(s) =>  @isStr(s) and /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s)
  hasEmail:(s)    =>  @isStr(s) and /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)

  # Converters
  toStr:( value, enclose=false ) =>
    str = ""
    switch @type(value)
      when 'string'
        str = if enclose then '"'+value+'"' else value
      when 'function'
        str = "?"
      when 'object' # This combination of travesal and recursion is cleaner than JSON.stringify()
        str += "{ "
        for own key, val of value
          str += key+":"+@toStr(val,true)+", "
        str = str.substring( 0, str.length-2 ) # remove trailing comma and space
        str += " }"
      when 'array'  # This combination of travesal and recursion is cleaner than JSON.stringify()
        str += "[ "
        for val in value
          str += @toStr(val,true)+", "
        str = str.substring( 0, str.length-2 ) # remove trailing comma  and space
        str += " ]"
      else
        str = value.toString()
    console.log( "Tester.toStr(val)", { type:@type(value), value:value, str:str } ) if enclose and @debug
    str

  # Check if an object or array or string is empty
  isEmpty:(e) =>
    return false if @isNot(e)
    switch @isType(e)
      when 'object' then Object.getOwnPropertyNames(e).length is 0
      when 'array'  then e.length is 0
      when 'string' then e.length is 0
      else               false

  # Checks for offical child key which starts with capital letter and isnt an _ or $
  isChild: (key) =>
    a = key.charAt(0)
    b = key.charAt(key.length - 1)
    a is a.toUpperCase() and a isnt '$' and b isnt '_'

  # An improved typeof() that follows the convention by returning types in lower case
  # by default. The basic types returned are:
  # boolean number string function object array date regexp undefined null
  type:(val,lowerCase=true) =>
    str = Object::toString.call(val)
    tok = str.split(' ')[1]
    typ = tok.substring(0,tok.length-1)
    if lowerCase then typ.toLowerCase() else typ

  # A more detail type that returns basic types, class, object and function name in upper case
  klass:(val) =>
    typ = @type(val,false) # Start with basic type to catch 'Null' and 'Undefined'
    switch typ
      when 'Null'      then 'Null'
      when 'Undefined' then 'Undefined'
      when "Function"  then val.name
      when "Object"    then val.constructor.name
      else                  typ

  # Stream is an optional libary for publising statusObject to UIs like RxJS
  injectStream:( stream ) ->
    type = @klass(stream)
    if type is "Stream"
      @stream  = stream
    else
      console.error( "Tester.injectStream( stream ) stream klass must be 'Stream' not", type )
    return

  archiveLocal:( failed, passed ) =>
    localStorage.setItem( 'TestsFailed', JSON.stringify( failed ) )
    localStorage.setItem( 'TestsPassed', JSON.stringify( passed ) )
    return

  reviewsLocal:( reviewFailed, reviewPassed ) ->
    return if not @debug
    if reviewFailed
      failLocals = localStorage.getItem( 'TestsFailed' )
      if failLocals?
        failStatuses = JSON.parse( failLocals )
        for failStatus in failStatuses
          console.log( failStatus ) if @logToConsole
    if reviewPassed
      passLocals = localStorage.getItem( 'TestsPassed' )
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
export { test, unit }
