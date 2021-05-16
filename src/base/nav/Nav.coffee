
import Build from '../util/Build.js'
#mport { NavigationFailureType, isNavigationFailure } from 'vue-router'

class Nav

  constructor:( @stream, @batch,  @routes, @routeNames, @komps, @isMuse=false ) ->
    @dirs       = { west:true, east:true, north:true, south:true, prev:true, next:true }
    @navs       = @addInovToNavs( @komps )
    @touch      =  null
    @build      =  new Build( @batch )
    @router     =  null
    @source     = 'None'
    @route      = 'Home'
    @routeLast  = 'None'
    @choice     = 'None'
    @checked    = false
    @level      = 'None' # set to either Comp Prac or Disp by Tocs.vue
    @compKey    = 'Home' # Also specifies current plane
    @pracKey    = 'None'
    @dispKey    = 'None'
    @pageKey    = 'None'
    @inovKey    = 'None' # Only used by Tabs to Tocs
    @pages      = {}
    @museLevels = ['Comp','Prac','Disp']
    @museComps  = ['Info','Know','Wise','Prin','Cube']
    @museInovs  = ['Info','Know','Wise','Soft','Data','Scie','Math']
    @keyEvents()
    @routeChange()

  pub:( msg ) ->
    if @msgOK(msg)
      obj = @toObj( msg )
      console.log('Nav.pub()', obj )
      @doRoute( obj ) # Creates route if necessary to publish to
      @stream.publish( 'Nav',  obj )
    return

  msgOK:( msg ) ->
    ok = true
    ok = false if @isMuse and msg.compKey? and not @hasCompKey(msg.compKey)
    ok

  toObj:( msg ) ->
    @set( msg )
    @source   = 'None' if not msg.source?
    pagesName = if @inArray(@compKey,@museComps) then 'Comp'                            else @compKey
    @pageKey  = if @inArray(@compKey,@museComps) and @pageKey isnt 'None' then @pageKey else @getPageKey(pagesName,true)
    { source:@source, route:@route, level:@level, compKey:@compKey, inovKey:@inovKey, pageKey:@pageKey,
    pracKey:@pracKey, dispKey:@dispKey, choice:@choice, checked:@checked }

  set:( msg ) ->
    for own key, val of msg
      @[key] = val
    return

  doRoute:( obj ) ->
    # console.log( 'Nav.doRoute()', { objRoute:obj.route, routeLast:@routeLast})
    return if obj.source is 'Tabs' or obj.route is 'None' or obj.route is @routeLast # or @isInov(obj.route)
    if obj.route? and @inArray( obj.route, @routeNames )
      if @router?
        @router.push( { name:obj.route } )
          .then()
            # console.log( 'Nav.doRoute() success', { route:obj.route } ) )
          .catch( (failure) =>
            console.log( 'Nav.doRoute() failure', { route:obj.route, failure:failure } ) )
      else
        console.error( 'Nav.doRoute() router not set' )
      @routeLast = obj.route
      @route     = obj.route
    else
      console.error( 'Nav.doRoute() undefined or unnamed route', obj.route )
    return

  routeOK:( path ) ->
    for route in @routeNames when path is route
      return true
    false

  # Not working
  routeChange:() ->
    window.addEventListener( 'popstate', (event) =>
      console.log( 'Nav.routeChange', window.location.pathname, event )
      if @routeOK( window.location.pathname )
         @doRoute( window.location.pathname ) )
    return

  hasCompKey:( compKey, dir=null ) ->
    has = compKey? and @navs? and @navs[compKey]?
    if dir? and has then @navs[compKey][dir]? else has

  adjCompKey:(      compKey, dir ) ->
    if @hasCompKey( compKey, dir ) then  @navs[compKey][dir] else 'None'

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

  dir:( direct ) =>
    @source = direct
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
      msg.compKey = @adjCompKey( @compKey,dir )
      msg.route   = @toRoute( msg.compKey )
      @doRoute( { route:msg.route } )
      @pub( msg )
    else if @hasActivePageDir( @route, dir )
      @dirPage( dir )
    else
      @log( msg, warnMsg:"Missing adjacent component for #{dir} #{@compKey}" )
    return

  # Map compKeys to a single Comp route for Muse
  toRoute:( compKey ) ->
    if @isMuse and @inArray(compKey,@museComps) then 'Comp' else compKey

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
      @log( msg, "Missing adjacent practice for #{dir} #{@compKey} #{@pracKey}" )
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
       @log( msg, "Missing adjacent displine for #{dir} #{@compKey} #{@pracKey}" )
    return

  prevKey:( key, keys ) ->
    kidx = keys.indexOf(key)
    pidx = kidx - 1
    pidx = keys.length - 1 if pidx is -1
    keys[pidx]

  nextKey:( key, keys ) ->
    kidx = keys.indexOf(key)
    nidx = kidx + 1
    nidx = 0 if nidx is keys.length
    keys[nidx]

  # Special case
  nextPage:( key, keys, peys ) ->
    if key isnt keys[keys.length-1]
      @nextKey( key, keys )
    else
      @dispKey = @nextKey( @dispKey, peys )
      'None'

  dirPage:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirPage'}(#{dir})"
    pageKey = if @hasActivePageDir(@route,dir) then @movePage(@pages[@route],dir) else 'None'
    if pageKey isnt 'None'
      @setPageKey( @route, pageKey )
      # @pub( msg )
    else
      @log( msg, warnMsg:"Cannot find pageKey for #{dir}" )
    return

  movePage:( page, dir  ) ->
    pageKey  = @getPageKey( @route )
    len      = page.keys.length
    if pageKey isnt 'None'
      idx = page.keys.indexOf(pageKey)
      ndx = @range(idx+1,len) if dir is 'east'
      ndx = @range(idx-1,len) if dir is 'west'
      pageKey = page.keys[ndx]
    else
      pageKey = if dir is 'east' then page.keys[0] else page.keys[len-1]
    pageKey

  range:( idx, len ) ->
    ndx = idx
    ndx = 0     if ndx >= len
    ndx = len-1 if ndx <  0
    ndx

  isShow:( pagesName, pageKey ) ->
    pageNav = @getPageKey( pagesName, false )
    # pageNav = if pageNav is 'None' then @getPageDef(@pages[@pagesName].pages) else pageNav
    # console.log( 'Nav.isShow()', { pageKey:pageKey, pageNav:pageNav, equals:pageKey===pageNav } );
    pageKey is pageNav

  # An important indicator of when Comps and Tabs are instanciated
  setPages:( pagesName, pages ) ->
    return if @hasPages(pagesName,false )
    @pages[pagesName]       = {}
    @pages[pagesName].pages = pages
    @pages[pagesName].keys  = Object.keys(pages)
    #pageKey                = @getPageKey( pagesName, false ) # Check
    # console.log( 'Nav.setPages()', { pagesName:pagesName, has:@hasPages(pagesName), pages:@pages[pagesName] } )
    return

  setPageKey:( pagesName, pageKey ) ->
    if not @hasPages(pagesName)
      # console.log( 'Nav.setPageKey()', { pagesName:pagesName, pageKey:pageKey, has:@hasPages(pagesName) } )
      return
    for own key, page  of @pages[pagesName].pages
      page.show = key  is pageKey
    return

  getPageKey:( pagesName, log=false ) ->
    return 'None' if not  @hasPages(pagesName,log)
    for own  key,   page  of @pages[pagesName].pages
      return key if page.show
    'None'

  getPageDef:( pages ) ->
    for own  key,   page  of pages
      return key if page.show
    'None'

  hasPage:( pages, pageKey ) ->
    # console.log( 'Nav.hasPage()', { pageKey:pageKey, pages:pages, has:pages[pageKey]? } );
    pages[pageKey]?
    ###
      for own key, page of pages
        return true if key is pageKey
      false
    ###

  hasPages:( pagesName, log=false ) ->
    has = @isDef(@pages[pagesName]) and @isDef(@pages[pagesName].pages) and @pages[pagesName].keys.length > 0
    console.log( 'Nav.hasPages()', { pagesName:pagesName, has:has, pages:@pages } ) if not has and log
    has

  hasPageKey:( pagesName, pageKey ) ->
    @isDef(pageKey) and @hasPages(pagesName) and @pages[pagesName].pages[pageKey]?

  hasActivePage:( pagesName ) ->
    return false    if    not @hasPages(pagesName)
    for own  key,    page  of @pages[pagesName].pages
      return true if page.show
    false

  hasActivePageDir:( pagesName, dir ) ->
     @hasActivePage( pagesName ) and ( dir is 'west' or dir is 'east' )

  isMyNav:( obj, level, routes=null, checkPageKey=false ) ->
    if not routes?
      obj.level is level
    else
      if checkPageKey
        obj.level is level and @inArray(obj.route,routes) and @hasPageKey(routes[0],obj.pageKey)
      else
        obj.level is level and @inArray(obj.route,routes)

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

  isDef:(d) ->
    d isnt null and typeof(d) isnt 'undefined' and d isnt 'None'

  isStr:(s) ->
    @isDef(s) and typeof (s) == "string" and s.length > 0

  isArray:(a) ->
    @isDef(a) and typeof(a)!="string" and a.length? and a.length > 0

  inArray:(e,a) ->
    @isArray(a) and a.indexOf(e) > -1

  # --- Innovate --- Inov in one place

  # Across the board Inov detector for compKey pageKey and route
  isInov:( compKey ) ->
    @inArray( compKey, @museInovs )

  addInovToNavs:( komps ) ->
    return komps? if not @isMuse
    navs = Object.assign( {}, komps )
    #avs = @insInov( navs, @museInovs )
    navs

  insInov:( navs, prev, inov, next ) ->
    navs[prev].south = inov if navs[prev]?
    navs[prev].next  = inov if navs[next]?
    navs[inov] = { north:prev, prev:prev, south:next, next:next }
    navs[next].north = inov
    navs[next].prev  = inov
    navs

export default Nav

###
    prevImg:() ->
    if @imgsIdx > 0 then @imgsIdx-1 else @imgsNum-1

  nextImg:() ->
    if @imgsIdx < @imgsNum-1 then @imgsIdx+1 else 0
###
