

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
    console.log( 'Index.initDB()', @db.name, @db.version )
    return

  openDB:( dbName, dbVersion ) ->
    dbp = new Promise( (resolve,reject) =>
      request = window.indexedDB.open( dbName, dbVersion )
      request.onupgradeneeded = ( event ) =>
        upDb  = event.target['result']
        upTxn = event.target['transaction']
        @openStores( upDb, true )
        console.log( 'Index.openDB()', 'upgrade', dbName, upDb.objectStoreNames )
        upTxn.complete
        #resolve(upDb)
        return
      request.onsuccess = ( event ) =>
        db = event.target['result']
        @openStores( db, false )
        console.log( 'Index.openDB()', 'open',    dbName, db.objectStoreNames )
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
    # console.log( 'Index.openStores() called',
    #   { dbName:@dbName, version:db.version, isUpgrade:isUpgrade, stores:db.objectStoreNames } )
    for own  table, obj of @tables
      @openStore( db, table, isUpgrade )
    return

  contains:( db, table ) ->
    db.objectStoreNames.contains(table)

  openStore:( db, table, isUpgrade ) ->
    #console.log( 'Index.openStore()', { table:table,  } )
    if isUpgrade and not @contains( db, table )
      db.createObjectStore( table, { keyPath:@keyPath } )
      # st.createIndex( @keyPath, @keyPath, { unique: true } )
    return

  txo:( table, mode="readwrite" ) ->
    txn = @db.transaction( table, mode )
    sto = txn.objectStore( table )
    sto

  txp:( table, mode="readwrite" ) ->
    `async function tran(that) {
      return await that.txp( table, mode ) }`
    await tran(@)

  txp:( table, mode="readwrite" ) ->
    txp = new Promise( (resolve,reject) =>
      txn = @db.transaction( table, mode )
      txn.oncomplete = () => # event
        resolve( txn.objectStore(table) )
      txn.onerror = (error) =>
        @store.onerror( table, 'sto', error )
        reject() )
    txp

  version:() ->
    localStorage.setItem('IndexDbVersion','0')
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
    txo = @txo( table, 'readonly' )
    request = txo.get( id )
    request.onsuccess = () =>
      callback(request.result) if callback?
      @store.results( table, op, request.result, id )
    request.onerror = (error) =>
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

  select:( table, where, callback=null ) ->
    @traverse( 'select', table, where, callback )
    return

  update:( table, objects ) ->
    txo = @txo( table )
    for own id, object of objects
      txo.put(  object )
    return

  # Using @store.table for objects
  remove:( table, where ) ->
    txo = @txo( table )
    for own id, obj of @store.table(table) when where(obj)
      txo['delete']( id )
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

