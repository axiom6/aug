
import Fire   from './Fire.js'
import Cloud  from './Cloud.js'
#mport Index  from './Index.js'
#mport Rest   from './store/Rest.js'
#mport Local  from './Local.js'
#mport Memory from './Memory.js'
import Pipe   from './Pipe.js'
import Store  from './Store.js'

class Table

  constructor:( @stream ) ->
    @dbName       = 'Prac'
    @url          = 'http://localhost:63342/aug/pub/app/data/'
    @tables       = { Prac:{} }
    @store        = new Store( @dbName, @tables, @url )
    @store.fire   = new Fire(   @store )
    @store.Cloud  = new Cloud(  @store )
    @store.pipe   = new Pipe( @stream, @dbName )
    #store.rest   = new Rest(   @store )
    #store.local  = new Local(  @store )
    #store.memory = new Memory( @store )

  selectPrac:( onSelect ) ->
    cols = ['id','plane','row','column','icon']
    keys = ['Collab','Domain','Discover','Adapt','Tech','Benefit','Change','Deliver','Govern',
            'Humanity','Science','Understand','Conduct','Cognition','Reason','Evolve','Educate','Culture',
            'Trust','Nature','Truth','Experience','Create','Conscious','Emerge','Inspire','Actualize']
    onPrac = (results) =>
      rows = {}
      for key in keys
        row = {}
        for col in cols
          row[col] = results[key][col]
        rows[key] = row
      onSelect(rows)
      return
    @store.subscribe( "Prac", "select", 'Table', onPrac )
    where = (obj) -> true
    @store.select( 'fire', 'Prac', where )

  toCap:( str ) ->
    str.charAt(0).toUpperCase() + str.substring(1)

  columns:( rows ) ->
    fkey = Object.keys(rows)[0]
    cols = {}
    for key, obj of rows[fkey]
      cols[key] = @toCap(key)
    cols

export default Table