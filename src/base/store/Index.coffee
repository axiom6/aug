
import Store  from './Store.js'

class Index extends Store

  constructor:( dbName ) ->
    super()
    @db        = null
    @dbName    = dbName
    @dbVersion = 1
    @keyPath   = 'id'
    window.indexedDB.deleteDatabase( @dbName )

  openDB:( dbName, dbVersion, tables ) ->
    # @db.close() if @db?
    dbp = new Promise( ( resolve, reject ) =>
      request = window.indexedDB.open( dbName, dbVersion )
      request.onupgradeneeded = ( event ) =>
        upDb  = event.target['result']
        upTxn = event.target['transaction']
        @openStores( upDb, tables )
        # console.log( 'Index.openDB()', 'upgrade', @dbName, upDb.objectStoreNames )
        upTxn.complete
        return
      request.onsuccess = ( event ) =>
        db = event.target['result']
        # console.log( 'Index.openDB()', 'open', @dbName )
        resolve(db)
        return
      request.onblocked = (  ) =>  # event
        @onerror( dbName, 'Index.openDB()', { cause:'Index.openDB() onblocked', error:request.error } )
        reject('Request blocked')
        return
      request.onerror   = () =>
        @onerror( dbName, 'Index.openDB()', { cause:'Index.openDB() onerror', error:request.error } )
        reject('Request error')
        return
    )
    dbp

  openStores:( upDb, tables ) ->
    for table in tables
      @openStore( upDb, table )
    return

  contains:( upDb, table ) ->
    upDb.objectStoreNames.contains(table)

  openStore:( upDb, table ) ->
    if not @contains( upDb, table )
      upDb.createObjectStore( table, { keyPath:@keyPath } )
      # st.createIndex( @keyPath, @keyPath, { unique: true } )
    return

  # Need to better handle a missing objectStore
  txo:( table, mode="readwrite" ) ->
    if @contains( @db, table )
       txn = @db.transaction( table, mode )
       sto = txn.objectStore( table )
       sto
    else
       console.error(  'Index.txo() missing ObjectStore for',   table )
       #hrow new Error('Index.txo() missing ObjectStore for ' + table ) # May not be necessary
       null

  add:( table, id, obj ) ->
    txo = @txo( table )
    txo.add( obj )
    @results( table, 'add', obj, id )
    return

  get:( table, id, callback, op='get' ) ->
    txo = @txo( table )
    req = txo.get( id )
    req.onsuccess = () =>
      if callback?
         callback( { "#{id}":req.result } )
      else
         @results( table, op, req.result, id )
    req.onerror = (error) =>
      @onerror( table, op, error, id )
    return

  put:( table, id, obj ) ->
    txo = @txo( table )
    txo.put( obj )
    @results( table, 'put', obj, id )
    return

  del:( table, id ) ->
    txo = @txo( table )
    txo['delete']( id )
    @results( table, 'del', {}, id ) # Latee with obj
    return

  insert:( table, objs ) ->
    txo = @txo( table )
    for own id, obj of objs
      txo.add(  obj )
    @results( table, 'insert', objs )
    return

  select:    ( table, where, callback=null ) ->
    @traverse( table, where, callback, 'select' )
    return

  update:( table, objs ) ->
    txo = @txo( table )
    for own id, obj of objs
      txo.put(  obj )
    @results( table, 'update', objs )
    return

  remove:    ( table, where ) ->
    @traverse( table, where, null, 'remove' )
    return

  traverse:( table, where, callback=null, op ) ->
    mode = if op is 'remove' then 'readwrite' else 'readonly'
    txo  = @txo( table, mode )
    req  =  txo.getAll()
    req.onsuccess = () =>
      objs = {}
      for own key, obj of req.result when where(obj)
        objs[obj.id] = obj
        txo['delete'](obj.id) if op is 'remove'
      if callback?
         callback(objs)
      else
         @results( table, op, objs  )
    req.onerror = (error) =>
      @onerror( table, op, error )
    return

  show:() ->
    tables = []
    for own key, table of @db.objectStoreNames
      tables.push( table )
    @results( @dbName, 'show', tables )
    return

  drop:( table ) ->
    try
      @db.deleteObjectStore(table)
      @results( table, 'drop', {} )
    catch error
       @onerror( table, 'drop', error )
    return

export default Index

###
  addTable:( table, id, obj ) ->
    if not @contains( @db, table )
      @openDB( @dbName, @dbVersion, [table] )
        .then( (db) =>
           @db = db
           @addHas( table, id, obj )
           return )
        .catch( (error) =>
           @onerror( table, 'addTable', error )
           return )
    else
      @addHas( table, id, obj )
    return

  initDB:() ->
    `function open(that) {
      return await that.openDB( that.dbName, that.version() ) }`
    @db = open(@)
    console.log( 'Index.initDB()', @db.name, @db.version )
    return

  openDatabase:() ->
    request = @indexedDB.open( @dbName, @dbVersion ) # request = @indexedDB.IDBFactory.open( database, @dbVersion )
    request.onupgradeneeded = ( event ) =>
      @dbs = event.target.result
      @objectStoreNames = @dbs['objectStoreNames']
      @createObjectStores()
      console.log( 'Store.IndexedDB', 'upgrade', @dbName, @objectStoreNames )
    request.onsuccess = ( event ) =>
      @dbs = event.target.result
      console.log( 'Store.IndexedDB', 'open',    @dbName, @objectStoreNames )
      @publish( 'none', 'open', 'none', @dbs.objectStoreNames )
    request.onerror   = () =>
      console.error( 'Store.IndexedDB.openDatabase() unable to open', { database:@dbName, error:request.error } )
      @onError( 'none', 'open', 'none', @dbName, { error:request.error } )
###

