
import Build from '../util/Build.js'
#mport { NavigationFailureType, isNavigationFailure } from 'vue-router'

class Nav

  constructor:( @stream, @batch, @komps, @pages, @isMuse=false ) ->
    @dirs       = { west:true, east:true, north:true, south:true, prev:true, next:true }
    @navs       = @addInovToNavs( @komps )
    @touch      =  null
    @build      =  new Build( @batch )
    @source     = 'None'
    @level      = 'None' # set to either Comp Prac or Disp by Tocs.vue
    @compKey    = 'Home' # Also specifies current plane
    @pracKey    = 'None'
    @dispKey    = 'None'
    @pageKey    = 'None'
    @inovKey    = 'None' # Only used by Tabs to Tocs.vue and Comp.vue
    @choice     = 'None'
    @checked    = false
    @warnMsg    = 'None'
    @debug      =  false
    @replays    = []
    @url        = 'None'
    @tabs       = {}
    @museLevels = ['Comp','Prac','Disp']
    @museComps  = ['Home','Prin','Info','Know','Wise','Cube','Test']
    @museInovs  = ['Info','Know','Wise','Soft','Data','Scie','Math']
    @musePlanes = ['Info','Know','Wise']
    @keyEvents()
    #urlListen()

  pub:( msg, isReplay=false ) ->
    obj  = @toObj( msg, isReplay )
    @url = @toUrl( obj )
    console.log('Nav.pub()', obj )
    @replays.push(obj) if not isReplay and obj.compKey isnt 'Test'
    @stream.publish( 'Nav',  obj )
    return

  toObj:( msg, isReplay ) ->
    @set( msg, isReplay )
    @source   = 'None' if not msg.source?
    @pracKey  = 'None' if @level is   'Comp'
    @dispKey  = 'None' if @level isnt 'Disp'
    obj = { source:@source, level:@level, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey }
    obj.pageKey = @objPage( obj )
    obj.inovKey = @objInov( obj )
    obj.choice  = @choice  if not @isMuse
    obj.checked = @checked if not @isMuse
    obj.warnMsg = @warnMsg if @warnMsg isnt 'None'
    obj

  set:( msg, isReplay ) ->
    if isReplay
       if msg.pageKey isnt 'None'
          compKey = @getPagesName(msg)
          @setPageKey( compKey, msg.pageKey, {} ) # Short message on 'Tab' subject
          @stream.publish( 'Tab', { compKey:compKey, pageKey:msg.pageKey } )
       if msg.inovKey isnt 'None'
         @setPageKey( msg.compKey, msg.inovKey, {} ) # Short message on 'Tab' subject
         @stream.publish( 'Tab',   { compKey:msg.compKey, pageKey:msg.inovKey } )
         console.log( 'Nav.set()', { compKey:msg.compKey, inovKey:msg.inovKey } ) if @debug
    for own key, val of msg
      @[key] = val
    return

  toUrl:( obj ) ->
    page = @objPage( obj )
    inov = @objInov( obj )
    url  = window.location.protocol + '//' + window.location.host
    url += if    obj.compKey is 'Home' then '' else '/' + obj.compKey
    url += '/' + obj.pracKey if obj.pracKey isnt 'None'
    url += '/' + obj.dispKey if obj.dispKey isnt 'None'
    url += '?' + 'page='     + page  if page isnt 'None'
    url += '&' + 'innovate=' + inov  if inov isnt 'None'
    # console.log( 'Nav.toUrl()', url ) if @debug
    window.history.pushState( {}, '', url )
    url

  getPagesName:( obj ) ->
    pagesName = 'None'
    pagesName = obj.level   if @inArray(obj.compKey,@musePlanes)
    pagesName = 'Prin' if obj.compKey is 'Prin' and obj.level is 'Comp'
    pagesName = 'Prac' if obj.compKey is 'Prin' and obj.level is 'Prac'
    pagesName

  objPage:( obj ) ->
    @getPageKey( @getPagesName(obj) )

  objInov:( obj ) ->
    if @inArray(obj.compKey,@musePlanes) then @getPageKey(obj.compKey) else 'None'

  toPub:( href ) ->
    obj         = {}
    url         = new URL(href)
    page        = url.searchParams.get("page")
    innovate    = url.searchParams.get("innovate")
    paths       = url.pathname.split('/')
    obj.source  = 'Url'
    obj.compKey = if @isStr(paths[1]) then paths[1] else 'Home'
    obj.pracKey = if @isStr(paths[2]) then paths[2] else 'None'
    obj.dispKey = if @isStr(paths[3]) then paths[3] else 'None'
    obj.pageKey = if page?            then page     else 'None'
    obj.inovKey = if innovate?        then innovate else 'None'
    obj.level =
      if      obj.dispKey isnt 'None' then 'Disp'
      else if obj.pracKey isnt 'None' then 'Prac'
      else                                 'Comp'
    console.log( 'Nav.toPub()', { url:href, obj,obj, paths:paths } ) if @debug
    obj

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
      @pub( msg )
    else if @hasActivePageDir( @route, dir )
      @dirPage( dir )
    else
      @log( msg, warnMsg:"Missing adjacent component for #{dir} #{@compKey}" )
    return

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
    pageKey = if @hasPages(@route) then @movePage(@pages[@route],dir) else 'None'
    if pageKey isnt 'None'
      @setPageKey( @route, pageKey )
      # @pub( msg )
    else
      @log( msg, warnMsg:"Cannot find pageKey for #{dir}" )
    return

  # Need to int page.keys = Object.keys(pages)
  movePage:( page, dir  ) ->
    pageKey  = @getPageKey( @compKey )
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
    pageKey is pageNav

  # An important indicator of when Comps and Tabs are instanciated
  setPages:( pagesName, pages ) ->
    return if @hasPages(pagesName,false )
    @pages[pagesName] = pages
    return

  getPages:( pagesName ) ->
    if@hasPages(pagesName,true) then @pages[pagesName] else {}

  setPageKey:( pagesName, pageKey, propPages ) ->
    return if pageKey is 'None'
    for own key, page  of @pages[pagesName]
      page.show           = key is pageKey  # Update nav pages
      propPages[key].show = key is pageKey  if propPages[key]? # Also update Tabs.vue propPages because it is a copy
    return

  getPageKey:( pagesName, log=false ) ->
    return 'None' if not  @hasPages(pagesName,log)
    for own  key,   page  of @pages[pagesName]
      return key if page.show
    'None'

  getInovKey:(  pagesName ) ->
    if @inArray(pagesName,@musePlanes) then @getPageKey(pagesName) else 'None'

  hasPages:( pagesName, log=false ) ->
    has = @isDef(@pages[pagesName])
    console.log( 'Nav.hasPages()', { pagesName:pagesName, has:has, pages:@pages } ) if not has and log
    has

  logAllPages:() ->
    for own pagesKey, pagesObj of @pages
      for own key, page of pagesObj
        console.log( page )
    return

  isMyNav:( obj, level, checkPageKey=false ) ->  # @routes, @routeNames,
    if checkPageKey
      obj.level is level and @hasPages(obj.pageKey,true)
    else
      obj.level is level

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

  # Called as await sleep(2000) inside an asych function
  sleep:(ms) ->
    new Promise( (resolve) => setTimeout( resolve, ms ) )

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

  setPageKey:( pagesName, pageKey, propPages ) ->
    return if pageKey is 'None'
    for own key, page  of @pages[pagesName]
      page.show           = key is pageKey  # Update nav pages
      if propPages[key]?
         propPages[key].show = key is pageKey  # Also update the propPages in Tabs.vue because it is a copy
      else
        console.log( 'Nav.setPageKey() missing propPages key', { key:key, propPages:propPages } )
    return

  toObj:( msg ) ->
    @set( msg )
    pagesName = if @inArray(@compKey,@musePlanes) then @level else @compKey
    @source   = 'None' if not msg.source?
    @pracKey  = 'None' if @level is 'Comp'
    @pageKey  = @getPageKey( pagesName )
    @inovKey  = @getInovKey( @compKey  )
    obj = { source:@source, level:@level, compKey:@compKey,  pracKey:@pracKey, pageKey:@pageKey,
    inovKey:@inovKey, dispKey:@dispKey }
    obj.choice  = @choice  if not @isMuse
    obj.checked = @checked if not @isMuse
    obj.warnMsg = @warnMsg if @warnMsg isnt 'None'
    obj

  msg.inovKey if msg.inovKey isnt 'None' and msg.level is 'Comp'

  urlChanged:( event ) ->
    #vent.preventDefault() # Not really needed
    console.log( 'Mav.urlChanged()', event ) # if @debug
    window.stop()
    obj = toPub()
    @pub( obj )
    return

  urlPrevent:( event ) ->
    # await window.stop()
    # window.location.reload(false)
    # document.execCommand('Stop')
    console.log( 'Mav.urlPrevent()', event ) # if @debug
    return

  urlListen:() ->
    window.addEventListener( 'beforeunload', (event) => @urlPrevent(event) )
    window.addEventListener( 'popstate',     (event) => @urlChanged(event) )
    return

  toPub:( href ) ->
    obj         = {}
    url         = new URL(href)
    page        = url.searchParams.get("page")
    innovate    = url.searchParams.get("innovate")
    hashs1      =  url.hash.split('#')
    hashs2      = hashs1[1].split('?')
    hashs3      = hashs2[0].split('/')
    obj.source  = 'Url'
    obj.compKey = if hashs3[0]? then hashs3[0] else 'None'
    obj.pracKey = if hashs3[1]? then hashs3[1] else 'None'
    obj.dispKey = if hashs3[2]? then hashs3[2] else 'None'
    obj.pageKey = if page?      then page      else 'None'
    obj.inovKey = if innovate?  then innovate  else 'None'
    obj.level =
      if      obj.dispKey isnt 'None' then 'Disp'
      else if obj.pracKey isnt 'None' then 'Prac'
      else                                 'Comp'
    console.log( 'Nav.toPub()', { url:href, obj,obj, hash:url.hash, hashs1:hashs1, hashs2:hashs2, hashs3:hashs3 } ) if @debug
    obj

   <script>
     console.log("Listens", window.location.href );
     window.addEventListener( 'beforeunload', () => {
       console.log("Prevent", window.location.href );
       window.location.reload(false); } );
     window.addEventListener( 'popstate',     () => {
       console.log("Changed", window.location.href ); } );
   </script>
###

