
class DataRx

  constructor:( @stream ) ->

  subscribe:( table, id ,op, onSubscribe  ) ->
    @stream.subscribe( 'Store:'+table, id+':'+op, onSubscribe )
    return

  publish:( table, id, op, obj, extras={} ) ->
    @stream.publish( 'Store:'+table, id+':'+op, obj )
    if extras is false then {}
    return

  results:( table, id, op, result, extras ) ->
    switch op
      when 'change' then @publish( table, id, 'change',        result )
      when 'get'    then @publish( table, id, 'get',           result )
      when 'select' then @publish( table, 'none', 'select', result, extras )
      when 'show'   then @publish( table, 'none', 'show',   result, extras )

  add:( table, id, object ) -> # Post an object into table with id
    @publish( table, id, 'add', object )
    return

  put:( table, id, object ) -> # Put an object into table with id
    @publish( table, id, 'put', object )
    return

  del:( table, id ) -> # Delete  an object from table with id
    @publish( table, id, 'del', {} )
    return

  # SQL tables with multiple objects (rows)

  insert:   ( table, objects ) -> # Insert objects into table with unique id
    @publish( table,'none', 'insert',  objects )
    return

  update:   ( table, objects ) -> # # Update objects into table mapped by id
    @publish( table,'none', 'update',  objects )
    return

  remove:   ( table, where=@W ) -> # Remove objects from table with where clause
    @publish( table, 'none', 'remove', {}, { where:where } )
    return

  # Table DDL (Data Definition Language)
  open:     ( table, schema=@S ) -> # Create a table with an optional schema
    @publish( table, 'none', 'show', {}, { schema:schema } )
    return

  make:     ( table, alters=@A ) -> # Alter a table's schema - especially columns
    @publish( table, 'none', 'show', {}, { alters:alters } )
    return

  drop:     ( table, resets=@R ) -> # Drop the entire @table - good for testing
    @publish( table, 'none', 'show', {}, { resets:resets } )
    return
