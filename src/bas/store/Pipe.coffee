
class Pipe

  constructor:( @stream, @dbName ) ->

  toSubject:( table, op ) ->
    @dbName + ':' + table + ':' + op

  subscribe:( table, op, source, onSubscribe  ) ->
    @stream.subscribe( @toSubject(table,op), source, onSubscribe )
    return

  publish:( table, op, result, id=null ) ->
    obj = if id? then { id:result } else result
    @stream.publish( @toSubject(table,op), obj )
    return

  results:( table, op, result, id ) ->
    switch op
      when 'change' then @publish( table, 'change', result, id )
      when 'get'    then @publish( table, 'get',    result, id )
      when 'select' then @publish( table, 'select', result )
      when 'show'   then @publish( table, 'show',   result )
      when 'batch'  then @publish( table, 'batch',  result )
      when 'range'  then @publish( table, 'range',  result ) # Range op in Firebase

  add:( table, id, object ) -> # Post an object into table with id
    @publish( table, 'add', object, id )
    return

  put:( table, id, object ) -> # Put an object into table with id
    @publish( table, 'put', object, id )
    return

  del:( table, id ) -> # Delete  an object from table with id
    @publish( table, 'del', object, id )
    return

  # SQL tables with multiple objects (rows)

  insert:   ( table, objects ) -> # Insert objects into table with unique id
    @publish( table, 'insert', objects )
    return

  update:   ( table, objects ) -> # # Update objects into table mapped by id
    @publish( table, 'update', objects )
    return

  remove:   ( table, where ) -> # Remove objects from table with where clause
    @publish( table, 'remove', where )
    return

  # Table DDL (Data Definition Language)
  open:     ( table, schema ) -> # Create a table with an optional schema
    @publish( table, 'open', schema )
    return

  make:     ( table, alters ) -> # Alter a table's schema - especially columns
    @publish( table, 'make', alters )
    return

  drop:     ( table, resets ) -> # Drop the entire @table - good for testing
    @publish( table, 'drop', resets )
    return

export default Pipe