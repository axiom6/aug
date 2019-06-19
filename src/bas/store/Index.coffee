

class Index

  constructor:(  @store ) ->
    @dbName    = @store.dbName
    @tables    = @store.tables
    @keyPath   = 'key' # Check
    @dbVersion = 1
    @dbs       = null
    @indexedDB = window.indexedDB
    @openDatabase( @dbName, @dbVersion )

  change:( table, id, callback ) ->
    @get(  table, id, callback, 'change' )
    return

  get:( table, id, callback, op='get' ) ->
    txo = @txnObjectStore( table, "readonly" )
    req = txo.get(id) # Check to be sre that indexDB understands id
    req.onsuccess = () =>
      callback( req.result ) if callback?
      @store.results( table, id, op, req.result )
    req.onerror = () =>
      @store.onerror( table, id, op, req.result, { error:req.error } )
    return

  add:( table, id, object ) ->
    txo = @txnObjectStore( table, "readwrite" )
    req = txo.add( obj, id )
    req.onerror   = () => @store.onerror( table, id, 'add', object, { error:req.error } )
    return

  put:( table, id, object ) ->
    txo = @txnObjectStore( table, "readwrite" )
    req = txo.put(object) # Check to be sre that indexDB understands id
    req.onerror   = () => @store.onerror( table, id, 'put', object, { error:req.error } )
    return

  del:( table, id ) ->
    txo = @txnObjectStore( table, "readwrite" )
    req = txo['delete'](id) # Check to be sre that indexDB understands id
    req.onerror   = () => @store.onerror( table, id, 'del', req.result, { error:req.error } )
    return

  insert:( table, objects ) ->
    txo = @txnObjectStore( table, "readwrite" )
    for own key, object of objects
      object = @idProp( key, object, @key )
      txo.put(object)
    return

  select:( table, callback, where ) ->
    @traverse( 'select', table, where, callback )
    return

  update:( table, objects ) ->
    txo = @txnObjectStore( table, "readwrite" )
    for own key, object of objects
      object = @idProp( key, object, @key )
      txo.put(object)
    return

  remove:( table, where ) ->
    @traverse( 'remove', table, where )
    return

  open:( table, schema ) ->
    if table is false and schema is false then {}

    return

  show:( table, callback, where ) ->
    @traverse( 'show', table, where, callback )
    return

  make:( table, alters ) ->
    if table is false and alters is false then {}
    return

  drop:( table, resets ) ->
    if resets is false then {}
    @dbs.deleteObjectStore(table)
    return

  # IndexedDB Specifics

  idProp:( id, object, key ) ->
    object[key] = id if not object[key]?
    object

  txnObjectStore:( table, mode ) -> # , key=@key
    txo = null
    if not @dbs?
      console.trace( 'Store.IndexedDb.txnObjectStore() @dbs null' )
    else if @dbs.objectStoreNames.contains(table)
      txn = @dbs.transaction( table, mode )
      txo = txn.objectStore(  table ) # , { keyPath:key }
    else
      console.error( 'Store.IndexedDb.txnObjectStore() missing objectStore for', table )
    txo

  traverse:( op, table, where, callback=null ) ->
    mode = if op is 'select' then 'readonly' else 'readwrite'
    txo  = @txnObjectStore( table, mode )
    req  = txo.openCursor()
    req.onsuccess = ( event ) =>
      objects = {}
      cursor = event.target['result']
      if cursor?
        objects[cursor.key] = cursor.value if op is 'select' and where(cursor.value)
        cursor.delete()                    if op is 'remove' and where(cursor.value)
        cursor.continue()
      callback( objects ) if callback?
      @store.results( table, 'none', op, objects,   { where:'all' } )
    req.onerror   = () =>
      @store.onerror( table, 'none', op, {}, { where:'all', error:req.error } )
    return

  createObjectStores:( tables, keyPath ) ->
    for own key, obj of tables when not @dbs.objectStoreNames.contains(key)
      @dbs.createObjectStore( key, { keyPath:keyPath } )
    return

  openDatabase:( dbName, dbVersion ) ->
    request = @indexedDB.open( dbName, dbVersion ) # request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = ( event ) =>
      @dbs = event.target['result']
      @createObjectStores( @tables, )
      console.log( 'Store.IndexedDB', 'upgrade', dbName, @dbs.objectStoreNames )
    request.onsuccess = ( event ) =>
      @dbs = event.target['result']
      console.log( 'Store.IndexedDB', 'open',    dbName, @dbs.objectStoreNames )
    request.onerror   = () =>
      console.error( 'Store.IndexedDB.openDatabase() unable to open', { database:dbName, error:request.error } )
      @store.onerror( 'none', 'none', 'open', dbName, { error:request.error } )

  deleteDatabase:( dbName ) ->
    request = @indexedDB.deleteDatabase(dbName)
    request.onsuccess = () =>
      console.log(   'Store.IndexedDB.deleteDatabase() deleted',          { database:dbName } )
    request.onerror   = () =>
      console.error( 'Store.IndexedDB.deleteDatabase() unable to delete', { database:dbName, error:request.error } )
    request.onblocked = () =>
      console.error( 'Store.IndexedDB.deleteDatabase() database blocked', { database:dbName, error:request.error } )

  close:() ->
    @dbs.close() if @dbs?

export default Index

# console.error( 'Store.IndexedDB.constructor indexedDB not found' ) if not @indexedDB