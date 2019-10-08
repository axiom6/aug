
import Data    from '../../base/util/Data.js'
import Stream  from '../../base/util/Stream.js'
import Dir     from '../../base/nav/Dir.js'
import Cache   from '../../base/util/Cache.js'
#mport Test    from './Test.js'

import Mixin   from '../../base/vue/Mixin.js'
import Vue     from '../../lib/vue/vue.esm.browser.js'
import Router  from '../../lib/vue/vue-router.esm.js'
import Home    from '../../vue/jitter/Home.js'

Vue['config'].productionTip = false

class Jitter

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Jitter.Batch. Call Jitter.init() when complete.
  # 2. Jitter.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Jitter.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Jitter.Batch. Call Jitter.init() when complete.
  Jitter.start = () ->
    Data.batchRead( Jitter.Batch, Jitter.init, Data.refine )
    return

  Jitter.Batch = {
    Choice: { url:'jitter/Choice.json', data:null, type:'None', plane:'None' }
    Jitter: { url:'jitter/Jitter.json', data:null, type:'None', plane:'None' }
    Flavor: { url:'jitter/Flavor.json', data:null, type:'None', plane:'None' }
    Region: { url:'jitter/Region.json', data:null, type:'None', plane:'None' } }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Jitter.init =   ( batch ) ->
    Jitter.Batch   = batch # Not necessary here, but assigned for compatibilitry
    Jitter.app     = 'Jitter'
    subjects       = ["Dir"]
    streamLog      = { subscribe:false, publish:false, subjects:subjects }
    Jitter.stream  = new Stream( subjects, streamLog )
    Jitter.dir     = new Dir(   Jitter.stream, Jitter.komps )
    Jitter.cache   = new Cache( Jitter.stream )
    Jitter.vue()
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Jitter.vue = () ->
    Jitter.mixin = new Mixin( Jitter, Jitter.komps )
    Vue['mixin']( Jitter.mixin.mixin() )
    Vue.use(Router)
    app = new Vue( { router:Jitter.router(), render: (h) -> h(Home.Dash) } );
    Jitter.dir.$router = app.$router;
    app.$mount('j-jitter')
    return

  # Lazy loader with dynamic import()
  Jitter.lazy = (name) -> () ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( path )`

  # Vue Router Routes
  Jitter.router = () ->
    new Router( {
      routes:[
        { path: '/',       name:'Home',   components:{ Home:   Home } },
        { path: '/flavor', name:'Flavor', components:{ Flavor: Jitter.lazy('vue/jitter/Flavor' ) } },
        { path: '/roast',  name:'Roast',  components:{ Roast:  Jitter.lazy('vue/jitter/Roast'  ) } },
        { path: '/brew',   name:'Brew',   components:{ Brew:   Jitter.lazy('vue/jitter/Brew'   ) } },
        { path: '/drink',  name:'Drink',  components:{ Brew:   Jitter.lazy('vue/jitter/Drink'  ) } },
        { path: '/body',   name:'Body',   components:{ Body:   Jitter.lazy('vue/jitter/Body'   ) } },
        { path: '/world',  name:'World',  components:{ World:  Jitter.lazy('vue/jitter/World'  ) } },
        { path: '/region', name:'Region', components:{ Region: Jitter.lazy('vue/jitter/Region' ) } }
      ] } )

  # Toc.vue components and routes
  Jitter.komps = {
    Home:{   name:'Home',   route:'Home',   icon:"fas fa-draw-polygon",
    west:"Brew",   north:"Roast",  east:"Flavor", south:"Drink",  next:"Body",   prev:"Home" }
    Flavor:{ name:'Flavor', route:'Flavor', icon:"fas fa-bezier-curve",
    west:"Drink",  north:"Brew",   east:"Roast",  south:"Body",   next:"Home",   prev:"Home" }
    Roast:{  name:'Roast',  route:'Roast',  icon:"fas fa-bezier-curve",
    west:"Body",   north:"Drink",  east:"Brew",   south:"Home",   next:"Flavor", prev:"Home" }
    Brew:{   name:'Brew',   route:'Brew',   icon:"fas fa-bezier-curve",
    west:"Home",   north:"Body",   east:"Drink",  south:"Flavor", next:"Roast",  prev:"Home" }
    Drink:{  name:'Drink',  route:'Drink',  icon:"fas fa-bezier-curve" ,
    west:"Flavor", north:"Home",   east:"Body",   south:"Roast",  next:"Brew",   prev:"Home" }
    Body:{   name:'Body',   route:'Body',   icon:"fas fa-bezier-curve",
    west:"Roast",  north:"Flavor", east:"Home",   south:"Brew",   next:"Drink",  prev:"Home" } }

export default Jitter
