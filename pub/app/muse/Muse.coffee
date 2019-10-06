
import Data    from '../../base/util/Data.js'
import Build   from '../../ikw/cube/Build.js'
import Stream  from '../../base/util/Stream.js'
import Nav     from '../../base/util/Nav.js'
#mport Cache   from '../../base/util/Cache.js'

import Mixin  from '../../base/vue/Mixin.js'
import Vue    from '../../lib/vue/vue.esm.browser.js'
import Router from '../../lib/vue/vue-router.esm.js'
import Home   from './Home.js'

Vue['config'].productionTip = false

class Muse

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  # 2. Muse.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Muse.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  Muse.start = () ->
    Data.batchRead( Muse.Batch, Muse.init, Data.refine )
    return

  Muse.Batch = {
    Prin: { url:'muse/Prin.json', data:null, type:'Pack', plane:'Prin' }
    Rows: { url:'muse/Rows.json', data:null, type:'Pack', plane:'Rows' }
    Info: { url:'muse/Info.json', data:null, type:'Pack', plane:'Info' }
    Know: { url:'muse/Know.json', data:null, type:'Pack', plane:'Know' }
    Wise: { url:'muse/Wise.json', data:null, type:'Pack', plane:'Wise' },
    Data: { url:'muse/Data.json', data:null, type:'Pack', plane:'Data' } }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Muse.init =   ( batch ) ->
    Muse.Batch  = batch # Not necessary here, but assigned for compatibilitry
    Muse.app    = 'Muse'
    subjects    = ["Nav"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Muse.stream = new Stream( subjects, infoSpec )
    Muse.nav    = new Nav(   Muse.stream, batch, Muse.komps )
    Muse.build  = new Build( batch )
    #use.cache  = new Cache( Muse.stream )
    Muse.mergePracsPrin()
    #ain.build.logByColumn()
    Muse.vue()
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Muse.vue = () ->
    Muse.mixin = new Mixin( Muse, ['Home','Prin','Comp','Prac','Disp'] ) # Can't use komps
    Vue['mixin']( Muse.mixin.mixin() )
    Vue.use(Router)
    app = new Vue( { router:Muse.router(), render: (h) -> h(Home.Dash) } );
    Muse.nav.$router = app.$router;
    app.$mount('muse')
    return

  # Lazy loader with dynamic import()
  Muse.lazy = (name) ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( path )`

  # Vue Router Routes
  Muse.router = () ->
    new Router( {
      routes:[
        { path: '/',     name:'Home', components:{ Home: Home      } },
        { path: '/prin', name:'Prin', components:{ Prin: Home.Prin } },
        { path: '/comp', name:'Comp', components:{ Comp: Home.Comp } },
        { path: '/prac', name:'Prac', components:{ Prac: Home.Prac } },
        { path: '/disp', name:'Disp', components:{ Disp: Home.Disp } }
      ] } )

  # Toc.vue components and routes
  Muse.komps = {
    Home:{ title:'Home', key:'Home', route:'Home', pracs:{}, ikw:false, icon:"fas fa-home",
    west:"Wise", north:"Wise", prev:"Wise", east:"Prin", south:"Prin", next:"Prin"  }
    Prin:{ title:'Basis', key:'Prin', route:'Prin', pracs:{}, ikw:true,  icon:"fas fa-balance-scale",
    west:"Home", north:"Home", prev:"Home", east:"Info", south:"Info", next:"Info" }
    Info:{ title:'Info', key:'Info', route:'Comp', pracs:{}, ikw:true,  icon:"fas fa-th",
    west:"Prin", north:"Prin", prev:"Prin", east:"Know", south:"Know", next:"Know" }
    Know:{ title:'Know', key:'Know', route:'Comp', pracs:{}, ikw:true,  icon:"fas fa-university",
    west:"Info", north:"Info", prev:"Info", east:"Wise", south:"Wise", next:"Wise" }
    Wise:{ title:'Wise', key:'Wise', route:'Comp', pracs:{}, ikw:true,  icon:"fab fa-tripadvisor",
    west:"Know", north:"Know", prev:"Know", east:"Home", south:"Home", next:"Home" } }

  # Merges principles into practices
  Muse.mergePracsPrin = () ->
    cols = Muse.Batch['Prin'].data.pracs
    for comp in ['Info','Know','Wise']
      prcs = Muse.Batch[comp].data.pracs
      for own  key, col of cols
        prcs[key] = col
    Muse.build.dimDisps() # Add disps to every dim - dimension
    Muse.build.colPracs() # Add pracs to every col
    return

  # Log practices for diagnostics
  Muse.logPracs = ( compk ) ->
    console.log( 'Muse.pracs', Muse.Batch[compk].data[compk].pracs )
    return

export default Muse
