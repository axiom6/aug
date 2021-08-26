
import Memory from '../../../lib/pub/data/Memory.js'
import Local  from '../../../lib/pub/data/Local.js'
import Index  from '../../../lib/pub/data/Index.js'
import Fire   from '../../../lib/pub/data/Fire.js'
#mport Couch  from '../../../lib/pub/data/Couch.js'
#mport Mongo  from '../../../lib/pub/data/Mongo.js'

class Manager

  constructor:( @nav ) ->
    @dbName     = 'test1'
    @credsUrl   = 'http://admin:athena@127.0.0.1:5984' # Admin host to couchdb
    @couchUrl   = 'http://127.0.0.1:5984'              # Admin host to couchdb
    @stream     = @nav.stream
    @Prac       = null
    @Hues       = null
    @Kit        = null
    @source     = null

  test:( name ) ->

    @store = switch name
      when 'Local'  then new Local(  @stream, @dbName )
      when 'Index'  then new Index(  @stream, @dbName )
      when 'Fire'   then new Fire(   @stream, @dbName )
      when 'Couch'  then new Memory( @stream, @dbName, @couchUrl )
      when 'Memory' then new Memory( @stream, @dbName )
      when 'Mongo'  then new Memory( @stream, @dbName )
      else
        console.error( 'Manager.test() unknown name', name )
        null

    @source = @store.source
    @store.openTable( 'Prac')
    @store.openTable( 'Hues')
    @openIndex( @store ) if name is   'Index'
    @suite()             if name isnt 'Index'

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

  subscribe:( table, op ) =>
    onSubscribe = ( obj ) =>
      console.log( 'Mgr', { table:table, op:op, source:@source, obj:obj } )
      whereS = (obj) -> true
      whereD = (obj) -> obj.column is 'Embrace'
      switch op
        when 'add'    then @store.get(    table, obj.id )
        when 'put'    then @store.del(    table, obj.id )
        when 'insert' then @store.select( table, whereS )
        when 'update' then @store.remove( table, whereD )

    @store.subscribe(   table, op, @store.source, onSubscribe )
    return

  suite:() ->

    console.log( 'Manager.suite()', @store.source )

    @data()

    @subscribe( 'Prac',   'add' )
    @subscribe( 'Prac',   'get' )
    @subscribe( 'Prac',   'put' )
    @subscribe( 'Prac',   'del' )

    @subscribe( 'Hues', 'insert' )
    @subscribe( 'Hues', 'select' )
    @subscribe( 'Hues', 'update' )
    @subscribe( 'Hues', 'remove' )

    @subscribe( 'Tables', 'show' )
    @subscribe( 'Prac',   'open' )
    @subscribe( 'Prac',   'drop' )

    @store.show()

    @store.add( 'Prac', @Prac.id, @Prac )
    #tore.get( 'Prac', @Prac.id )         # Called after add
    @store.put( 'Prac', @Prac.id, @Prac )
    #tore.del( 'Prac', @Prac.id )         # Called after put

    @store.insert( 'Hues', @Hues )
    #tore.select( 'Hues', (obj) -> true ) # Called after insert

    @Hues['Green'].column  = 'Embrace'
    @Hues['Orange'].column = 'Embrace'
    @Hues['Violet'].column = 'Embrace'
    @store.update( 'Hues', @Hues )

    #here = (obj) -> obj.column is 'Embrace'  # Called after update
    #tore.remove( 'Hues', where )
    #console.log( "Manager.test()", { subjects:@store.stream.subjects } )
    return

  data:() ->

    @Prac = { "_id":"Involve", "id":"Involve", "table":"prac","type":"pane", "hsv":[195,90,60],"column":"Embrace",
    "row":"Learn","plane":"Know","icon":"fas fa-users",
    "cells":[5,12,7,12], "dir":"nw", "neg":"Greed" }

    @Hues  = @nav.data( 'Hues' )
    # console.log( 'Manager.data(@Pracs)', @nav, @Hues )

    @Kit = { "_id":"mittens", "name": "Mittens", "occupation": "kitten", "age": 3,
    "hobbies": [ "playing with balls of yarn", "chasing laser pointers", "lookin' hella cute" ] }

export default Manager