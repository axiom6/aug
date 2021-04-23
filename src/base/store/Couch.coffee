
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

  get:( table, id, callback ) ->
    opts = { callback:callback }
    @rest( 'get', table, id, null, opts )
    return

  put:( table, id, obj, op='put' ) ->
    obj = @setCouchProps( table, id, obj )
    @rest( op, table, id, obj, {} )
    return

  del:( table, id ) ->
    @rest( 'del', table, id, null, {} )
    return

  select:( table,  where, callback ) ->
    opts = { where:where, callback:callback, ops2:'select' }
    @rest( 'find', table, 'None', @query, opts )
    return

  insert:( table, objs )  ->
    docs = @insertDocs( table, objs )
    #onsole.log( 'Rest.insert()',   { "docs":docs } )
    @rest( 'insert', table, 'None', { "docs":docs }, {} )
    return

  update:( table, objs )  ->
    docs = @insertDocs( table, objs )
    @rest( 'update', table, 'None', { "docs":docs }, {} )
    return

  remove:( table, where ) ->
    opts = { where:where, ops2:'remove' }
    @rest( 'find', table, 'None', @query, opts )
    return

  show:() ->
    @rest( 'show', @dbName,'None', null, {} ) # Shows all docs in db
    return

  open:( table ) ->
    @rest( 'open', table, 'None', null, {} )
    return

  drop:( table ) ->
    @rest( 'drop', table, 'None', null, {} )
    return

  query:() ->
    {}

  rest:( op1, table, id, obj, opts ) ->
    url       = @urlRest( op1, table, id )
    json      = if obj? then JSON.stringify(obj) else null
    settings  = @config( op1, json )
    fetch( url, settings )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        if op1 is 'find'
          @findDocs( opts.ops2, table, data, opts.where, opts.callback )
        else
          result = @restResult( op1, table, obj, data, opts.where )
          if opts.callback? then opts.callback(result) else @results( table, op1, result ) )
      .catch( (error) =>
        @onerror( table, op1, error ) )
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


  findDocs:( op, table, iDocs, where, callback ) ->
    oDocs = { "docs": [] }
    for iDoc in iDocs.docs when where(iDoc)
      iDoc['_deleted'] = true if op is 'remove' or op is 'drop'
      oDocs.docs.push( iDoc )
    opts = { where:((obj)->true), callback:callback }
    @rest( op, table,'None', oDocs, opts )
    return

  setCouchProps:( table, id, obj, rev=null, ok=null ) ->
    obj[ 'id']    = id
    obj['_id']    = id
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
      id       = row.id
      oObj[id] = iObj[key]
      oObj[id] = @setCouchProps( table, id, oObj[id], row.rev, row.ok )
    oObj

  tableObjs:( table, objsIn, results, query ) ->
    where = if query? then query else (obj)->true
    if @isArray(results)
      objsOp = {}
      for row in results when where(row)
        objsOp[row[@keyProp]] = row
      objsOp
    else
      objsOp = {}
      for own key, obj of results when where(row)
        objsOp[key] = obj
      objsOp

  restResult:( op, table, obj, data=null, where ) ->  # obj can also be objs
    result = {}
    result = data                      if data? and ( op is 'get'    or op is 'del'    )
    result = obj                       if obj?  and ( op is 'add'    or op is 'put'    )
    result = @insertObjs( table, obj, data )        if obj?  and ( op is 'insert' or op is 'update' )
    result = @tableObjs(  table, obj, data, where ) if data? and ( op is 'select' or op is 'remove' )
    result = data                      if data? and ( op is 'show'   or op is 'drop'   )
    result

  urlRest:( op, table, id ) ->
    switch op
      when 'add','get','put','del' then @baseUrl + '/' + table + '/' + id
      when 'remove','open','drop'  then @baseUrl + '/' + table
      when 'insert','update'       then @baseUrl + '/' + table + '/' + '_bulk_docs'
      when 'select'                then @baseUrl + '/' + table + '/' + '_bulk_get'
      when 'show'                  then @baseUrl + '/' + table + '/' + '_all_docs'
      else
        console.error( 'Rest.urlRest() Unknown op', op )
        @baseUrl + '/' + table

  restOp:( op ) ->
    switch op
      when 'add', 'put', 'open'              then 'PUT'
      when 'get', 'show'                     then 'GET'
      when 'select','insert','update','find' then 'POST'
      when 'del', 'remove', 'drop'           then 'DELETE'
      else
        console.error( 'Rest.restOp() Unknown op', op )
        'GET'

export default Couch
