import Store  from './Store.js'

class Local extends Store

  constructor:( stream, dbName ) ->
    super(      stream, dbName )
    @memory = {}

  tableId:( table,  id ) ->
            table + id

  obj:( table, id ) ->
    str = localStorage.getItem( @tableId(table,id) )
    if str? then JSON.parse(str) else {}

  addId:( table, id, obj ) ->
    obj._id = id
    @openTable( table )     if not ( @tables[table]? and @tables[table][@source]? )
    @memory[table]     = {} if not @memory[table]?
    @memory[table][id] = obj
    return

  delId:( table, id ) ->
    delete @memory[table][id] if @memory[table]? and @memory[table][id]?
    return

  add:(     table, id, obj, silent=false  )    ->
    @addId( table, id, obj )
    localStorage.setItem( @tableId(table,id), JSON.stringify(obj) )
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
    localStorage.setItem( @tableId(table,id), JSON.stringify(obj) )
    @results( table, 'put', obj ) if not silent
    return

  del:(     table, id, silent=false  ) ->
    @delId( table, id )
    obj = @obj( table, id )
    localStorage.removeItem( @tableId(table,id) )
    @results( table, 'del', obj )  if not silent
    return

  insert:( table, objs ) ->
    for own key, obj of objs
      @add( table, key, obj, true )
    @results( table, 'insert', objs )
    return

  select:( table, where, callback=null, op='select' ) ->
    objs =  {}
    for own id, entry of @memory[table] when @memory[table]?
      obj      = @obj( table, id )
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

  remove:( table, where, op='remove'  ) ->
    objs = {}
    for own id, entry of @memory[table] when @memory[table]?
      obj = @obj( table, id )
      if obj? and where(obj)
        @del( table, id, true )
        objs[id] = obj
    @results( table, op, objs )
    return

  show:() ->
    @showTables()

  open:( table ) ->
    @openTable( table )
    return

  drop:( table ) ->
    @dropTable( table )
    where = (obj) -> true
    @remove( table, where, 'drop' )
    return

export default Local

###
      # console.log( 'Local.obj()', str )

  version:() ->
    localStorage.setItem('IndexDbVersion','0')
    dbVersionStr = localStorage.getItem('IndexDbVersion')
    dbVersionInt = if dbVersionStr? then parseInt(dbVersionStr)+1 else 1
    dbVersionStr = dbVersionInt.toString()
    localStorage.setItem('IndexDbVersion',dbVersionStr)
    console.log( 'Index() version', dbVersionStr, dbVersionInt )
    dbVersionInt
###