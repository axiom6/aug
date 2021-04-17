
import Store  from '../util/Store.js'

class Rest extends Store

  constructor:( baseUrl ) ->
    super()
    @baseUtl = baseUrl
    @key  = "id"

  # Rest
  get:( table, id, callback, path )  -> @rest( 'get',    table, id,null, path, callback )
  add:( table, id, object,   path )  -> @rest( 'add',    table, id, object,    path )
  put:( table, id, object,   path )  -> @rest( 'put',    table, id, object,    path )
  del:( table, id,           path )  -> @rest( 'del',    table, id,null, path )

  # Sql
  select:( table, where, callback ) -> @sql( 'select', table, where,   '',null, callback )
  insert:( table, objects )         -> @sql( 'insert', table,{}, '', objects,    )
  update:( table, objects )         -> @sql( 'update', table,{}, '', objects,    )
  remove:( table, where   )         -> @sql( 'remove', table, where,   '',null, )

  # Table - only partially implemented
  open:( table )  -> @opTable( 'open', table )
  drop:( table )  -> @opTable( 'drop', table )

  config:( op ) ->
    obj = {}
    obj.method   = @restOp(op)          # *GET, POST, PUT, DELETE
    obj.mode     = 'cors'               # no-cors, cors, *same-origin
    obj.cache    = 'no-cache'           # *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'             # manual, *follow, error
    obj.referrer = 'no-referrer'        # no-referrer, *client
    obj.headers  = { 'Content-Type': 'application/json' }
    obj

  rest:( op, table, id, object=null, path, callback=null ) ->
    url       = @baseUrl + path
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( object, data )
        if callback?
           callback(result)
        else
           @results( table, op, result, id ) )
      .catch( (error) =>
        @onerror( table, op, @toError(url,error), id ) )
    return

  sql:( op, table, where, objects=null, callback=null ) ->
    url       = @urlRest( op, table,'' )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( objects, data, where )
        if callback?
           callback(result)
        else
           @results( table, op, result ) )
      .catch( (error) =>
        @onerror( table, op, @toError(url,error) ) )
    return

  # Only for open and drop. Needs to be thought out
  opTable:( op, table ) ->
    url       = @urlRest( op, t,'' )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( null, data )
        @results( table, op, result ) )
      .catch( (error) =>
        @onerror( table, op, @toError(url,error) ) )
    return

  restResult:( object, data=null, where=()->true ) ->  # object can also be objects
    ###
    result = {}
    result = @toObject(data)                 if data?   and ( op is 'get'  )
    result = @toKeysJson(data)               if data?   and ( op is 'show' )
    result = object                          if object? and ( op is 'add' or op is 'put' )
    result = Util.toObjects(data,where,@key) if data?   and ( op is 'select' or op is 'remove' )
    result = object                          if object? and ( op is 'insert' or op is 'update' )
    result = if op is 'show' then @toKeysJson(data) else {}  
    ###
    if where is false then {}
    result = data
    result

  toError:( url, error=null, where=null, options=null ) ->
    obj         = { }
    obj.url     = url
    obj.error   = error   if error?
    obj.where   = where   if where?
    obj.options = options if options?
    obj

  urlRest:( op, table, id='', params='' ) ->
    switch op
      when 'add',   'get',    'put',    'del'    then @baseUrl + '/' + table + '/' + id + params
      when 'insert','select', 'update', 'remove' then @baseUrl + '/' + table            + params
      when 'open',  'show',   'make',   'drop'   then @baseUrl + '/' + table  # No Params
      else
        console.error( 'Rest.urlRest() Unknown op', op )
        @baseUrl + '/' + table + '/' + id + params

  restOp:( op ) ->
    switch op
      when 'add', 'insert', 'open' then 'POST'
      when 'get', 'select', 'show' then 'GET'
      when 'put', 'update', 'make' then 'PUT'
      when 'del', 'remove', 'drop' then 'DELETE'
      else
        console.error( 'Rest.restOp() Unknown op', op )
        'GET'

export default Rest
