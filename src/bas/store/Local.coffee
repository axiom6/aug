
class Local

  constructor:( @store ) ->
    @tableIds = {}

  key:( table, id ) ->
    @store.dbName + table + id

  obj:( table, id ) ->
    str = localStorage.getItem( @key(table,id) )
    if str? then JSON.parse(str) else null

  addId:( table, id ) ->
    @tableIds[table] = [] if not @tableIds[table]?
    @tableIds[table].push(id)

  delId:( table, id ) ->
    @tableIds[table] = [] if not @tableIds[table]?
    @tableIds[table].push(id)

  change:( table, id, callback ) ->
    @get(  table, id, callback, 'change' )
    return

  get:( table, id, callback=null, op='get' ) ->
    obj = @obj( table, id )
    if obj?
      callback( obj ) if callback?
      @store.results( table, op, obj, id )
    else
      @store.onerror( table, op, { error:"Local get error"}, id )
    return

  add:(     table, id, obj  )    ->
    @addId( table, id )
    localStorage.setItem( @key(table,id), JSON.stringify(obj) )
    return

  put:( table, id, obj ) ->
    localStorage.setItem( @key(table,id), JSON.stringify(obj) )
    return

  del:(     table, id ) ->
    @delId( table, id )
    localStorage.removeItem( @key(table,id) )
    return

  insert:( table, objs ) ->
    for own key, obj of objs
      @add( table, key, obj )
    return

  select:( table, callback, where, op='select' ) ->
    objs =  {}
    ids  =  @tableIds[table]
    for id in ids
      obj = @obj( table, id )
      if obj?
         objs[key] = obj if where(obj)
    callback( objs ) if callback?
    @store.results( table, op, objs )
    return

  update:( table, objs ) ->
    for own key, obj of objs
      @put( table, key, obj )
    return

  remove:( table, where ) ->
    ids  =  @tableIds[table]
    for id in ids
      obj = @obj( table, id )
      if obj?
        @del( table, id ) if where(obj)
    return

  open:( table, schema ) ->
    if table is false and schema is false then {}
    return

  show:( table, callback, format ) ->
    if format is false then {}
    where = (obj)->true
    @select( table, callback, where, 'show' )
    return

  make:( table, alters ) ->
    if table is false and alters is false then {}
    return

  drop:( table ) ->
    @remove( table, (obj)->true )
    return

export default Local