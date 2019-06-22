
class Memory

  constructor:( @store ) ->
    @dbName    = @store.dbName
    @pubChange = true

  table:(tn) ->
    @store.table(tn)

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

  open:( tn ) ->
    if tn is false then {} # Nothing to do. Handled by store
    return

  drop:( tn ) ->
    if tn is false then {} # Nothing to do. Handled by store
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