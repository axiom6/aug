
import Data    from '../../base/util/Data.js'
import Build   from '../../ikw/cube/Build.js'
import Stream  from '../../base/util/Stream.js'
import Nav     from '../../base/util/Nav.js'
import Cache   from '../../base/util/Cache.js'

import Mixin  from '../../base/vue/Mixin.js'
import Vue    from '../../lib/vue/vue.esm.browser.js'
import Router from '../../lib/vue/vue-router.esm.js'
import Home   from './Home.js'

Vue['config'].productionTip = false

class Main

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Main.Batch. Call Main.init() when complete.
  # 2. Main.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Main.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Main.Batch. Call Main.init() when complete.
  Main.start = () ->
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json"

  Main.Batch = {
    Prin: { url:'muse/Prin.json', data:null, type:'Pack', plane:'Prin' }
    Rows: { url:'muse/Rows.json', data:null, type:'Pack', plane:'Rows' }
    Info: { url:'muse/Info.json', data:null, type:'Pack', plane:'Info' }
    Know: { url:'muse/Know.json', data:null, type:'Pack', plane:'Know' }
    Wise: { url:'muse/Wise.json', data:null, type:'Pack', plane:'Wise' }
    Cube: { url:'muse/Cube.json', data:null, type:'Pack', plane:'Cube' }
    Font: { url:Main.FontUrl,     data:null, type:'Font', plane:'Cube' } }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Main.init =   ( batch ) ->
    Main.Batch  = batch # Not necessary here, but assigned for compatibilitry
    Main.app    = 'Muse'
    subjects    = ["Info","Know","Wise","Cube","Menu","Page","Nav","Toc","Cache"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Main.stream = new Stream( subjects, infoSpec )
    Main.nav    = new Nav(   Main.stream, batch, 'Info' )
    Main.build  = new Build( batch )
    #ain.cache  = new Cache( Main.stream )
    Main.mergePracsPrin()
    #ain.build.logByColumn()
    Main.vue()
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Main.vue = () ->

    Main.mixin = new Mixin( Main, ['Home','Prin','Comp','Prac','Disp','Cube'] )
    Vue['mixin']( Main.mixin.mixin() )
    Vue.use(Router)
    app = new Vue( { router:Main.router(), render: (h) -> h(Home.Dash) } );
    app.$mount('muse')
    return

  # Lazy loader with dynamic import()
  Main.lazy = (name) ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( path )`

  # Vue Router Routes
  Main.router = () ->
    new Router( {
      routes:[
        { path: '/',     name:'Home', components:{ Home: Home      } },
        { path: '/prin', name:'Prin', components:{ Prin: Home.Prin } },
        { path: '/comp', name:'Comp', components:{ Comp: Home.Comp } },
        { path: '/prac', name:'Prac', components:{ Prac: Home.Prac } },
        { path: '/disp', name:'Disp', components:{ Disp: Home.Disp } },
        { path: '/cube', name:'Cube', components:{ Cube: Main.lazy( 'vue/cube/Cube') } }
      ] } )

  # Toc.vue components and routes
  Main.komps = {
    Prin:{ title:'Prin', key:'Prin', route:'Prin', pracs:{}, ikw:true,  icon:"fas fa-balance-scale" }
    Info:{ title:'Info', key:'Info', route:'Comp', pracs:{}, ikw:true,  icon:"fas fa-th"            }
    Know:{ title:'Know', key:'Know', route:'Comp', pracs:{}, ikw:true,  icon:"fas fa-university"    }
    Wise:{ title:'Wise', key:'Wise', route:'Comp', pracs:{}, ikw:true,  icon:"fab fa-tripadvisor"   }
    Cube:{ title:'Cube', key:'Cube', route:'Comp', pracs:{}, ikw:false, icon:"fas fa-cubes"         } }

  # Merges principles into practices
  Main.mergePracsPrin = () ->
    cols = Main.Batch['Prin'].data.pracs
    for comp in ['Info','Know','Wise']
      prcs = Main.Batch[comp].data.pracs
      for own  key, col of cols
        prcs[key] = col
    Main.build.dimDisps() # Add disps to every dim - dimension
    Main.build.colPracs() # Add pracs to every col
    return

  # Log practices for diagnostics
  Main.logPracs = ( compk ) ->
    console.log( 'Main.pracs', Main.Batch[compk].data[compk].pracs )
    return

export default Main
