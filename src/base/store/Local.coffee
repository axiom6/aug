import Store  from './Store.js'

class Local extends Store

  constructor:( dbName ) ->
    super( dbName )
    @tableIds = {}

  key:( table, id ) ->
    @dbName + table + id

  obj:( table, id ) ->
    str = localStorage.getItem( @key(table,id) )
    # console.log( 'Local.obj()', str )
    if str? then JSON.parse(str) else {}

  addId:( table, id, obj ) ->
    obj._id = id
    @tableIds[table] = [] if not @tableIds[table]?
    @tableIds[table].push(id)
    return

  delId:( table, id ) ->
    @tableIds[table] = [] if not @tableIds[table]?
    @tableIds[table].push(id)
    return

  add:(     table, id, obj, silent=false  )    ->
    @addId( table, id, obj )
    localStorage.setItem( @key(table,id), JSON.stringify(obj) )
    @results( table, 'add', obj ) if not silent
    return

  get:( table, id, callback=null, op='get', silent=false ) ->
    obj = @obj( table, id )
    if obj?
      if callback?
         callback( obj )
      else
         @results( table, op, obj ) if not silent
    else
      @onerror( table, op, { error:"Local get error"}, id )
    return

  put:(     table, id, obj, silent=false  ) ->
    @addId( table, id, obj )
    localStorage.setItem( @key(table,id), JSON.stringify(obj) )
    @results( table, 'put', obj ) if not silent
    return

  del:(     table, id, silent=false  ) ->
    @delId( table, id )
    obj = @obj( table, id )
    localStorage.removeItem( @key(table,id) )
    @results( table, 'del', obj )  if not silent
    return

  insert:( table, objs ) ->
    for own key, obj of objs
      @add( table, key, obj, true )
    @results( table, 'insert', objs )
    return

  select:( table, where, callback=null, op='select' ) ->
    objs =  {}
    ids  =  @tableIds[table]
    for id in ids
      obj = @obj( table, id )
      objs[id] = obj if obj? and where(obj)
    if callback?
      callback( objs )
    else
      @results( table, op, objs )
    return

  update:( table, objs ) ->
    for own key, obj of objs
      @put( table, key, obj, true )
    @results( table, 'update', objs )
    return

  remove:( table, where, silent=false  ) ->
    ids  =  @tableIds[table]
    objs = {}
    for id in ids
      obj = @obj( table, id )
      if obj? and where(obj)
        @del( table, id, true )
        objs[id] = obj
    @results( table, 'remove', objs ) if not silent
    return

  show:() ->
    tables = []
    ptn = /([A-Z][a-z]*)([A-Z][a-z]*)([A-Z][a-z]*)/
    for i in  [0...localStorage.length]
      item = localStorage.key(i)
      if item.startsWith( @dbName )
         match = ptn.exec( item )
         # console.log( 'Local.show()', match[1], match[2], match[3] )
         table = match[2]
         tables.push( table ) if not tables.includes(table)
    @results( @dbName, 'show', tables )
    return

  drop:( table ) ->
    @remove( table, ((obj)->true), true )
    @results( table, 'drop', {} )
    return

export default Local

###
  version:() ->
    localStorage.setItem('IndexDbVersion','0')
    dbVersionStr = localStorage.getItem('IndexDbVersion')
    dbVersionInt = if dbVersionStr? then parseInt(dbVersionStr)+1 else 1
    dbVersionStr = dbVersionInt.toString()
    localStorage.setItem('IndexDbVersion',dbVersionStr)
    console.log( 'Index() version', dbVersionStr, dbVersionInt )
    dbVersionInt
###