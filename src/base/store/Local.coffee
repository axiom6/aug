import Store  from '../util/Store.js'

class Local extends Store

  constructor:() ->
    @tableIds = {}

  key:( table, id ) ->
    table + id

  obj:( table, id ) ->
    str = localStorage.getItem( @key(table,id) )
    if str? then JSON.parse(str) else null

  addId:( table, id ) ->
    @tableIds[table] = [] if not @tableIds[table]?
    @tableIds[table].push(id)

  delId:( table, id ) ->
    @tableIds[table] = [] if not @tableIds[table]?
    @tableIds[table].push(id)

  get:( table, id, callback=null, op='get' ) ->
    obj = @obj( table, id )
    if obj?
      if callback?
         callback( obj )
      else
         @results( table, op, obj, id )
    else
      @onerror( table, op, { error:"Local get error"}, id )
    return

  add:(     table, id, obj  )    ->
    @addId( table, id )
    localStorage.setItem( @key(table,id), JSON.stringify(obj) )
    return

  put:( table, id, obj ) ->
    localStorage.setItem( @key(table,id), JSON.stringify(obj) )
    return

  del:(     table, id ) ->
    @delId( table, id )
    localStorage.removeItem( @key(table,id) )
    return

  insert:( table, objs ) ->
    for own key, obj of objs
      @add( table, key, obj )
    return

  select:( table, where, callback=null, op='select' ) ->
    objs =  {}
    ids  =  @tableIds[table]
    for id in ids
      obj = @obj( table, id )
      objs[key] = obj if obj? and where(obj)
    if callback?
      callback( objs )
    else
      @results( table, op, objs )
    return

  update:( table, objs ) ->
    for own key, obj of objs
      @put( table, key, obj )
    return

  remove:( table, where ) ->
    ids  =  @tableIds[table]
    objs = {}
    for id in ids
      obj = @obj( table, id )
      if obj? and where(obj)
        @del( table, id )
        objs[id] = obj
    @results( table, 'remove', objs )
    return

  # Nothing to do until we get ids
  open:( table ) ->
    if table is false then {}
    return

  drop:( table ) ->
    @remove( table, (obj)->true )
    return

export default Local