
import Store  from './Store.js'

class Rest extends Store

  constructor:( dbName, baseUrl ) ->
    super( dbName )
    @baseUrl = baseUrl

  get:( table           ) -> @getter( table )
  cet:( table, id, call ) -> @rest( 'get',  table, id,null, call )
  add:( table, id, obj  ) -> @rest( 'add',  table, id, obj    )
  put:( table, id, obj  ) -> @rest( 'put',  table, id, obj    )
  del:( table, id       ) -> @rest( 'del',  table, id,null )

  select:( table, where, call ) -> @rest( 'select', table,'None', null, where, call )
  insert:( table, objs )        -> @rest( 'insert', table,'None', objs )
  update:( table, objs )        -> @rest( 'update', table,'None', objs )
  remove:( table, where )       -> @rest( 'remove', table,'None', null, where )

  drop:(   table )              -> @rest( 'drop',   table,'None' )
  show:()                       -> @rest( 'show','_all_dbs','None' ) # '_all_dbs' for couch

  rest:( op, table, id, obj=null, where=null, callback=null ) ->
    url       = @urlRest( op, table )
    json      = if obj? then JSON.stringify(obj) else null
    settings  = @config( op, json )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restRestResult( op, obj, data, where )
        if callback? then callback(result) else @results( table, op, result, id ) )
      .catch( (error) =>
        @onerror( table, op, error, id ) )
    return

  getter:( table ) ->
    url = @urlRest( 'get', table )
    fetch( url, {
      method: 'GET',
      mode:'no-cors',
      credentials: 'same-origin',
      redirect: 'follow',
      agent: null,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + btoa('admin:athena') } } )
    return

  config:( op, json ) ->
    obj = {}                            # 'Access-Control-Allow-Origin'  http://localhost:3000
    obj.method   = @restOp(op)          # *GET, POST, PUT, DELETE
    obj.body     = json if json?
    obj.mode     = 'no-cors'               # no-cors, cors, *same-origin
    obj.credentials = 'include'         # 'same-origin'
    obj.cache    = 'no-cache'           # *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'             # manual, *follow, error
    obj.referrer = 'no-referrer'        # no-referrer, *client
    obj.headers  = {
      "Authorization": 'Basic ' + "admin" + ":" + "athena",
      "Content-Type":"application/json", "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Credentials":true, "Access-Control-Allow-Methods":"*", "Origin":"http://localhost:3000" }
    obj

  config2:( op, json ) ->
    obj = {}                            # 'Access-Control-Allow-Origin'  http://localhost:3000
    obj.method   = @restOp(op)          # *GET, POST, PUT, DELETE
    obj.body     = json if json?
    # console.log( 'Rest.config()', obj.body ) if op is 'add'
    obj.mode     = 'cors'               # no-cors, cors, *same-origin
    obj.credentials = 'include'         # 'same-origin'
    obj.cache    = 'no-cache'           # *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'             # manual, *follow, error
    obj.referrer = 'no-referrer'        # no-referrer, *client
    obj.headers  = {
      "Authorization": 'Basic ' + "admin" + ":" + "athena",
      "Content-Type":"application/json", "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Credentials":true, "Access-Control-Allow-Methods":"*", "Origin":"http://localhost:3000" }
    obj

  restResult:( op, obj, data=null, where ) ->  # obj can also be objs
    result = {}
    result = data                      if data? and ( op is 'get'    or op is 'del'    )
    result = obj                       if obj?  and ( op is 'add'    or op is 'put'    )
    result = obj                       if obj?  and ( op is 'insert' or op is 'update' )
    result = @toObjects( data, where ) if data? and ( op is 'select' or op is 'remove' )
    result = data                      if data? and ( op is 'show'   or op is 'drop'   )
    result

  urlRest:( op, table ) ->
    switch op
      when 'add', 'get', 'put', 'del'   then @baseUrl + '/' + table
      when 'insert', 'update', 'remove' then @baseUrl + '/' + table + '?batch=ok'
      when 'drop',   'select'           then @baseUrl + '/' + table
      when 'show'
      else
        console.error( 'Rest.urlRest() Unknown op', op )
        @baseUrl + '/' + table

  urlRestDB:( op, table ) ->
    switch op
      when 'add', 'get', 'put', 'del'   then @baseUrl + '/' + @dbName + '/' + table
      when 'insert', 'update', 'remove' then @baseUrl + '/' + @dbName + '/' + table + '?batch=ok'
      when 'drop',   'select'           then @baseUrl + '/' + @dbName + '/' + table
      when 'show'
      else
        console.error( 'Rest.urlRest() Unknown op', op )
        @baseUrl + '/' + table

  restOp:( op ) ->
    switch op
      when 'add', 'insert'         then 'POST'
      when 'get', 'select', 'show' then 'GET'
      when 'put', 'update'         then 'PUT'
      when 'del', 'remove', 'drop' then 'DELETE'
      else
        console.error( 'Rest.restOp() Unknown op', op )
        'GET'

export default Rest

###
  sql:( op, table, where, objs=null, callback=null ) ->
    url       = @urlRest( op, table,'' )
    settings  = @config( op )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( objs, data, where )
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

  toError:( url, error=null, where=null, options=null ) ->
    obj         = { }
    obj.url     = url
    obj.error   = error   if error?
    obj.where   = where   if where?
    obj.options = options if options?
    obj
###
