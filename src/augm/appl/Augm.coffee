

#mport Load    from './Load.js'
import { tester } from  '../../../lib/pub/test/Tester.js'
import Access     from  '../../../lib/pub/base/util/Access.js'
import Stream     from '../../../lib/pub/base/util/Stream.js'
import Nav        from '../../../lib/pub/base/nav/Nav.js'
import Mix        from '../../../lib/pub/base/nav/Mix.js'
import Dash       from '../../../vue/augm/appl/Dash.vue'

import { createApp }    from 'vue'

#mport Cache   from '../../../lib/pub/base/util/Cache.js'

import MathJson from '../../../data/augm/Math.json'
import GeomJson from '../../../data/augm/Geom.json'
import DataJson from '../../../data/augm/Data.json'
import ToolJson from '../../../data/augm/Tool.json'
import PrinJson from '../../../data/muse/Prin.json'
import RowsJson from '../../../data/muse/Rows.json'
import InfoJson from '../../../data/muse/Info.json'
import KnowJson from '../../../data/muse/Know.json'
import WiseJson from '../../../data/muse/Wise.json'
import QuadJson from '../../../data/draw/Quad.json'
import TechJson from '../../../data/draw/Tech.json'
import TreeJson from '../../../data/draw/Tree.json'
import CubeJson from '../../../data/muse/Cube.json'

import FlavorJson from '../../../data/jitter/Flavor.json'
import ChoiceJson from '../../../data/jitter/Choice.json'
import FontJson   from "../../../css/font/three/helvetiker_regular.typeface.json"
#mport DataInov from   '../../../data/inno/Data.json'
#mport MachInov from   '../../../data/inno/Mach.json'
#mport MathInov from   '../../../data/inno/Math.json'
#mport ScieJson from   '../../../data/inno/Scie.json'
#mport SoftInov from   '../../../data/inno/Soft.json'

