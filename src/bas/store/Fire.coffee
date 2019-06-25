
import firebase from '../../../pub/lib/store/firebase.app.esm.js'      # Firebase core (required)
import               '../../../pub/lib/store/firebase.database.esm.js' # Realtime Database
import               '../../../pub/lib/store/firebase.auth.esm.js'     # Authentication

class Fire

  Fire.OnFire  = { get:"value", add:"child_added", put:"child_changed", del:"child_removed" }

  constructor:( @store, config ) ->
    @dbName = @store.dbName
    @tables = @store.tables
    @fb = @init( config )
    @keyProp = 'id'
    @auth() # Anonomous logins have to be enabled
    @fd = firebase.database()

  init:( config ) ->
    firebase.initializeApp(config)
    #console.log( 'Fires.init', config )
    firebase

  batch:( name, obj, objs, callback=null ) ->
    onBatch = (snapshot) =>
      if snapshot? and snapshot.val()?
        obj.result = snapshot.val()
        if @store.batchComplete( objs )
          if callback?
             callback( objs )
          else
             @store.results( name, 'batch', objs )
      else
        @store.onerror( obj.table, 'batch', 'Fire batch error' )
    @fd.ref(table).once('value', onBatch )
    return

  # Have too clarify id with snapshot.key
  change:( table, id='none', callback=null, onEvt='put' ) ->
    onComplete = (snapshot) =>
      if snapshot?
        key = snapshot.key
        val = snapshot.val()
        if callback?
           callback( val )
        else
           @store.results( table, 'change', val, key )
      else
        @store.onerror( table, 'change', 'Fire batch error' )
    path  = if id is 'none' then table else table + '/' + id
    @fd.ref(path).on( Fire.OnFire[onEvt], onComplete )
    return    

  get:( table, id, callback ) ->
    onComplete = (snapshot) =>
      if snapshot? and snapshot.val()?
        if callback?
           callback( snapshot.val() )
        else
           @store.results( table, 'get', snapshot.val(), id )
      else
        @store.onerror( table, 'get', 'Fire get error', id )
    @fd.ref(table+'/'+id).once('value', onComplete )
    return    

  add:( table, id, object  ) ->
    object[@keyProp] = id
    onComplete = (error) =>
      @store.onerror( table, 'add', { error:error, object:object }, id ) if error?
    @fd.ref(table+'/'+id).set( object, onComplete )
    return

  # Same as add
  put:( table, id,  object ) ->
    onComplete = (error) =>
      @store.onerror( table, 'put', { error:error, object:object }, id ) if error?
    @fd.ref(table+'/'+id).set( object, onComplete )
    return

  del:( table, id ) ->
    onComplete = (error) =>
      @store.onerror( table, 'del', { error:error }, id ) if error?
    @fd.ref(table+'/'+id).remove( onComplete )
    return

  select:( table, where, callback=null ) ->
    if where is false then {}
    onComplete = (snapshot) =>
      if snapshot? and snapshot.val()?
        if callback?
           callback( snapshot.val() )
        else
           @store.results( table, 'select', snapshot.val() )
    @fd.ref(table).once('value', onComplete )
    return

  insert:( table, objects ) ->
    onComplete = (error) =>
      @store.onerror( table, 'insert', { error:error } ) if error?
    @fd.ref(table).set( objects, onComplete )
    return

  range:( table, beg, end ) ->
    onComplete = (snapshot) =>
      if snapshot? and snapshot.val()?
        val = @toObjects( snapshot.val() )
        @store.results( table, 'range', val )
    @fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value', onComplete )
    return

  update:( table, objects ) ->
    onComplete = (error) =>
      @store.onerror( table, 'update', { error:error } ) if error?
    @fd.ref(table).update( objects, onComplete )
    return

  remove:( table, keys ) ->
    ref = @fd.ref(table)
    ref.child(key).remove() for key in keys
    return

  # Need to implement
  open:( table ) ->
    if   table is false then {}
    return

  # ref.remove( onComplete ) is Dangerous and has removed all tables in Firebase
  drop:( table ) ->
    if table is false then {}
    return

  # keyProp only needed if rows is array
  toObjects:( rows ) ->
    objects = {}
    if @store.isArray(rows)
      for row in rows
        if row? and row['key']?
          ckey = row['key'].split('/')[0]
          objects[row[ckey]] = @toObjects(row)
          console.log( 'Fire.toObjects', { rkowKey:row['key'], ckey:ckey, row:row } )
        else
          console.error( "Fire.toObjects() row array element requires key property", row )
    else
      objects = rows
    objects

  # Sign Anonymously
  auth:( ) ->
   onerror = (error) =>
     @store.onerror( 'auth', 'auth', { error:error } )
   @fb.auth().signInAnonymously().catch( onerror )
   return



export default Fire

#mport firebase from "firebase/app" # Firebase core (required)
#mport "firebase/database"          # Realtime Database
#mport firebase from '../../../pub/lib/store/Firebase.esm.stub.js'
#mport "firebase/auth"              # Authentication
#mport "firebase/firestore"         # Cloud Firestore
#mport "firebase/functions"         # Cloud Functions for Firebase Client SDK
#mport "firebase/messaging"         # Cloud Messaging
#mport "firebase/storage"           # Cloud Storage
#mport "firebase/performance"       # Performance Monitoring (beta release)