import Store  from './Store.js'

class Memory extends Store

  constructor:() ->
    super()
    @tables = {}

  table:( t ) ->
    if @tables[t]?
       @tables[t]
    else
       @tables[t] = {}
       @tables[t]

  add:( tn, id, obj )    ->
    @table(tn)[id] = obj
    @results( tn, 'add', obj, id )
    return

  get:( tn, id, callback ) ->
    obj = @table(tn)[id]
    if obj?
      if callback?
         callback( obj )
      else
         @results( tn, 'get', obj, id )
    else
      @onerror( tn, 'get', { error:'Memory object no found'}, id )
    return

  put:( tn, id,  obj ) ->
    @table(tn)[id] = obj
    @results( tn, 'put', obj, id )
    return

  del:( tn, id ) ->
    obj  = @table(tn)[id]
    if obj?
      delete @table(tn)[id]
      @results( tn, 'del', obj, id )
    else
      @onerror( tn, 'get', { error:'Memory object not found'}, id )
    return

  insert:( tn, objs ) ->
    table = @table(tn)
    for own key, obj of objs
      table[key] = obj
    @results( tn, 'insert', objs )
    return

  select:( tn, where, callback=null ) ->
    table = @table(tn)
    objs  = {}
    for key, obj of table when where(obj)
      objs[key] = obj
    if callback?
       callback( objs )
    else
       @results( tn, 'select', objs )
    return

  update:( tn, objs ) ->
    table = @table(tn)
    for own key,   obj of objs
      table[key] = obj
    @results( tn, 'update', objs )
    #console.log( tn, 'update2', objs )
    return

  remove:( tn, where ) ->
    table = @table(tn)
    objs  = {}
    for own key,  obj of table when where(obj)
      objs[key] = obj
      delete table[key]
    @results( tn, 'remove', objs )
    #console.log( tn, 'remove2', objs )
    return

  open:( tn ) ->
    if tn is false then {} # Nothing to do. Handled by store
    return

  drop:( tn ) ->
    if tn is false then {} # Nothing to do. Handled by store
    return

export default Memory