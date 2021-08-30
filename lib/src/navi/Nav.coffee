
import Mix   from './Mix.js'
import Build from '../util/Build.js'
import Dir   from './Dir.js'

class Nav extends Mix

  constructor:( Main, stream, komps=null, pages={}, isRoutes=false ) ->
    super( Main )
    @stream     = stream
    @komps      = komps
    @pages      = pages
    @isRoutes   = isRoutes
    @navs       = if @komps then @addInovToNavs( @komps ) else null
    @touch      =  null
    @build      =  new Build( @batch )
    @dir        =  new Dir( @ )
    @source     = 'none'
    @level      = 'none' # set to either Comp Prac or Disp by Tocs.vue
    @compKey    = 'none'
    @pracKey    = 'none'
    @dispKey    = 'none'
    @pageKey    = 'none'
    @inovKey    = 'none' # Only used by Tabs to Tocs.vue and Comp.vue
    @choice     = 'none'
    @checked    = false
    @warnMsg    = 'none'
    @debug      =  false
    @pubs       = []
    @urls       = []
    @tabs       = {}
    @router     =  null
    @routeLast  = 'none'
    @museLevels = ['Comp','Prac','Disp']
    @museComps  = ['Home','Prin','Info','Know','Wise','Cube','Test']
    @museInovs  = ['Info','Know','Wise','Soft','Data','Scie','Math']
    @musePlanes = ['Info','Know','Wise']

  # Special publsher for Vizu side bar
  pubVizu:( obj ) ->
    # console.log('Nav.pubVizu()', obj )
    @stream.publish( 'Vizu',     obj )
    return

  pub:( msg, isReplay=false ) ->
    changeView = @viewChange( msg )
    obj = @toObj( msg )
    url = @toUrl( obj )
    console.log('Nav.pub()', obj )
    @doRoute(   obj ) if @isRoutes
    @pubs.push( obj ) if not isReplay and obj.compKey isnt 'Test'
    @urls.push( url ) if not isReplay and obj.compKey isnt 'Test'
    @stream.publish( 'View', obj ) if changeView
    @stream.publish( 'Nav',  obj )
    return

  viewChange:( obj ) ->
    obj.compKey = @compKey if not @isDef(obj.compKey)
    obj.pracKey = @pracKey if not @isDef(obj.pracKey)
    obj.dispKey = @dispKey if not @isDef(obj.dispKey)
    change = not ( obj.compKey is @compKey and obj.pracKey is @pracKey and obj.dispKey is @dispKey )
    console.log( 'Nav.viewChange()', { change:change, compObj:obj.compKey, compNav:@compKey,
    pracObj:obj.pracKey, pracNav:@pracKey, dispObj:obj.dispKey, dispNav:@dispKey, } ) if @debug and change
    change

  toObj:( msg ) ->
    @set( msg )
    @source   = 'none' if not msg.source?
    @pracKey  = 'none' if @level is   'Comp'
    @dispKey  = 'none' if @level isnt 'Disp'
    obj = { source:@source, level:@level, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey }
    obj.pageKey = @objPage( obj )
    obj.inovKey = @objInov( obj )
    obj.choice  = @choice  if @isApp('Jitter')
    obj.checked = @checked if @isApp('Jitter')
    obj.warnMsg = @warnMsg if @warnMsg isnt 'none'
    @tab( obj ) # Publisn pageKey and inovKey to tabs
    obj

  set:( msg ) ->
    for own key, val of msg
      @[key] = val
    return

  tab:( obj ) ->

    if @isDef(obj.pageKey)
      @pageKye  = obj.pageKey
      tabsKey   = @getTabsKey(obj)
      @setPageKey( tabsKey, obj.pageKey, {} ) # Short message on 'Tab' subject
      @stream.publish( 'Tab',           { compKey:tabsKey, pageKey:obj.pageKey } )
      console.log( 'Nav.set() pageKey', { compKey:tabsKey, pageKey:obj.pageKey } ) if @debug

    if @isDef(obj.inovKey)
      @inovKey  = obj.inovKey
      @setPageKey( obj.compKey, obj.inovKey, {} ) # Short message on 'Tab' subject
      @stream.publish( 'Tab',   { compKey:obj.compKey, pageKey:obj.inovKey } )
      console.log( 'Nav.set() inovKey', { compKey:obj.compKey, inovKey:obj.inovKey } ) if @debug

    return

  toUrl:( obj ) ->
    page = @objPage( obj )
    inov = @objInov( obj )
    url  = window.location.protocol + '//' + window.location.host
    url += if    obj.compKey is 'Home' then '' else '/' + obj.compKey
    url += '/' + obj.pracKey if obj.pracKey isnt 'none'
    url += '/' + obj.dispKey if obj.dispKey isnt 'none'
    url += '?' + 'page='     + page  if page isnt 'none'
    url += '&' + 'innovate=' + inov  if inov isnt 'none'
    # console.log( 'Nav.toUrl()', url ) if @debug
    window.history.pushState( {}, '', url )
    url

  toPub:( href ) =>
    obj         = {}
    url         = new URL(href)
    page        = url.searchParams.get("page")
    innovate    = url.searchParams.get("innovate")
    paths       = url.pathname.split('/')
    obj.source  = 'Url'
    obj.compKey = if @isStr(paths[1]) then paths[1] else 'Home'
    obj.pracKey = if @isStr(paths[2]) then paths[2] else 'none'
    obj.dispKey = if @isStr(paths[3]) then paths[3] else 'none'
    obj.pageKey = if page?                then page     else 'none'
    obj.inovKey = if innovate?            then innovate else 'none'
    obj.level =
      if      obj.dispKey isnt 'none' then 'Disp'
      else if obj.pracKey isnt 'none' then 'Prac'
      else                                 'Comp'
    console.log( 'Nav.toPub()', { url:href, obj,obj, paths:paths } ) if @debug
    obj

  doDir:( direct ) ->
    @dir.dir( direct )
    return

  doRoute:( obj ) ->
    route = obj.compKey
    return if route is @routeLast or route is 'none' or @isInov(route)
    if route? and @komps? and @komps[route]?
      if @router?
         @router.push( name:route )
      else
         console.error( 'Nav.doRoute() router not set for', route )
      @routeLast = obj.compKey
    else
      console.error( 'Nav.doRoute() undefined or unnamed route', route )
    return

  getTabsKey:( obj ) ->
    tabsKey = 'none'
    if @isApp('Muse')
      tabsKey = obj.level if @inArray(obj.compKey,@musePlanes)
      tabsKey = 'Prin' if obj.compKey is 'Prin' and obj.level is 'Comp'
      tabsKey = 'Prac' if obj.compKey is 'Prin' and obj.level is 'Prac'
    else
      tabsKey = switch obj.level
        when 'Comp' then obj.compKey
        when 'Prac' then obj.pracKey
        when 'Disp' then obj.dispKey
        else             obj.compKey
    tabsKey

  objPage:( obj ) ->
    @getPageKey( @getTabsKey(obj), false )

  objInov:( obj ) ->
    if @inArray(obj.compKey,@musePlanes) then @getPageKey(obj.compKey) else 'none'

  isShow:( tabsKey, pageKey ) ->
    pageNav = @getPageKey( tabsKey )
    pageKey is pageNav

  # When @page matches return
  #  otherwise look for when the page is true at eech level
  #  this supports setting show true in pages
  show:( pageArg ) ->
    switch
      when pageArg is @pageKey then true
      when @level is "Disp"    then pageArg is @getPageKey( @dispKey )
      when @level is "Prac"    then pageArg is @getPageKey( @pracKey )
      when @level is "Comp"    then pageArg is @getPageKey( @compKey )
      else                          false

  keyIdx:( key, idx ) ->
    key + idx

  # An important indicator of when Comps and Tabs are instanciated
  setTabs:( tabsKey, pages ) ->
    return if @hasTabs(tabsKey,false )
    @pages[tabsKey] = pages
    return

  getTabs:( tabsKey ) ->
    if @hasTabs(tabsKey,true) then @pages[tabsKey] else {}

  setPageKey:( tabsKey, pageKey, propTabs ) ->
    return if pageKey is 'none'
    for own key, page  of @pages[tabsKey]
      page.show           = key is pageKey  # Update nav pages
      propTabs[key].show = key is pageKey  if propTabs[key]? # Also update Tabs.vue propTabs because it is a copy
    return

  getPageKey:( tabsKey, log=false ) ->
    return 'none' if not  @hasTabs(tabsKey,log)
    for own  key,   page  of @pages[tabsKey]
      return key if page.show
    'none'

  hasPage:( tabsKey, pageKey, log=true ) ->
    if    @isDef(tabsKey) and @hasTabs(tabsKey)
       if @isDef(pageKey) and @pages[tabsKey][pageKey]?
         true
       else
         console.log( 'Nav.hasPage() bad pageKey', { tabsKey:tabsKey, pageKey:pageKey, pages:getTabs:(tabsKey) } ) if log and pageKey isnt 'none'
         false
    else
      console.log( 'Nav.hasPage() bad tabsKey',    { tabsKey:tabsKey, pageKey:pageKey } ) if log and pageKey isnt 'none'
      false

  getPage:( tabsKey, pageKey, log=false ) ->
    if @hasTabs(tabsKey,log) and @pages[tabsKey][pageKey]?
      @pages[tabsKey][pageKey]
    else
      console.error( 'Nav.getPage() bad page', { tabsKey:tabsKey, pageKey:pageKey } )
      'none'

  getInovKey:( tabsKey ) ->
    if @inArray(tabsKey,@musePlanes) then @getPageKey(tabsKey) else 'none'

  hasTabs:( tabsKey, log=false ) ->
    has = @isDef(tabsKey) and @isDef(@pages[tabsKey])
    console.log( 'Nav.hasTabs()', { tabsKey:tabsKey, has:has, pages:@pages } ) if not has and log
    has

  isMyNav:( obj, level, checkPageKey=false ) ->  # @routes, @routeNames,
    if checkPageKey
      obj.level is level and @hasTabs(obj.pageKey,true)
    else
      obj.level is level

  pracs:(  compKey ) ->
    if @batch[compKey]? then @batch[compKey].data.pracs else {}

  disps:(  compKey, pracKey ) ->
    if @batch[compKey]? then @batch[compKey].data.pracs[pracKey].disps else {}

  # Called as await sleep(2000) inside an asych function
  sleep:(ms) ->
    new Promise( (resolve) => setTimeout( resolve, ms ) )

  delayCallback:( ms, callback ) ->
    setTimeout( callback, ms )
    return

