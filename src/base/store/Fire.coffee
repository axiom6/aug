
import Store    from './Store.js'
import firebase from 'firebase'      # Firebase core (required)

class Fire extends Store

  constructor:( dbName ) ->
    super( dbName )
    @init( @config() )
    #@auth() # Anonomous logins have to be enabled
    @fd = firebase.database()

  # https://console.firebase.google.com/project/data-muse/overview
  config:() -> {
    apiKey: "AIzaSyDuWZIanBoKVZiPTcxDMQ9HyC2Ak3cr7j8",
    authDomain: "data-muse.firebaseapp.com",
    databaseURL: "https://data-muse-default-rtdb.firebaseio.com",
    projectId: "data-muse",
    storageBucket: "data-muse.appspot.com",
    messagingSenderId: "782871064051",
    appId: "1:782871064051:web:a4914c83e898b45e7c7686"
  }

  init:( config ) ->
    firebase.initializeApp(config)
    return

  add:( table, id, obj ) ->
    @fd.ref(table+'/'+id).set( obj )
       .then(  (snaps) => @results( table, 'add', obj   ) )
       .catch( (error) => @onerror( table, 'add', error, id ) )
    return

  get:( table, id, callback ) ->
    @fd.ref(table+'/'+id).once('value' )
       .then(  (snaps) => @firemsg( table, 'get', snaps, null, callback ) )
       .catch( (error) => @onerror( table, 'get', error, id ) )
    return

  put:( table, id,  obj ) ->    # Same as add
    @fd.ref(table+'/'+id).set( obj )
       .then(  (snaps) => @results( table, 'put', obj   ) )
       .catch( (error) => @onerror( table, 'put', error, id ) )
    return

  del:( table, id ) ->
    @fd.ref(table+'/'+id).remove()
       .then(  ()      => @firemsg( table,'del', {} ) )
       .catch( (error) => @onerror( table,    'del', error, id ) )
    return

  select:( table, where, callback=null ) ->
    @fd.ref(table).once('value')
       .then(  (snaps) => @firemsg( table, 'select', snaps, where, callback ) )
       .catch( (error) => @onerror( table, 'select', error ) )
    return

  insert:( table, objs) ->
    @fd.ref(table).set( objs )
       .then(  (snaps) => @results( table, 'insert', objs  ) )
       .catch( (error) => @onerror( table, 'insert', error ) )
    return

  update:( table, objs ) ->
    @fd.ref(table).update( objs )
       .then(  (snaps) => @results( table, 'update', objs   ) )
       .catch( (error) => @onerror( table, 'update', error  ) )
    return

  remove:( table, where) ->
    @fd.ref(table).once('value')
       .then( (snaps) =>
          if @isSnaps(snaps)
            objs = @toObjects( snaps.val(), where )
            for own key, obj of objs when where(obj)
              @del( table, key ) # @fd.ref(table+'/'+key).remove()
            @results( table, 'remove', objs ) )
        .catch( (error) => @onerror( table, 'remove', error ) )
    return

  show:() ->
    @showTables()
    return

  open:( table ) ->
    @openTable( table )
    return

  # ref.remove() is Dangerous and has removed all tables in Firebase
  drop:( table ) ->
    @dropTable( table )
    @fd.ref(table).remove()
       .then(  (snaps) => @firemsg( table, 'drop', snaps ) )
       .catch( (error) => @onerror( table, 'drop', error ) )
    return

  # Have too clarify id with snapshot.key
  change:( table, id='none', callback=null, Event='put' ) ->
    path  = if id is 'none' then table else table + '/' + id
    @fd.ref(path).on( Fire.EventType[Event] ) # , onChange
       .then(  (snaps) => @firemsg( table, 'change', snaps, null, callback ) )
       .catch( (error) => @onerror( table, 'change', error ) )
    return

  range:( table, beg, end ) ->
    @fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value' )
      .then( (snaps) => @firemsg( table, 'range', snaps ) )
      .catch( (error) =>@onerror( table, 'range', error ) )
    return

  firemsg:( table, op, snaps, query=null, callback=null ) ->
    where = if query? then query else (obj)->true
    objs  = if @isSnaps(snaps) then @toObjects( snaps.val(), where ) else snaps
    if callback? then callback(objs) else @results( table, op, objs )
    return

  isSnaps:( snaps ) ->
    snaps? and snaps.val? and snaps.key?

# Sign Anonymously
  auth:( ) ->
    @fb.auth().signInAnonymously()
       .then ( (creds) => @results( 'auth', 'auth', creds ) )
       .catch( (error) => @onerror( 'auth', 'auth', error ) )
    return

Fire.EventType  = { get:"value", add:"child_added", put:"child_changed", del:"child_removed" }

export default Fire

###
  console.log( 'Fire.firemsg(snaps)', { table:table, op:op, snaps:snaps.val() } ) if op is 'select'
  console.log( 'Fire.firemsg(objs )', { table:table, op:op, objs:objs         } ) if op is 'select'
###

