
import Util     from '../../bas/util/Util.js'
import Store    from './Store.js'

import firebase from '../../../pub/lib/store/firebase.app.esm.js'      # Firebase core (required)
import               '../../../pub/lib/store/firebase.database.esm.js' # Realtime Database
import               '../../../pub/lib/store/firebase.auth.esm.js'     # Authentication

class Fire extends Store

  # Fire.OnFire  = { get:"value", add:"child_added", put:"child_changed", del:"child_removed" }

  constructor:( stream, uri, config ) ->
    super( stream, uri, 'Fire' ) # @dbName set by Store in super constructor
    @fb = @init( config )
    @keyProp = 'id'
    @auth() # Anonomous logins have to be enabled
    @fd = firebase.database()

  init:( config ) ->
    firebase.initializeApp(config)
    #console.log( 'Fires.init', config )
    firebase

  add:( t, id, object  ) ->
    table = @tableName(t)
    object[@keyProp] = id
    onComplete = (error) =>
      if not error?
        @publish( table, 'add', id, object )
      else
        @onError( table, 'add', id, object, { error:error } )
    @fd.ref(table+'/'+id).set( object, onComplete )
    return

  get:( t, id ) ->
    table = @tableName(t)
    onComplete = (snapshot) =>
      if snapshot? and snapshot.val()?
        @publish( table, 'get', id, snapshot.val() )
      else
        @onError( table, 'get', id, { msg:'Fire get error' } )
    @fd.ref(table+'/'+id).once('value', onComplete )
    return

  # Same as add
  put:( t, id,  object ) ->
    table = @tableName(t)
    onComplete = (error) =>
      if not error?
        @publish( table, 'put', id, object )
      else
        @onError( table, 'put', id, object, { error:error } )
    @fd.ref(table+'/'+id).set( object, onComplete )
    return

  del:( t, id ) ->
    table = @tableName(t)
    onComplete = (error) =>
      if not error?
        @publish( table, 'del', id, {} )
      else
        @onError( table, 'del', id, {}, { error:error } )
    @fd.ref(table+'/'+id).remove( onComplete )
    return

  insert:( t, objects ) ->
    table  = @tableName(t)
    onComplete = (error) =>
      if not error?
        @publish( table, 'insert', 'none', objects )
      else
        @onError( table, 'insert', 'none', { error:error } )
    @fd.ref(table).set( objects, onComplete )
    return

  select:( t, where=@W ) ->
    if where is false then {}
    table = @tableName(t)
    onComplete = (snapshot) =>
      if snapshot? and snapshot.val()?
        #val = @toObjects( snapshot.val() )
        @publish( table, 'select', 'none', snapshot.val() )
      else
        @publish( table, 'select', 'none', {} ) # Publish empty results
    @fd.ref(table).once('value', onComplete )
    return

  range:( t, beg, end ) ->
    table = @tableName(t)
    #console.log( 'Fire.range  beg', t, beg, end )
    onComplete = (snapshot) =>
      if snapshot? and snapshot.val()?
        val = @toObjects( snapshot.val() )
        @publish( table, 'range', 'none', val )
      else
        @publish( table, 'range', 'none', {}  )  # Publish empty results
    @fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value', onComplete )
    return

  update:( t, objects ) ->
    table  = @tableName(t)
    onComplete = (error) =>
      if not error?
        @publish( table, 'update', 'none', objects )
      else
        @onError( table, 'update', 'none', { error:error } )
    @fd.ref(table).update( objects, onComplete )
    return

  remove:( t, keys ) ->
    table = @tableName(t)
    ref       = @fd.ref(table)
    ref.child(key).remove() for key in keys
    @publish( table, 'remove', 'none', keys )
    return

  make:( t ) ->
    table = @tableName(t)
    onComplete = (error) =>
      if not error?
        @publish( table, 'make', 'none', {}, {} )
      else
        @onError(  table, 'make', 'none', {}, { error:error } )
    @fd.ref().set( table, onComplete )
    return

  show:( t, where=@W ) ->
    table  = if t? then @tableName(t) else @dbName
    onComplete = (snapshot) =>
      if snapshot? and snapshot.val()?
        keys = Util.toKeys( snapshot.val(), where, @keyProp )
        @publish( table, 'show', 'none', keys, { where:where.toString() } )
      else
        @onError( table, 'show', 'none', {},   { where:where.toString() } )
    if t?
      @fd.ref(table).once('value', onComplete )
    else
      @fd.ref(     ).once('value', onComplete )
    return

  # ref.remove( onComplete ) is Dangerous and has removed all tables in Firebase
  drop:( t ) ->
    table = @tableName(t)
    @onError( table, 'drop', 'none', {}, { error:'Fire.drop(t) not implemented'  } )
    return

  # Have too clarify id with snapshot.key
  on:( t, onEvt, id='none', onFunc=null ) ->
    table  = @tableName(t)
    onComplete = (snapshot) =>
      if snapshot?
        key = snapshot.key
        val = snapshot.val() # @toObjects( snapshot.val() )
        if onFunc?
           onFunc( key, val )
        else
           @publish( table, onEvt, key, val )
      else
        @onError( table, onEvt, id, {}, { error:'error' } )
    path  = if id is 'none' then table else table + '/' + id
    @fd.ref(path).on( Fire.OnFire[onEvt], onComplete )
    return

  # keyProp only needed if rows is array
  toObjects:( rows ) ->
    objects = {}
    if Util.isArray(rows)
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
     @onError( 'none', 'none', 'anon', {}, { error:error } )
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