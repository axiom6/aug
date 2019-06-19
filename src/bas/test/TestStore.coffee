
import Stream from '../util/Stream.js'
import Rest   from '../store/Rest.js'
import Fire   from '../store/Fire.js'
import Index  from '../store/Index.js'
import Memory from '../store/Memory.js'
import Pipe   from '../store/Pipe.js'
import Store  from '../store/Store.js'

class TestStore

  constructor:() ->
    @dbName       = ''   # Used by Index
    @tables       = {}
    @uri          = ''
    subjects      = ["Data"]
    streamLog     = { subscribe:false, publish:false, subjects:subjects}
    @stream       = new Stream( subjects, streamLog )
    @store        = new Store( @dbName, @tables, @uri )
    @store.rest   = new Rest(   @store )
    @store.fire   = new Fire(   @store, {} )
    @store.index  = new Index(  @store )
    @store.local  = new Index(  @store )
    @store.memory = new Memory( @store )
    @store.pipe   = new Pipe( @stream, @store.dbName )


  testFire:() ->

  testIndexDB:() ->

  testMemory:() ->

  testDataRx:() ->

