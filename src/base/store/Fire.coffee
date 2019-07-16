
import firebase from '../../../pub/lib/store/firebase-app.esm.js'      # Firebase core (required)
import               '../../../pub/lib/store/firebase-database.esm.js' # Realtime Database
import               '../../../pub/lib/store/firebase-auth.esm.js'     # Authentication

class Fire

  constructor:( @store ) ->
    @dbName  = @store.dbName
    @tables  = @store.tables
    @keyProp = 'id'
    @fb      = @init( @config("augm-d4b3c") )
    #@auth() # Anonomous logins have to be enabled
    @fd      = @fb.database()
    #@openTables( @tables )

  config:( projectId ) -> {
    projectId:         projectId,
    apiKey:            "AIzaSyD4Py9oML_Y77ze9bGX0I8s9hqndKkBVjY",
    authDomain:        "#{projectId}.firebaseapp.com",
    databaseURL:       "https://#{projectId}.firebaseio.com",
    storageBucket:     "#{projectId}.appspot.com",
    messagingSenderId: "341294405322",
    appID:             "1:341294405322:web:06369c7823ccc079" }

  ###
  firebase.initializeApp({
    "apiKey": "AIzaSyD4Py9oML_Y77ze9bGX0I8s9hqndKkBVjY",
    "databaseURL": "https://augm-d4b3c.firebaseio.com",
    "storageBucket": "augm-d4b3c.appspot.com",
    "authDomain": "augm-d4b3c.firebaseapp.com",
    "messagingSenderId": "341294405322",
    "projectId": "augm-d4b3c",
    "appId": "1:341294405322:web:06369c7823ccc079"
  });
  ###

  init:( config ) ->
    #console.log( 'firebase', firebase )
    firebase.initializeApp(config)
    firebase

  batch:( name, obj, objs, callback=null ) ->
    @fd.ref(table).once('value' )
      .then( (snapshot) =>
        if snapshot? and snapshot.val()?
          obj.result = snapshot.val()
          if @store.batchComplete( objs )
            if callback?
               callback( objs )
            else
               @store.results( name, 'batch', objs ) )
      .catch( (error) =>
        @store.onerror( obj.table, 'batch', error ) )
    return

  # Have too clarify id with snapshot.key
  change:( table, id='none', callback=null, Event='put' ) ->
    path  = if id is 'none' then table else table + '/' + id
    @fd.ref(path).on( Fire.EventType[Event], onChange )
       .then( (snapshot) =>
          if snapshot?
            key = snapshot.key
            val = snapshot.val()
            if callback?
               callback( val )
            else
               @store.results( table, 'change', val, key ) )
      .catch( (error) =>
        @store.onerror( table, 'change', error ) )
    return    

  get:( table, id, callback ) ->
    @fd.ref(table+'/'+id).once('value' )
       .then( (snapshot) =>
          if snapshot? and snapshot.val()?
            if callback?
               callback( snapshot.val() )
            else
               @store.results( table, 'get', snapshot.val(), id ) )
      .catch( (error) =>
        @store.onerror( table, 'get', error, id ) )
    return

  add:( table, id, object  ) ->
    @fd.ref(table+'/'+id).set( object )
       .catch( (error) =>
         @store.onerror( table, 'add', error, id ) )
    return

  # Same as add
  put:( table, id,  object ) ->
    @fd.ref(table+'/'+id).set( object )
       .catch( (error) =>
         @store.onerror( table, 'put', error, id ) )
    return

  del:( table, id ) ->
    @fd.ref(table+'/'+id).remove()
       .catch( (error) =>
         @store.onerror( table, 'del', error, id ) )
    return

  select:( table, where, callback=null ) ->
    @fd.ref(table).once('value')
       .then( (snapshot) =>
        if snapshot? and snapshot.val()?
          objs = @store.toObjs( snapshot.val(), where, @keyProp )
          if callback?
             callback( objs )
          else
             @store.results( table, 'select', objs ) )
    return

  insert:( table, objects ) ->
    @fd.ref(table).set( objects )
       .catch( (error) =>
         @store.onerror( table, 'insert', error ) )
    return

  update:( table, objects ) ->
    @fd.ref(table).update( objects )
       .catch( (error) =>
         @store.onerror( table, 'update', error ) )
    return

  remove:( table, where ) ->
    @fd.ref(table).once('value')
      .then( (snapshot) =>
      if snapshot? and snapshot.val()?
        objs = @store.toObjs( snapshot.val(), where, @keyProp )
        for own key, obj of objs
          @del( table, key ) # @fd.ref(table+'/'+key).remove()
        @store.results( table, 'select', objs ) )
    return

  range:( table, beg, end ) ->
    @fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value' )
       .then( (snapshot) =>
          if snapshot? and snapshot.val()?
            objs = @toObjects( snapshot.val() )
            @store.results( table, 'range', objs ) )
       .catch( (error) =>
         @store.onerror( table, 'range', error ) )
    return

  openTables:( tables ) ->
    for own table, obj of tables
      open( table )
    return

  # Need to learn what opening a table means in firebase
  # Problem with Firebase sending a socket.io to url/Prac to Intellij server that becomes a 404
  open:( table ) ->
    ref = @fd.ref(table)
    @fd.root().set(table) if not ref
    # @fd.ref(table).set( {} )
    #    .catch( (error) =>
    #      @store.onerror( table, 'open', error ) )
    return

  # ref.remove() is Dangerous and has removed all tables in Firebase
  drop:( table ) ->
    @fd.ref(table).remove()
      .catch( (error) =>
        @store.onerror( table, 'drop', error ) )
    return

  # Sign Anonymously
  auth:( ) ->
    @fb.auth().signInAnonymously()
       .catch( (error) =>
         @store.onerror( 'auth', 'auth', error ) )
    return

Fire.EventType  = { get:"value", add:"child_added", put:"child_changed", del:"child_removed" }

export default Fire

