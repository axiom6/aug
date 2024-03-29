
import Type     from "../test/Type.js"
import { vis  } from '../draw/Vis.js'

class Mix extends Type

  constructor:( Main ) ->
    super()
    Mix.Main =  Main
    @batch   = Main.Batch
    @debug = false

  hasElem: (elem)    -> elem? and elem['clientHeight']? and elem['clientHeight'] > 0

  getElem: ($refs, name) ->  # Not called
    elem = $refs[name]
    console.log('Mix.getElem() $refs[name]   ', $refs, elem, name)
    if not @hasElem(elem) and elem[0]?
      elem = $refs[name][0]
      console.log('Mix.getElem() $refs[name][0]', $refs, elem, name)
      if not @hasElem(elem)
        console.error('Mix.hasElem() unable to find elem in $refs[name]', name)
        console.dir($refs)
        elem = null
    else
      console.error('Mix.hasElem() unable to find elem in $refs[name][0]', name)
      elem = null
    elem

  styleObj: (ikwObj, fontSize = null) ->
    hsv = [30, 90, 90]
    if   @isDef(ikwObj)
      if @isDef(ikwObj.hsv)
        hsv = ikwObj.hsv
      else if @isDef(ikwObj.dir)
        hsv = switch ikwObj.dir
          when 'west'  then [195, 90, 70]
          when 'north' then [ 90, 90, 90]
          when 'east'  then [ 30, 60, 90]
          when 'south' then [ 60, 90, 90]
          else
            [30, 90, 90]
    style = { backgroundColor:vis.css(hsv)}
    style['fontSize'] = fontSize + 'rem' if fontSize?
    console.log( "Mix.styleObj()", { ikwObj:ikwObj, style:style, hsv:hsv } ) if @debug
    style

  toRgbaHsv: (hsv) ->
    vis.rgb(hsv)

  # Main
  app: () ->
    Mix.Main.appName
  isApp: ( appName ) ->
    Mix.Main.appName is appName
  routeNames:() ->
    if Mix.Main.routeNames? then Mix.Main.routeNames else []
  subscribe: (subject, source, onMethod) ->
    Mix.Main['stream'].subscribe(subject, source, onMethod)
    return
  publish: (subject, object) ->
    Mix.Main['stream'].publish(subject, object)
    return
  fontSize: (scale) ->  # JavaScript font-size the matches themeFS in theme.less
    fs = if Mix.Main.fontSize? then Mix.Main.fontSize else 2
    sc = if scale?               then scale else 1
    sc * fs + 'vmin'
  fontSizeCss: (scale) ->
    {fontSize: @fontSize(scale)}

  # Not working with MatnBox
  promiseScript:(src) ->
    new Promise( (resolve) =>
      scripts    = document.getElementsByTagName('script');
      for scriptx in scripts
        # console.log( 'Mix.addScript() scriptx src', scriptx.src )
        return if scriptx.src.includes(src)
      # console.log( 'Mix.addScript() adding', src )
      script = document.createElement('script')
      document.head.appendChild(script)
      script.async = false
      script.defer = false
      script.src = src
      resolve )

  # Not working with MatnBox. With CoffeeScript await make addScript() async
  addScript:( src ) ->
    await @promiseScript(src)
    return

  delScript:( src ) ->
    scripts    = document.getElementsByTagName('script');
    for  script in scripts
      if script.src.includes(src)
        console.log( 'Mix.delScript()', script.src ) if @debug
        document.head.removeChild(script)
        return
    return

  # Nav
  nav: () ->
    console.error('Mix.nav() null') if not Mix.Main.nav?
    Mix.Main.nav
  touch: () ->
    console.error('Mix.touch() null') if not Mix.Main.touch?
    Mix.Main.touch
  isNav: () ->
    Mix.Main.nav?

  # Batch
  isBatch:(compk) ->
    Mix.Main.Batch[compk]?
  data:( name ) ->
    if @isBatch(name)
      Mix.Main.Batch[name].data
    else
      console.error( 'Mix.data() unknown data name', name )
      {}
  opts:( key ) ->
    # console.log( "Mix.opts",  key, Mix.Main.Batch['Main'].data[key] )
    Mix.Main.Batch['Main'].data[key]
  prin: ()  ->
    Mix.Main.Batch['Prin'].data.pracs
  comps: (compk) ->
    Mix.Main.Batch[compk].data.comps
  kompsTocs: () ->   # For Tocs.vue
    Mix.Main.komps
  subset: (compk, filter) ->
    filts = {}
    for own key, prac of @pracs(compk) when filter(prac)
      filts[key] = prac
    filts
  conns: (compk) ->
    filter = if compk isnt 'Prin' then (prac) -> prac.row isnt 'Dim' else (prac) -> prac.row is 'Dim'
    @subset(compk, filter)
  pracs: (compk) ->
    Mix.Main.Batch[compk].data.pracs
  disps: (compk, prack) ->
    Mix.Main.Batch[compk].data[prack].disps
  areas: (compk, prack, dispk) ->
    Mix.Main.Batch[compk].data[prack][dispk].areas
  items: (compk, prack, dispk, areak) ->
    Mix.Main.Batch[compk].data[prack][dispk][areak].items
  bases: (compk, prack, dispk, areak, itemk) ->
    Mix.Main.Batch[compk].data[prack][dispk][areak][itemk].bases

  compObject:( compKey ) ->
    obj = {}
    if       Mix.Main.Batch[compKey]?
       obj = Mix.Main.Batch[compKey].data.pracs
    else if compKey isnt 'Home' and compKey isnt 'Defs'
      console.error( 'Mix.compObject() bad compKey', compKey )
    obj

  inovObject:( compKey, inovKey ) ->
    pracs = {}
    if @isBatch(compKey)
      compPracs = @pracs(compKey)
      if @isDef(inovKey) and inovKey isnt compKey and @isBatch(inovKey)
        inovPracs = @pracs(inovKey)
        console.log( 'Mix.inovObject() inovPracs', { inovKey:inovKey, inovPracs:inovPracs } ) if @debug
        for key, prac of compPracs
          if prac.column is 'Innovate' and prac.row isnt 'Dim'
            inovPrac = @getPrac(inovPracs,prac.row,prac.column,inovKey)
            pracs[inovPrac.name] = inovPrac
          else
            pracs[key] = prac
      else
        pracs = compPracs
    else if compKey isnt "Home" and compKey isnt "Defs"
      console.error('Mix.inovObject() bad compKey or inovKey', { compKey:compKey, inovKey:inovKey } )
    pracs

  pracObject:( compKey,  inovKey, pracKey ) ->
    pracs = @inovObject( compKey, inovKey )
    prac  = {}
    if pracs[pracKey]?
      prac = pracs[pracKey]
    else
      console.error('Mix.pracObject() unknown pracKey', { compKey:compKey, inovKey:inovKey, pracKey:pracKey, pracs:pracs } )
    prac

  sectObject: ( pracKey, dispKey  ) ->
    talkObjs = @compObject('Talk' )
    talkObj = talkObjs[pracKey]
    console.log( 'Mix.sectObj()', { talkObj:talkObj, talkKey:pracKey, sectKey:dispKey } ) # , sectObj:sectObj
    sectObjs = @compObject(talkObj.comp)
    talkObj.keys = if talkObj.keys?  then talkObj.keys else @childKeys(sectObjs)
    dispKey = if dispKey is 'none' or not @inArray(dispKey,talkObj.keys) then @keys(sectObjs)[0] else dispKey
    sectObj = sectObjs[dispKey]
    if not sectObj?
      console.error( 'Nav.sectObject null', { pracKey:pracKey, dispKey:dispKey } )
      sectObj = {}
    sectObj.src = talkObj.src
    sectObj.name = dispKey
    sectObj.peys = talkObj.keys
    sectObj.keys = if sectObj.keys?  then sectObj.keys else @childKeys(sectObj)
    sectObj = Object.assign( {}, sectObj ) if sectObj.imgsIdx isnt @nav().imgsIdx  # Trigger reactive render
    sectObj.imgsIdx = @nav().imgsIdx
    sectObj

  presObject:( sectObj, presKey ) ->
    presKey = if presKey is 'none' and sectObj.keys[0]? then sectObj.keys[0] else presKey
    pageObj = null
    if presKey isnt 'none' and sectObj[presKey]?
      pageObj = sectObj[presKey]
      pageObj.src = sectObj.src
      pageObj.name = presKey
      pageObj.peys = sectObj.keys
      pageObj.keys = if pageObj.keys?  then pageObj.keys else @childKeys(pageObj)
      console.log( 'Mix.pageObj()', { dispKey:sectObj.name, presKey:presKey, pageObj:pageObj } )
    pageObj

  dataObject: (sectObj, presKey ) ->
    dataObj = null
    if sectObj.type is 'Prac'
      dataObj = @pracObject( sectObj.src, sectObj.name )
    else if sectObj.type is 'Disp' and presKey isnt 'none'
      dataObj = @dispObject(sectObj.src, 'none', sectObj.name, presKey  )
    dataObj

  dispObject:( compKey, inovKey, pracKey, dispKey ) ->
    disp = {}
    pracs = @inovObject( compKey, inovKey )
    if pracs[pracKey]?
      prac = pracs[pracKey]
      if prac[dispKey]?
        disp = prac[dispKey]
      else
        console.error( 'Mix.dispObject() unknown dispKey', { compKey:compKey, inovKey:inovKey, pracKey:pracKey, dispKey:dispKey } )
    else
      console.error( 'Mix.dispObject() unknown pracKey',   { compKey:compKey, inovKey:inovKey, pracKey:pracKey, dispKey:dispKey } )
    disp

  getPrac: ( pracs, row, column, inovKey ) ->
    for key, prac of pracs
      return prac if prac.row is row and prac.column is column
    console.error( 'Mix.getPrac() missing prac for', { inovKey:inovKey, row:row, column:column } )
    {}

  isPageKeyComp: (pageKey) ->
    pageKey is 'Info' or pageKey is 'Data' # @app() is 'Muse' and

  removeElem:( msg, elem, nextTick, closure=null ) ->
    nextTick( () =>
      if @isDef(elem)
        closure() if closure?
        @removeElems(elem)
      else
        console.error( msg, "Mix.removeElem() elem undefined" ) )
    return

  removeElems:( elem ) ->
    while @isDef(elem) and @isDef(elem.firstChild)
      elem.removeChild(elem.firstChild)
    return

  createElem:( msg, elem, nextTick, closure ) ->
    nextTick( () =>
      if @isDef(elem)
        closure()
      else
        console.error( msg, "Mix.createElem() elem undefined" ) )
    return

  appendImgsHW:( src, elem ) ->
    hw  = {}
    img = new Image();
    img.onload = () ->
      hw.iw = this.width
      hw.ih = this.height
      hw.ew = elem['clientWidth']
      hw.eh = elem['clientHeight']
      hw.r  = Math.min( hw.ew/hw.iw, hw.eh/hw.ih )
      img.width  = hw.iw * hw.r
      img.height = hw.ih * hw.r
      img.alt    = 'alt'
      # console.log( 'Mix.appendImgsHW()', hw:hw, { w:img.width, h:img.height } )
      elem.children[0].remove() if elem.children[0]?
      elem.append( img )
    img.src = src

  # aspectHW:( )

export default Mix
