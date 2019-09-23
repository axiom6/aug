
import Build from '../../ikw/cube/Build.js';

class Nav

  constructor:( @stream, @batch, @navs=null ) ->
    @build    =  new Build( @batch )
    @$router  =  null
    @route    =  'None' # Prac Disp
    @compKey  =  'None' # Also specifies current plane
    @pracKey  =  'None'
    @pracObj  =   null
    @dispKey  =  'None'
    @dispObj  =   null
    @pageKey  =  'Icon'
    @pageKeys = ['Icon','Dirs','Conn','Desc']
    @compass  =   ""

  pub:( change ) ->
    routeChanged = change.route? and change.route isnt @route
    @set( change )
    obj = { route:@route, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey, pageKey:@pageKey }
    obj.source = if change.source? then change.source else 'None'
    console.log('Nav.pub()', obj )
    @stream.publish( 'Nav',  obj )
    @doRoute( @route ) if routeChanged
    return

  doRoute:( route ) ->
    # console.log( 'Nav.doRoute()', route )
    if @$router?
      @$router.push( { name:route } )
    else
      console.error( 'Nav.doRoute() $router not set' )
    return

  set:( obj ) ->
    for own key,   val of obj
          @[key] = val
    return

  setPages:( array ) ->
    @pageKeys = []
    for obj in array
      @pageKeys.push( obj.key )
    return

  tap:() =>
    console.log( 'Nav.tap()' )
    return

  touch:( dr, event=null ) =>
    # return if dr is 'prev'
    if event is null then {}
    route = @dirs[@comp][dr]
    @pub( comp )
    @doRoute( route )
    # console.log('Nav.dir()', { beg:@comp, dir:dr, end:comp } )
    @comp = comp
    return

  dir:( dr, event=null ) =>
    console.log('Nav.dir()', dr )
    if event is null then {}
    @compass = dr if dr isnt 'next' and dr isnt 'prev'
    switch @route
      when 'Comp'  then @dirComp( dr )
      when 'Prac'  then @dirPrac( dr )
      when 'Disp'  then @dirDisp( dr )
      when 'Page'  then @dirPage( dr )
      else              @dirNone( dr )
    return

  dirComp:( dir ) ->
    compKey = @adjCompKey( @compKey, dir )
    @pub( {  compKey:compKey } )
    return

  dirPrac:( dir ) ->
    adj = @adjPracObj( dir )
    if adj.name isnt 'None'
      obj = {}
      obj.compKey = @compKey
      if adj.name  isnt @pracKey
         obj.pracKey = adj.name
      if adj.plane isnt @compKey
         obj.compKey = adj.plane
      @pub( obj )
    return

  dirDisp:( dir ) ->
    prc = @pracs(@compKey)[@pracKey]
    dis = prc[@dispKey]

    # if current prac.dir is dir or next or prev we will nav to adjacent prac
    if dir is dis.dir or ( dir is 'next' or dir is 'prev')
       adj = @adjPracObj(dir)
       dis = @getDispObj( adj, @adjDir(@compass) )
    else
       adj = prc
       dis = @getDispObj( prc, @compass )

    if adj.name isnt 'None'
       obj = {}
       obj.compKey  = @compKey
       obj.pracKey  = adj.name
       obj.dispKey  = dis.name
       if adj.plane isnt @compKey
          obj.compKey = adj.plane
       @pub( obj )
    return

  dirPage:( dir ) ->
    if @pageKeys.length > 0 and @pageKey isnt 'None'
      idx  = @pageKeys.indexOf(@pageKey)
      page = @pageKeys[idx++] if dir is 'east' and idx < @pageKeys.length-1
      page = @pageKeys[idx--] if dir is 'west' and idx > 1
      if page isnt @pageKey
         obj = {}
         obj.pageKey = page
         @pub( obj )
    else
      @dirNone(  dr )
    return

  dirNone:( dir ) ->
    console.error( 'Nav.dirNone unknown dir', { dir:dir, route:@route } )
    return

  adjCompKey:( compKey, dir ) ->
    adjDir = switch  dir
      when 'west'  then 'prev'
      when 'north' then 'prev'
      when 'east'  then 'next'
      when 'south' then 'next'
      when 'prev'  then 'prev'
      when 'next'  then 'next'
      else              'next'
    return if adjDir is 'next' then @build.next(compKey) else @build.prev(compKey)

  adjPracObj:( dir ) ->
    pracObj = @pracs(@compKey)[@pracKey]
    adjcObj = @build.adjacentPractice(pracObj,dir)
    # console.log( 'Nav.adjPrac()', { dir:dir, pracObj:pracObj, adjcObj:adjcObj } )
    adjcObj

  getDispObj:( pracObj, dirDisp ) ->
    dispObj = @build.getDir( pracObj, dirDisp )
    # console.log( 'Nav.getDisp()', { dir:dir, prac:prac, disp:disp } )
    dispObj

  adjDir:( dir ) ->
    switch dir
      when 'west'  then 'east'
      when 'north' then 'south'
      when 'east'  then 'west'
      when 'south' then 'north'
      else              'west'

  pracs:(  compKey ) ->
    @batch[compKey].data.pracs

  disps:(  compKey, pracKey ) ->
    @batch[compKey].data.pracs[pracKey].disps

export default Nav