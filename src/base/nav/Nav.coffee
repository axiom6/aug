
import Build from '../util/Build.js'
import Dir   from './Dir.js'

class Nav

  constructor:( @stream, @mix, @batch, @komps, @pages ) ->
    @dirs       = { west:true, east:true, north:true, south:true, prev:true, next:true }
    @navs       = @addInovToNavs( @komps )
    @touch      =  null
    @build      =  new Build( @batch )
    @dir        =  new Dir( @ )
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
    @pubs       = []
    @urls       = []
    @tabs       = {}
    @museLevels = ['Comp','Prac','Disp']
    @museComps  = ['Home','Prin','Info','Know','Wise','Cube','Test']
    @museInovs  = ['Info','Know','Wise','Soft','Data','Scie','Math']
    @musePlanes = ['Info','Know','Wise']

  pub:( msg, isReplay=false ) ->
    obj = @toObj( msg, isReplay )
    url = @toUrl( obj )
    console.log('Nav.pub()', obj )
    @pubs.push(obj) if not isReplay and obj.compKey isnt 'Test'
    @urls.push(url) if not isReplay and obj.compKey isnt 'Test'
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
    obj.choice  = @choice  if @mix.isApp('Jitter')
    obj.checked = @checked if @mix.isApp('Jitter')
    obj.warnMsg = @warnMsg if @warnMsg isnt 'None'
    obj

  set:( msg, isReplay ) ->
    if isReplay
       if msg.pageKey isnt 'None'
          compKey = @getPagesKey(msg)
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

  getPagesKey:( obj ) ->
    pagesKey = 'None'
    if @mix.isApp('Muse')
      pagesKey = obj.level if @mix.inArray(obj.compKey,@musePlanes)
      pagesKey = 'Prin' if obj.compKey is 'Prin' and obj.level is 'Comp'
      pagesKey = 'Prac' if obj.compKey is 'Prin' and obj.level is 'Prac'
    else
      pagesKey = switch obj.level
        when 'Comp' then obj.compKey
        when 'Prac' then obj.pracKey
        when 'Disp' then obj.dispKey
        else             obj.compKey
    pagesKey

  objPage:( obj ) ->
    @getPageKey( @getPagesKey(obj), false )

  objInov:( obj ) ->
    if @mix.inArray(obj.compKey,@musePlanes) then @getPageKey(obj.compKey) else 'None'

  isShow:( pagesKey, pageKey ) ->
    pageNav = @getPageKey( pagesKey, false )
    pageKey is pageNav

  # An important indicator of when Comps and Tabs are instanciated
  setPages:( pagesKey, pages ) ->
    return if @hasPages(pagesKey,false )
    @pages[pagesKey] = pages
    return

  getPages:( pagesKey ) ->
    if@hasPages(pagesKey,true) then @pages[pagesKey] else {}

  setPageKey:( pagesKey, pageKey, propPages ) ->
    return if pageKey is 'None'
    for own key, page  of @pages[pagesKey]
      page.show           = key is pageKey  # Update nav pages
      propPages[key].show = key is pageKey  if propPages[key]? # Also update Tabs.vue propPages because it is a copy
    return

  getPageKey:( pagesKey, log=false ) ->
    return 'None' if not  @hasPages(pagesKey,log)
    for own  key,   page  of @pages[pagesKey]
      return key if page.show
    'None'

  getInovKey:( pagesKey ) ->
    if @mix.inArray(pagesKey,@musePlanes) then @getPageKey(pagesKey) else 'None'

  hasPages:( pagesKey, log=false ) ->
    has = @mix.isDef(@pages[pagesKey])
    console.log( 'Nav.hasPages()', { pagesKey:pagesKey, has:has, pages:@pages } ) if not has and log
    has

  isMyNav:( obj, level, checkPageKey=false ) ->  # @routes, @routeNames,
    if checkPageKey
      obj.level is level and @hasPages(obj.pageKey,true)
    else
      obj.level is level

  pracs:(  compKey ) ->
    @batch[compKey].data.pracs

  disps:(  compKey, pracKey ) ->
    @batch[compKey].data.pracs[pracKey].disps

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
