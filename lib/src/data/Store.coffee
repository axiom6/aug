
import Util from '../util/Util.js'

class Store

  constructor:( stream, dbName ) ->
    @stream   = stream
    @dbName   = dbName
    @source   = @constructor.name
    @keyProp  = "_id"
    @tables   = @getTables()

  toSubject:( table, op ) ->
    table + ':' + op

  # id gets lost
  publish:( table, op, result ) ->
    @stream.publish( @toSubject(table,op), result )
    return

  results:  ( table, op, result ) ->
    obj = if result? then result else {}
    @publish( table, op, obj )
    return

  onerror:( table, op, error, id='none' ) ->
    msg    =  { table:table, op:op, error:error }
    msg.id = id if id isnt 'none'
    console.error( 'Store.onerror', msg )
    return

  subscribe:( table, op, source, onSubscribe  ) ->
    if op isnt 'change'
      if not @stream.hasSubject( @toSubject(table,op) )
        @stream.subscribe( @toSubject(table,op), source, onSubscribe )
    else
      for changeOp in Store.changeOps
        @stream.subscribe( @toSubject(table,changeOp), source, onSubscribe )
    return

  unsubscribe:( table, op, source  ) ->
    @stream.unsubscribe( @toSubject(table,op), source )
    return

  # SQL rowops
  get:( table, id, callback ) ->  # Get an object from table with id
  add:( table, id, obj )      -> # Post an object into table with id
  put:( table, id, obj )      -> # Put an object into table with id
  del:( table, id )           -> # Delete  an object from table with id

  # SQL tables with multiple objects (rows)    
  select:( table, where=Store.where, callback ) ->  # Get an object from table with id
  insert:( table, objs ) -> # Insert objects into table with unique id
  update:( table, objs ) -> # # Update objects into table mapped by id
  remove:( table, where=Store.where ) -> # Delete objects from table with where clause

  # Table DDL (Data Definition Language)
  show:() ->
    shows = {}
    for own key,table of @table when @source is table.source
      shows[key] = table
    @results( 'Shows', 'show', shows )
    return

  open:( table ) ->

  drop:( table ) ->

  change:( table, id='none' ) ->

  getTables:() ->
    str = localStorage.getItem( 'Tables' )
    if str? then JSON.parse(str) else {}

  showTables:() ->
    @results( 'Tables', 'show', @tables )
    return

  openTable:( table ) -> # Create a new table. For now only reallt used by CouchDB
    @tables[table] = {} if not @tables[table]
    if not @tables[table][@source]?
      @tables[table][@source] = {}
      json = JSON.stringify( @tables )
      localStorage.setItem( 'Tables', json )
      @open( table ) if @source is 'Couch'
    @results( table, 'open', table+@source )
    return

  dropTable:( table ) -> # Drop the entire @table - good for testing
    if @tables[table][@source]?
      delete @tables[table+@source]
      json = JSON.stringify( @tables )
      localStorage.setItem( 'Tables', json )
    @results( table, 'drop', table+@source )
    return

  # REST Api  CRUD + Subscribe for objectect records

  # A set is Table:{ url:'muse/Prin.json', result:json }
  batch:( sets, callback ) ->
    for  own table, set of sets
      @batchSelect( table, set, sets, callback )
    return

  batchComplete:( sets ) ->
    for own table, set of sets
      return false if not set['result']?
    true

  batchSelect:( table, set, sets, callback=null ) ->
    onBatch = (result) =>
      set.result = result
      if @batchComplete( sets )
        if callback?
           callback( sets )
        else
           @results( table, 'batch', sets )
    where = () -> true
    @select( table, where, onBatch ) # Calls the derived Store
    return   

  copyTable:( src, des, table, where=Store.where ) ->
    callback = (results) ->
      des.insert( table, results )
    src.select(   table, where, callback )
    return

  copyDatabase:( src, des ) ->
    for own table, data of @tables
      @copyTable( src, des, table, Store.where )
    return

  # Utilities
  toObjects:( results, query ) ->
    where = if query? then query else (obj)->true
    if @isArray(results)
      objs = {}
      for row in results when where(row)
        objs[row[@keyProp]] = row
      objs
    else
      objs = {}
      for own key, obj of results when where(obj)
         objs[key] = obj
      objs

  toArray:( objs ) -> Util.toArray( objs )
  isArray:( a )    -> Util.isArray( a    )
  isStr:(   s )    -> Util.isStr(   s    )

Store.changeOps = ['change','add','put','del','insert','update','remove']

# RDUDC            Retrieve  Create    Update    Delete   Change
Store.restOps  = [ 'get',    'add',    'put',    'del'    ]  #batch
Store.sqlOps   = [ 'select', 'insert', 'update', 'remove' ]
Store.tableOps = [ 'show',   'open',             'drop'   ]
Store.allOps   = Store.restOps.concat( Store.sqlOps, Store.tableOps )

# Dafaults for empty arguments
Store.where  = () -> true # Default where clause filter that returns true to access all records
 
export default Store
