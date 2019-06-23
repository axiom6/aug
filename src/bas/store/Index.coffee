

class Index

  constructor:(  @store, onOpenDB ) ->
    @dbName    = @store.dbName
    @tables    = @store.tables
    @keyPath   = 'id'

    @indexedDB = window.indexedDB
    @db        = null
    @txnUp     = null
    @dbVersion = @version()
    @openDB( @dbName, @dbVersion, onOpenDB )

  version:() ->
    dbVersionStr = localStorage.getItem('IndexDbVersion')
    dbVersionInt = if dbVersionStr? then parseInt(dbVersionStr)+1 else 1
    dbVersionStr = dbVersionInt.toString()
    localStorage.setItem('IndexDbVersion',dbVersionStr)
    console.log( 'Index() version', dbVersionStr, dbVersionInt )
    dbVersionInt

  change:( table, id, callback ) ->
    @get(  table, id, callback, 'change' )
    return

  get:( table, id, callback, op='get' ) ->
    txo = @txnObjectStore( table, "readwrite" ) # readonly
    req = txo.get(id)
    req.onsuccess = () =>
      callback( req.result ) if callback?
      @store.results( table, op, req.result, id )
    req.onerror = () =>
      @store.onerror( table, op, { error:req.error }, id )
    return

  add:( table, id, object ) ->
    object['id'] = id
    txo = @txnObjectStore( table, "readwrite" ) # [table]
    req = txo.add( object )
    req.onerror   = () => @store.onerror( table, 'add', { error:req.error, object:object }, id )
    return

  put:( table, id, object ) ->
    object['id'] = id
    txo = @txnObjectStore( table, "readwrite" )
    req = txo.put(object)
    req.onerror   = () => @store.onerror( table, 'put', { error:req.error, object:object }, id )
    return

  del:( table, id ) ->
    txo = @txnObjectStore( table, "readwrite" )
    req = txo['delete'](id)
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
    if not @db.objectStoreNames.contains(table)
      objStor = @db.createObjectStore( table, { keyPath:@keyPath } )
      objStor.createIndex("id", "id", { unique: true })
    return

  drop:( table ) ->
    @db.deleteObjectStore(table)
    return

  # IndexedDB Specifics

  idProp:( id, object, key ) ->
    object[key] = id if not object[key]?
    object

  txnObjectStore:( table, mode ) -> # , key=@key
    txo = null
    if not @db?
      console.trace( 'Store.IndexedDb.txnObjectStore() @db null' )
    else if @db.objectStoreNames.contains(table)
      txn = if @txnUp? then @txnUp else @db.transaction( table, mode )
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
    for  own name, obj of tables
      @open( name )
    return

  openDB:( dbName, dbVersion, onOpenDB=null ) ->
    request = @indexedDB.open( dbName, dbVersion ) # request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = ( event ) =>
      @db    = event.target['result']
      @txnUp = event.target['transaction']
      @openTables( @tables )
      console.log( 'Index.openDB()', 'upgrade', dbName, @db.objectStoreNames )
      onOpenDB() if onOpenDB?
    request.onsuccess = ( event ) =>
      @db = event.target['result']
      @openTables( @tables )
      console.log( 'Index.openDB()', 'open',    dbName, @db.objectStoreNames )
      onOpenDB() if onOpenDB?
    request.onerror   = () =>
      # console.error( 'Index.openDB() unable to open', { database:dbName, error:request.error } )
      @store.onerror( dbName, 'Index.openDB()', { error:request.error } )
    return

  deleteDB:( dbName ) ->
    request = @indexedDB.deleteDatabase(dbName)
    request.onsuccess = () =>
      console.log(   'Index.openDB().deleteDB() deleted',           { dbName:dbName } )
    request.onerror   = () =>
      console.error( 'Index.openDB().deleteDB() unable to delete',  { dbName:dbName, error:request.error } )
    request.onblocked = () =>
      console.error( 'Store.IndexedDB.deleteDB() database blocked', { dbName:dbName, error:request.error } )
    return  

  closeDB:() ->
    @db.close() if @db?
    return

export default Index

# console.error( 'Store.IndexedDB.constructor indexedDB not found' ) if not @indexedDB