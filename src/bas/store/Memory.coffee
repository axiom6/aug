
import IndexedDB from './IndexedDB'

class Memory

  constructor:( @store, dbName, @tables={} ) ->

  table:(t) ->
    @tables[t] = if @tables[t]? then @tables[t] else {}
    @tables[t]

  # This could be tied to put and add
  change:( t, id, callback=null ) ->
    object = @table(t)[id]
    if object?
      callback( object ) if callback?
      @store.results( t, id, 'change', object )
    else
      @store.onerror( t, id, 'change', object,  { msg:"Id #{id} not found"} )
    return

  add:( t, id, object )    ->
    @table(t)[id] = object
    return

  get:( t, id, callback=null ) ->
    object = @table(t)[id]
    if object?
      callback( object ) if callback?
      @store.results( t, id, 'get', object )
    else
      @store.onerror( t, id, 'get', object,  { msg:"Id #{id} not found"} )
    return

  put:( t, id,  object ) ->
    @table(t)[id] = object
    return

  del:( t, id ) ->
    object  = @table(t)[id]
    if object?
      delete @table(t)[id]
    else
      @store.onerror( t, id, 'del', object,  { msg:"Id #{id} not found"} )
    return

  insert:( t, objects ) ->
    table   = @table(t)
    for own key, object of objects
      table[key] = object
    return

  select:( t, callback,  where=(object)->true ) ->
    objects =  {}
    table   = @table(t)
    for own key, object of table when where(object)
      objects[key] = object
    callback( objects ) if callback?
    @store.results( t, id, 'show', objects )
    return

  update:( t, objects ) ->
    table = @table(t)
    for own key, object of objects
      table[key] = object
    return

  remove:( t, where ) ->
    table = @table(t)
    objects = {}
    for own key, object of table when where(object)
      objects[key] = object
      delete object[key]
    return

  show:( t, format, callback ) ->
    if format is false then {}
    callback( @table(t) ) if callback?
    @store.results( t, id, 'show', @table(t) )
    return

  open:( t, schema ) ->
    if schema is false then {}
    @table(t)
    return

  make:( t, alters ) ->
    if t is false and alters is false then {}
    return

  drop:( t ) ->
    hasTable = @tables[t]?
    if hasTable
      delete  @tables[t]
    else
      @onerror( t, 'none', 'drop', {}, { msg:"Table #{t} not found"} )
    return

  dbTableName:( tableName ) ->
    @dbName + '/' + tableName

  tableNames:() ->
    names = []
    for own key, table of @tables
      names.push(key)
    names

  importLocalStorage:( tableNames ) ->
    for t in tableNames
      @tables[t] = JSON.parse(localStorage.getItem(@dbTableName(t)))
    return

  exportLocalStorage:() ->
    for own tableName, table of @tables
      dbTableName = @dbTableName(tableName)
      localStorage.removeItem( dbTableName  )
      localStorage.setItem(    dbTableName, JSON.stringify(table) )
      # console.log( 'Store.Memory.exportLocalStorage()', dbTableName )
    return

  importIndexedDB:() ->
    idb = new IndexedDB( @dbName )
    for tableName in idb.dbs.objectStoreNames
      where = (obj)->false
      idb.traverse( 'select', tableName, {}, where, false )
    return

  exportIndexedDB:() ->
    dbVersion = 1
    idb = new IndexedDB( @dbName, dbVersion, @tables )
    onIdxOpen = (dbName) =>
      idb.deleteDatabase( dbName )
      for own name, table of @tables
        idb.insert( name, table  )
    if onIdxOpen is false then {}
    idb.openDatabase()
    return

  logRows:( name, table ) ->
    console.log( name )
    for own key, row of table
      console.log( '  ', key )
      console.log( '  ', row )
      console.log( '  ',  JSON.stringify( row ) )

export default Memory