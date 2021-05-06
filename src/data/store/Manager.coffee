
import Data   from '../appl/Data.js'
import Memory from '../../base/store/Memory.js'
import Local  from '../../base/store/Local.js'
import Index  from '../../base/store/Index.js'
import Fire   from '../../base/store/Fire.js'
import Couch  from '../../base/store/Couch.js'

class Manager

  constructor:( @mix ) ->
    @dbName     = 'test1'
    @credsUrl   = 'http://admin:athena@127.0.0.1:5984' # Admin host to couchdb
    @couchUrl   = 'http://127.0.0.1:5984'              # Admin host to couchdb
    @stream     = Data.stream
    @Prac       = null
    @Hues       = null
    @Kit        = null
    @source     = null


  test:( name ) ->

    store = switch name
      when 'Local' then new Local(  @dbName )
      when 'Index' then new Index(  @dbName )
      when 'Fire'  then new Fire(   @dbName )
      when 'Couch' then new Couch(  @dbName, @couchUrl )
      else              new Memory( @dbName )

    @source = store.source
    store.openTable( 'Prac')
    store.openTable( 'Hues')
    @openIndex( store ) if name is   'Index'
    @suite( store )     if name isnt 'Index'

    return

  openIndex:( idb ) ->
    idb.openDB( idb.dbName, idb.dbVersion )
       .then(  (db) =>
          idb.db   = db
          @suite( idb )
          return )
       .catch( (error) =>
         idb.onerror( idb.tables, 'openDB', error )
         return )
    return

  subscribe:( table, op, store ) =>
    onSubscribe = ( obj ) =>
      console.log( 'Mgr', { table:table, op:op, source:@source, obj:obj } )
      whereS = (obj) -> true
      whereD = (obj) -> obj.column is 'Embrace'
      switch op
        when 'add'    then store.get(    table, obj.id )
        when 'put'    then store.del(    table, obj.id )
        when 'insert' then store.select( table, whereS )
        when 'update' then store.remove( table, whereD )

    #tore.unsubscribe( table, op, @lastSource ) if @lastSource?
    store.subscribe(   table, op, store.source, onSubscribe )
    return

  suite:( store ) ->

    console.log( 'Manager.suite()', store.source )

    @data()

    @subscribe( 'Prac',   'add',  store )
    @subscribe( 'Prac',   'get',  store )
    @subscribe( 'Prac',   'put',  store )
    @subscribe( 'Prac',   'del',  store )

    @subscribe( 'Hues', 'insert', store )
    @subscribe( 'Hues', 'select', store )
    @subscribe( 'Hues', 'update', store )
    @subscribe( 'Hues', 'remove', store )

    @subscribe( 'Tables', 'show', store )
    @subscribe( 'Prac',   'open', store )
    @subscribe( 'Prac',   'drop', store )

    store.show()

    store.add( 'Prac', @Prac.id, @Prac )
    #tore.get( 'Prac', @Prac.id )         # Called after add
    store.put( 'Prac', @Prac.id, @Prac )
    #tore.del( 'Prac', @Prac.id )         # Called after put

    store.insert( 'Hues', @Hues )
    #tore.select( 'Hues', (obj) -> true ) # Called after insert

    @Hues['Green'].column  = 'Embrace'
    @Hues['Orange'].column = 'Embrace'
    @Hues['Violet'].column = 'Embrace'
    store.update( 'Hues', @Hues )

    #here = (obj) -> obj.column is 'Embrace'  # Called after update
    #tore.remove( 'Hues', where )
    #console.log( "Manager.test()", { subjects:store.stream.subjects } )
    return

  data:() ->

    @Prac = { "_id":"Involve", "id":"Involve", "table":"prac","type":"pane", "hsv":[195,90,60],"column":"Embrace",
    "row":"Learn","plane":"Know","icon":"fas fa-users",
    "cells":[5,12,7,12], "dir":"nw", "neg":"Greed" }

    @Hues  = @mix.data( 'Hues' )
    # console.log( 'Manager.data(@Pracs)', @mix, @Hues )

    @Kit = { "_id":"mittens", "name": "Mittens", "occupation": "kitten", "age": 3,
    "hobbies": [ "playing with balls of yarn", "chasing laser pointers", "lookin' hella cute" ] }

export default Manager