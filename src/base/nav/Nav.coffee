
import Build from '../util/Build.js'

class Nav

  constructor:( @stream, @batch, @komps=null, @isMuse=false ) ->
    @navs       = @addInovToNavs( @komps )
    @build      =  new Build( @batch )
    @$router    =  null
    @source     = 'None'
    @route      = 'Home'
    @routeLast  = 'None'
    @compKey    = 'Home' # Also specifies current plane
    @pracKey    = 'None'
    @dispKey    = 'None'
    @warnMsg    = 'None'
    @inovKey    = 'None' # Only used by Tabs to Tocs
    @presKey    = 'None'
    @imgsIdx    = 0
    @imgsNum    = 0
    @mix        = null
    @pages      = {}
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
    ok = false if @isMuse and msg.compKey? and not @hasCompKey(msg.compKey)
    ok

  toObj:( msg ) ->
    @set( msg )
    @warnMsg = 'None' if not msg.warnMsg?
    @source  = 'None' if not msg.source?
    @inovKey = if @mix().isDef(msg.inovKey) then msg.inovKey else @compKey
    { source:@source, route:@route, compKey:@compKey, inovKey:@inovKey, pracKey:@pracKey,
    dispKey:@dispKey,warnMsg:@warnMsg, imgsIdx:@imgsIdx }

  set:( msg ) ->
    for own key, val of msg
      @[key] = val
    return

  setMix:( methods ) ->
    @mix = methods.mix # mix
    return

  doRoute:( route ) ->
    return if route is @routeLast or @isInov(route)
    if route? and route isnt 'None'
      @dirsNavd(  route )
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

  dir:( direct, event=null ) =>
    @source = direct
    if event is null then {}
    if @isMuse
      switch @route
        when 'Comp' then @dirComp( direct )
        when 'Prac' then @dirPrac( direct )
        when 'Disp' then @dirDisp( direct )
        when 'Talk' then @dirTalk( direct )
        else             @dirComp( direct )
    else
      @dirComp( direct, dirs )
    @dirsNavd( @route )
    return

  dirComp:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirComp'}(#{dir})"
    if @hasCompKey( @compKey, dir )
      msg.compKey = @adjCompKey( @compKey,dir )
      msg.route   = @toRoute( msg.compKey )
      @doRoute( msg.route )
      @pub( msg )
    else if @hasActivePageDir( @route, dir )
      @dirPage( dir )
    else
      @log( msg, warnMsg:"Missing adjacent component for #{dir} #{@compKey}" )
    return

  # Map compKeys to a single Comp route for Muse
  toRoute:( compKey ) ->
    if @isMuse and @inArray(compKey,['Info','Data','Know','Wise']) then 'Comp' else compKey

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

  dirTalk:( dir ) ->
    dirs = @dirsNavdTalk()
    return if @pracKey is 'None' or not dirs[dir]
    msg         = {}
    msg.source  = "#{'Nav.dirTalk'}(#{dir})"
    sectObj     = @mix().sectObject( @pracKey, @dispKey )
    hasChildren = @mix().isArray(sectObj.keys)
    @dispKey    = sectObj.name
    @imgsNum    = 0 if not sectObj['imgs']
    if @imgsNum > 0 and ( dir is 'west' or dir is 'east' )
      @imgsIdx = @prevImg() if dir is 'west'
      @imgsIdx = @nextImg() if dir is 'east'
    else if @isPageTalk( sectObj, hasChildren, @presKey )
       @presKey = switch dir
         when 'west','north','prev' then @prevKey(  @presKey, sectObj.keys )
         when 'east','south'        then @nextKey(  @presKey, sectObj.keys )
         when 'next             '   then @nextPage( @presKey, sectObj.keys, sectObj.peys ) # Special case
         else 'None'
    else
       @dispKey = switch dir
         when 'west'  then @prevKey(  @dispKey, sectObj.peys )
         when 'east'  then @nextKey(  @dispKey, sectObj.peys )
         when 'north' then @presKey = 'None';          @dispKey
         when 'south' then @presKey = sectObj.keys[0]; @dispKey
         when 'prev'  then @prevKey(  @dispKey, sectObj.peys )
         when 'next'  then @nextDisp( @dispKey, sectObj.keys, sectObj.peys )  # Special case
         else              'None'
    # console.log( 'Nav.dirTalk()', { dir:dir, pracKey:@pracKey, dispKey:@dispKey, presKey:@presKey, imgsIdx:@imgsIdx,
    # sectObj:sectObj, hasChildren:hasChildren } )
    msg.dispKey = @dispKey
    msg.presKey = @presKey
    msg.imgsIdx = @imgsIdx
    @pub( msg )
    return

  prevImg:() ->
    if @imgsIdx > 0 then @imgsIdx-1 else @imgsNum-1

  nextImg:() ->
    if @imgsIdx < @imgsNum-1 then @imgsIdx+1 else 0

  isPageTalk:( sectObj, hasChildren, presKey ) ->
    @ and hasChildren and sectObj[presKey]?

  dirsNavd:( route ) ->
    dirs = @dirsNavdTalk(route)
    @stream.publish( 'Navd',  dirs )
    return

  dirsNavdTalk:( route ) ->
    dirs = { west:true, east:true, north:true, south:true, prev:true, next:true }
    return dirs if route isnt 'Talk' or @pracKey is 'None'
    sectObj     = @mix().sectObject( @pracKey, @dispKey )
    hasChildren = @mix().isArray(sectObj.keys)
    if @isPageTalk( sectObj, hasChildren, @presKey )
      @dirsNavdTalkPage( dirs, sectObj )
    else
      @dirsNavdTalkSect( dirs, sectObj, hasChildren )
    dirs

  dirsNavdTalkSect:( dirs, sectObj, hasChildren ) ->
    dirs.west   = sectObj.name isnt sectObj.peys[0]
    dirs.prev   = dirs.west
    dirs.east   = sectObj.name isnt sectObj.peys[sectObj.peys.length-1]
    dirs.next   = dirs.east
    dirs.north  = false
    dirs.south  = hasChildren
    return

  dirsNavdTalkPage:( dirs, sectObj ) ->
    pageObj     = @mix().pageObject(  sectObj, @presKey )
    dirs.west   = pageObj.name isnt sectObj.keys[0]
    dirs.prev   = dirs.west
    dirs.east   = pageObj.name isnt sectObj.keys[sectObj.keys.length-1]
    dirs.next   = true # dirs.east
    dirs.north  = true
    dirs.south  = false
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

  # Special case
  nextDisp:( dispKey, keys, peys ) ->
    if keys[0]?
      @presKey = keys[0]
      dispKey
    else
      @presKey = 'None'
      @nextKey( dispKey, peys )

  dirPage:( dir ) ->
    pagesKey = @getPagesComp( @route, @compKey )
    msg = {}
    msg.source = "#{'Nav.dirPage'}(#{dir})"
    pageKey = if @hasActivePageDir(@route,dir) then @movePage(@pages[pagesKey],dir) else 'None'
    if pageKey isnt 'None'
      @setPageKey( pagesKey, pageKey )
      # @pub( msg )
    else
      @log( msg, warnMsg:"Cannot find pageKey for #{dir}" )
    return

  movePage:( page, dir  ) ->
    pagesKey = @getPagesComp( @route, @compKey )
    pageKey  = @getPageKey( pagesKey )
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

  # An important indicator of when Comps and Tabs are instanciated
  setPages:( pagesComp, pagesObj ) ->
    @pages[pagesComp] = {}
    @pages[pagesComp].pages = pagesObj
    @pages[pagesComp].keys  = Object.keys(pagesObj)
    return

  setPageKey:( pagesComp, pageKey ) ->
    if not @hasPages(pagesComp)
      console.log( 'Nav.setPageKey()', { pagesComp:pagesComp, pageKey:pageKey, has:@hasPages(pagesComp) } )
      return
    for own key, page  of @pages[pagesComp].pages
      page.show = key  is pageKey
    return

  # pagesKeys is usually a route except for Comp which uses getPagesComp:( route, compKey )
  getPageKey:( pagesKey ) ->
    return 'None' if not @hasPages(pagesKey)
    for own  key,   page  of @pages[pagesKey].pages
      return key if page.show
    pageKey = @pages[pagesKey].keys[0] # Default is first page
    @pages[pagesKey].pages[pageKey].show = true
    # console.log( 'Nav.getPageKey()', { pagesKey:pagesKey, pageKey:pageKey, has:@hasPages(pagesKey) } )
    pageKey

  getPagesComp:( route, compKey ) ->
    pagesKey = route
    if route is 'Comp'
      pagesKey = 'Pane'
    else if route is 'Inov'
      pagesKey = compKey
    pagesKey

  hasPages:( pagesKey ) ->
    has = @isDef(@pages[pagesKey]) and @isDef(@pages[pagesKey].pages) and @pages[pagesKey].keys.length > 0
    console.log( 'Nav.hasPages()', { pagesKey:pagesKey, has:has, pages:@pages } ) if not has
    has

  hasPageKey:( pagesKey, pageKey ) ->
    @isDef(pageKey) and @hasPages(pagesKey) and @pages[pagesKey].pages[pageKey]?

  hasActivePage:( pagesKey ) ->
    return false    if    not @hasPages(pagesKey)
    for own  key,    page  of @pages[pagesKey].pages
      return true if page.show
    false

  hasActivePageDir:( pagesKey, dir ) ->
     @hasActivePage( pagesKey ) and ( dir is 'west' or dir is 'east' )

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

  isDef:(d) ->
    d isnt null and typeof(d) isnt 'undefined' and d isnt 'None'

  isArray:(a) ->
    @isDef(a) and typeof(a)!="string" and a.length? and a.length > 0

  inArray:(e,a) ->
    @isArray(a) and a.indexOf(e) > -1

  # --- Innovate --- Inov in one place

  # Across the board Inov detector for compKey pageKey and route
  isInov:( route ) ->
    @inArray( route, ['Inov','Info','Know','Wise'] )

  addInovToNavs:( komps ) ->
    return komps? if not @isMuse
    navs = Object.assign( {}, komps )
    navs = @insInov( navs, 'Info', 'Data', 'Know' )
    navs

  insInov:( navs, prev, inov, next ) ->
    navs[prev].south = inov
    navs[prev].next  = inov
    navs[inov] = { north:prev, prev:prev, south:next, next:next }
    navs[next].north = inov
    navs[next].prev  = inov
    navs

export default Nav
