
import Stream from '../util/Stream.js'
import Rest   from '../store/Rest.js'
#mport Fire   from '../store/Fire.js'
#mport Index  from '../store/Index.js'
#mport Local  from '../store/Local.js'
import Memory from '../store/Memory.js'
import Pipe   from '../store/Pipe.js'
import Store  from '../store/Store.js'

class TestStore

  constructor:() ->
    @dbName       = 'Prac'
    @url          = 'http://localhost:63342/aug/pub/app/data/store/Prac.json'
    @tables       = {}
    subjects      = ["Data"]
    streamLog     = { subscribe:false, publish:false, subjects:subjects}
    @stream       = new Stream( subjects, streamLog )
    @store        = new Store( @dbName, @tables, @url )
    @store.rest   = new Rest(   @store )
    #store.fire   = new Fire(   @store, {} )
    #store.index  = new Index(  @store )
    #store.local  = new Local(  @store )
    @store.memory = new Memory( @store )
    @store.pipe   = new Pipe( @stream, @dbName )

  testRest:() ->
    callback = (result) -> console.log( 'testRest result', result )
    @store.rest.get( 'table', 'id', callback )
    return

  testMemory:() ->

  testIndex:() ->

  testLocal:() ->

  testPipe:() ->

  testFire:() ->

export default TestStore




