

#import { openDB } from '../../lib/idb/index.js';

class Index

  constructor:(  @store ) ->
    @dbName    = @store.dbName
    @tables    = @store.tables
    @keyPath   = 'id'
    window.indexedDB.deleteDatabase( @dbName )

  initDB:() ->
    `async function open(that) {
      return await that.openDB( that.dbName, that.version() ) }`
    @db = await open(@)
    # console.log( 'Index.initDB()', @db.name, @db.version )
    return

  openDB:( dbName, dbVersion ) ->
    dbp = new Promise( (resolve,reject) =>
      request = window.indexedDB.open( dbName, dbVersion )
      request.onupgradeneeded = ( event ) =>
        upDb  = event.target['result']
        upTxn = event.target['transaction']
        @openStores( upDb, true )
        # console.log( 'Index.openDB()', 'upgrade', dbName, upDb.objectStoreNames )
        upTxn.complete
        return
      request.onsuccess = ( event ) =>
        db = event.target['result']
        @openStores( db, false )
        # console.log( 'Index.openDB()', 'open',    dbName, db.objectStoreNames )
        resolve(db)
        return
      request.onblocked = (  ) =>  # event
        @store.onerror( dbName, 'open', { cause:'Index.openDB() onblocked', error:request.error } )
        reject()
        return
      request.onerror   = () =>
        @store.onerror( dbName, 'open', { cause:'Index.openDB() onerror', error:request.error } )
        reject()
        return )
    return dbp

  openStores:( db, isUpgrade ) ->
    for own  table, obj of @tables
      @openStore( db, table, isUpgrade )
    return

  contains:( db, table ) ->
    db.objectStoreNames.contains(table)

  openStore:( db, table, isUpgrade ) ->
    if isUpgrade and not @contains( db, table )
      db.createObjectStore( table, { keyPath:@keyPath } )
      # st.createIndex( @keyPath, @keyPath, { unique: true } )
    return

  txo:( table, mode="readwrite" ) ->
    txn = @db.transaction( table, mode )
    sto = txn.objectStore( table )
    sto

  version:() ->
    localStorage.setItem('IndexDbVersion','0')
    dbVersionStr = localStorage.getItem('IndexDbVersion')
    dbVersionInt = if dbVersionStr? then parseInt(dbVersionStr)+1 else 1
    dbVersionStr = dbVersionInt.toString()
    localStorage.setItem('IndexDbVersion',dbVersionStr)
    console.log( 'Index() version', dbVersionStr, dbVersionInt )
    dbVersionInt

  batch:( name, obj, objs, callback=null ) ->
    onBatch = (result) =>
      obj.result = result
      if @store.batchComplete( objs )
        if callback?
           callback( objs )
        else
           @store.results( name, 'batch', objs )
    where = () -> true
    @select( obj.table, where, onBatch )
    return

  get:( table, id, callback, op='get' ) ->
    txo = @txo( table, 'readonly' )
    req = txo.get( id )
    req.onsuccess = () =>
      if callback?
         callback( { "#{id}":req.result } )
      else
         @store.results( table, op, req.result, id )
    req.onerror = (error) =>
      @store.onerror( table, op, error, id )
    return

  add:( table, id, object ) ->
    txo = @txo( table )
    txo.add( object )
    return # txn.complete

  put:( table, id, object ) ->
    txo = @txo( table )
    txo.put( object )
    return

  del:( table, id ) ->
    txo = @txo( table )
    txo['delete']( id )
    return

  insert:( table, objects ) =>
    txo = @txo( table )
    for own id, object of objects
      txo.add(  object )
    return

  select:    ( table, where, callback=null ) ->
    @traverse( table, where, callback, 'select' )
    return

  update:( table, objects ) ->
    txo = @txo( table )
    for own id, object of objects
      txo.put(  object )
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
         @store.results( table, op, objs  )
    req.onerror = (error) =>
      @store.onerror( table, op, error )
    return

  open:( table ) ->
    if @db?
      @openStore( @db, table )
    else
      @store.onerror( table, 'open', '@db null for IndexedDB' )
    return

  drop:( table ) ->
    if @db?
       @db.deleteObjectStore(table)
    else
       @store.onerror( table, 'drop', '@db null for IndexedDB' )
    return

export default Index

