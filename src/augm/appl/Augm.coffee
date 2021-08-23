

#mport Load    from './Load.js'
import { tester } from  '../../../lib/pub/test/Tester.js'
import Access     from  '../../../lib/pub/util/Access.js'
import Stream     from '../../../lib/pub/util/Stream.js'
import Nav        from '../../../lib/pub/navi/Nav.js'
import Mix        from '../../../lib/pub/navi/Mix.js'
import Dash       from '../../../vue/augm/appl/Dash.vue'

import { createApp }    from 'vue'

#mport Cache   from '../../../lib/pub/util/Cache.js'

import MathJson   from '../../../data/augm/Math.json'
import GeomJson   from '../../../data/augm/Geom.json'
import DataJson   from '../../../data/augm/Data.json'
import ToolJson   from '../../../data/augm/Tool.json'
import QuadJson   from '../../../data/draw/Quad.json'
import TechJson   from '../../../data/draw/Tech.json'
import TreeJson   from '../../../data/draw/Tree.json'
import FlavorJson from '../../../data/jitter/Flavor.json'
import ChoiceJson from '../../../data/jitter/Choice.json'


class Augm

  Augm.appName = 'Augm'

  Augm.Batch = {
    Math:   { url:'augm/Math.json',     data:MathJson, refine:true }
    Geom:   { url:'augm/Geom.json',     data:GeomJson, refine:true }
    Data:   { url:'augm/Data.json',     data:DataJson, refine:true }
    Tool:   { url:'augm/Tool.json',     data:ToolJson, refine:true }
    Quad:   { url:'draw/Quad.json',     data:QuadJson   }
    Tech:   { url:'draw/Tech.json',     data:TechJson   }
    Tree:   { url:'draw/Tree.json',     data:TreeJson   }
    Flavor: { url:'jitter/Flavor.json', data:FlavorJson }
    Choice: { url:'jitter/Choice.json', data:ChoiceJson } }

  Augm.komps = Access.kompsDirs( {
    Home:{ title:'Home', key:'Home', pracs:{}, ikw:false, icon:"fas fa-home" }
    Math:{ title:'Math', key:'Math', pracs:{}, ikw:true,  icon:"fas fa-bezier-curve" }
    Draw:{ title:'Draw', key:'Draw', pracs:{}, ikw:false, icon:"fas fa-draw-polygon" }
    Tool:{ title:'Tool', key:'Tool', pracs:{}, ikw:false, icon:"fas fa-wrench" }
    Wood:{ title:'Wood', key:'Wood', pracs:{}, ikw:false, icon:"fas fa-tree" }
    Geom:{ title:'Geom', key:'Geom', pracs:{}, ikw:true,  icon:"fas fa-shapes" }
    Test:{ title:'Test', key:'Test', pracs:{}, ikw:false, icon:"fas fa-stethoscope"} } )

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Augm.Batch. Call Augm.init() when complete.
  # 2. Augm.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Augm.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Augm.Batch. Call Augm.init() when complete.
  Augm.start = (href) ->
    console.log( "Augm.start()", href )
    Augm.href = href
    Augm.addToHead()
    for key, val of Augm.Batch when val.refine? and val.refine
      val.data = Access.refine(val.data)
    Augm.init()
    return

  # Add these <link> tags to <head> because vite build makes a mess of them
  Augm.addToHead = () ->
  # manifest   = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
  # siteLink   = """<link href="https://vit-muse.web.app/" rel="canonical">"""
    maniElem       = document.createElement('link')
    maniElem.href  = "manifest.json"
    maniElem.rel   = "manifest"
    maniElem['crossorigin'] = "use-credentials"
    siteElem = document.createElement('link')
    siteElem.href  =   window.location.href
    siteElem.rel   = "canonical"
    #jsonLD        = document.createElement('script')
    #jsonLD.type   = "application/ld+json"
    #jsonLD.text   = JSON.stringify(MuseLD)
    head           = document.getElementsByTagName("head")[0]
    head.appendChild(maniElem)
    head.appendChild(siteElem)
    #ead.appendChild(jsonLD)
    return

  Augm.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json"

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Augm.init =   () ->
    window['Geom'] = {} # May still be needed by Ganjs
    subjects    = ["Nav","Tab","View"]
    streamLog   = { subscribe:false, publish:false, subjects:subjects }
    Augm.stream = new Stream( subjects, streamLog )
    Augm.mix    = new Mix( Augm )
    Augm.nav    = new Nav( Augm, Augm.stream, Augm.komps, Augm.pages, false )
    #ugm.cache  = new Cache( Augm.stream )
    tester.setOptions( { testing:true, archive:false, verbose:false, debug:false } )
    try
      Augm.vue3()
    catch error
      console.error( 'Augm.vue app.use error', error )
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Augm.vue3 = () ->
    Augm.app = createApp( Dash  )
    Augm.app.provide('tester', tester   )
    Augm.app.provide('mix',    Augm.mix )
    Augm.app.provide('nav',    Augm.nav )
    Augm.app.mount('#augm')
    Augm.nav.pub( Augm.nav.toPub(Augm.href), true )
    return

  # Lazy loader with dynamic import()
  Augm.lazy = (name) -> () ->
    path = "../../#{name}.vue"
    if path is false then {}
    return `import( /* @vite-ignore */ path )`

  Augm.pages = {
    MathML: {
      Basics: { title:'Basics', key:'Basics', obj:null, show:true  } }
    MathEQ: {
      Differ: { title:'Differ', key:'Differ', obj:null, show:true  },
      Solves: { title:'Solves', key:'Solves', obj:null, show:false } }
    Draw: {
      Axes:   { title:'Axes',   key:'Axes',   obj:null, show:true  },
      Flavor: { title:'Flavor', key:'Flavor', obj:null, show:false },
      Chord:  { title:'Chord',  key:'Chord',  obj:null, show:false },
      Link:   { title:'Link',   key:'Link',   obj:null, show:false },
      Radar:  { title:'Radar',  key:'Radar',  obj:null, show:false },
      Hue:    { title:'Hue',    key:'Hue',    obj:null, show:false },
      Tree:   { title:'Tree',   key:'Tree',   obj:null, show:false } },
    Hues: {
      Red:     { title:'Red',     key:'Red',     show:true  },
      Orange:  { title:'Orange',  key:'Orange',  show:false },
      Yellow:  { title:'Yellow',  key:'Yellow',  show:false },
      Lime:    { title:'Lime',    key:'Lime',    show:false },
      Green:   { title:'Green',   key:'Green',   show:false },
      Cyan:    { title:'Cyan',    key:'Cyan',    show:false },
      Blue:    { title:'Blue',    key:'Blue',    show:false },
      Magenta: { title:'Magenta', key:'Magenta', show:false } },
    Gauges: {
      Gauge:   { title:'Gauge', key:'Gauge', show:true } }
    Widget: {
      DnD:     { title:'DnD',   key:'DnD',  show:true   } }
    Geom2D: {
      Graph:  { title:'Graph',   key:'Graph',    obj:null, show:true  },
      Basics: { title:'Basics',  key:'Basics',   obj:null, show:false } },
    Geom3D: {
      Grids:   { title:'Grids',   key:'Grids',   obj:null, show:true  },
      Isomet:  { title:'Isomet',  key:'Isomet',  obj:null, show:false },
      Play:    { title:'Play',    key:'Play',    obj:null, show:false },
      Isohed:  { title:'Isohed',  key:'Isohed',  obj:null, show:false },
      Torus:   { title:'Torus',   key:'Torus',   obj:null, show:false },
      Sphere:  { title:'Sphere',  key:'Sphere',  obj:null, show:false } }
    Tables: {
      Table1: { title:'Table1', key:'Table1', created:false, show:false },
      Table2: { title:'Table2', key:'Table2', created:false, show:false } }
    Pivots: {
      Table1: { title:'Pivot1', key:'Pivot1', created:false, show:false },
      Table2: { title:'Pivot2', key:'Pivot2', created:false, show:false } } }

export default Augm

