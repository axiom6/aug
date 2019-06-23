
class Store

  constructor:( @dbName, @tables, @url ) ->
    @rest=null; @fire=null; @index=null; @local=null; @memory=null; @pipe=null

  table:(tn) ->
    if @tables[tn]?
       @tables[tn]
    else
      @open( table )
      @tables[tn]

  results:       ( table, op, result, id=null ) ->
    @pipe.results( table, op, result, id ) if @pipe?
    return

  onerror:( table, op, error, id='none' ) ->
    console.error( 'Store.onerror', { dbName:@dbName, table:table, op:op, error:error, id:id } )
    return

  subscribe:       ( table, op, source, onSubscribe ) ->
    @pipe.subscribe( table, op, source, onSubscribe ) if @pipe?
    return

  publish:       ( table, op, result, id=null ) ->
    @pipe.publish( table, op, result, id ) if @pipe?
    return

  # REST Api  CRUD + Subscribe for objectect records 

  batch:( objs, callback )  -> # Respond to an changed object
    for own key, obj of objs
      switch obj.src
        when 'rest'   then @rest  .batch( obj, objs, callback ) if @rest?
        when 'fire'   then @fire  .batch( obj, objs, callback ) if @fire?
        when 'index'  then @index .batch( obj, objs, callback ) if @index?
        when 'local'  then @local .batch( obj, objs, callback ) if @local?
        when 'memory' then @memory.batch( obj, objs, callback ) if @memory?
    return

  batchComplete:( objs ) ->
    for own key, obj of objs
      return false if not obj['data']
    true

  change:(  src, table, id, callback )  -> # Respond to an changed object 
    switch  src
      when 'rest'   then @rest  .change( table, id, callback ) if @rest?
      when 'fire'   then @fire  .change( table, id, callback ) if @fire?
      when 'index'  then @index .change( table, id, callback ) if @index?
      when 'local'  then @local .change( table, id, callback ) if @local?
      when 'memory' then @memory.change( table, id, callback ) if @memory?
    return

  get:( src, table, id, callback ) ->  # Get an object from table with id
    switch  src
      when 'rest'   then @rest  .get( table, id, callback ) if @rest?
      when 'fire'   then @fire  .get( table, id, callback ) if @fire?
      when 'index'  then @index .get( table, id, callback ) if @index?
      when 'local'  then @local .get( table, id, callback ) if @local?
      when 'memory' then @memory.get( table, id, callback ) if @memory?
    return    

  add:         ( table, id, object ) -> # Post an object into table with id
    @rest  .add( table, id, object ) if @rest?
    @fire  .add( table, id, object ) if @fire?
    @index .add( table, id, object ) if @index?
    @local .add( table, id, object ) if @local?
    @memory.add( table, id, object ) if @memory?
    @pipe  .add( table, id, object ) if @pipe?
    return
      
  put:         ( table, id, object ) -> # Put an object into table with id
    @rest  .put( table, id, object ) if @rest?
    @fire  .put( table, id, object ) if @fire?
    @index .put( table, id, object ) if @index?
    @local .put( table, id, object ) if @local?
    @memory.put( table, id, object ) if @memory?
    @pipe  .put( table, id, object ) if @pipe?
    return
        
  del:         ( table, id ) -> # Delete  an object from table with id
    @rest  .del( table, id ) if @rest?
    @fire  .del( table, id ) if @fire?
    @index .del( table, id ) if @index?
    @local .del( table, id ) if @local?
    @memory.del( table, id ) if @memory?
    @pipe  .del( table, id ) if @pipe?
    return

  # SQL tables with multiple objects (rows)    
  select:( src, table, where=Store.where, callback=null ) ->  # Get an object from table with id
    switch  src
      when 'rest'   then @rest.select(   table, where, callback ) if @rest?
      when 'fire'   then @fire.select(   table, where, callback ) if @fire?
      when 'index'  then @index.select(  table, where, callback ) if @index?
      when 'local'  then @local.select(  table, where, callback ) if @local?
      when 'memory' then @memory.select( table, where, callback ) if @memory?
    return

  insert:         ( table, objects ) -> # Insert objects into table with unique id
    @rest  .insert( table, objects ) if @rest?
    @fire  .insert( table, objects ) if @fire?
    @index .insert( table, objects ) if @index?
    @local .insert( table, objects ) if @local?
    @memory.insert( table, objects ) if @memory?
    @pipe  .insert( table, objects ) if @pipe?
    return
    
  update:         ( table, objects ) -> # # Update objects into table mapped by id
    @rest  .update( table, objects ) if @rest?
    @fire  .update( table, objects ) if @fire?
    @index .update( table, objects ) if @index?
    @local .update( table, objects ) if @local?
    @memory.update( table, objects ) if @memory?
    @pipe  .update( table, objects ) if @pipe?
    return
  
  remove:         ( table, where=Store.where ) -> # Delete objects from table with where clause
    @rest  .remove( table, where ) if @rest?
    @fire  .remove( table, where ) if @fire?
    @index .remove( table, where ) if @index?
    @local .remove( table, where ) if @local?
    @memory.remove( table, where ) if @memory?
    @pipe  .remove( table, where ) if @pipe?
    return

  # Table DDL (Data Definition Language)  
  show:( callback=null )  -> # Show all table names
    keys = Object.keys( @tables )
    callback( keys ) if callback?
    @pipe.results( null, 'show', keys )
    return
  
  open:         ( table) -> # Create a table with an optional schema
    if not @tables[table]?
      @tables[table] = {}
      @rest  .open( table ) if @rest?
      @fire  .open( table ) if @fire?
      @index .open( table ) if @index?
      @local .open( table ) if @local?
      @pipe  .open( table ) if @pipe?
    else
      @onerror( table, 'open', { error:'Store table already exists'} )
    return
    
  drop:         ( table ) -> # Drop the entire @table - good for testing
    @rest  .drop( table ) if @rest?
    @fire  .drop( table ) if @fire?
    @index .drop( table ) if @index?
    @local .drop( table ) if @local?
    @pipe  .drop( table ) if @pipe?

    if       @tables[table]?
      delete @tables[table]
    else
      @onerror( table, 'drop', { error:'Store missing table'} )
    return


  # RDUDC            Retrieve  Create    Update    Delete   Change
  Store.restOps  = [ 'get',    'add',    'put',    'del', 'change', 'batch' ]
  Store.sqlOps   = [ 'select', 'insert', 'update', 'remove' ]
  Store.tableOps = [ 'show',   'open',             'drop'   ]

  # Dafaults for empty arguments
  Store.where  = () -> true # Default where clause filter that returns true to access all records
 
export default Store
