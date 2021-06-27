
class Tester

  constructor:() ->

    @stream = null # Optional streaming publisher module that is set by @injectStream( stream )

    # Key settings that can be reconfigured through setOptions( options )
    @testing        = true          # When false all testing is turned which allows tests to remain in code
    @logToConsole   = true
    @archive        = true          # When true archives test status object to localStorage TestsPassed and TestFail
    @verbose        = false         # Adds addition and sometimes mind numbing detail to testStatus objects
    @debug          = false         # Turns on debugs call to console.log(...)
    @schemaKey      = "schema"      # Specifies the key in a JSON file to look up its validating schema in JSON
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
    @schemaKey      = if options.schemaKey?      then options.schemaKey      else "schema"
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

  run:( text, result, expect, op ) =>
    return @ not @testing
    console.log( "Tester.run()", { text:text, result:result, expect:expect, op:op } ) if  @debug
    status = @initStatus( result, expect, op )
    status = @assert(     result, expect, op, status )
    @report(              result, expect, op, status )
    @    # returns tester instance for chaining

  describe:( description, suite=null ) =>
    @description = description
    @suite       = if suite? then suite else null
    @

  initStatus:( result, expect, op ) ->
    module = text.split('.')[0]
    eType  = if op is "schema" then "schema" else @type(expect)
    {
      assert:{ text:@text, pass:true, module:module, op:op, code:@code, info:"" }
      result:{ text:"", type:@type(result), value:result }
      expect:{ text:"", type:eType,         value:expect }
    }

  # Performs all assertions even a deep equal on objects and arrays
  #   Strong type checking with @type(val) so asserions are only test when types match
  #   Skips over @type(val) = "function"
  assert:( result, expect, status, op, level=0, key=null, index=null ) ->

    # Covert expect to a schema object if op is schema
    expect = @toSchema(expect,op)

    # Check values and types
    status = @checkValuesTypes( result, expect, status, op, key, index )

    # Perform all comparisions
    if status.assert.pass
       status = switch @type(result)
         when 'string','number','boolean' then @valuesEq(   result, expect, status, op )
         when 'object'                    then @objectsEq(  result, expect, status, op, level )
         when 'array'                     then @arraysEq(   result, expect, status, op, level )
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
    value  = if op is "schema" then expect.value else expect
    eType  = if op is "schema" then expect.type  else @type(expect)
    prefix = if pass then "-- Passed -- " else "-- Failed -- "
    status.assert.text   = prefix + status.assert.text
    status.assert.pass   = pass and status.assert.pass # Asserts a previous status.assert.pass is false
    status.assert.info  += info
    status.assert.code   = if @isStr(@code) then @code else ""
    status.result.text  += @textValue( "Result", @type(result), result, key, index )
    status.expect.text  += @textValue( "Expect", eType,         value,  key, index )
    status

  # Convert expect to a schema object if op is schema
  isSchema:( v ) ->
    v.op? and v.type? and v.value? and v.range? and v.op? and v.size?

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
  toSchema:( expect,   op ) ->
    return   expect if op isnt "schema"
    schema = { type:"any", ranges:['any'], value:"any", length:"any", oper:"eq", opt:"1" }
    switch @type(expect)
      when "string"
        schema = @parseSchema( expect, schema )

      when "object"
        schema.opt    = if expect.opt is "?"        then expect.opt    else  "1" # "1" implies key required
        schema.type   = if @isStr(expect.type)      then expect.type   else  "any"
        schema.value  = if expect.value?            then expect.value  else  "any"
        schema.ranges = if @isArray(expect.ranges ) then expect.ranges else ["any"]
        schema.length = if @isNum(  expect.length ) then expect.length else  "any"
        schema.oper   = if @isStr(  expect.oper   ) then expect.oper   else  "eq"
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
        schema.value  = "any"
      else if splits[1].includes("|")
        schema.ranges = @toEnums( splits[1] )
        schema.value  = "any"
      else
        schema.ranges = "any"
        schema.value  = @toType( splits[1], schema.type )
      schema.length    = if length >= 2 then @toInt( splits[2] ) else "any"
      schema.oper      = if length >= 3 then @toStr( splits[3] ) else "eq"
      schema

  # Range parser for @toSchema(expect,op)
  toRanges:( splits ) =>
    ranges = []
    for split in splits
      switch @type(split)
        when 'string'
          for split in splits
            if @head(split,"[[",false) is '[[' and @tail(split,"]]",false) is "]]"
              strs = @toArray(split)
              for str in strs
                ranges.push[@toArray(str)]
              return ranges
            else if @head(split) is '[' and @tail(split) is "]"
              ranges.push[@toArray(split)]
              return ranges
        when 'array'
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
        " Result of #{rType} is not defined\nExpect is type '#{eType}"
      when @isNot(expect)
        " Expect of #{eType} is not defined\nResult is type '#{rType}"
      when op is 'schema'
        if eType is 'any'
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
    if @isStr(info)
      @examine( false, result, expect, status, op, info, key, index )
    else
      status

  # Equality check for "string","number","boolean" types
  valuesEq:( result, expect, status, op ) ->

    value = expect
    if op is "schema"
      value  = expect.value
      ranges = expect.ranges
      oper   = switch
        when ranges is "any" then "eq"
        when @isArray(ranges)
          if @isArray(ranges[0]) then "ranges" else "range"

    status.assert.pass = switch oper
      when value is "any" then true
      when op is "range" then @inRange( result, ranges )
      when op is "ranges" and @isArray( result )
        pass   = true
        length = Math.min( result.length, ranges.length )
        for i in [0...length]
          if @isArray(result[i]) and @isArray(ranges[i])
            pass = pass and @inRange( result[i], ranges[i] )
        pass
      when "eq" then result is   value
      when "le" then result <=   value
      when "lt" then result <    value
      when "ge" then result >=   value
      when "lt" then result >    value
      when "ne" then result isnt value
      else           false
    status

  # if range.length = 3 min=range[0], max=range[1] and tol=range[2]
  # if range.length = 2 min=range[0], max=range[1] and tol=0
  # if range.length = 1 min=0,        max=range[0] and  tol=0
  @inRange:( result, range ) ->
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
    else if rType is 'array' and @inArray(@type(result[0]),["string","number"])
      for val in result
        pass = pass and @inRange( val, range )
    pass

  # Just a fallback when types are not fully screened
  unknownsEq:( result, expect, status ) ->
    status.assert.pass  = false
    status.assert.info += "unknown types for comparision"
    status

  textValue:( name, value, key, index ) ->
    ref   = " "
    ref   " at key:#{key} "      if @isStr(key)
    ref = " at index: #{index} " if @isNum(index)
    "#{name}#{ref}where type is #{@type(value)} and value is #{@toStr(value)}"

  # Deep object equality assertion where all matching keys are examined
  objectsEq:( result, expect, status, op, level ) ->

    # Check that the expect object has all the keys that the result object has
    for own key, val of result when  expect[key]?
      status = @examine( false, val, expect[key], status, op, "missing expect", key, null )

    # Check that the result object has all the keys that the expect object has
    for own key, val of expect when ( result[key]? or ( op is "schema" and val.opt is "1" ) )
      status = @examine( false, result[key], val, status, op, "missing result", key, null )

    # Assert each value for the set of keys that result and expect objects share in common
    for own key, obj of expect when result[key]? and expect[key]?
      status = @assert( result[key], val, status, op, ++level, key, null )
    status

  # Deep array equality assertion
  arraysEq:( result, expect, status, op, level ) ->
    value = expect

    # Check against the schema when present
    if op is "schema"
      value = expect.value
      if value is 'any'
         status.assert.pass = true
         return status
      else if value.size isnt "any" and result.length > value.size
         info   = " Result length exceeds the maximum size #{value.size}"
         info  += " Result length is #{result.length}"
         info  += " Size is #{value.size}"
         return @examine( false, result, expect, status, op, info, null, null )
      else if not @isArray(value)
         return status

    # Examine the array lengths
    if result.length isnt value.length
      info   = " different array lengths"
      info  += " Result length is #{result.length}"
      info  += " Expect length is #{value.length}"
      status = @examine( false, result, expect, status, op, info, null, null )

    # Assert each value within the minimum length of the result and expect arrays
    length = Math.min( result.length, expect.length )
    for i in [0...length]
      status = @assert( result[i], expect[i], status, op, ++level, null, i )

    status

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
  isBoolean:(v)   =>  @isType(a,"array")
  inArray:(a,e)   =>  @isArray(a) and a.includes(e)
  atIndex:(a,e)   =>  if @isArray(a) then a.indexOf(e) else -1
  time:()         =>  new Date().getTime()

  head:(v,action=false,pop=false) ->
    val = null
    switch @type(v)
      when 'array'
        switch @type(action)
          when 'boolean'
            val = v[0]
            v   = v.shift() if action
      when 'string'
        switch @type(action)
          when 'boolean'
            val = v.charAt(0)
            v   = v.substring(1) if action
          when 'string' and v.startsWith(action)
            val = action
            v   = v.substring(action.length) if pop
    pop

  tail:(v,action=false) ->
    pop = null
    switch @type(v)
      when 'array'
        pop = v[v.length-1]
        v   = v.pop() if @isType(action,"boolean") and action
      when 'string'
        switch @type(action)
          when 'boolean'
            pop = v.charAt(v.length-1)
            v   = v.substring( 0, v.length-1 ) if action
          when 'string' and v.endsWith(action)
            pop = action
            v   = v.substring(0,v.length-action.length)
    pop

  # Unlike the built in Array v.slice(beg,end) where beg is a zero-based index and end

  # Here beg starts at 1 and end includes the last position or is set to beg if ommitted
  #  an array slice( ['a','b','c'], 1, 2 ) returns ['a','b']
  #  an array slice( ['a','b','c'], 2    ) returns ['b']
  #  a string slice( ['abc'],       1, 2 ) returns   'ab'
  #  a string slice( ['abc'],       2    ) returns   'b'
  # where with Array.slice() it is open
  slice:( v, beg, end=null, remove=false ) ->
    end if @isDef(end) then end else beg
    pop = null
    switch @type(v)
      when 'array'
        pop = if remove then v.splice(beg-1,end+1) else v.slice(beg-1,end+1)
      when 'string'
        pop = v.splice(beg-1,end+1)
        v   = v.substring(0,beg-1) + v.substring(end+1) if remove
    pop

  isFloat:( val ) ->
    switch @type(val)
      when "number" then true
      when "string"
        regex = /^-?\d+(?:[.,]\d*?)?$/
        regex.test(val)
      else false

  isInt:( val ) ->
    switch @type(val)
      when "number" then true
      when "string"
        regex = /^-?\d+$/
        regex.test(val)
      else false

  # Converters
    toType:( val, type ) ->
      switch type
        when "string"  then @toStr(     val )
        when "number"  then @toNum(     val )
        when "boolean" then @toBoolean( val )
        when "array"   then @toArray(   val )
        when "object"  then @toObj(     val )
        else
          console.error( "Tester.toType(type,val) unknown type", { type:type, val:val } )
          null

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

  toNum:( arg ) ->
    switch @type(arg)
      when 'string' and @isFloat(arg) then @toFloat(arg)
      when 'string' and @isInt(arg)   then @toInt(arg)
      when 'number'
        if Number.isInteger(arg) then @toInt(arg) else @toFloat(arg)
      else NaN

  toFloat:( arg ) ->
    switch @type(arg)
      when 'number' then arg
      when 'string' then parseFloat(arg)
      else NaN

  toInt:( arg ) ->
    switch @type(arg)
      when 'number' then Math.round(arg)
      when 'string' then   parseInt(arg)
      else NaN

  # Return a number with fixed decimal places
  toFixed:( arg, dec=2 ) ->
    num = switch @type(arg)
      when 'number' then arg
      when 'string' then parseFloat(arg)
    num.toFixed(dec)

  toBoolean:( arg ) ->
    bool = switch @type(arg)
      when 'boolean' then arg
      when 'string'
        switch arg 
          when "true"  then  true
          when "false" then false
          else              false
      when 'number' then arg isnt 0
      else false
    bool

  toArray:( value, type, sep="|" ) =>
    switch @type(value)
      when 'string'
        if @head(value) is "[" and @tail(value) is "]" # Strip off brackets
          value = @slice(value,2,value.length-1)
        array = []

        strs  = @slice(value,2,value.length-1).split(sep)
        for str in strs
          array.push( @toType( str, type ) )
        array
      when 'array'
        value
      else
        null

  toObj:( arg ) =>
    obj  = {}
    type = @type(arg)
    switch type
      when 'object' then obj = arg
      when 'array'  then obj[i] = arg[i] for i in [0...arg.length]
      when 'number','boolean','function'
        obj[type] = arg
      when 'string'
        obj = arg.split(',')
                 .map( (x) => x.split(':').map( (y) => y.trim() ) )
                 .reduce( (a,x) => a[x[0]] = x[1]; a {} )
      else obj

    # const obj = 'foo: 1, bar: 2'
    toObj2:( arg ) ->
      arg.split(',') # split into ['foo: 1', 'bar: 2']
         .map(  (keyVal) =>             # go over each keyVal value in that array
            return keyVal.split(':')    #  split into ['foo', '1'] and on the next loop ['bar', '2']
            .map( (y) => y.trim() ) )   # loop over each value in each array and remove trailing whitespace
        .reduce( (acc,curr) =>          # reduce() takes a func and a beginning object, we're making fresh object
            acc[curr[0]] = curr[1]; acc {} )
        # accumulator starts at the beginning obj, in our case {}, and "accumulates" values to it
        # since reduce() works like map() in the sense it iterates over an array, and it can be chained upon things like map(),
        # first time through it would say "okay accumulator, accumulate currentValue[0] (which is 'foo') = currentValue[1] (which is '1')
        # so first time reduce runs, it starts with empty object {} and assigns {foo: '1'} to it
        # second time through, it "accumulates" {bar: '2'} to it. so now we have {foo: '1', bar: '2'}
        #  return when there are no more things in the array to iterate over,

  toCap:( str ) ->
    str.charAt(0).toUpperCase() + str.substring(1)

  unCap:( str ) ->
    str.charAt(0).toLowerCase() + str.substring(1)

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

  pad:( n, m ) ->
    len = @numDigits( n )
    tot = @numDigits( m )
    str = n.toString()
    for i in [len...tot]
      str = ' ' + str
    str

  numDigits:( n ) ->
    Math.max( Math.floor( Math.log10( Math.abs(n) ) ), 0 ) + 1

  # An improved typeof() that follows the convention by returning types in lower case
  # by default. The basic types returned are:
  # boolean number string function object array date regexp undefined null
  type:(val,lowerCase=true) =>
    str = Object::toString.call(val)
    tok = str.split(' ')[1]
    typ = tok.substring(0,tok.length-1)
    if lowerCase then typ.toLowerCase() else typ

  scheme:( val,op='eq' ) =>
    if op is 'schema' then 'schema' else @type(val)

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
fits = tester.unit
export { test, unit, fits }

###
  # Validate and diagnose a result that fits a schema both of type 'object' or 'array'
  #  Very usefull for a result originating from a'.json' file and parsed by JSON.parse(...)
  #  Very usefull for a schema originating from a'.json' file and parsed by JSON.parse(...)
  fits2:( text, result, schema ) =>
    return @ if arguments.length is 0 or not @testing
    @text   = text
    @code   = ""
    status = @initStatus( result, schema, text, 'schema', "" )
    status = switch @type(result)
      when 'object' then @objectsEq( result, schema, status, level )
      when 'array'  then @arraysEq(  result, schema, status, level )
      else               @assert(    result, schema, status )
    if @debug
      console.log( "Tester.fits(result,schema)", { type:@type(result), result:result, schema:schema, status:status } )
    @
###