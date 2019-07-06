
class Memory

  constructor:( @store ) ->
    @dbName    = @store.dbName

  table:(tn) ->
    @store.table(tn)

  batch:( name, obj, objs, callback=null ) ->
    onBatch = (result) =>
      obj.result = result
      if @store.batchComplete( objs )
        if callback?
           callback( objs )
        else
           @store.results( name, 'batch', objs )
    where = () -> true
    @select( obj.table, where, onBatch )
    return

  add:( tn, id, object )    ->
    @table(tn)[id] = object
    return

  get:( tn, id, callback ) ->
    object = @table(tn)[id]
    if object?
      if callback?
         callback( object )
      else
         @store.results( tn, 'get', object, id )
    else
      @store.onerror( tn, 'get', { error:'Memory object no found'}, id )
    return

  put:( tn, id,  object ) ->
    @table(tn)[id] = object
    return

  del:( tn, id ) ->
    object  = @table(tn)[id]
    if object?
      delete @table(tn)[id]
    else
      @store.onerror( tn, 'get', { error:'Memory object not found'}, id )
    return

  insert:( tn, objects ) ->
    table = @table(tn)
    for own key, obj of objects
      table[key] = obj
    return

  select:( tn, where, callback=null ) ->
    table   = @table(tn)
    objects = @store.filter( table, where )
    if callback?
       callback( objects )
    else
       @store.results( tn, 'select', objects )
    return

  update:( tn, objects ) ->
    table = @table(tn)
    for own key,   obj of objects
      table[key] = obj
    return

  remove:( tn, where ) ->
    table = @table(tn)
    objs  = {}
    for own key,  obj of table when where(obj)
      objs[key] = obj
      delete table[key]
    @store.results( table, 'remove', objs )
    return

  open:( tn ) ->
    if tn is false then {} # Nothing to do. Handled by store
    return

  drop:( tn ) ->
    if tn is false then {} # Nothing to do. Handled by store
    return

export default Memory