

import Store        from './Store.js'
import * as PouchDB from 'pouchdb'
#`var global = window`
#(window as any).global = window
#window.PouchDB = PouchDB
#import PouchDB from 'pouchdb'
import * as PouchDBFind from 'pouchdb/dist/pouchdb.find';
#PouchDB.plugin(PouchDBFind);
#(window as any).global = window;
#mport * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';


class Pouch extends Store

  @CouchDBHost    = 'http://127.0.0.1:5984/'
  @CouchDBLocal   = 'http://localhost:5984/'

  # adapter: One of 'idb', 'leveldb', or 'http'.

  constructor:( @opts={} ) ->
    super()
    @tableDBs = {}

  db:( table, id='None', obj=null ) ->
    if not @tableDBs[table]?
      @tableDBs[table] = new PouchDB( table, @opts )
    obj['_id'] = id if obj? and @isStr(id)
    @tableDBs[table]

  # Same as put
  add:( table, id, obj ) ->
    db = @db( table, id, obj )
    db.put( obj )
      .then(  (result) => @results( table, 'add', result, id ) )
      .catch( (error)  => @onerror( table, 'add', error,  id ) )
    return

  get:( table, id, callback=null ) ->
    db = @db( table, id )
    db.get( table )
     .then(  (result) =>
       if callback? then callback(result) else @results( table, 'get', result, id ) )
     .catch( (error)  => @onerror( table, 'get', error,  id ) )
    return

  put:( table, id, obj ) ->
    db = @db( table, id, obj )
    db.put( obj )
      .then(  (result) => @results( table, 'put', result, id ) )
      .catch( (error)  => @onerror( table, 'put', error,  id ) )
    return

  del:( table, id ) ->
    db = @db( table, id )
    db.get( table )
      .then( (obj) =>
         db.remove( obj._id, obj._rev ) )
           .then(  (result) => @results( table, 'del', result, id ) )
           .catch( (error)  => @onerror( table, 'del', error,  id ) )
      .catch( (error)  => @onerror( table, 'del', error,  id ) )
    return

  # Right now same as update, objs without _rev will be inserted
  insert:( table, objs ) ->
    docs = @toArray( table, objs, @where )
    db   = @db( table )
    db.bulkDocs( docs )
      .then(  (result) => @results( table, 'insert', result ) )
      .catch( (error)  => @onerror( table, 'insert', error  ) )
    return

  select:( table, where=@where, callback=null ) ->
    db   = @db( table )
    db.allDocs( { include_docs:true } )
      .then(  (results) =>
        objs = @toSelectObjects( table, results.rows, where )
        if callback? then callback(result) else @results( table, 'select', objs ) )
      .catch( (error)  =>
        @onerror( table, 'select', error  ) )
    return

  # Right now same as insert except objs with  _rev will be updated
  update:( table, objs ) ->
    docs = @toArray( table, objs, @where )
    db   = @db( table )
    db.bulkDocs( docs )
      .then(  (result) => @results( table, 'update', result ) )
      .catch( (error)  => @onerror( table, 'update', error  ) )
    return

  remove:( table, objs, where=@where ) ->
    docs = @toArray( table, objs, where, true )
    db   = @db( table )
    db.bulkDocs( docs )
      .then(  (result) => @results( table, 'remove', result ) )
      .catch( (error)  => @onerror( table, 'remove', error  ) )
    return

  open:( table ) ->
    db = @db( table )
    @results( table, 'open', db )
    return

  show:( table ) ->
    db = @db( table )
    db.info()
      .then(  (result) => @results( table, 'show', result ) )
      .catch( (error)  => @onerror( table, 'show', error  ) )
    return

  drop:( table ) ->
    db = @db( table )
    db.destroy()
      .then(  (result) => @results( table, 'drop', result ) )
      .catch( (error)  => @onerror( table, 'drop', error  ) )
    # @close( table ) # Determine necessity
    return

  # Subscribe to  a table. Note: PouchDB can not subscript to objecst with id
  change:( table, id='None' ) ->
    opts = { include_docs:true }
    db   = @db( table, id )
    db.changes( opts )
      .on( 'change',   (change)   => @results( table, 'change', change   ) )
      .on( 'complete', (complete) => @results( table, 'change', complete ) )
      .on( 'error',    (error)    => @onerror( table, 'change', error    ) )
    return

  close:( table ) ->
    db = @db( table )
    db.close()
      .then(  (result) =>
        delete ( @tableDBs[table] )
        @results( table, 'close', result ) )
      .catch( (error)  =>
        @onerror( table, 'close', error  ) )
    return

  toArray:( table, objs, whereIn=null, del=false ) ->
    where = if whereIn? then whereIn else () -> true
    array = []
    if @isArray(objs)
      for obj in array  when where(obj)
        obj['_id']      = obj['id'] if obj['id']
        obj['_deleted'] = true if del
        array.push( obj )
    else
      for own key, obj of objs when where(obj)
        obj['_id'] = key
        obj['_deleted'] = true if del
        array.push(obj)
    array

  toSelectObjects:( table, rows, whereIn, del=false ) ->
    where = if whereIn? then whereIn else () -> true
    objs = {}
    if @isArray(rows)
      for row in rows when where(row.doc)
        row['_deleted'] = true if del
        objs[row.doc['id']] = row.doc # Weird PouchDB structure
    else
      for key, row of rows when where(row)
        row['_deleted'] = true if del
        objs[key]  = row
    objs

export default Pouch