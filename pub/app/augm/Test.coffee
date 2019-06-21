
import Stream from '../../bas/util/Stream.js'
import Rest   from '../../bas/store/Rest.js'
#mport Fire   from '../../bas/store/Fire.js'
#mport Index  from '../../bas/store/Index.js'
#mport Local  from '../../bas/store/Local.js'
import Memory from '../../bas/store/Memory.js'
import Pipe   from '../../bas/store/Pipe.js'
import Store  from '../../bas/store/Store.js'

class Test

  constructor:() ->
    @dbName       = 'Prac'
    @url          = 'http://localhost:63342/aug/pub/app/data/'
    @tables       = {}
    subjects      = ["Data","Prac"]
    streamLog     = { subscribe:true, publish:true, subjects:subjects}
    @stream       = new Stream( subjects, streamLog )
    @store        = new Store( @dbName, @tables, @url )
    @store.rest   = new Rest(   @store )
    #store.fire   = new Fire(   @store, {} )
    #store.index  = new Index(  @store )
    #store.local  = new Local(  @store )
    @store.memory = new Memory( @store )
    @store.pipe   = new Pipe( @stream, @dbName )

  testStore:() ->

    onInsert = (obj) =>
      console.log( 'testMemory pipe insert', obj )
    @store.subscribe( "Prac", "insert", 'testMemory', onInsert )
    @store.insert( 'Prac', @prac() )

    onSelect = (result) =>
      console.log( 'testMemory select', result )
    @store.subscribe( "Prac", "insert", 'testMemory', onSelect )
    where = (obj) -> obj.column is 'Embrace'
    @store.select( 'memory', 'Prac', callback, where )

  testRest:() ->

    callback = (result) =>
      # @store.tables['Prac'] = result
      console.log( 'testRest result', result )
    @store.rest.get( 'table', 'id', 'store/Prac.json', callback )
    return

  testMemory:() ->

  testIndex:() ->

  testLocal:() ->

  testPipe:() ->

  testFire:() ->

  prac:() ->
    str = """ {
      "Collab":{"column":"Embrace","row":"Learn","plane":"Information","icon":"fa-group","id":"Collab"},
      "Domain":{"column":"Innovate","row":"Learn","plane":"Information","icon":"fa-empire","id":"Domain"},
      "Discover":{"column":"Encourage","row":"Learn","plane":"Information","icon":"fa-external-link-square","id":"Discover"},
      "Adapt":{"column":"Embrace","row":"Do","plane":"Information","icon":"fa-spinner","id":"Adapt"},
      "Tech":{"column":"Innovate","row":"Do","plane":"Information","icon":"fa-wrench","id":"Tech"},
      "Benefit":{"column":"Encourage","row":"Do","plane":"Information","icon":"fa-bar-chart-o","id":"Benefit"},
      "Change":{"column":"Embrace","row":"Share","plane":"Information","icon":"fa-refresh","id":"Change"},
      "Deliver":{"column":"Innovate","row":"Share","plane":"Information","icon":"fa-medkit","id":"Deliver"},
      "Govern":{"column":"Encourage","row":"Share","plane":"Information","icon":"fa-compass","id":"Govern"},
      "Humanity":{"column":"Embrace","row":"Learn","plane":"Knowledge","icon":"fa-question-circle","id":"Humanity"},
      "Science":{"column":"Innovate","row":"Learn","plane":"Knowledge","icon":"fa-flask","id":"Science"},
      "Understand":{"column":"Encourage","row":"Learn","plane":"Knowledge","icon":"fa-tripadvisor","id":"Understand"},
      "Conduct":{"column":"Embrace","row":"Do","plane":"Knowledge","icon":"fa-magic","id":"Conduct"},
      "Cognition":{"column":"Innovate","row":"Do","plane":"Knowledge","icon":"fa-object-group","id":"Cognition"},
      "Reason":{"column":"Encourage","row":"Do","plane":"Knowledge","icon":"fa-connectdevelop","id":"Reason"},
      "Evolve":{"column":"Embrace","row":"Share","plane":"Knowledge","icon":"fa-language","id":"Evolve"},
      "Educate":{"column":"Innovate","row":"Share","plane":"Knowledge","icon":"fa-graduation-cap","id":"Educate"},
      "Culture":{"column":"Encourage","row":"Share","plane":"Knowledge","icon":"fa-user-plus","id":"Culture"},
      "Trust":{"column":"Embrace","row":"Learn","plane":"Wisdom","icon":"fa-github-square","id":"Trust"},
      "Nature":{"column":"Innovate","row":"Learn","plane":"Wisdom","icon":"fa-paint-brush","id":"Nature"},
      "Truth":{"column":"Encourage","row":"Learn","plane":"Wisdom","icon":"fa-lightbulb-o","id":"Truth"},
      "Experience":{"column":"Embrace","row":"Do","plane":"Wisdom","icon":"fa-history","id":"Experience"},
      "Create":{"column":"Innovate","row":"Do","plane":"Wisdom","icon":"fa-eye","id":"Create"},
      "Conscious":{"column":"Encourage","row":"Do","plane":"Wisdom","icon":"fa-connectdevelop","id":"Conscious"},
      "Emerge":{"column":"Embrace","row":"Share","plane":"Wisdom","icon":"fa-dropbox","id":"Emerge"},
      "Inspire":{"column":"Innovate","row":"Share","plane":"Wisdom","icon":"fa-fire","id":"Inspire"},
      "Actualize":{"column":"Encourage","row":"Share","plane":"Wisdom","icon":"fa-codepen","id":"Actualize"}
    } """
    JSON.parse(str)

  batchObjs:() -> {
    Math: { src:'rest', url:'augm/Math.json', table:'Math', data:null }
    Geom: { src:'rest', url:'augm/Geom.json', table:'Geom', data:null }
    Data: { src:'rest', url:'augm/Data.json', table:'Data', data:null } }

export default Test