# --- Innovate --- Inov in one place

  # Across the board Inov detector for compKey pageKey and route
  isInov:( compKey ) ->
    @inArray( compKey, @museInovs )

  addInovToNavs:( komps ) ->
    return komps? if not @isApp('Muse')
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

  userAgent:() ->
    navigator.userAgent.toLowerCase()

  # Looks up lower case strings in navigator userAngent
  #   like 'android' 'mac' 'iphone' 'firefox'
  #   not 100% certain but usefull
  inUserAgent:( str ) ->
    @userAgent().indexOf(str) > -1

  isMobile:() ->
    @inUserAgent('android') or @inUserAgent('iphone')

export default Nav

###
  set:( msg, isReplay ) ->
    if isReplay
       if msg.pageKey isnt 'none'
          tabsKey = @getTabsKey(msg)
          @setPageKey( tabsKey, msg.pageKey, {} ) # Short message on 'Tab' subject
          @stream.publish( 'Tab',           { compKey:tabsKey, pageKey:msg.pageKey } )
          console.log( 'Nav.set() pageKey', { compKey:tabsKey, pageKey:msg.pageKey } ) if @debug
       if msg.inovKey isnt 'none'
         @setPageKey( msg.compKey, msg.inovKey, {} ) # Short message on 'Tab' subject
         @stream.publish( 'Tab',   { compKey:msg.compKey, pageKey:msg.inovKey } )
         console.log( 'Nav.set() inovKey', { compKey:msg.compKey, inovKey:msg.inovKey } ) if @debug
    for own key, val of msg
      @[key] = val
    return
###
