
import Build from '../util/Build.js';

class Nav

  constructor:( @stream, @batch, @navs=null, @isMuse=false ) ->
    @build     =  new Build( @batch )
    @$router   =  null
    @source    = 'None'
    @route     = 'Home'
    @routeLast = 'None'
    @compKey   = 'Home' # Also specifies current plane
    @pracKey   = 'None'
    @dispKey   = 'None'
    @pageKey   = 'None'
    @warnMsg   = 'None'
    @pages     = {}
    @setPagesCallbacks = {}
    @keyEvents()

  pub:( msg ) ->
    if @msgOK(msg)
      obj = @toObj( msg )
      @doRoute( obj.route ) # Creates route if necessary to publish to
      console.log('Nav.pub()', obj )
      @stream.publish( 'Nav',  obj )
    return

  msgOK:( msg ) ->
    ok = true
    ok = false if msg.compKey? and not @hasCompKey(msg.compKey)
    ok

  toObj:( msg ) ->
    @set( @reviseMsg(msg) )
    @warnMsg = 'None' if not msg.warnMsg?
    @source  = 'None' if not msg.source?
    { source:@source, route:@route, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey, pageKey:@pageKey, warnMsg:@warnMsg }

  # A hack for Innovate Tabs
  reviseMsg:( msg ) ->
    if msg.route? and msg.route is 'Inov'
       msg.route   = 'Comp'
       msg.compKey = msg.pageKey
       msg.pageKey = @getPageKey( 'Comp' )
    msg

  set:( msg ) ->
    for own key,   val of msg
      @[key] = val
    return

  doRoute:( route ) ->
    return if route is @routeLast
    if route? and route isnt 'None'
      if @$router?
         @$router.push( { name:route } )
      else
         console.error( 'Nav.doRoute() $router not set' )
      @routeLast = @route
      @route     =  route
    else
      console.error( 'Nav.doRoute() undefined route' )
    return

  hasCompKey:( compKey, dir=null ) ->
    has = compKey? and @navs? and @navs[compKey]?
    if dir?   and   has   then    @navs[compKey][dir]? else has

  log:( msg, warnMsg ) ->
    msg.warnMsg = warnMsg
    console.log( 'Nav.log()', @toObj( msg ) )

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
    if @isMuse
      switch @route
        when 'Comp' then @dirComp( direct )
        when 'Prac' then @dirPrac( direct )
        when 'Disp' then @dirDisp( direct )
        else             @dirComp( direct )
    else
      @dirComp( direct )
    return

  dirComp:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirComp'}(#{dir})"
    if @hasCompKey( @compKey, dir )
      msg.compKey = @navs[@compKey][dir]
      msg.route   = @toRoute( msg.compKey )
      @doRoute( msg.route )
      msg.pageKey = if @pageKey isnt 'None' and @pageKey isnt 'Info' then @pageKey else 'Sign'
      #sg.pageKey = if @hasPageKey(msg.route,@pageKey)               then @pageKey else @getPageKey(msg.route)
      @pub( msg )
    else if @hasActivePageDir( @route, dir )
      @dirPage( dir )
    else
      @log( msg, warnMsg:'Missing component' )
    return

  dirComp2:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirComp'}(#{dir})"
    if @hasCompKey( @compKey, dir )
      msg.compKey = @navs[@compKey][dir]
      msg.route   = @toRoute( msg.compKey )
      callback = () =>
        msg.pageKey = if @hasPageKey(msg.route,@pageKey) then @pageKey else @getPageKey(msg.route)
        @pub( msg )
      if @hasPages()
        @doRoute( msg.route )
        callback()
      else
        @setPagesCallbacks[msg.route] = callback
        @doRoute( msg.route )
    else if @hasActivePageDir( @route, dir )
      @dirPage( dir )
    else
      @log( msg, warnMsg:'Missing component' )
    return

  toRoute:( compKey ) ->
    if compKey is 'Info' or compKey is 'Know' or compKey is 'Wise' then 'Comp' else compKey

  dirPrac:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirPrac'}(#{dir})"
    msg.compKey = @compKey
    adj = @adjPracObj( dir )
    if adj.name isnt 'None'
      if adj.name  isnt @pracKey
         msg.pracKey = adj.name
      if adj.plane isnt @compKey
         msg.compKey = adj.plane
      @pub( msg )
    else
      @log( msg, "Missing practice @adjPracObj(dir)" )
    return

  dirDisp:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirDisp'}(#{dir})"
    prc = @pracs(@compKey)[@pracKey]
    dis = prc[@dispKey]
    adj = @adjPracObj(dir)
    ddr = dis.dir
    dis = @getDispObj( adj, ddr )
    if adj.name isnt 'None'
       msg.compKey  = adj.plane
       msg.pracKey  = adj.name
       msg.dispKey  = dis.name
       @pub( msg )
    else
       @log( msg, "Missing displine @adjPracObj(dir)" )
    return

  ###
  dirNavs:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirNavs'}(#{dir})"
    if @hasActivePageDir(@route,dir)
       @dirPage( dir )
    else if @hasCompKey(@compKey, dir)
      msg.compKey = @navs[@compKey][dir]
      msg.route   = @toRoute(msg.compKey )
      @pub( msg )
    else
      @log( msg, warnMsg:'Missing compKey or @navs' )
    return
  ###

  dirPage:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirPage'}(#{dir})"
    pageKey = if @hasActivePageDir(@route,dir) then @movePage(@pages[@route],dir) else 'None'
    if pageKey isnt 'None'
      msg.pageKey = pageKey
      @pub( msg )
    else
      @log( msg, warnMsg:'Cannot find pageKey'  )
    return

  movePage:( page, dir  ) ->
    pageKey = @getPageKey( @route )
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
    console.log( 'Nav().setPages', route, @pages[route] )
    if @setPagesCallbacks[route]?
       @setPagesCallbacks[route]()
       @setPagesCallbacks[route] = null # Only call once
    @getPageKey( route )

  setPageKey:( route, pageKey ) ->
    @pageKey = pageKey if route isnt 'Inov'
    return if  not        @hasPages(route)
    for own key, page  of @pages[route].pages
      page.show = key is pageKey
    return

  getPageKey:( route ) ->
    return @pageKey if @hasPageKey(route,@pageKey)
    return 'None'   if not @hasPages(route)
    for own  key,   page  of @pages[route].pages
      return key if page.show
    @pages[route].keys[0] # Default is first page

  hasPageKey:( route, pageKey ) ->
    pageKey isnt 'None' and @hasPages(route) and @pages[route].pages[pageKey]?

  hasActivePage:( route ) ->
    return false    if    not @hasPages(route)
    for own  key,    page  of @pages[route].pages
      return true if page.show
    false

  hasPages:( route ) ->
    @pages[route]? and @pages[route].pages? and @pages[route].keys.length > 0

  hasActivePageDir:( route, dir ) ->
     @hasActivePage( route ) and ( dir is 'west' or dir is 'east' )

  isMyNav:( obj, route ) ->
    obj.route is route # and @hasActivePage(route)

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
