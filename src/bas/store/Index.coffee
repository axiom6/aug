

class Index

  constructor:(  @store, onOpen ) ->
    @dbName    = @store.dbName
    @tables    = @store.tables
    @keyPath   = 'id'
    @dbVersion = 2
    @indexedDB = window.indexedDB
    @dbs       = null
    @openDatabase( @dbName, @dbVersion, onOpen )


  change:( table, id, callback ) ->
    @get(  table, id, callback, 'change' )
    return

  get:( table, id, callback, op='get' ) ->
    txo = @txnObjectStore( table, "readonly" )
    req = txo.get(id) # Check to be sre that indexDB understands id
    req.onsuccess = () =>
      callback( req.result ) if callback?
      @store.results( table, op, req.result, id )
    req.onerror = () =>
      @store.onerror( table, op, { error:req.error }, id )
    return

  add:( table, id, object ) ->
    txo = @txnObjectStore( table, "readwrite" )
    req = txo.add( obj, id )
    req.onerror   = () => @store.onerror( table, 'add', { error:req.error, object:object }, id )
    return

  put:( table, id, object ) ->
    txo = @txnObjectStore( table, "readwrite" )
    req = txo.put(object) # Check to be sre that indexDB understands id
    req.onerror   = () => @store.onerror( table, 'put', { error:req.error, object:object }, id )
    return

  del:( table, id ) ->
    txo = @txnObjectStore( table, "readwrite" )
    req = txo['delete'](id) # Check to be sre that indexDB understands id
    req.onerror   = () => @store.onerror( table, 'del', { error:req.error }, id )
    return

  insert:( table, objects ) ->
    txo = @txnObjectStore( table, "readwrite" )
    for own key, object of objects
      object = @idProp( key, object, @key )
      txo.put(object)
    return

  select:( table, where, callback=null ) ->
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

  open:( table ) ->
    @dbs.createObjectStore( table, { keyPath:@keyPath } )
    return

  drop:( table ) ->
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
      txo = txn.objectStore(  table ) # { keyPath:@keyPath } )
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
      @store.results( table, op, objects )
    req.onerror = () =>
      @store.onerror( table, op, { error:req.error, where:where } )
    return

  openTables:( tables ) ->
    for  own key, obj of tables # when not @dbs.objectStoreNames.contains(key)
      @open( key )
    return

  openDatabase:( dbName, dbVersion, onOpen=null ) ->
    request = @indexedDB.open( dbName, dbVersion ) # request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = ( event ) =>
      @dbs = event.target['result']
      @openTables( @tables )
      console.log( 'Store.IndexedDB', 'upgrade', dbName, @dbs.objectStoreNames )
      onOpen() if onOpen?
    request.onsuccess = ( event ) =>
      @dbs = event.target['result']
      @openTables( @tables )
      console.log( 'Store.IndexedDB', 'open',    dbName, @dbs.objectStoreNames )
      onOpen() if onOpen?
    request.onerror   = () =>
      console.error( 'Store.IndexedDB.openDatabase() unable to open', { database:dbName, error:request.error } )
      @store.onerror( dbName, 'Index.openDatabase', { error:request.error } )

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