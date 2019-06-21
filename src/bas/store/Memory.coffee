
class Memory

  constructor:( @store ) ->
    @dbName    = @store.dbName
    @tables    = @store.tables
    @pubChange = true

  table:(tn) ->
    @tables[tn] = if @tables[tn]? then @tables[tn] else {}
    @tables[tn]

  # This could be tied to put and add
  change:( tn, id, callback, op='change' ) ->
    object = @table(tn)[id]
    if object?
      callback( object ) if callback?
      @store.results( tn, op, object, id )
    else
      @store.onerror( tn, op, 'Memory change error', id )
    return

  add:( tn, id, object )    ->
    @table(tn)[id] = object
    @change( tn, id,null,'add' ) if @pubChange
    return

  get:( tn, id, callback ) ->
    object = @table(tn)[id]
    if object?
      callback( object ) if callback?
      @store.results( tn, 'get', object, id )
    else
      @store.onerror( tn, 'get', { error:'Memory object no found'}, id )
    return

  put:( tn, id,  object ) ->
    @table(tn)[id] = object
    @change( tn, id,null,'put' ) if @pubChange
    return

  del:( tn, id ) ->
    object  = @table(tn)[id]
    if object?
      @change( tn, id,null,'del' ) if @pubChange
      delete @table(tn)[id]
    else
      @store.onerror( tn, 'get', { error:'Memory object not found'}, id )
    return

  insert:( tn, objects ) ->
    table = @table(tn)
    for own key, obj of objects
      table[key] = obj
    return

  select:( tn, where, callback=null ) ->
    objects = {}
    table   = @table(tn)
    for own key, obj of table when where(obj)
      objects[key] = obj
    callback( objects ) if callback?
    @store.results( tn, 'select', objects )
    return

  update:( tn, objects ) ->
    table = @table(tn)
    for own key,   obj of objects
      table[key] = obj
    return

  remove:( tn, where ) ->
    table = @table(tn)
    for own key, obj of table when where(obj)
      delete table[key]
    return

  show:( tn, format, callback ) ->
    if format is false then {}
    callback( @table(tn) ) if callback?
    @store.results( tn, 'show', @table(tn) )
    return

  open:( tn, schema ) ->
    if schema is false then {}
    @table(tn)
    return

  make:( tn, alters ) ->
    if tn is false and alters is false then {}
    return

  drop:( tn, resets ) ->
    if resets is false then {}
    if       @tables[tn]?
      delete @tables[tn]
    else
      @store.onerror( tn, 'drop', { error:'Memory missing table'} )
    return

  importLocal:( local ) ->
    for own tn, table of local.tableIds
      for id in table
        @add( tn, id, @local.obj(tn,id) )
    return

  exportDB:( db ) ->
    for own tn, table of @tables
      for own id, obj of table
        db.add( tn, id, obj )
    return

  ###
  importIndexedDB:() ->
    idb = new IndexedDB( @dbName )
    for tableName in idb.dbs.objectStoreNames
      where = (obj)->false
      idb.traverse( 'select', tableName, {}, where, false )
    return
  ###

  logRows:( name, table ) ->
    console.log( name )
    for own key, row of table
      console.log( '  ', key )
      console.log( '  ', row )
      console.log( '  ',  JSON.stringify( row ) )

export default Memory