class Augm

  Augm.appName = 'Augm'

  Augm.Batch = {
    Math:   { url:'augm/Math.json',     data:MathJson, refine:true }
    Geom:   { url:'augm/Geom.json',     data:GeomJson, refine:true }
    Data:   { url:'augm/Data.json',     data:DataJson, refine:true }
    Prin:   { url:'muse/Prin.json',     data:PrinJson, refine:true }
    Tool:   { url:'augm/Tool.json',     data:ToolJson, refine:true }
    Rows:   { url:'muse/Rows.json',     data:RowsJson, refine:true }
    Info:   { url:'muse/Info.json',     data:InfoJson, refine:true }
    Know:   { url:'muse/Know.json',     data:KnowJson, refine:true }
    Wise:   { url:'muse/Wise.json',     data:WiseJson, refine:true }
    Cube:   { url:'muse/Cube.json',     data:CubeJson, refine:true }
    Quad:   { url:'draw/Quad.json',     data:QuadJson   }
    Tech:   { url:'draw/Tech.json',     data:TechJson   }
    Tree:   { url:'draw/Tree.json',     data:TreeJson   }
    Flavor: { url:'jitter/Flavor.json', data:FlavorJson }
    Choice: { url:'jitter/Choice.json', data:ChoiceJson }
    Font:   { url: '',                  data:FontJson   } }

  Augm.komps = {
    Home:{ title:'Home', key:'Home', route:'Home', pracs:{}, ikw:false, icon:"fas fa-home",
    west:"Wood", north:"Wood", east:"Math", south:"Math", next:"Math", prev:"Wood" }
    Math:{ title:'Math', key:'Math', route:'Math', pracs:{}, ikw:true,  icon:"fas fa-bezier-curve",
    west:"Home", north:"Home", east:"Geom", south:"Geom", next:"Geom", prev:"Home" }
    Draw:{ title:'Draw', key:'Draw', route:'Draw', pracs:{}, ikw:false, icon:"fas fa-draw-polygon",
    west:"Math", north:"Math", east:"Hues", south:"Hues", next:"Hues", prev:"Math" }
    Hues:{ title:'Hues', key:'Hues', route:'Hues', pracs:{}, ikw:false, icon:"fas fa-palette",
    west:"Draw", north:"Draw", east:"Tool", south:"Tool", next:"Tool", prev:"Draw" }
    Tool:{ title:'Tool', key:'Tool', route:'Tool', pracs:{}, ikw:false, icon:"fas fa-wrench",
    west:"Hues", north:"Hues", east:"Cube", south:"Cube", next:"Cube", prev:"Hues" }
    Cube:{ title:'Cube', key:'Cube', route:'Cube', pracs:{}, ikw:false, icon:"fas fa-cubes",
    west:"Hues", north:"Hues", east:"Wood", south:"Wood", next:"Wood", prev:"Hues" }
    Wood:{ title:'Wood', key:'Wood', route:'Wood', pracs:{}, ikw:false, icon:"fas fa-tree",
    west:"Cube", north:"Cube", east:"Geom", south:"Geom", next:"Geom", prev:"Cube" }
    Geom:{ title:'Geom', key:'Geom', route:'Geom', pracs:{}, ikw:true,  icon:"fas fa-shapes",
    west:"Wood", north:"Wood", east:"Wood", south:"Test", next:"Test", prev:"Geom" }
    Test:{ title:'Test', key:'Test', pracs:{}, ikw:false, icon:"fas fa-stethoscope",
    north:"Geom", prev:"Geom", south:"Home",  next:"Home"  } }

  Augm.geomKomp =


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
    Augm.init( Augm.Batch )
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
  Augm.init =   ( batch ) ->
    Augm.Batch  = batch # Not necessary here, but assigned for compatibilitry
    window['Geom'] = {} # May still be needed by Ganjs
    subjects    = ["Nav","Tab","View"]
    streamLog   = { subscribe:false, publish:false, subjects:subjects }
    Augm.stream = new Stream( subjects, streamLog )
    Augm.mix    = new Mix( Augm )
    Augm.nav    = new Nav( Augm.stream, Augm.mix, batch, Augm.komps, Augm.pages )
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
      Tree:   { title:'Tree',   key:'Tree',   obj:null, show:false } }
    Hues:   {
      Color:   { title:'Color',   key:'Color',   show:false }, # No default because Hues needs
      Rgbs:    { title:'Rgbs',    key:'Rgbs',    show:false }, #   time to load MathBox script
      Polar:   { title:'Polar',   key:'Polar',   show:false },
      Vecs:    { title:'Vecs',    key:'Vecs',    show:false },
      Sphere:  { title:'Sphere',  key:'Sphere',  show:false },
      Regress: { title:'Regress', key:'Regress', show:false } }
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
      Table2: { title:'Pivot2', key:'Pivot2', created:false, show:false } }

  }

export default Augm

###
    # console.log( 'Augm.start() env', process.env.NODE_ENV )
    if process.env.NODE_ENV is 'development'
      Augm.routes.push( Augm.geomRoute )
      Augm.komps.Geom = Augm.geomKomp
    Augm.routeNames = Augm.createRouteNames( Augm.routes )

    loader = new Load()

  Augm.routes = [
    { path: '/',       name:'Home',   components:{ Home:   Home } },
    { path: '/math',   name:'Math',   components:{ Math:   Home.Math }, children: [
      { path:'ML',     name:'MathML', components:{ MathML: loader.load('MathND') } },
      { path:'EQ',     name:'MathEQ', components:{ MathEQ: loader.load('MathND') } } ] },
    { path: '/draw',   name:'Draw',   components:{ Draw:   loader.load('Draw') } },
    { path: '/hues',   name:'Hues',   components:{ Hues:   loader.load('Hues') } },
    { path: '/tool',   name:'Tool',   components:{ Tool:   Home.Tool }, children: [
      { path:'Gauges', name:'Gauges', components:{ Gauges: loader.load('Tools') } },
      { path:'Widget', name:'Widget', components:{ Widget: loader.load('Tools') } } ] },
    { path: '/cube',   name:'Cube',   components:{ Cube:   loader.load('Cube') } },
    { path: '/wood',   name:'Wood',   components:{ Wood:   loader.load('Wood') } } ]

  Augm.geomRoute =
    { path: '/geom', name:'Geom',   components:{ Geom:   Home.Geom }, children: [
      { path:'2D',   name:'Geom2D', components:{ Geom2D: loader.load('GeomND') } },
      { path:'3D',   name:'Geom3D', components:{ Geom3D: loader.load('GeomND') } } ] }
###
