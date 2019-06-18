

class IndexedDB

  constructor:( @store, @uri ) ->    # @dbVersion=1, @tableNames=[]
    @indexedDB = window.indexedDB
    console.error( 'Store.IndexedDB.constructor indexedDB not found' ) if not @indexedDB
    @dbs       = null

  change:( t, id, callback ) ->
    @get(  t, id, callback )
    return

  get:( t, id, callback ) ->
    txo = @txnObjectStore( t, "readonly" )
    req = txo.get(id) # Check to be sre that indexDB understands id
    req.onsuccess = () =>
      callback( req.result ) if callback?
      @store.results( t, id, 'get', req.result )
    req.onerror   = () =>
      @store.onerror( t, id, 'get', req.result, { error:req.error } )
    return

  add:( t, id, object ) ->
    txo = @txnObjectStore( t, "readwrite" )
    req = txo.add( obj, id )
    req.onerror   = () => @store.onerror( t, id, 'add', object, { error:req.error } )
    return

  put:( t, id, object ) ->
    txo = @txnObjectStore( t, "readwrite" )
    req = txo.put(object) # Check to be sre that indexDB understands id
    req.onerror   = () => @store.onerror( tableName, id, 'put', object, { error:req.error } )
    return

  del:( t, id ) ->
    txo = @txnObjectStore( t, "readwrite" )
    req = txo['delete'](id) # Check to be sre that indexDB understands id
    req.onerror   = () => @store.onerror( t, id, 'del', req.result, { error:req.error } )
    return

  insert:( t, objects ) ->
    txo = @txnObjectStore( t, "readwrite" )
    for own key, object of objects
      object = @idProp( key, object, @key )
      txo.put(object)
    return

  select:( t, callback=null, where=(obj)->true) ->
    @traverse( 'select', t, where, callback )
    return

  update:( t, objects ) ->
    txo = @txnObjectStore( t, "readwrite" )
    for own key, object of objects
      object = @idProp( key, object, @key )
      txo.put(object)
    return

  remove:( t, where=Store.where ) ->
    @traverse( 'remove', t, where )
    return

  open:( t, schema ) ->
    if schema is false then {}
    return

  show:( t ) ->
    where  = () -> true
    @traverse( 'show', t, objects, where, callback )
    return

  make:( t, alters ) ->
    if t is false and alters is false then {}
    return

  drop:( t ) ->
    @dbs.deleteObjectStore(t)
    return

  # IndexedDB Specifics

  idProp:( id, object, key ) ->
    object[key] = id if not object[key]?
    object

  txnObjectStore:( t, mode ) -> # , key=@key
    txo = null
    if not @dbs?
      console.trace( 'Store.IndexedDb.txnObjectStore() @dbs null' )
    else if @dbs.objectStoreNames.contains(t)
      txn = @dbs.transaction( t, mode )
      txo = txn.objectStore(  t ) # , { keyPath:key }
    else
      console.error( 'Store.IndexedDb.txnObjectStore() missing objectStore for', t )
    txo

  traverse:( op, t, where, callback=null ) ->
    mode = if op is 'select' then 'readonly' else 'readwrite'
    txo  = @txnObjectStore( t, mode )
    req  = txo.openCursor()
    req.onsuccess = ( event ) =>
      objects = {}
      cursor = event.target['result']
      if cursor?
        objects[cursor.key] = cursor.value if op is 'select' and where(cursor.value)
        cursor.delete()                    if op is 'remove' and where(cursor.value)
        cursor.continue()
      callback( objects ) if callback?
      @store.results( t, 'none', op, objects,   { where:'all' } )
    req.onerror   = () =>
      @store.onerror( t, 'none', op, {}, { where:'all', error:req.error } )
    return

  createObjectStores:() ->
    if @tableNames?
      for t in @tableNames when not @dbs.objectStoreNames.contains(t)
        @dbs.createObjectStore( t, { keyPath:@key } )
    else
      console.error( 'Store.IndexedDB.createTables() missing @tableNames' )
    return

  openDatabase:() ->
    request = @indexedDB.open( @dbName, @dbVersion ) # request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = ( event ) =>
      @dbs = event.target['result']
      @createObjectStores()
      console.log( 'Store.IndexedDB', 'upgrade', @dbName, @dbs.objectStoreNames )
    request.onsuccess = ( event ) =>
      @dbs = event.target['result']
      console.log( 'Store.IndexedDB', 'open',    @dbName, @dbs.objectStoreNames )
      @publish( 'none', 'none', 'open', @dbs.objectStoreNames )
    request.onerror   = () =>
      console.error( 'Store.IndexedDB.openDatabase() unable to open', { database:@dbName, error:request.error } )
      @onerror( 'none', 'none', 'open', @dbName, { error:request.error } )

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

export default IndexedDB