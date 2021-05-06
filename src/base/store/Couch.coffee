
import Store  from './Store.js'

class Couch extends Store

  constructor:( dbName, baseUrl ) ->
    super( dbName )
    @baseUrl  = baseUrl
    @username = 'admin'
    @password = 'athena'

  # obj: {error: "not_found", reason: "missing"}
  add:(   table, id, obj ) ->
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
    where     = (obj)->true
    selector  = @findId( table, id )
    opts = { where:where, op2:'del' }
    @rest( 'find', table, id, selector, opts )
    return



  select:( table,  where, callback ) ->
    selector  = @findSelect( table )
    opts = { where:where, callback:callback, op2:"select" }
    @rest( 'find', table, 'None', selector, opts )
    return

  insert:( table, objs )  ->
    docs = @insertDocs( table, objs )
    opts = { objs:objs }
    @rest( 'insert', table, 'None', { "docs":docs }, opts )
    return

  update:( table, objs )  ->
    docs = @insertDocs( table, objs )
    opts = { objs:objs }
    @rest( 'update', table, 'None', { "docs":docs }, opts )
    return

  remove:( table, where ) ->
    selector  = @findSelect( table )
    opts = { where:where, op2:'del' }
    @rest( 'find', table, 'None', selector, opts )
    return

  show:() ->
    @showTables()
    # @rest( 'show', @dbName,'None', null, {} ) # Shows all docs in db
    return

  # consider 412 status when opening an existing table
  open:( table ) ->
    @openTable( table )
    @rest( 'open', table, 'None', null, {} )
    return

  # look at response obj: {ok: true}
  drop:( table ) ->
    @dropTable( table )
    @rest( 'drop', table, 'None', null, {} )
    return

  queryPrac:( ) ->
    { "selector":{ "plane": { "$eq":"Know" } } }

  findSelect:( table ) ->
    { "selector":{ "table": { "$eq": table.toLowerCase() } } }

  findId:( table, id ) ->
    { "selector":{ "table": { "$eq": table.toLowerCase() }, "_id": { "$eq": id } } }

  rest:( op1, table, id, obj, opts ) ->
    url       = @urlRest( op1, table, id )
    json      = if obj? then JSON.stringify(obj) else null
    settings  = @config( op1, json )
    fetch( url, settings )
      .then(  (response) =>
        if not response.ok
          @onerror( table, op1, response.statusText )
        else
          response.json() )
      .then( (data) =>
        if op1 is 'find' and opts.op2 is 'select'
          @selectDocs( table, data, opts.where, opts.callback )
        else if op1 is 'find'
          @findDocs( opts.op2, table, data, opts.where, opts.callback )
        else
          obj1 = if obj? then obj else {}
          objs = if opts.objs? then opts.objs else obj1
          op   = if opts.op2 is 'del' then 'del' else op1
          result = @restResult( op, table, objs, data, opts.where )
          if opts.callback? then opts.callback(result) else @results( table, op, result ) )
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

  findDocs:( op, table, data, where, callback ) ->
    oDocs = { "docs": [] }
    dObjs = {}
    for doc in data.docs when where(doc)
      doc['_deleted'] = true if op is 'remove' or op is 'del'
      doc = @setCouchProps( table, doc.id, doc, doc._rev, true )
      oDocs.docs.push( doc )
      dObjs[doc.id] =  doc
    # console.log('Couch.findDocs()', { data:data, oDocs:oDocs, dObjs:dObjs } )
    if op is 'remove'
      opts = { where:((obj)->true), callback:callback, objs:dObjs }
      @rest( op, table,'None', oDocs, opts )
    else if op is 'del'
      opts = { where:((obj)->true), callback:callback, objs:dObjs, op2:"del" }
      @rest( 'remove', table,'None', oDocs, opts )
    else if op is 'select'
      @results( table, 'select', oDocs )
    return

  selectDocs:( table, docs, where, callback ) ->
    results = {}
    for doc in docs.docs when where(doc)
      doc = @setCouchProps( table, doc.id, doc, doc._rev, true )
      results[doc.id] = doc
    # console.log( 'Couch.selectDocs', { table:table, docs:docs, results:results } )
    if callback? then callback(results) else @results( table, 'select', results )
    return

  setCouchProps:( table, id, obj, rev=null, ok=null ) ->
    obj[ 'id']    = id
    obj['_id']    = id
    obj['table']  = table.toLowerCase()
    obj['_rev']   = rev if rev?
    obj.ok        = ok  if ok?
    obj

  insertDocs:( table, objs ) ->
    docs = []
    for own key, obj of objs
      obj = @setCouchProps( table, key, obj, null, null )
      docs.push( obj )
    docs

  insertObjs:( table, objs, data ) ->
    # console.log('Couch.insertObjs()', { objs:objs, data:data } )
    results = {}
    for row in data
      id         = row.id
      results[id] = objs[id]
      # console.log('Couch.insertObjs()', { id:id, result:results[id], obj:objs[id] } )
      results[id] = @setCouchProps( table, id, results[id], row.rev, row.ok )
    results

  tableObjs:( table, results, query ) ->
    where = if query? then query else (obj)->true
    if @isArray(results.rows)
      objsOp = {}
      for row in results.rows when where(row)
        objsOp[row[@keyProp]] = row
      objsOp
    else
      objsOp = {}
      for own key, obj of results when where(row)
        objsOp[key] = obj
      objsOp

  restResult:( op, table, obj, data, where ) ->  # obj can also be objs
    result = {}
    result = data                              if data? and   op is 'get'
    result = obj                               if obj?  and ( op is 'add'    or op is 'put'    )
    result = @insertObjs( table, obj, data )   if data? and obj?  and ( op is 'insert' or op is 'update' )
    result = @tableObjs(  table, data, where ) if data? and ( op is 'select' )
    result = obj                               if obj?  and ( op is 'remove' or op is 'del'  )
    result = data                              if data? and ( op is 'show'   or op is 'drop' )
    result

  urlRest:( op, table, id ) ->
    tableLC = table.toLowerCase()
    switch op
      when 'add','put'                then @baseUrl + '/' + tableLC + '?batch=ok'
      when 'get','del'                then @baseUrl + '/' + tableLC + '/' + id
      when 'open','drop'              then @baseUrl + '/' + tableLC
      when 'insert','update','remove' then @baseUrl + '/' + tableLC + '/' + '_bulk_docs'
      when 'select'                   then @baseUrl + '/' + tableLC + '/' + '_all_docs'
      when 'find'                     then @baseUrl + '/' + tableLC + '/' + '_find'
      when 'show'                     then @baseUrl + '/' + '_all_dbs'
      else
        console.error( 'Rest.urlRest() Unknown op', op, id )
        @baseUrl + '/' + tableLC

  restOp:( op ) ->
    switch op
      when 'open'                                        then 'PUT'
      when 'get', 'select','show'                        then 'GET'
      when 'insert','update','remove','find','add','put' then 'POST'
      when 'del', 'drop'                                 then 'DELETE'
      else
        console.error( 'Rest.restOp() Unknown op', op )
        'GET'

export default Couch

###
  del2:( table, id ) ->
    # obj = {_id: "Involve", _rev: "1-afa975e535c8308069eaf575eb7e01d0", id: "Involve", table: "prac", type: "pane" }
    #idRev = id + '?rev=' + "1-afa975e535c8308069eaf575eb7e01d0"
    @rest( 'del', table, id, null )
    return
###
