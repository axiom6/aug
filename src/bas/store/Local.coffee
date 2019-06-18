
import Store     from './Store'

class Local extends Store

  constructor:( stream, uri ) ->
    super( stream, uri, 'Local' )

  key:( t, id ) ->
    t + id

  add:( t, id, obj  )    ->
    localStorage.setItem( @key(t,id), JSON.stringify(obj) )
    @publish( t, id, 'add', obj )
    return

  get:( t, id ) ->
    str = localStorage.getItem( @key(t,id) )
    obj = if str? then JSON.parse(str) else null
    if obj?
      @publish( t, id, 'get', obj )
    else
      @onerror( t, id, 'get', obj,  { msg:"Id #{id} not found"} )
    return

  put:( t, id, obj ) ->
    localStorage.setItem( @key(t,id), JSON.stringify(obj) )
    @publish( t, id, 'put', obj )
    return

  del:( t, id ) ->
    obj = @get( t, id )
    localStorage.removeItem( @key(t,id) )
    if obj?
      delete @table(t)[id]
      @publish( t, id, 'del', obj )
    else
      @onerror( t, id, 'del', obj,  { msg:"Id #{id} not found"} )
    return

  insert:( t, objs ) ->
    for own key, obj of objs
      @add( t, key, obj )
    @publish( t, 'none', 'insert', objs )
    return

  select:( t, where ) ->
    objs =  {}
    tab  =  @table(t) # Need to think about this
    for own k, obj of tab when where(obj)
      objs[key] = @get( t, k )
    @publish( t, 'none', 'select', objs, { where:where.toString() } )
    return

  update:( t, objs ) ->
    for own k, obj of objs
      @put( t, k, obj )
    @publish( t, id, 'update', objs )
    return

  remove:( t, where=@W ) ->
    objs = {}
    tab  = @table(t)
    for own k, obj of tab when where(obj)
      @del( t, j )
    @publish( t, 'none', 'remove', objs, { where:where.toString() } )
    return

  open:( t, schema ) ->
    @publish( t, 'none', 'open', {}, { schema:schema } )
    return

  show:( t ) ->
      keys = []
      for own key, val of @tables[t]
        keys.push(key)
      @publish( t, 'none', 'show', keys,  { showing:'keys' } )
    return

  make:( t, alters ) ->
    @publish( t, 'none', 'make', {}, { alters:alters, msg:'alter is a noop' } )
    return

  drop:( t ) ->
    delete  @tables[t]
    @publish( t, 'none', 'drop', {} )

    return

# Subscribe to  a table or obj with id
  onChange:(  t, id='none'   ) ->
    @onerror( t, id, 'onChange', {}, { msg:"onChange() not implemeted by Store.Memory" } )
    return

  dbTableName:( tableName ) ->
    @dbName + '/' + tableName

  tableNames:() ->
    names = []
    for own key, table of @tables
      names.push(key)
    names

  importLocalStorage:( tableNames ) ->
    for tableName in tableNames
      @tables[tableName] = JSON.parse(localStorage.getItem(@dbTableName(tableName)))
    return

  exportLocalStorage:() ->
    for own tableName, table of @tables
      dbTableName = @dbTableName(tableName)
      localStorage.removeItem( dbTableName  )
      localStorage.setItem(    dbTableName, JSON.stringify(table) )
    # console.log( 'Store.Memory.exportLocalStorage()', dbTableName )
    return

export default Local