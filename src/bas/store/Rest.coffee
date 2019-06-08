
import Util  from '../util/Util.js'
import Store from './Store'

class Rest extends Store

  constructor:( stream, uri ) ->
    super( stream, uri, 'Rest' )
    @key = ""

  # Rest
  add:( table, id, object, params="" )  -> @rest( 'add',  table, id, object, params )
  get:( table, id,         params="" )  -> @rest( 'get',  table, id,         params )
  put:( table, id, object, params="" )  -> @rest( 'put',  table, id, object, params )
  del:( table, id,         params="" )  -> @rest( 'del',  table, id,         params )

  # Sql
  insert:( table, objects,  params="" )  -> @sql( 'insert', table, @W,    objects, params )
  select:( table, where=@W, params="" )  -> @sql( 'select', table, where, null, params )
  update:( table, objects,  params="" )  -> @sql( 'update', table, @W,    objects, params )
  remove:( table, where=@W, params="" )  -> @sql( 'remove', table, where, null, params )

  # Table - only partially implemented
  open:( table, schema=@S  )  -> @opTable( 'open', table, { schema:schema } )
  show:( table, format=@F  )  -> @opTable( 'show', table, { format:format } )
  make:( table, alters=@A  )  -> @opTable( 'make', table, { alters:alters } )
  drop:( table, resets=@R  )  -> @opTable( 'drop', table, { resets:resets } )

  # Subscribe to  a table or object with id
  onChange:(  t, id='none'   ) ->
    @onerror( t, id, 'onChange', {}, { msg:"onChange() not implemeted by Store.Rest" } )
    return

  config:( op ) ->
    obj = {}
    obj.method   = method:@restOp(op)   # *GET, POST, PUT, DELETE
    obj.mode     = 'cors'               # no-cors, cors, *same-origin
    obj.cache    = 'no-cache'           # *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'             # manual, *follow, error
    obj.referrer = 'no-referrer'        # no-referrer, *client
    obj.headers  = { 'Content-Type': 'application/json' }
    obj

  rest:( op, t, id, object=null, params="" ) ->
    url       = @urlRest( op, t,'',params )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( object, data )
        extras = @restExtras( url )
        @publish( @tableName(t), id, op, result, extras ) )
      .catch( (error) =>
        result = @restResult( object )
        extras = @restExtras( url, error  )
        @onerror( @tableName(t), id, op, result, extras ) )
    return

  sql:( op, t, where, id, objects=null, params="" ) ->
    url       = @urlRest( op, t,'',params )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( objects, data, where )
        extras = @restExtras( url )
        @publish( @tableName(t), id, op, result, extras ) )
      .catch( (error) =>
        result = @restResult( object )
        extras = @restExtras( url, error  )
        @onerror( @tableName(t), id, op, result, extras ) )
    return

  opTable:( op, t, options ) ->
    url       = @urlRest( op, t,'',params )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( null, data )
        extras = @restExtras( url, null, null, options )
        @publish( @tableName(t), id, op, result, extras ) )
      .catch( (error) =>
        extras = @restExtras( url, error  )
        @onerror( @tableName(t), id, op, {}, extras ) )
    return

  restResult:( object, data=null, where=()->true ) ->  # object can also be objects
    result = {}
    result = @toObject(data)                 if data?   and ( op is 'get'  )
    result = @toKeysJson(data)               if data?   and ( op is 'show' )
    result = object                          if object? and ( op is 'add' or op is 'put' )
    result = Util.toObjects(data,where,@key) if data?   and ( op is 'select' or op is 'remove' )
    result = object                          if object? and ( op is 'insert' or op is 'update' )
    result = if op is 'show' then @toKeysJson(data) else {}
    result

  restExtras:( url, error=null, where=null, options=null ) ->
    extras         = { url:url }
    extras.error   = error   if error?
    extras.where   = where   if where?
    extras.options = options if options?
    extras

  urlRest:( op, table, id='', params='' ) ->
    # console.log('Store.Rest.urlRest()', @uri, table,params, @uri + '/' + table + params )
    tableJson = table  + '.json'
    switch op
      when 'add',   'get',    'put',    'del'    then @uri + '/' + tableJson + '/' + id + params
      when 'insert','select', 'update', 'remove' then @uri + '/' + tableJson            + params
      when 'open',  'show',   'make',   'drop'   then @uri + '/' + tableJson  # No Params
      when 'onChange'
        if id is '' then @uri + '/' + table      else @uri + '/' + tableJson + '/' + id + params
      else
          console.error( 'Store.Rest.urlRest() Unknown op', op )
          @uri + '/' + tableJson

  restOp:( op ) ->
    switch op
      when 'add', 'insert', 'open' then 'POST'
      when 'get', 'select', 'show' then 'GET'
      when 'put', 'update', 'make' then 'PUT'
      when 'del', 'remove', 'drop' then 'DELETE'
      when 'onChange'              then 'GET'
      else
        console.error( 'Store.Rest.restOp() Unknown op', op )
        'get'

export default Rest
