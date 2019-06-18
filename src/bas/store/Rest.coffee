
import Util  from '../util/Util.js'
import Store from './Store'

class Rest

  constructor:( @uri, @store ) ->
    @key = "id"

  # Rest
  change:( table, id, callback, params="" )  -> @rest( 'change', table, id,null, params, callback )
  get:(    table, id, callback, params="" )  -> @rest( 'get',    table, id,null, params, callback )
  add:(    table, id, object,   params="" )  -> @rest( 'add',    table, id, object,    params )
  put:(    table, id, object,   params="" )  -> @rest( 'put',    table, id, object,    params )
  del:(    table, id,           params="" )  -> @rest( 'del',    table, id,null, params )

  # Sql
  select:( table, where={},  params="" )  -> @sql( 'select', table, where,   '',null, params, callback )
  insert:( table, objects,   params="" )  -> @sql( 'insert', table,{}, '', objects,    params )
  update:( table, objects,   params="" )  -> @sql( 'update', table,{}, '', objects,    params )
  remove:( table, where={},  params="" )  -> @sql( 'remove', table, where,   '',null, params )

  # Table - only partially implemented
  show:( table, format={} )  -> @opTable( 'show', table, { format:format }, , callback  )
  open:( table, schema={} )  -> @opTable( 'open', table, { schema:schema } )
  make:( table, alters={} )  -> @opTable( 'make', table, { alters:alters } )
  drop:( table, resets={} )  -> @opTable( 'drop', table, { resets:resets } )

  config:( op ) ->
    obj = {}
    obj.method   = @restOp(op)          # *GET, POST, PUT, DELETE
    obj.mode     = 'cors'               # no-cors, cors, *same-origin
    obj.cache    = 'no-cache'           # *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'             # manual, *follow, error
    obj.referrer = 'no-referrer'        # no-referrer, *client
    obj.headers  = { 'Content-Type': 'application/json' }
    obj

  rest:( op, table, id, object=null, params="", callback=null ) ->
    url       = @urlRest( op, table,'',params )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( object, data )
        extras = @restExtras( url )
        callback(result) if callback?
        @store.results( table, id, op, result, extras ) )
      .catch( (error) =>
        result = @restResult( object )
        extras = @restExtras( url, error  )
        @store.onerror( table, id, op, result, extras ) )
    return

  sql:( op, table, where, id, objects=null, params="", callback=null ) ->
    url       = @urlRest( op, table,'',params )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( objects, data, where )
        extras = @restExtras( url )
        callback( result ) if callback?
        @store.results( table, id, op, result, extras ) )
      .catch( (error) =>
        result = @restResult( object )
        extras = @restExtras( url, error  )
        @store.onerror( table, id, op, result, extras ) )
    return

  opTable:( op, table, options, callback=null ) ->
    url       = @urlRest( op, t,'',params )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( null, data )
        extras = @restExtras( url, null, null, options )
        callback( result ) if callback?
        @store.results( table, id, op, result, extras ) )
      .catch( (error) =>
        extras = @restExtras( url, error  )
        @store.onerror( table, id, op, {}, extras ) )
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
    switch op
      when 'add', 'get', 'put', 'del',  'change' then @uri + '/' + table + '/' + id + params
      when 'insert','select', 'update', 'remove' then @uri + '/' + table            + params
      when 'open',  'show',   'make',   'drop'   then @uri + '/' + table  # No Params
      else
          console.error( 'Store.Rest.urlRest() Unknown op', op )
          @uri + '/' + table + '/' + id + params

  restOp:( op ) ->
    switch op
      when 'add', 'insert', 'open' then 'POST'
      when 'get', 'select', 'show' then 'GET'
      when 'put', 'update', 'make' then 'PUT'
      when 'del', 'remove', 'drop' then 'DELETE'
      when 'change'                then 'GET'
      else
        console.error( 'Store.Rest.restOp() Unknown op', op )
        'GET'

export default Rest
