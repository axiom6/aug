
import Data   from '../appl/Data.js'
import Memory from '../../base/store/Memory.js'
import Local  from '../../base/store/Local.js'
import Index  from '../../base/store/Index.js'
#mport Pouch  from '../../base/store/Pouch.js'
import Fire   from '../../base/store/Fire.js'
import Rest   from '../../base/store/Rest.js'

class Manager

  constructor:() ->
    @dbName = 'Test'
    @tables
    @mix    = Data.mix
    @stream = Data.stream

  test:( name ) ->
    store = switch name
      when 'Local' then new Local()
      when 'Index' then new Index()
      #hen 'Pouch' then new Pouch()
      when 'Fire'  then new Fire()
      when 'Rest'  then new Rest()
      else              new Memory()
    @suite( store )
    return

  subscribe:( table, op, store ) ->
    onSubscribe = ( obj ) =>
      console.log( 'Mgr', { table:table, op:op, source:store.source, obj:obj } )
    store.subscribe( table, op, store.source, onSubscribe )
    return


  suite:( store ) ->

    @data()

    @subscribe( 'Prac', 'add', store )
    @subscribe( 'Prac', 'get', store )
    @subscribe( 'Prac', 'put', store )
    @subscribe( 'Prac', 'del', store )

    store.add(   'Prac', '0', @prac )
    store.get(   'Prac', '0' )
    @prac.type = 'view'
    store.put(   'Prac', '0', @prac )
    store.del(   'Prac', '0' )

    @subscribe( 'Pracs', 'insert', store )
    @subscribe( 'Pracs', 'select', store )
    @subscribe( 'Pracs', 'update', store )
    @subscribe( 'Pracs', 'remove', store )

    store.insert( 'Pracs', @pracs )
    store.select( 'Pracs', (obj) -> true )
    prac.type = 'view' for key, prac of @pracs
    store.update( 'Pracs', @pracs )
    store.remove( 'Pracs', (obj) -> true )
    return

  data:() ->

    @prac = { id:"Involve", type:"pane", "hsv":[195,90,60],"column":"Embrace",
    "row":"Learn","plane":"Know","icon":"fas fa-users",
    "cells":[5,12,7,12], "dir":"nw", "neg":"Greed" }

    @pracs  = @mix.inovObject( 'Info', 'Info' )

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