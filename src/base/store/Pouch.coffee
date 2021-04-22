

import Store        from './Store.js'
import * as PouchDB from 'pouchdb-browser'

# in PouchDB and in CouchDB a database is a collection of docs with table as the doc id
# the id arg is all the calls is not used here

class Pouch extends Store

  @CouchDBHost    = 'http://127.0.0.1:5984/'
  @CouchDBLocal   = 'http://localhost:5984/'

  # adapter: One of 'idb', 'leveldb', or 'http'.

  constructor:( dbName ) ->
    super( dbName )
    @opts = {  adapter:'http', auth:{ username:'admin', password:'athena' } }
    @db = new PouchDB( 'http://127.0.0.1:5984/'+@dbName, @opts )

  add:(   table, id, obj ) ->
    @put( table, id, obj, 'add' )
    return

  get:( table, id, callback=null, op='get' ) ->
    @db.get( table )
       .then( (result) =>
         if callback? then callback(result) else @results( table, op, result, id ) )
       .catch( (error)  => @onerror( table, op, error,  id ) )
    return

  put:( table, id, obj, op='put' ) ->
    obj['_id'] = table
    @db.put( obj )
       .then(  (result) => @results( table, op, result, id ) )
       .catch( (error)  => @onerror( table, op, error,  id ) )
    return

  del:( table, id, op='del' ) ->
    @db.get( table )
       .then( (obj) =>
         @db.remove( obj._id, obj._rev ) )
            .then(  (result) => @results( table, op, result, id ) )
            .catch( (error)  => @onerror( table, op, error,  id ) )
       .catch( (error)  => @onerror( table, op, error,  id ) )
    return

  # Right now same as update, objs without _rev will be inserted
  insert:( table, objs ) ->
    docs = @toArray( objs )
    @db.bulkDocs( docs )
       .then(  (result) => @results( table, 'insert', result ) )
       .catch( (error)  => @onerror( table, 'insert', error  ) )
    return

  select:( table, where=@where, callback=null ) ->
    @db.allDocs( { include_docs:true } )
       .then(  (results) =>
         objs = @toSelectObjects( results.rows, where )
         if callback? then callback(objs) else @results( table, 'select', objs ) )
       .catch( (error)  =>
         @onerror( table, 'select', error  ) )
    return

  # Right now same as insert except objs with  _rev will be updated
  update:( table, objs ) ->
    docs = @toArray( objs )
    @db.bulkDocs( docs )
      .then(  (result) => @results( table, 'update', result ) )
      .catch( (error)  => @onerror( table, 'update', error  ) )
    return

  remove:(    table, objs, where ) ->
    docs = @toArray( objs, where, true )
    @db.bulkDocs( docs )
      .then(  (result) => @results( table, 'remove', result ) )
      .catch( (error)  => @onerror( table, 'remove', error  ) )
    return

  show:() ->
    @get( '_all_docs', 'None', null, 'show')
    return

  drop:(  table ) ->
    @del( table, 'None', 'drop' )
    return

  # Subscribe to  a table. Note: PouchDB can not subscript to objecst with id
  change:( table, id='None' ) ->
    opts = { include_docs:true }
    @db.changes( opts )
       .on( 'change',   (change)   => @results( table, 'change', change,   id ) )
       .on( 'complete', (complete) => @results( table, 'change', complete, id ) )
       .on( 'error',    (error)    => @onerror( table, 'change', error,    id ) )
    return

  close:( table ) ->
    @db.close()
       .then(  (result) =>
         @results( table, 'close', result ) )
       .catch( (error)  =>
         @onerror( table, 'close', error  ) )
    return

  toArray:( objs, whereIn=null, del=false ) ->
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
        array.push( obj )
    array

  toSelectObjects:( rows, whereIn, del=false ) ->
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

###    
      @tableDBs = {}

  db:( table, id='None', obj=null ) ->
    if not @tableDBs[table]?
      @tableDBs[table] = new PouchDB( table, @opts )
    obj['_id'] = id if obj? and @isStr(id)
    @tableDBs[table]
  
  
#`var global = window`
#(window as any).global = window
#window.PouchDB = PouchDB
#import PouchDB from 'pouchdb'
#import * as PouchDBFind from 'pouchdb/dist/pouch@db.find';
#PouchDB.plugin(PouchDBFind);
#(window as any).global = window;
#mport * as PouchDBUpsert from 'pouchdb-upsert/dist/pouch@db.upsert';
###