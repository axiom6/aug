
class Store

  # @uri = REST URI where the file part is the database
  # @key = The key id property = default is ['id']
  constructor:( @uri ) ->
    @remote = null
    @locals = null
    @memory = null
    @datarx = null

  results:         ( table, id, op, result, extras={} ) ->
    @datarx.results( table, id, op, result, extras) if @datarx?
    return

  # REST Api  CRUD + Subscribe for objectect records  

  change:(  src, table, id, callback )  -> # Respond to an changed object 
    switch  src
      when 'remote' then @remote.change( table, id, callback ) if @remote?
      when 'locals' then @locals.change( table, id, callback ) if @locals?
      when 'memory' then @memory.change( table, id, callback ) if @memory?
    return

  get:( src, table, id, callback ) ->  # Get an object from table with id
    switch  src
      when 'remote' then @remote.get( table, id, callback )
      when 'locals' then @locals.get( table, id, callback )
      when 'memory' then @memory.get( table, id, callback )
    return    

  add:         ( table, id, object ) -> # Post an object into table with id
    @remote.add( table, id, object ) if @remote?
    @locals.add( table, id, object ) if @locals?
    @memory.add( table, id, object ) if @memory?
    @datarx.add( table, id, object ) if @datarx?
    return
      
  put:         ( table, id, object ) -> # Put an object into table with id
    @remote.put( table, id, object ) if @remote?
    @locals.put( table, id, object ) if @locals?
    @memory.put( table, id, object ) if @memory?
    @datarx.put( table, id, object ) if @datarx?
    return
        
  del:         ( table, id ) -> # Delete  an object from table with id
    @remote.del( table, id ) if @remote?
    @locals.del( table, id ) if @locals?
    @memory.del( table, id ) if @memory?
    @datarx.del( table, id ) if @datarx?
    return

  # SQL tables with multiple objects (rows)    
  select:( src, table, callback, where=Store.where) ->  # Get an object from table with id
    switch  src
      when 'remote' then @remote.select( table, callback, where )
      when 'locals' then @locals.select( table, callback, where )
      when 'memory' then @memory.select( table, callback, where )
    return

  insert:         ( table, objects ) -> # Insert objects into table with unique id
    @remote.insert( table, objects ) if @remote?
    @locals.insert( table, objects ) if @locals?
    @memory.insert( table, objects ) if @memory?
    @datarx.insert( table, objects ) if @datarx?
    return
    
  update:         ( table, objects ) -> # # Update objects into table mapped by id
    @remote.update( table, objects ) if @remote?
    @locals.update( table, objects ) if @locals?
    @memory.update( table, objects ) if @memory?
    @datarx.update( table, objects ) if @datarx?
    return
  
  remove:         ( table, where=@W ) -> # Delete objects from table with where clause
    @remote.remove( table, where ) if @remote?
    @locals.remove( table, where ) if @locals?
    @memory.remove( table, where ) if @memory?
    @datarx.remove( table, where ) if @datarx?
    return

  # Table DDL (Data Definition Language)  
  show:(    src, table, callback, format=Store.format  )  -> # Respond to an changed object
    switch  src
      when 'remote' then @remote.show( table, format, callback ) if @remote?
      when 'locals' then @locals.show( table, format, callback ) if @locals?
      when 'memory' then @memory.show( table, format, callback ) if @memory?
    return   
    
  open:         ( table, schema=Store.schema ) -> # Create a table with an optional schema
    @remote.open( table, schema    ) if @remote
    @locals.open( table, schema    ) if @locals
    @memory.open( table, schema    ) if @memory
    @datarx.open( table, schema    ) if @datarx
    return
  
  make:         ( table, alters=Store.alters ) -> # Alter a table's schema - especially columns
    @remote.open( table, alters    ) if @remote
    @locals.open( table, alters    ) if @locals
    @memory.open( table, alters    ) if @memory
    @datarx.open( table, alters    ) if @datarx
    return
    
  drop:         ( table, resets=Store.reset ) -> # Drop the entire @table - good for testing
    @remote.open( table, resets    ) if @remote
    @locals.open( table, resets    ) if @locals
    @memory.open( table, resets    ) if @memory
    @datarx.open( table, resets    ) if @datarx
    return

  # RDUDC            Retrieve  Create    Update    Delete   Change
  Store.restOps  = [ 'get',    'add',    'put',    'del', 'change' ]
  Store.sqlOps   = [ 'select', 'insert', 'update', 'remove' ]
  Store.tableOps = [ 'show',   'open',   'make',   'drop'   ]

  # Dafaults for empty arguments
  Store.where  = () -> true # Default where clause filter that returns true to access all records
  Store.schema = {}         # Default schema      for open()
  Store.format = {}         # Default format      for show()
  Store.alters = {}         # Default alterations for make()
  Store.resets = {}         # Default resets      for drop()    

export default Store
