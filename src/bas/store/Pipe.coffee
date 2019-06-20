
class Pipe

  constructor:( @stream, @dbName ) ->

  toSubject:( table ) ->
    @dbName + ':' + table

  toSource:( id, op ) ->
    id + ':' + op

  subscribe:( table, id ,op, onSubscribe  ) ->
    @stream.subscribe( @toSubject(table), @toSource(id,op), onSubscribe )
    return

  #ublish:( table, id, op, obj, extras={} ) ->
  publish:( table, obj ) ->
    @stream.publish(   @toSubject(table), obj )
    return

  results:( table, id, op, result, extras ) ->
    switch op
      when 'change' then @publish( table, id, 'change',        result )
      when 'get'    then @publish( table, id, 'get',           result )
      when 'select' then @publish( table, 'none', 'select', result, extras )
      when 'show'   then @publish( table, 'none', 'show',   result, extras )

  add:( table, id, object ) -> # Post an object into table with id
    @publish( table, object )
    return

  put:( table, id,   object ) -> # Put an object into table with id
    @publish( table, object )
    return

  del:( table, id ) -> # Delete  an object from table with id
    @publish( table, id )
    return

  # SQL tables with multiple objects (rows)

  insert:   ( table, objects ) -> # Insert objects into table with unique id
    @publish( table, objects )
    return

  update:   ( table, objects ) -> # # Update objects into table mapped by id
    @publish( table, objects )
    return

  remove:   ( table, where ) -> # Remove objects from table with where clause
    @publish( table, where )
    return

  # Table DDL (Data Definition Language)
  open:     ( table, schema ) -> # Create a table with an optional schema
    @publish( table, schema )
    return

  make:     ( table, alters ) -> # Alter a table's schema - especially columns
    @publish( table, alters )
    return

  drop:     ( table, resets ) -> # Drop the entire @table - good for testing
    @publish( table, resets )
    return

export default Pipe