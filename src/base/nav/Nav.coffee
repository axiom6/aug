
import Build from '../util/Build.js';

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
    @pageKey  =  'None' # Used to maintain continuity through dir tranvesals with Prac
    @pages    =  {}
    @dirTabs  = false
    @keyEvents()

  pub:( msg ) ->
    reset = @resetRoute( msg )
    @set( msg )
    obj = { source:@source, route:@route, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey, pageKey:@pageKey }
    obj.source = if msg.source? then msg.source else 'None'
    console.log('Nav.pub()', obj )
    @stream.publish( 'Nav',  obj )
    @doRoute( reset.route ) if reset.changed
    return
    
  resetRoute:( msg ) ->
    reset         = {}
    reset.route   = if msg['poute']? then msg['poute'] else if msg.route? then msg.route else @route
    reset.changed = ( msg.route? and msg.route isnt @route ) or msg['poute']?
    # console.log( 'Nav.resetRoute()', { msg:msg, prev:@route, next:reset.route, changed:reset.changed })
    @route        = if msg.route? then msg.route else @route
    reset

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

  dir:( direct, event=null ) =>
    @source = direct
    if event is null then {}
    if @dirTabs and ( direct is 'east'  or direct is 'west' )
       @dirPage( direct )
    else
      switch @route
        when 'Comp' then @dirComp( direct )
        when 'Prac' then @dirPrac( direct )
        when 'Disp' then @dirDisp( direct )
        else             @dirNavs( direct )
    return

  dirComp:( dir ) ->
    compKey = @adjCompKey( @compKey, dir )
    route   =  if compKey is 'Home' then 'Home' else 'Comp'
    route   =  if compKey is 'Prin' then 'Prin' else route
    @pub( {  route:route, compKey:compKey, source:'Nav.dirComp' } )
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
    adj = @adjPracObj(dir)
    ddr = dis.dir # if dir is 'next' or dir is 'prev' then dis.dir else @adjDir(dir)
    dis = @getDispObj( adj, ddr )

    if adj.name isnt 'None'
       obj = {}
       obj.source = 'Nav.dirDisp'
       obj.compKey  = adj.plane
       obj.pracKey  = adj.name
       obj.dispKey  = dis.name
       @pub( obj )
    return

  dirNavs:( dir ) ->
    if @hasPages(@route) and dir is 'west' or dir is 'east'
       @dirPage( dir )
    else if @navs? and @navs[@route]?
      route = @navs[@route][dir]
      obj = { route:route, compKey:route, source:dir }
      obj.route   = 'Comp' if route is 'Info' or route is 'Know' or route is 'Wise'
      @pub( obj )
    # else
    #  console.error( 'Nav.dirNavs() no pages or @navs not specified', { dir:dir, route:@route } )
    return

  dirPage:( dir ) ->
    pageKey = if @hasPages(@route) then @movePage(@pages[@route],dir) else 'None'
    @pub( { source:'Nav.dirPage' } ) if pageKey isnt 'None'
    return

  movePage:( page, dir  ) ->
    pageKey = @getPageKey( @route, 'None' )
    len     = page.keys.length
    if pageKey isnt 'None'
      idx = page.keys.indexOf(pageKey)
      ndx = @range(idx+1,len) if dir is 'east'
      ndx = @range(idx-1,len) if dir is 'west'
      pageKey = page.keys[ndx]
    else
      pageKey = if dir is 'east' then page.keys[0] else page.keys[len-1]
    @setPageKey( @route, pageKey )
    pageKey

  range:( idx, len ) ->
    ndx = idx
    ndx = 0     if ndx >= len
    ndx = len-1 if ndx <  0
    ndx

  setPages:( route, pagesObj ) ->
    @pages[route] = {}
    @pages[route].pages = pagesObj
    @pages[route].keys  = Object.keys(pagesObj)
    @getPageKey( route, 'None' )

  setPageKey:( route, pageKey ) ->
    @pageKey = pageKey
    return if  not        @hasPages(route)
    for own key, page  of @pages[route].pages
      page.show = key is pageKey
    return

  getPageKey:( route, defn ) ->
    return @pageKey if     @usePageAtt(route)
    return 'None'   if   not @hasPages(route)
    for own  key,   page  of @pages[route].pages
      return key if page.show
    return defn

  hasPageKey:( route ) ->
    return false    if    not @hasPages(route)
    for own  key,    page  of @pages[route].pages
      return true if page.show
    false

  usePageAtt:( route ) ->
    @pageKey isnt 'None' and @hasPages(route) and @pages[route].pages[@pageKey]? and
      ( route is 'Prin'or route is 'Comp' or route is 'Prac' or route is 'Disp' )

  hasPages:( route ) ->
    @pages[route]? and @pages[route].pages? and @pages[route].keys.length > 0

  isMyNav:( obj, route ) ->
    obj.route is route and @hasPageKey(route)

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
      else               dir

  pracs:(  compKey ) ->
    @batch[compKey].data.pracs

  disps:(  compKey, pracKey ) ->
    @batch[compKey].data.pracs[pracKey].disps

export default Nav
