
import Store  from './Store.js'

class Couch extends Store

  constructor:( dbName, baseUrl ) ->
    super( dbName )
    @baseUrl  = baseUrl
    @username = 'admin'
    @password = 'athena'

  add:( table, id, obj ) ->
    @put( table, id, obj, 'add' )
    return

  get:( table, id, call ) ->
    @rest( 'get', table, id, null, null, call )
    return

  put:( table, id, obj, op='put' ) ->
    obj = @setCouchProps( table, id, obj )
    @rest( op, table, id, obj )
    return

  del:( table, id ) ->
    @rest( 'del', table, id,null )
    return

  select:( table, where, call ) ->
    docs = { "docs": [ { "id": table }, { "id": 'pracInvolve' } ] }
    @rest( 'select', table,'None', docs, where, call )
    return

  insert:( table, objs )  ->
    docs = @insertDocs( table, objs )
    console.log( 'Rest.insert()',   { "docs":docs } )
    @rest( 'insert', table, 'None', { "docs":docs } )
    return

  update:( table, objs )  ->
    docs = @insertDocs( table, objs )
    @rest( 'update', table, 'None', { "docs":docs } )
    return

  remove:( table, where ) ->
    @rest( 'remove', table,'None', null, where )
    return

  drop:( table ) ->
    @rest( 'drop',   table,'None' )
    return

  show:() ->
    @rest( 'show', @dbName,'None' ) # Shows all docs in db
    return

  find:( table ) ->
      doc =  { "selector":{ "_table": { "$eq": table } } }
      url       = @urlRest( op, table, 'None' )
      settings  = @config( op, doc )
      fetch( url, settings )
        .then( (response) =>
          response.json() )
        .then( (data) =>
        .catch( (error) => @onerror( table, 'find', error ) )

  rest:( op, table, id, obj=null, where=null, callback=null ) ->
    url       = @urlRest( op, table, id )
    json      = if obj? then JSON.stringify(obj) else null
    settings  = @config( op, json )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        result = @restResult( op, table, obj, data, where )
        if callback? then callback(result) else @results( table, op, result ) )
      .catch( (error) =>
        @onerror( table, op, error ) )
    return

  headers:() -> {
    "Content-Type": "application/json"
    "Accept":       "application/json"
    "Authorization":"Basic " + btoa( @username + ":" + @password ) }

  config:( op, json ) ->
    obj = {}
    obj.method   = @restOp(op)
    obj.body     = json if json?
    obj.headers  = @headers()
    obj

  restResult:( op, table, obj, data=null, where ) ->  # obj can also be objs
    result = {}
    result = data                      if data? and ( op is 'get'    or op is 'del'    )
    result = obj                       if obj?  and ( op is 'add'    or op is 'put'    )
    result = @insertObjs( table, obj, data )        if obj?  and ( op is 'insert' or op is 'update' )
    result = @tableObjs(  table, obj, data, where ) if data? and ( op is 'select' or op is 'remove' )
    result = data                      if data? and ( op is 'show'   or op is 'drop'   )
    result

  setCouchProps:( table, id, obj, rev=null, ok=null ) ->
    obj[ 'id']    = id
    obj['_id']    = @toDocId( table, id )
    obj['_table'] = table
    obj['_rev']   = rev if rev?
    obj.ok        = ok  if ok?
    obj

  insertDocs:( table, objs ) ->
    docs = []
    for own key, obj of objs
      obj = @setCouchProps( table, id, obj, null, null )
      docs.push( obj )
    docs

  insertObjs:( table, iObj, results ) ->
    oObj = {}
    for row in results
      id = @frDocId(row.id).id
      oObj[id] = iObj[key]
      oObj[id] = @setCouchProps( table, id, oObj[id], row.rev, row.ok )
    oObj

  tableObjs:( table, objsIn, results, query ) ->
    where = if query? then query else (obj)->true
    if @isArray(results)
      objsOp = {}
      for row in results when @whereTable(table,row,where)
        objsOp[row[@keyProp]] = row
      objsOp
    else
      objsOp = {}
      for own key, obj of results when @whereTable(table,row,where)
        objsOp[key] = obj
      objsOp

  toDocId:( table, id ) ->
    table + id

  frDocId:( docId ) ->
    ptn   = /([a-z]+)([A-Z][a-z]*)/
    match = ptn.exec( docId )
    if match? then {table:match[1],id:match[2]} else 'prac'

  whereTable:( obj, table, where ) ->
    tableId = @frDocId( obj.id )
    tableId.table is table and where(obj)

  urlRest:( op, table, id ) ->
    switch op
      when 'add','get','put','del' then @baseUrl + '/' + @dbName + '/' + @toDocId(table,id)
      when 'remove'                then @baseUrl + '/' + @dbName + '/' + table + '?batch=ok'
      when 'insert', 'update'      then @baseUrl + '/' + @dbName + '/' + '_bulk_docs'
      when 'select'                then @baseUrl + '/' + @dbName + '/' + '_bulk_get'
      when 'drop'                  then @baseUrl + '/' + @dbName + '/' + @toDocId(table,id) # Not yet complete
      when 'show'                  then @baseUrl + '/' + @dbName + '/' + '_all_docs'
      else
        console.error( 'Rest.urlRest() Unknown op', op )
        @baseUrl + '/' + table

  restOp:( op ) ->
    switch op
      when 'add', 'put'                      then 'PUT'
      when 'get', 'show'                     then 'GET'
      when 'select','insert','update','find' then 'POST'
      when 'del', 'remove', 'drop'           then 'DELETE'
      else
        console.error( 'Rest.restOp() Unknown op', op )
        'GET'

export default Couch

###
  <!--script type="text/javascript">var global = window;</script-->
  <!--script type="text/typescript">(window as any).global = window;</script-->

  config:( op, json ) ->
    obj = {}                            # 'Access-Control-Allow-Origin'  http://localhost:3000
    obj.method   = @restOp(op)          # *GET, POST, PUT, DELETE
    obj.body     = json if json?
    obj.mode     = 'no-cors'               # no-cors, cors, *same-origin
    obj.credentials = 'include'         # 'same-origin'
    obj.cache    = 'no-cache'           # *default, no-cache, reload, force-cache, only-if-cached
    obj.redirect = 'follow'             # manual, *follow, error
    obj.referrer = 'no-referrer'        # no-referrer, *client
    obj.headers  = @headers()
    obj

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
