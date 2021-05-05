
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
    @prac       = null
    @hues       = null
    @kit        = null
    @lastSource = null

  test:( name ) ->

    store = switch name
      when 'Local' then new Local(  @dbName )
      when 'Index' then new Index(  @dbName )
      when 'Fire'  then new Fire(   @dbName )
      when 'Couch' then new Couch(  @dbName, @couchUrl )
      else              new Memory( @dbName )

    store.openTable( 'prac')
    store.openTable( 'hues')
    @openIndex( store ) if name is 'Index'
    @suite( store ) if name isnt 'Index'

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
      console.log( 'Mgr', { table:table, op:op, source:store.source, obj:obj } )
      whereS = (obj) -> true
      whereD = (obj) -> obj.column is 'Embrace'
      switch op
        when 'add'    then store.get(    table, obj.id )
        when 'put'    then store.del(    table, obj.id )
        when 'insert' then store.select( table, whereS )
        when 'update' then store.remove( table, whereD )

    store.unsubscribe( table, op, @lastSource ) if @lastSource?
    store.subscribe(   table, op, store.source, onSubscribe )
    return

  suite:( store ) ->

    console.log( 'Manager.suite()', store.source )

    @data()

    @subscribe( 'prac',   'add',  store )
    @subscribe( 'prac',   'get',  store )
    @subscribe( 'prac',   'put',  store )
    @subscribe( 'prac',   'del',  store )

    @subscribe( 'hues', 'insert', store )
    @subscribe( 'hues', 'select', store )
    @subscribe( 'hues', 'update', store )
    @subscribe( 'hues', 'remove', store )

    @subscribe( 'Tables', 'show', store )
    @subscribe( 'prac',   'open', store )
    @subscribe( 'prac',   'drop', store )

    #tore.drop( 'demo')
    #tore.open( 'hues')
    store.show()

    store.add( 'prac', @prac.id, @prac )
    #tore.get( 'prac', @prac.id )         # Called after add
    store.put( 'prac', @prac.id, @prac )
    #tore.del( 'prac', @prac.id )         # Called after put

    store.insert( 'hues', @hues )
    #tore.select( 'hues', (obj) -> true ) # Called after insert

    @hues['Green'].column  = 'Embrace'
    @hues['Orange'].column = 'Embrace'
    @hues['Violet'].column = 'Embrace'
    store.update( 'hues', @hues )

    #here = (obj) -> obj.column is 'Embrace'  # Called after update
    #tore.remove( 'hues', where )
    @lastSource = store.source
    return

  data:() ->

    @prac = { "_id":"Involve", "id":"Involve", "table":"prac","type":"pane", "hsv":[195,90,60],"column":"Embrace",
    "row":"Learn","plane":"Know","icon":"fas fa-users",
    "cells":[5,12,7,12], "dir":"nw", "neg":"Greed" }

    @hues  = @mix.data( 'Hues' )
    # console.log( 'Manager.data(@pracs)', @mix, @hues )

    @kit = { "_id":"mittens", "name": "Mittens", "occupation": "kitten", "age": 3,
    "hobbies": [ "playing with balls of yarn", "chasing laser pointers", "lookin' hella cute" ] }

export default Manager