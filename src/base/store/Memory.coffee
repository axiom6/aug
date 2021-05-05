import Store  from './Store.js'

class Memory extends Store

  constructor:( dbName ) ->
    super( dbName )
    @memory = {}

  table:( tn ) ->
    if @memory[tn]?
       @memory[tn]
    else
       @openTable(tn)
       @memory[tn] = {}
       @memory[tn]

  add:( tn, id, obj )    ->
    @table(tn)[id] = obj

    @results( tn, 'add', obj )
    return

  get:( tn, id, callback=null ) ->
    obj = if @table(tn)[id]? then @table(tn)[id] else {}
    if obj?
      if callback?
         callback( obj )
      else
         @results( tn, 'get', obj )
    else
      @onerror( tn, 'get', { error:'Memory object not found'}, id )
    return

  put:( tn, id,  obj ) ->
    @table(tn)[id] = obj
    @results( tn, 'put', obj )
    return

  del:( tn, id ) ->
    obj  = @table(tn)[id]
    if obj?
      delete @table(tn)[id]
      @results( tn, 'del', obj )
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
    return

  remove:( tn, where, op='remove' ) ->
    table = @table(tn)
    objs  = {}
    for own key,  obj of table when where(obj)
      objs[key] = obj
      delete table[key]
    @results( tn, op, objs )
    return

  show:() ->
    @showTables()
    return

  open:( table ) ->
    @openTable( table )
    return

  drop:( table ) ->
    @dropTable( table )
    return

export default Memory

###
  console.log( 'Memory.get', { table:tn, id:id, obj:obj } )
  console.log( 'Memory.add', { table:tn, id:id, obj:@table(tn)[id] } )
###