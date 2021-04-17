
import Data   from '../appl/Data.js'
import Store  from '../../base/store/Store.js'
import Memory from '../../base/store/Memory.js'
import Local  from '../../base/store/Local.js'
import Index  from '../../base/store/Index.js'
import Pouch  from '../../base/store/Pouch.js'
#mport Fire from '../../base/store/Fire.js'

class Manager

  constructor:() ->
    @dbName = 'Test'
    @tables
    @mix    = Data.mix
    @stream = Data.stream
    memory  = new Memory()
    local   = new Local()
    index   = new Index()
    pouch   = new Pouch()
    #ire    = new Fire()

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