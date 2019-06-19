

import Util      from '../util/Util.js'
import Memory    from '../store/Memory.js'

class Stuff

  createTable:( t  ) ->
    @tables[t] = {}
    @tables[t]

  table:( t ) ->
    if @tables[t]? then @tables[t] else @createTable( t )

  tableName:( t ) ->
     name  = Util.firstTok(t,'.') # Strips off  .json .js .csv file extensions
     table = @table( name )
     Util.noop( table )
     name

  memory:( table, id , op ) ->
    # console.log( 'Store.memory()', @toSubject(table,op,id) )
    onNext = (data) => @toMemory(  op, table, id, data )
    @datarx.subscribe( @toSubject(table,op,id), 'Store', onNext )
    return





  # params=Store provides empty defaults
  toMemory:( op, table, id, data, params ) ->
    memory = @getMemory( @dbName )
    switch op
      when 'add'    then memory.add(    table, id, data )
      when 'get'    then memory.get(    table, id, data )
      when 'put'    then memory.put(    table, id, data )
      when 'del'    then memory.del(    table, id )
      when 'change' then memory.change( table, data )
      when 'insert' then memory.insert( table, data )
      when 'select' then memory.insert( table, data )
      when 'update' then memory.update( table, data )
      when 'remove' then memory.remove( table, params.where  )
      when 'open'   then memory.open(   table, params.schema )
      when 'show'   then memory.show(   table, params.format )
      when 'make'   then memory.make(   table, params.alters )
      when 'drop'   then memory.drop(   table, params.resets )
      else console.error( 'Store.toMemory() unknown op', op )
    return

  getMemory:() ->
    @hasMemory = true
    Stuff.memories[@dbName] = new Memory( @datarx, @dbName ) if Memory? and not Stuff.memories[@dbName]?
    Stuff.memories[@dbName]

  getMemoryTables:() ->
    @getMemory().tables

  remember:() ->
    Util.noop( @getMemory(@dbName) )
    return

  toSubject:( table='none', op='none', id='none' ) ->
    subject  = "#{@dbName}"
    subject += "/#{table}"     if table isnt 'none'
    subject += "/#{id}"        if id    isnt 'none'
    subject += "?module=#{@module}"
    subject += "&op=#{op}"     if op    isnt 'none'
    # console.log( 'Store.toSubject', subject )
    subject

  toParams:( table, id, op, extras ) ->
    params = { db:@dbName, table:table, id:id, op:op, module:@module }
    Util.copyProperties( params, extras )

  toSubjectFromParams:( params ) ->
    @toSubject( params.table, params.op, params.id )

  # Combine params and result
  toStoreObject:( params, result ) ->
    { params:params, result:result }

  fromStoreObject:( object ) ->
    [object.params,object.result]

  # ops can be single value. ids can be an array for single record ops
  toSubjects:( tables, ops, ids ) ->
    array = []
    for i in [0...tables.length]
      elem = {}
      elem.table = tables[i]
      elem.op    = if Util.isArray(ops) then ops[i] else ops
      elem.id    = if Util.isArray(ids) then ids[i] else 'none'
      array.push( elem )
    array

  completeSubjects:( array, completeOp, onComplete ) ->
    subjects = []
    for elem in array
      op  = if elem.op? then elem.op else 'none'
      id  = if elem.id? then elem.id else 'none'
      sub = @toSubject( elem.table, op, id )
      subjects.push( sub )
    completeSubject = "#{@dbName}?module=#{@module}&op=#{completeOp}"
    callback = if typeof onComplete is 'function' then () => onComplete() else true
    @datarx.complete( completeSubject, subjects, callback )

  # ops can be single value.
  uponTablesComplete:( tables, ops, completeOp, onComplete ) ->
    subjects = @toSubjects( tables, ops, 'none' )
    @completeSubjects( subjects, completeOp, onComplete )
    return

  toKeys:( object ) ->
    keys = []
    for own key, obj of object
      keys.push(key)
    keys

  toJSON:(     obj  ) -> if obj? then JSON.stringify(obj) else ''

  toObject:(   json ) -> if json then JSON.parse(json) else {}

  toKeysJson:( json ) -> @toKeys( JSON.parse(json) )

  toObjectsJson:( json, where ) -> Util.toObjects( JSON.parse(json), where, @key )

  onError2:( error ) -> console.error( 'Store.onError()', error.params, error.result )

  onComplete:()      -> console.log(   'Store.onComplete()', 'Completed' )

  toExtras:( status, url, datatype, readyState=null, error=null ) ->
    extras = { status:status, url:url, readyState:readyState, error:error } # datatype:datatype,
    extras['readyState'] = readyState if readyState?
    extras['error']      = error      if error?
    extras

  dataType:() ->
    parse = Util.parseURI( @uri )
    if parse.hostname is 'localhost' then 'json' else 'jsonp'

  nameDb:( uri ) -> Util.parseURI( uri )['dbName']

  Store.memories  = {} # Store.Memory instances create by getMemory() for in memory dbName