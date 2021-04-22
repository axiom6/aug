
import Data   from '../appl/Data.js'
import Memory from '../../base/store/Memory.js'
import Local  from '../../base/store/Local.js'
import Index  from '../../base/store/Index.js'
import Fire   from '../../base/store/Fire.js'
import Couch  from '../../base/store/Couch.js'

class Manager

  constructor:( @mix ) ->
    @dbName  = 'test1'
    @tables  = ['Prac','Hues']
    @credUrl = 'http://admin:athena@127.0.0.1:5984' # Admin host to couchdb
    @baseUrl = 'http://127.0.0.1:5984'              # Admin host to couchdb
    @stream  = Data.stream
    @prac    = null
    @hues    = null
    @kit     = null

  test:( name ) ->

    store = switch name
      when 'Local' then new Local(  @dbName )
      when 'Index' then @openIndex( @dbName, ['Hues'] )  # 'Prac',
      when 'Fire'  then new Fire(   @dbName )
      when 'Couch' then new Couch(  @dbName, @baseUrl )
      else              new Memory( @dbName )

    @suite( store ) if name isnt 'Index'

    return

  openIndex:( dbName, tables ) ->
    idb = new Index(dbName, ['Prac','Hues'] )
    idb.openDB( idb.dbName, idb.dbVersion, tables )
       .then(  (db) =>
          idb.db   = db
          @suite( idb )
          return )
       .catch( (error) =>
         idb.onerror( tables, 'openDB', error )
         return )
    idb

  subscribe:( table, op, store ) ->
    onSubscribe = ( obj ) =>
      console.log( 'Mgr', { table:table, op:op, source:store.source, obj:obj } )
    store.subscribe( table, op, store.source, onSubscribe )
    return

  suite:( store ) ->

    console.log( 'Manager.suite()', store.source )

    @data()

    @subscribe( 'prac',  'add',  store )
    @subscribe( 'prac',  'get',  store )
    @subscribe( 'prac',  'put',  store )
    @subscribe( 'prac',  'del',  store )
    @subscribe( @dbName, 'show', store )

    store.show()

    #tore.add( 'prac', @prac._id, @prac )
    store.get( 'prac', @prac._id )
    #tore.put( 'prac', @prac._id, @prac )
    #tore.del( 'prac', @prac._id )

    @subscribe( 'hues', 'insert', store )
    @subscribe( 'prac', 'select', store )
    @subscribe( 'hues', 'update', store )
    @subscribe( 'hues', 'remove', store )

    #tore.insert( 'hues', @hues )
    #tore.select( 'prac', (obj) -> true )
    #tore.update( 'hues', @hues )
    #tore.remove( 'hues', (obj) -> true )
    return

  data:() ->

    @prac = { "_id":"Involve", "type":"pane", "hsv":[195,90,60],"column":"Embrace",
    "row":"Learn","plane":"Know","icon":"fas fa-users",
    "cells":[5,12,7,12], "dir":"nw", "neg":"Greed" }

    @hues  = @mix.data( 'Hues' )
    # console.log( 'Manager.data(@pracs)', @mix, @hues )

    @kit = { "_id":"mittens", "name": "Mittens", "occupation": "kitten", "age": 3,
    "hobbies": [ "playing with balls of yarn", "chasing laser pointers", "lookin' hella cute" ] }

export default Manager