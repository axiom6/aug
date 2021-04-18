
import Data   from '../appl/Data.js'
import Store  from '../../base/store/Store.js'
import Memory from '../../base/store/Memory.js'
import Local  from '../../base/store/Local.js'
import Index  from '../../base/store/Index.js'
import Pouch  from '../../base/store/Pouch.js'
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
      when 'Pouch' then new Pouch()
      when 'Fire'  then new Fire()
      when 'Rest'  then new Rest()
      else              new Memory()
    id    = 'Involve'
    table = 'Prac'
    obj   = { id:"Involve", type:"pane", "hsv":[195,90,60],"column":"Embrace",
    "row":"Learn","plane":"Know","icon":"fas fa-users",
    "cells":[5,12,7,12], "dir":"nw", "neg":"Greed" }
    objs  = @mix.inovObject( 'Info', 'Info' )
    @suite( store, table, id, obj, objs )
    return

  onSubscribe:( obj ) =>
    console.log( 'Mgr', obj )
    return

  subscribes:( table, store ) ->
    for op in Store.allOps
      store.subscribe( table, op, store.source, @onSubscribe )

  suite:( store,  table, id, obj, objs ) ->
    subscribes(   table, store )
    store.add(    table, id, obj )
    store.get(    table, id )
    store.put(    table, id, obj )
    store.del(    table, id )
    store.insert( table, objs )
    store.select( table )
    store.update( table, objs )
    store.remove( table )
    return

export default Manager