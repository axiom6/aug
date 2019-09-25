
import Data    from '../../base/util/Data.js'
import Stream  from '../../base/util/Stream.js'
import Nav     from '../../base/util/Nav.js'
import Cache   from '../../base/util/Cache.js'
#mport Test   from './Test.js'

import Mixin  from '../../base/vue/Mixin.js'
import Vue    from '../../lib/vue/vue.esm.browser.js'
import Router from '../../lib/vue/vue-router.esm.js'
import Home   from './Home.js'

Vue['config'].productionTip = false

class Augm

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Augm.Batch. Call Augm.init() when complete.
  # 2. Augm.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Augm.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Augm.Batch. Call Augm.init() when complete.
  Augm.start = () ->
    Data.batchRead( Augm.Batch, Augm.init, Data.refine )
    return

  Augm.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json"

  Augm.Batch = {
    Math: { url:'augm/Math.json', data:null, type:'Pack', plane:'Math' }
    Geom: { url:'augm/Geom.json', data:null, type:'Pack', plane:'Geom' }
    Data: { url:'augm/Data.json', data:null, type:'Pack', plane:'Data' }
    Prin: { url:'muse/Prin.json', data:null, type:'Pack', plane:'Prin' }
    Rows: { url:'muse/Rows.json', data:null, type:'Pack', plane:'Rows' }
    Info: { url:'muse/Info.json', data:null, type:'Pack', plane:'Info' }
    Know: { url:'muse/Know.json', data:null, type:'Pack', plane:'Know' }
    Wise: { url:'muse/Wise.json', data:null, type:'Pack', plane:'Wise' }
    Cube: { url:'muse/Cube.json', data:null, type:'Pack', plane:'Cube' }
    Font: { url:Augm.FontUrl,     data:null, type:'Font', plane:'Cube' } }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Augm.init =   ( batch ) ->
    Augm.Batch  = batch # Not necessary here, but assigned for compatibilitry
    window['Geom'] = {} # May still be needed by Ganjs
    Augm.app    = 'Augm'
    subjects    = ["Draw","Note","Menu","Tabs","Geom","Data","Cache","Navd"]
    streamLog    = { subscribe:false, publish:false, subjects:subjects }
    Augm.stream  = new Stream( subjects, streamLog )
    Augm.nav    = new Nav(   Augm.stream, batch, Augm.komps )
    #ugm.cache  = new Cache( Augm.stream )
    Augm.vue()
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Augm.vue = () ->
    Augm.mixin = new Mixin( Augm, Augm.komps )
    Vue['mixin']( Augm.mixin.mixin() )
    Vue.use(Router)
    app = new Vue( { router:Augm.router(), render: (h) -> h(Home.Dash) } );
    Augm.nav.$router = app.$router;
    app.$mount('h-augm')
    return

  # Lazy loader with dynamic import()
  Augm.lazy = (name) -> () ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( path )`

  # Vue Router Routes
  Augm.router = () ->
    new Router( {
      routes:[
        { path: '/',        name:'Home',    components:{ Home:     Home } },
        { path: '/math',    name:'Math',    components:{ Math:     Home.Math }, children: [
          { path:'ML',      name:'MathML',  components:{ MathML:   Augm.lazy( 'vue/math/MathML') } },
          { path:'EQ',      name:'MathEQ',  components:{ MathEQ:   Augm.lazy( 'vue/math/MathEQ') } } ] },
        { path: '/geom',    name:'Geom',    components:{ Geom:     Home.Geom }, children: [
          { path:'2D',      name:'Geom2D',  components:{ Geom2D:   Augm.lazy( 'vue/geom/Geom2D') } },
          { path:'3D',      name:'Geom3D',  components:{ Geom3D:   Augm.lazy( 'vue/geom/Geom3D') } },
          { path:'4D',      name:'Geom4D',  components:{ Geom4D:   Augm.lazy( 'vue/geom/Geom4D') } } ] },
        { path: '/note',    name:'Note',    components:{ Note:     Home.Note }, children: [
          { path:'stand',   name:'Stand',   components:{ Stand:    Augm.lazy('vue/note/StandVue' ) } },
          { path:'embed',   name:'Embed',   components:{ Embed:    Augm.lazy('vue/note/EmbedVue' ) } },
          { path:'maths',   name:'Maths',   components:{ Maths:    Augm.lazy('vue/note/MathsVue' ) } },
          { path:'ganja',   name:'Ganja',   components:{ Ganja:    Augm.lazy('vue/note/GanjaVue' ) } } ] },
        { path: '/draw',    name:'Draw',    components:{ Draw:     Augm.lazy('vue/draw/Draw'     ) } },
        { path: '/hues',    name:'Hues',    components:{ Hues:     Augm.lazy('vue/draw/Hues'     ) } },
        { path: '/cube',    name:'Cube',    components:{ Cube:     Augm.lazy('vue/cube/Cube'     ) } },
        { path: '/wood',    name:'Wood',    components:{ Wood:     Augm.lazy('vue/wood/Wood'     ) } }
      # { path: '/data',    name:'Data',    components:{ Data:     Home.Data }, children: [
      #   { path:'tables',  name:'Tables',  components:{ Tables:   Augm.lazy( 'vue/data/Tables') } },
      #   { path:'pivots',  name:'Pivots',  components:{ Pivots:   Augm.lazy( 'vue/data/Pivots') } } ] }
      ] } )

  # Toc.vue and Nav components  routes and directions
  Augm.komps = {
    Home:{ title:'Home', key:'Home', route:'Home', pracs:{}, ikw:false, icon:"fas fa-home",
    west:"Wood", north:"Wood", east:"Math", south:"Math", next:"Math", prev:"Wood" }
    Math:{ title:'Math', key:'Math', route:'Math', pracs:{}, ikw:true,  icon:"fas fa-bezier-curve",
    west:"Home", north:"Home", east:"Geom", south:"Geom", next:"Geom", prev:"Home" }
    Geom:{ title:'Geom', key:'Geom', route:'Geom', pracs:{}, ikw:true,  icon:"fas fa-shapes",
    west:"Math", north:"Math", east:"Note", south:"Note", next:"Note", prev:"Math" }
  # Data:{ title:'Data', key:'Data', route:'Data', pracs:{}, ikw:true,  icon:"fas fa-database"     }
    Note:{ title:'Note', key:'Note', route:'Note', pracs:{}, ikw:false, icon:"fab fa-leanpub",
    west:"Geom", north:"Geom", east:"Draw", south:"Draw", next:"Draw", prev:"Geom" }
    Draw:{ title:'Draw', key:'Draw', route:'Draw', pracs:{}, ikw:false, icon:"fas fa-draw-polygon",
    west:"Note", north:"Note", east:"Hues", south:"Hues", next:"Hues", prev:"Note" }
    Hues:{ title:'Hues', key:'Hues', route:'Hues', pracs:{}, ikw:false, icon:"fas fa-palette",
    west:"Draw", north:"Draw", east:"Cube", south:"Cube", next:"Cube", prev:"Draw" }
    Cube:{ title:'Cube', key:'Cube', route:'Cube', pracs:{}, ikw:false, icon:"fas fa-cubes",
    west:"Hues", north:"Hues", east:"Wood", south:"Wood", next:"Wood", prev:"Hues" }
    Wood:{ title:'Wood', key:'Wood', route:'Wood', pracs:{}, ikw:false, icon:"fas fa-tree",
    west:"Cube", north:"Cube", east:"Home", south:"Home", next:"Home", prev:"Cube" } }

export default Augm
