
import Build from '../util/Build.js';

class Nav

  constructor:( @stream, @batch, @navs=null, @isMuse=false ) ->
    @build    =  new Build( @batch )
    @$router  =  null
    @source   =  'None'
    @route    =  'Home'
    @compKey  =  'Home' # Also specifies current plane
    @pracKey  =  'None'
    @dispKey  =  'None'
    @pageKey  =  'None'
    @warnMsg  =  'None'
    @pages    =  {}
    @keyEvents()

  pub:( msg ) ->
    if @msgOK(msg)
      lastRoute = @route
      obj = @pubObj( msg )
      console.log('Nav.pub()', obj )
      @stream.publish( 'Nav',  obj )
      @doRoute( msg.route ) if msg.route? and msg.route isnt lastRoute
    return

  msgOK:( msg ) ->
    ok = true
    ok = false if msg.compKey? and not @hasCompKey(msg.compKey)
    ok

  hasCompKey:( compKey, dir=null ) ->
    has = compKey? and @navs? and @navs[compKey]?
    if dir?   and   has   then    @navs[compKey][dir]? else has

  pubObj:( msg ) ->
    @set(  msg )
    @warnMsg = 'None' if not msg.warnMsg?
    @source  = 'None' if not msg.source?
    { source:@source, route:@route, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey, pageKey:@pageKey, warnMsg:@warnMsg }

  doRoute:( route ) ->
    if route? and route isnt 'None'
      if @$router?
         @$router.push( { name:route } )
      else
         console.error( 'Nav.doRoute() $router not set' )
      @route = route
    else
      console.error( 'Nav.doRoute() undefined route' )
    return

  set:( msg ) ->
    for own key,   val of msg
      @[key] = val
    return

  log:( source, warnMsg ) ->
    console.log( 'Nav.log()', @pubObj( { source:source, warnMsg:warnMsg } ) )

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
    if @isMuse and ( direct is 'east'  or direct is 'west' )
       @dirPage( direct )
    else
      switch @route
        when 'Comp' then @dirComp( direct )
        when 'Prac' then @dirPrac( direct )
        when 'Disp' then @dirDisp( direct )
        else             @dirNavs( direct )
    return

  dirComp:( dir ) ->
    if @hasCompKey(@compKey,dir)
      compKey =   @navs[@compKey][dir]
      route   =  @toRoute( compKey )
      @pub( {  route:route, compKey:compKey, source:"#{'Nav.dirComp'}(#{dir})" } )
    else
    return

  toRoute:( compKey ) ->
    if compKey is 'Info' or compKey is 'Know' or compKey is 'Wise' then 'Comp' else compKey

  dirPrac:( dir ) ->
    adj = @adjPracObj( dir )
    if adj.name isnt 'None'
      obj = {}
      obj.source = "#{'Nav.dirPrac'}(#{dir})"
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
    ddr = dis.dir
    dis = @getDispObj( adj, ddr )
    if adj.name isnt 'None'
       obj = {}
       obj.source = "#{'Nav.dirDisp'}(#{dir})"
       obj.compKey  = adj.plane
       obj.pracKey  = adj.name
       obj.dispKey  = dis.name
       @pub( obj )
    return

  dirNavs:( dir ) ->
    if @hasPages(@route) and dir is 'west' or dir is 'east'
       @dirPage( dir )
    else if @hasCompKey(@compKey, dir)
      compKey =   @navs[@compKey][dir]
      route   = @toRoute(compKey )
      msg = { route:route, compKey:compKey, source:"#{'Nav.dirNavs'}(#{dir})" }
      @pub( msg )
    else
      @log( "#{'Nav.dirNavs'}(#{dir})", warnMsg:'Cannot find pageKey or missing @navs' )
    return

  dirPage:( dir ) ->
    pageKey = if @hasPages(@route) then @movePage(@pages[@route],dir) else 'None'
    if pageKey isnt 'None'
      @pub(   { source:"#{'Nav.dirPage'}(#{dir})", pageKey:pageKey } )
    else
      @log( "#{'Nav.dirPage'}(#{dir})", warnMsg:'Cannot find pageKey'  )
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

  adjPracObj:( dir ) ->
    pracObj = @pracs(@compKey)[@pracKey]
    adjcObj = @build.adjacentPractice(pracObj,dir)
    adjcObj

  getDispObj:( pracObj, dirDisp ) ->
    dispObj = @build.getDir( pracObj, dirDisp )
    dispObj

  pracs:(  compKey ) ->
    @batch[compKey].data.pracs

  disps:(  compKey, pracKey ) ->
    @batch[compKey].data.pracs[pracKey].disps

export default Nav
