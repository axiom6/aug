

#import { openDB } from '../../lib/idb/index.js';

class Index

  constructor:(  @store ) ->
    @dbName    = @store.dbName
    @tables    = @store.tables
    @txos      = {}
    @keyPath   = 'id'
    #window.indexedDB.deleteDatabase( @dbName )
    @dbp = @openDB(  @dbName, @version() )

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
      request.onerror   = () =>
        @store.onerror( dbName, 'Index.openDB()', { error:request.error } )
        reject()
        return )
    return dbp

  openStores:( db, isUpgrade ) ->
    console.log( 'Index.openStores() called',
      { dbName:@dbName, version:db.version, isUpgrade:isUpgrade, stores:db.objectStoreNames } )
    for own  table, obj of @tables
      @openStore( table, db, isUpgrade )
    return

  contains:( table, db ) ->
    db.objectStoreNames.contains(table)

  openStore:( table, db, isUpgrade ) ->
    console.log( 'Index.openStore()', { table:table,  } )
    @txos[table] = {}
    @txos[table]['id'] = table
    if isUpgrade and not @contains( table, db )
      @txos[table]['objectStore'] = db.createObjectStore( table ) # { keyPath:@keyPath }
      #txos[table]['objectStore'].createIndex( @keyPath, @keyPath, { unique: true } )
    return

  txo:( table, db, mode="readwrite" ) ->
    txn = db.transaction( table, mode )
    txn.objectStore(      table )

  version:() ->
    # localStorage.setItem('IndexDbVersion','0')
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
    @dbp.then( (db) =>
      txn = db.transaction(  table, "readwrite" )
      txo = txn.objectStore( table )
      return txo.get( id ) )
    .then( (result) =>
      callback(result) if callback?
      @store.results( table, op, result, id ) )
    return

  add:( table, id, object ) ->
    @dbp.then( (db) =>
      txn = db.transaction(  table, "readwrite" )
      txo = txn.objectStore( table )
      txo.add( object, id ) # id
      return txn.complete )
    return

  put:( table, id, object ) ->
    @dbp.then( (db) =>
      txn = db.transaction(  table, "readwrite" )
      txo = txn.objectStore( table )
      txo.put( object, id )  # id
      return txn.complete )
    return

  del:( table, id ) ->
    @dbp.then( (db) =>
      txn = db.transaction(  table, "readwrite" )
      txo = txn.objectStore( table )
      txo['delete']( id ) )
    return

  insert:( table, objects ) =>
    #txo = await @txo( table )
    for own id, object of objects
      @add( table, object, id ) # txo.add(object)
    #await txo.done
    return

  select:( table, where, callback=null ) ->
    @traverse( 'select', table, where, callback )
    return

  update:( table, objects ) ->
    #txo = await @txo( table )
    for own id, object of objects
      @put( table, id, object )
    #await txo.done
    return

  remove:( table, where ) ->
    #@txo = await @txo( table ) @store.table(table) should not be used
    for own id, obj of @store.table(table) when where(obj)
      @del( table, id ) # txo['delete']( table, key )
    #await txo.done
    return

  open:( table ) ->
    @dbp.then( (db) =>
      @openStore( table, db ) )
    return

  drop:( table ) ->
    @dbp.then( (db) =>
      db.deleteObjectStore(table) )
    return


export default Index

