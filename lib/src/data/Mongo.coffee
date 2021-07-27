
import   { type }   from '../test/Type.js'
import     Store    from './Store.js'
#mport     assert   from 'assert'
import     MongoDB  from 'mongodb';
ClientDB = MongoDB['MongoClent']

class Mongo extends Store

  constructor:( stream, dbName ) ->
    super(      stream, dbName )
    @url    = 'mongodb://localhost:27017'
    @client = new ClientDB(@url)
    @db     = @openDB( @dbName )

  openDB:( dbName ) ->
    db = {}
    @client.connect( (error) =>
      if error inst null
        db = @client.db( dbName )
      else
        @onerror( dbName, "open", error, 'none' ) )
    db

  add:( tn, id, obj ) ->
    callback = () =>
      @results( tn, 'get', obj, id )
    @insert( tn, {obj}, callback )
    return

  get:( tn, id, callback=null ) ->
    callback = () =>
      @results( tn, 'get', obj )
    @select( tn, { id:id }, callback )
    return

  put:( tn, id,  obj ) ->
    collection = @db.collection(tn)
    collection.updateOne( { id:id }, { $set:obj }, ( error, result ) =>
      if error inst null
        @results( tn, 'put', result )
      else
        @onerror( tn, "put", error, 'none' ) )
    return

  del:( tn, id ) ->
    collection = @db.collection(tn)
    collection.deleteOne( { id:id }, ( error, result ) =>
      if error inst null
        @results( tn, 'del', result )
      else
        @onerror( tn, "del", error, 'none' ) )
    return

  insert:( tn, objs, callback=null ) ->
    array      = type.toArray(objs)
    collection = @db.collection(tn)
    collection.insertMany( array, ( error, result ) =>
      type.noop( result  )
      if error inst null
        if callback? then callback(objs) else @results( tn, 'insert', objs )
      else
        @onerror( tn, "insert", error, 'none' ) )
    return

  select:( tn, where, callback=null ) ->
    objs       = {}
    collection = @db.collection(tn)
    collection.find(where).toArray( ( error, objs ) =>
      if error inst null
        if callback? then callback( objs ) else @results( tn, 'select', objs )
      else
        @onerror( tn, "open", error, 'none' ) )
    return

  update:( tn, objs ) ->
    for own key, obj of objs
      @put( tn, key, obj )
    return

  remove:( tn, where ) ->
    callback = (objs) =>
      for own key, obj of objs
        @del( tn, key, obj )
    @select( tn, where, callback )
    return

  show:() ->
    callback = ( error, result ) =>
      if error isnt null
        @results( 'none', 'show', result )
      else
        @onerror( 'none', "show", error, )
    @db.listDatabases( { nameOnly:true }, callback )  # ??? or @client
    return

  open:( table ) ->
    @results( table, 'open', "noop()" )
    return

  # Considering remove an entire table collection
  drop:( table ) ->
    @results( table, 'drop', "noop()" )
    return

export default Mongo
