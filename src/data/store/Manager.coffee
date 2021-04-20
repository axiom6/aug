
import Data   from '../appl/Data.js'
import Memory from '../../base/store/Memory.js'
import Local  from '../../base/store/Local.js'
import Index  from '../../base/store/Index.js'
#mport Pouch  from '../../base/store/Pouch.js'
import Fire   from '../../base/store/Fire.js'
import Rest   from '../../base/store/Rest.js'

class Manager

  constructor:( @mix ) ->
    @dbName  = 'Test'
    @tables  = ['Prac','Hues']
    @baseUrl = 'http:localhost:3000' # Placeholder
    @stream  = Data.stream
    @prac    = null
    @hues    = null
    @kit     = null

  test:( name ) ->

    store = switch name
      when 'Local' then new Local(  @dbName )
      when 'Index' then @openIndex( @dbName, ['Hues'] )  # 'Prac',
      when 'Rest'  then new Rest(   @dbName, @baseUrl )
      #hen 'Pouch' then new Pouch(  @dbName )
      when 'Fire'  then new Fire(   @dbName )
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

    @subscribe( 'Prac', 'add', store )
    @subscribe( 'Prac', 'get', store )
    @subscribe( 'Prac', 'put', store )
    @subscribe( 'Prac', 'del', store )

    store.add( 'Prac', @prac.id, @prac )
    store.get( 'Prac', @prac.id )
    store.put( 'Prac', @prac.id, @prac )
    #tore.del( 'Prac', @prac.id )

    @subscribe( 'Hues', 'insert', store )
    @subscribe( 'Hues', 'select', store )
    @subscribe( 'Hues', 'update', store )
    @subscribe( 'Hues', 'remove', store )

    store.insert( 'Hues', @hues )
    store.select( 'Hues', (obj) -> true )
    store.update( 'Hues', @hues )
    #tore.remove( 'Hues', (obj) -> true )

    @subscribe( 'Test', 'show', store )
    store.show()
    return

  data:() ->

    @prac = { id:"Involve", type:"pane", "hsv":[195,90,60],"column":"Embrace",
    "row":"Learn","plane":"Know","icon":"fas fa-users",
    "cells":[5,12,7,12], "dir":"nw", "neg":"Greed" }

    @hues  = @mix.data( 'Hues' )
    # console.log( 'Manager.data(@pracs)', @mix, @hues )

    @kit = { "_id": "mittens", "name": "Mittens", "occupation": "kitten", "age": 3,
    "hobbies": [ "playing with balls of yarn", "chasing laser pointers", "lookin' hella cute" ] }


  subscribes:( table, store ) ->
    onSubscribe = {}
    onSubscribe['add'] = ( obj ) =>
      console.log( 'Mgr', { table:table, op:'add', source:store.source, obj:obj } )
    onSubscribe['get'] = ( obj ) =>
      console.log( 'Mgr', { table:table, op:'get', source:store.source, obj:obj } )
    onSubscribe['put'] = ( obj ) =>
      console.log( 'Mgr', { table:table, op:'put', source:store.source, obj:obj } )
    onSubscribe['del'] = ( obj ) =>
      console.log( 'Mgr', { table:table, op:'del', source:store.source, obj:obj } )
    onSubscribe['insert'] = ( obj ) =>
      console.log( 'Mgr', { table:table, op:'insert', source:store.source, obj:obj } )
    onSubscribe['select'] = ( obj ) =>
      console.log( 'Mgr', { table:table, op:'select', source:store.source, obj:obj } )
    onSubscribe['update'] = ( obj ) =>
      console.log( 'Mgr', { table:table, op:'update', source:store.source, obj:obj } )
    onSubscribe['remove'] = ( obj ) =>
      console.log( 'Mgr', { table:table, op:'remove', source:store.source, obj:obj } )
    store.subscribe( table, 'add',    store.source, onSubscribe['add']    )
    store.subscribe( table, 'get',    store.source, onSubscribe['get']    )
    store.subscribe( table, 'put',    store.source, onSubscribe['put']    )
    store.subscribe( table, 'del',    store.source, onSubscribe['del']    )
    store.subscribe( table, 'insert', store.source, onSubscribe['insert'] )
    store.subscribe( table, 'select', store.source, onSubscribe['select'] )
    store.subscribe( table, 'update', store.source, onSubscribe['update'] )
    store.subscribe( table, 'remove', store.source, onSubscribe['remove'] )
    return


export default Manager