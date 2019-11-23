
import Build from '../util/Build.js';

class Nav

  constructor:( @stream, @batch, @komps=null, @isMuse=false ) ->
    @navs      = @addInovToNavs( @komps )
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
    @mixins    = null
    @pages     = {}
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
    { source:@source, route:@route, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey, pageKey:@pageKey, warnMsg:@warnMsg }

  set:( msg ) ->
    msg = @tabInov(msg) # Revise tab innovate messages
    for own key,   val of msg
      @[key] = val
    return

  setMixinMethods:( methods ) ->
    @mixins = methods
    return

  doRoute:( route ) ->
    return if route is @routeLast or @isInov(route)
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
        when 'Sect' then @dirSect( direct )
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
      @doRoute( msg.route )
      msg.pageKey = @getPageKey(msg.route)
      @pub(     msg )
      @pubInov( msg, dir ) # Publish Innovate pageKey to Innovate Tabs if necessary
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

  dirSect:( dir ) ->
    msg = {}
    msg.source  = "#{'Nav.dirSect'}(#{dir})"
    talkObjs    = @mixin.compObject('Talk');
    talkObj     = talkObjs[msg.pracKey];
    msg.pracKey = if dir is 'east' then @prevKey(@pracKey,talkObj.pracKeys) else  @nextKey(@pracKey,talkObj.pracKeys)
    msg.dispKey = talkObj.pracKeys[0]
    @pub( msg )
    return

  dirPres:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirPres'}(#{dir})"
    talkObjs    = @mixin.compObject('Talk');
    talkObj     = talkObjs[msg.pracKey];
    sectObjs    = this.compObject(talkObj.sect);
    sectObj     = sectObjs[@pracKey]
    sectKeys    = sectObj.dispKeys
    msg.dispKey = if dir is 'east' then @prevKey(@dispKey,sectKeys) else  @nextKey(@dispKey,sectKeys)
    @pub( msg )
    return

  prevKey:( key, keys ) ->
    kidx = keys.indexOf(key)
    pidx = kidx - 1
    pidx = keys.length - 1 if pidx is -1
    keys(pidx)

  nextKey:( key, keys ) ->
    kidx = keys.indexOf(key)
    nidx = kidx + 1
    nidx = 0 if nidx is keys.length
    keys(nidx)

  dirPage:( dir ) ->
    msg = {}
    msg.source = "#{'Nav.dirPage'}(#{dir})"
    pageKey = if @hasActivePageDir(@route,dir) then @movePage(@pages[@route],dir) else 'None'
    if pageKey isnt 'None'
      msg.pageKey = pageKey
      @pub( msg )
    else
      @log( msg, warnMsg:"Cannot find pageKey for #{dir}" )
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

  # An important indicator of when Comps and Tabs are instanciated
  setPages:( route, pagesObj, defn=null ) ->
    # if not @pages[route]?
    @pages[route] = {}
    @pages[route].pages = pagesObj
    @pages[route].keys  = Object.keys(pagesObj)
    # console.log( 'Nav().setPages', route, @pages[route] )
    @getPageKey( route, defn )

  setPageKey:( route, pageKey ) ->
    @pageKey = pageKey if not @isInov(route)
    return             if not @hasPages(route)
    for own key, page  of @pages[route].pages
      page.show = key  is pageKey
    return

  # Jumps through hoops to set the right pageKey
  # Defn implies not to use first key as default
  getPageKey:( route, defn=null ) ->
    pageKey = 'Sign'
    if @hasPageKey(route,@pageKey)
      pageKey =  @pageKey
    else if not @hasPages(route)
      pageKey = if @isPageKey(@pageKey) then @pageKey else 'Sign'
    else
      for own  key,   page  of @pages[route].pages
        return key if page.show
      pageKey = if defn? then defn else @pages[route].keys[0] # Default is first page
    # console.trace()
    # console.log( 'Nav.getPageKey()', { pageKey:pageKey, defn:defn } )
    pageKey

  # Inov plays a roll is validating pageKey
  isPageKey:( pageKey ) ->
    pageKey? and pageKey isnt 'None' and not @isInov(pageKey)

  hasPageKey:( route, pageKey ) ->
    pageKey isnt 'None' and @hasPages(route) and @pages[route].pages[pageKey]?

  hasActivePage:( route ) ->
    return false    if    not @hasPages(route)
    for own  key,    page  of @pages[route].pages
      return true if page.show
    false

  hasPages:( route ) ->
    has = @pages[route]? and @pages[route].pages? and @pages[route].keys.length > 0
    # console.log( 'Nav.hasPages()', { route:route, has:has } )
    has

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

  isDef:(d) ->
    d isnt null and typeof(d) isnt 'undefined'

  isArray:(a) ->
    @isDef(a) and typeof(a)!="string" and a.length? and a.length > 0

  inArray:(e,a) ->
    @isArray(a) and a.indexOf(e) > -1

  # --- Innovate --- Inov in one place

  # Across the board Inov detector for compKey pageKey and route
  isInov:( e ) ->
    @inArray( e, ['Info','Data','Inov'] )

  # A hack for Innovate Tabs
  tabInov:( msg ) ->
    if msg.route? and @isInov(msg.route) and msg.source is 'Tabs'
       msg.route   = 'Comp'
       msg.compKey = msg.pageKey
       msg.pageKey = @getPageKey( 'Comp' )
    msg

  # Publish a message after dirComp() to update Innovate Tabs
  pubInov:( msg, dir ) ->
    return if not @isInov(msg.compKey)
    saveKey = @pageKey
    msh = Object.assign( {}, msg )
    @setPageKey( 'Inov', msh.compKey )
    msh.source = "#{'Nav.dirInov'}(#{dir})"
    msh.route  = 'Inov'
    msh.pageKey = msh.compKey
    @pub( msh )
    @pageKey = saveKey
    return

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
