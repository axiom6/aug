
import Build from '../util/Build.js'
import Dir   from './Dir.js'

class Nav

  constructor:( @stream, @mix, @batch={}, @komps=null, @pages={} ) ->
    @dirs       = { west:true, east:true, north:true, south:true, prev:true, next:true }
    @navs       = if @komps then @addInovToNavs( @komps ) else null
    @touch      =  null
    @build      =  new Build( @batch )
    @dir        =  new Dir( @ )
    @source     = 'None'
    @level      = 'None' # set to either Comp Prac or Disp by Tocs.vue
    @compKey    = 'None'
    @pracKey    = 'None'
    @dispKey    = 'None'
    @pageKey    = 'None'
    @inovKey    = 'None' # Only used by Tabs to Tocs.vue and Comp.vue
    @choice     = 'None'
    @checked    = false
    @warnMsg    = 'None'
    @debug      =  false
    @pubs       = []
    @urls       = []
    @tabs       = {}
    @museLevels = ['Comp','Prac','Disp']
    @museComps  = ['Home','Prin','Info','Know','Wise','Cube','Test']
    @museInovs  = ['Info','Know','Wise','Soft','Data','Scie','Math']
    @musePlanes = ['Info','Know','Wise']

  pub:( msg, isReplay=false ) ->
    changeView = @viewChange( msg )
    obj = @toObj( msg )
    url = @toUrl( obj )
    console.log('Nav.pub()', obj )
    @pubs.push(obj) if not isReplay and obj.compKey isnt 'Test'
    @urls.push(url) if not isReplay and obj.compKey isnt 'Test'
    @stream.publish( 'View', obj ) if changeView
    @stream.publish( 'Nav',  obj )
    return

  viewChange:( obj ) ->
    obj.compKey = @compKey if not @mix.isDef(obj.compKey)
    obj.pracKey = @pracKey if not @mix.isDef(obj.pracKey)
    obj.dispKey = @dispKey if not @mix.isDef(obj.dispKey)
    change = not ( obj.compKey is @compKey and obj.pracKey is @pracKey and obj.dispKey is @dispKey )
    console.log( 'Nav.viewChange()', { change:change, compObj:obj.compKey, compNav:@compKey,
    pracObj:obj.pracKey, pracNav:@pracKey, dispObj:obj.dispKey, dispNav:@dispKey, } ) if @debug and change
    change

  toObj:( msg ) ->
    @set( msg )
    @source   = 'None' if not msg.source?
    @pracKey  = 'None' if @level is   'Comp'
    @dispKey  = 'None' if @level isnt 'Disp'
    obj = { source:@source, level:@level, compKey:@compKey, pracKey:@pracKey, dispKey:@dispKey }
    obj.pageKey = @objPage( obj )
    obj.inovKey = @objInov( obj )
    obj.choice  = @choice  if @mix.isApp('Jitter')
    obj.checked = @checked if @mix.isApp('Jitter')
    obj.warnMsg = @warnMsg if @warnMsg isnt 'None'
    @tab( obj ) # Publisn pageKey and inovKey to tabs
    obj

  set:( msg ) ->
    for own key, val of msg
      @[key] = val
    return

  tab:( obj ) ->

    if @mix.isDef(obj.pageKey)
      @pageKye  = obj.pageKey
      tabsKey   = @getTabsKey(obj)
      @setPageKey( tabsKey, obj.pageKey, {} ) # Short message on 'Tab' subject
      @stream.publish( 'Tab',           { compKey:tabsKey, pageKey:obj.pageKey } )
      console.log( 'Nav.set() pageKey', { compKey:tabsKey, pageKey:obj.pageKey } ) if @debug

    if @mix.isDef(obj.inovKey)
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
    url += '/' + obj.pracKey if obj.pracKey isnt 'None'
    url += '/' + obj.dispKey if obj.dispKey isnt 'None'
    url += '?' + 'page='     + page  if page isnt 'None'
    url += '&' + 'innovate=' + inov  if inov isnt 'None'
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
    obj.compKey = if @mix.isStr(paths[1]) then paths[1] else 'Home'
    obj.pracKey = if @mix.isStr(paths[2]) then paths[2] else 'None'
    obj.dispKey = if @mix.isStr(paths[3]) then paths[3] else 'None'
    obj.pageKey = if page?                then page     else 'None'
    obj.inovKey = if innovate?            then innovate else 'None'
    obj.level =
      if      obj.dispKey isnt 'None' then 'Disp'
      else if obj.pracKey isnt 'None' then 'Prac'
      else                                 'Comp'
    console.log( 'Nav.toPub()', { url:href, obj,obj, paths:paths } ) if @debug
    obj

  getTabsKey:( obj ) ->
    tabsKey = 'None'
    if @mix.isApp('Muse')
      tabsKey = obj.level if @mix.inArray(obj.compKey,@musePlanes)
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
    if @mix.inArray(obj.compKey,@musePlanes) then @getPageKey(obj.compKey) else 'None'

  isShow:( tabsKey, pageKey ) ->
    pageNav = @getPageKey( tabsKey, false )
    pageKey is pageNav

  # An important indicator of when Comps and Tabs are instanciated
  setTabs:( tabsKey, pages ) ->
    return if @hasTabs(tabsKey,false )
    @pages[tabsKey] = pages
    return

  getTabs:( tabsKey ) ->
    if @hasTabs(tabsKey,true) then @pages[tabsKey] else {}

  setPageKey:( tabsKey, pageKey, propTabs ) ->
    return if pageKey is 'None'
    for own key, page  of @pages[tabsKey]
      page.show           = key is pageKey  # Update nav pages
      propTabs[key].show = key is pageKey  if propTabs[key]? # Also update Tabs.vue propTabs because it is a copy
    return

  getPageKey:( tabsKey, log=false ) ->
    return 'None' if not  @hasTabs(tabsKey,log)
    for own  key,   page  of @pages[tabsKey]
      return key if page.show
    'None'

  hasPage:( tabsKey, pageKey, log=true ) ->
    if    @mix.isDef(tabsKey) and @hasTabs(tabsKey)
       if @mix.isDef(pageKey) and @pages[tabsKey][pageKey]?
         true
       else
         console.log( 'Nav.hasPage() bad pageKey', { tabsKey:tabsKey, pageKey:pageKey, pages:getTabs:(tabsKey) } ) if log and pageKey isnt 'None'
         false
    else
      console.log( 'Nav.hasPage() bad tabsKey',    { tabsKey:tabsKey, pageKey:pageKey } ) if log and pageKey isnt 'None'
      false

  getPage:( tabsKey, pageKey, log=false ) ->
    if @hasTabs(tabsKey,log) and @pages[tabsKey][pageKey]?
      @pages[tabsKey][pageKey]
    else
      console.error( 'Nav.getPage() bad page', { tabsKey:tabsKey, pageKey:pageKey } )
      'None'

  getInovKey:( tabsKey ) ->
    if @mix.inArray(tabsKey,@musePlanes) then @getPageKey(tabsKey) else 'None'

  hasTabs:( tabsKey, log=false ) ->
    has = @mix.isDef(tabsKey) and @mix.isDef(@pages[tabsKey])
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

  # --- Innovate --- Inov in one place

  # Across the board Inov detector for compKey pageKey and route
  isInov:( compKey ) ->
    @mix.inArray( compKey, @museInovs )

  addInovToNavs:( komps ) ->
    return komps? if not @mix.isApp('Muse')
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
  set:( msg, isReplay ) ->
    if isReplay
       if msg.pageKey isnt 'None'
          tabsKey = @getTabsKey(msg)
          @setPageKey( tabsKey, msg.pageKey, {} ) # Short message on 'Tab' subject
          @stream.publish( 'Tab',           { compKey:tabsKey, pageKey:msg.pageKey } )
          console.log( 'Nav.set() pageKey', { compKey:tabsKey, pageKey:msg.pageKey } ) if @debug
       if msg.inovKey isnt 'None'
         @setPageKey( msg.compKey, msg.inovKey, {} ) # Short message on 'Tab' subject
         @stream.publish( 'Tab',   { compKey:msg.compKey, pageKey:msg.inovKey } )
         console.log( 'Nav.set() inovKey', { compKey:msg.compKey, inovKey:msg.inovKey } ) if @debug
    for own key, val of msg
      @[key] = val
    return
###
