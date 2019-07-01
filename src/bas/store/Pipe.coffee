
class Pipe

  constructor:( @stream, @dbName ) ->

  toSubject:( table, op ) ->
    if table? then @dbName + ':' + table + ':' + op else @dbName + ':' + op

  subscribe:( table, op, source, onSubscribe  ) ->
    if op isnt 'change'
      @stream.subscribe( @toSubject(table,op), source, onSubscribe )
    else
      for changeOp in Pipe.changeOps
        @stream.subscribe( @toSubject(table,changeOp), source, onSubscribe )
    return

  publish:( table, op, result, id=null ) ->
    obj = if id? then { "#{id}":result } else result
    @stream.publish( @toSubject(table,op), obj )
    return

  results:  ( table, op, result, id ) ->
    @publish( table, op, result, id )
    return

  add:( table, id, object ) -> # Post an object into table with id
    @publish( table, 'add', object, id )
    return

  put:( table, id, object ) -> # Put an object into table with id
    @publish( table, 'put', object, id )
    return

  del:( table, id ) -> # Delete  an object from table with id
    @publish( table, 'del', {}, id )
    return

  # SQL tables with multiple objects (rows)

  insert:   ( table, objects ) -> # Insert objects into table with unique id
    @publish( table, 'insert', objects )
    return

  update:   ( table, objects ) -> # # Update objects into table mapped by id
    @publish( table, 'update', objects )
    return

  remove:   ( table, where ) -> # Remove objects from table with where clause
    @publish( table, 'remove', where.toString() )
    return

  # Table DDL (Data Definition Language)
  open:     ( table ) -> # Create a table with an optional schema
    @publish( table, 'open', table )
    return

  drop:     ( table ) -> # Drop the entire @table - good for testing
    @publish( table, 'drop', table )
    return

  Pipe.changeOps = ['change','add','put','del','insert','update','remove']

export default Pipe