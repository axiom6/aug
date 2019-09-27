
import Build from '../../ikw/cube/Build.js';

class Nav

  constructor:( @stream, @batch, @navs=null ) ->
    @build    =  new Build( @batch )
    @$router  =  null
    @source   =  'None'
    @route    =  'Home' # Prac Disp
    @compKey  =  'None' # Also specifies current plane
    @pracKey  =  'None'
    @pracObj  =   null
    @dispKey  =  'None'
    @dispObj  =   null
    @pageKey  =  'Icon'
    @pages    =  {}
    @compass  =   ""
    @keyEvents()

  pub:( change ) ->
    routeChanged = change.route? and change.route isnt @route
    @set( change )
    obj = { source:@source, route:@route, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey, pageKey:@pageKey }
    obj.pageKey = change.pageKey if change.pageKey? # Bandaid fix
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
      console.log( 'Nav.set() key', key, val, @[key] ) if key is 'pageKey'
    console.log('Nav.set() obj', obj )
    return

  tap:() =>
    console.log( 'Nav.tap()' )
    return

  keyEvents:() ->
    keyDir = (event) =>
      switch event.key
        when 'ArrowRight' then @dir( 'east',  event )
        when 'ArrowLeft'  then @dir( 'west',  event )
        when 'ArrowDown'  then @dir( 'south', event )
        when 'ArrowUp'    then @dir( 'north', event )
        when '+'          then @dir( 'next',  event )
        when '-'          then @dir( 'prev',  event )
    document.addEventListener('keydown', (event) => keyDir(event) )
    return

  dir:( dr, event=null ) =>
    @source = dr
    if event is null then {}
    @compass = dr if dr isnt 'next' and dr isnt 'prev'
    switch @route
      when 'Comp' then @dirComp( dr )
      when 'Prac' then @dirPrac( dr )
      when 'Disp' then @dirDisp( dr )
      else             @dirNavs( dr )
    return

  dirComp:( dir ) ->
    compKey = @adjCompKey( @compKey, dir )
    @pub( {  compKey:compKey, source:'Nav.dirComp' } )
    return

  dirPrac:( dir ) ->
    adj = @adjPracObj( dir )
    if adj.name isnt 'None'
      obj = {}
      obj.source = 'Nav.dirPrac'
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
       obj.source = 'Nav.dirDisp'
       obj.compKey  = @compKey
       obj.pracKey  = adj.name
       obj.dispKey  = dis.name
       if adj.plane isnt @compKey
          obj.compKey = adj.plane
       @pub( obj )
    return

  dirNavs:( dir ) ->
    if @pages[@route]? and dir is 'west' or dir is 'east'
      @dirPage( dir )
    else if @navs? and @navs[@route]?
      route = @navs[@route][dir]
      obj = { route:route, compKey:route, source:dir }
      obj.route   = 'Comp' if route is 'Info' or route is 'Know' or route is 'Wise'
      obj.pageKey = 'Icon' if @pageKey is 'None'
      @pub( obj )
    # else
    #  console.error( 'Nav.dirNavs() no pages or @navs not specified', { dir:dir, route:@route } )
    return

  dirPage:( dir ) ->
    pageKey = @movePage(@pages[@route],dir)
    @pub( { pageKey:pageKey, source:'Nav.dorPage' } ) if pageKey isnt 'None'
    return

  movePage:( page, dir  ) ->
    if @hasPageKey( page )
       page.pageKey  = if  dir is 'east' then page.pageKeys[0] else page.pageKeys[page.pageKeys.length-1]
    else
      idx = page.pageKeys.indexOf(page.pageKey)
      ndx = @range(idx+1) if dir is 'east'
      ndx = @range(idx-1) if dir is 'west'
      page.pageKey = page.pageKeys[ndx]
    page.pageKey

  range:( idx, max ) ->
    ndx = idx
    ndx = 0     if ndx >= max
    ndx = max-1 if ndx <  0
    ndx

  hasPageKey:( page ) ->
    not page.pageKey? or page.pageKey is 'None'

  setPages:( route, pagesObj ) ->
    @pages[route]          = {}
    @pages[route].pageKey  = 'None'
    @pages[route].pageKeys = Object.keys( pagesObj )
    return

  setPageKey:( route, pageKey ) ->
    @pages[route].pageKey = pageKey if not @pages[route]?
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
