
import Data    from '../../base/util/Data.js'
import Stream  from '../../base/util/Stream.js'
import Touch   from '../../base/nav/Touch.js'
#mport Cache   from '../../base/util/Cache.js'
import Mix     from '../../base/nav/Mix.Jitt.js'
import Nav     from '../../base/nav/Nav.Jitt.js'

import { createApp } from 'vue'    #
import { createRouter, createWebHistory } from 'vue-router'

import ChoiceJson from '../../../data/jitter/Choice.json'
import JitterJson from '../../../data/jitter/Jitter.json'
import FlavorJson from '../../../data/jitter/Flavor.json'

import Home    from '../../../vue/jitt/appl/Jitt.vue'
import Flavor  from '../../../vue/jitt/main/Flavor.vue'
import Roast   from '../../../vue/jitt/main/Roast.vue'
import Brew    from '../../../vue/jitt/main/Brew.vue'
import Drink   from '../../../vue/jitt/main/Drink.vue'
import Body    from '../../../vue/jitt/main/Body.vue'
import Done    from '../../../vue/jitt/main/Done.vue'
#mport World   from '../../../vue/jitt/main/World.vue'
#mport Region  from '../../../vue/jitt/main/Region.vue'

class Jitter

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Jitter.Batch. Call Jitter.init() when complete.
  # 2. Jitter.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Jitter.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Jitter.Batch. Call Jitter.init() when complete.
  Jitter.start = () ->
    # Data.batchRead( Jitter.Batch, Jitter.init, Data.refine )
    for key, val of Jitter.Batch when val.refine? and val.refine
      val.data = Data.refine(val.data)
    Jitter.init( Jitter.Batch )
    return

  Jitter.Batch = {
    Choice: { url:'jitter/Choice.json', data:ChoiceJson, type:'None', plane:'None', refine:true }
    Jitter: { url:'jitter/Jitter.json', data:JitterJson, type:'None', plane:'None', refine:true }
    Flavor: { url:'jitter/Flavor.json', data:FlavorJson, type:'None', plane:'None', refine:true } }

  # Vue Router Routes
  Jitter.routes = [
    { path: '/',       name:'Home',   components:{ Home:   Home    } }
    { path: '/flavor', name:'Flavor', components:{ Flavor: Flavor  } }
    { path: '/roast',  name:'Roast',  components:{ Roast:  Roast   } }
    { path: '/brew',   name:'Brew',   components:{ Brew:   Brew    } }
    { path: '/drink',  name:'Drink',  components:{ Brew:   Drink   } }
    { path: '/body',   name:'Body',   components:{ Body:   Body    } }
    { path: '/done',   name:'Done',   components:{ Done:   Done    } } ]

  # Toc.vue components and route Nav() directions
  Jitter.komps = {
    Home:{   name:'Home',   route:'Home',   icon:"fas fa-draw-polygon",
    west:"Flavor", north:"Flavor",  east:"Flavor", south:"Flavor",  next:"Home", prev:"Home" }
    Flavor:{ name:'Flavor', route:'Flavor', icon:"fas fa-bezier-curve",
    west:"Roast",  north:"Roast",   east:"Roast",  south:"Roast",   next:"Home", prev:"Home" }
    Roast:{  name:'Roast',  route:'Roast',  icon:"fas fa-bezier-curve",
    west:"Brew",   north:"Brew",  east:"Brew",   south:"Brew",   next:"Home", prev:"Home" }
    Brew:{   name:'Brew',   route:'Brew',   icon:"fas fa-bezier-curve",
    west:"Drink",   north:"Drink",   east:"Drink",  south:"Drink", next:"Home", prev:"Home" }
    Drink:{  name:'Drink',  route:'Drink',  icon:"fas fa-bezier-curve" ,
    west:"Body", north:"Body",   east:"Body",   south:"Body",  next:"Home", prev:"Home" }
    Body:{   name:'Body',   route:'Body',   icon:"fas fa-bezier-curve",
    west:"Flavor",  north:"Flavor", east:"Flavor",   south:"Flavor",   next:"Home", prev:"Home" }
    Done:{   name:'Done',   route:'Done',   icon:"fas fa-bezier-curve",
    west:"Home",  north:"Home", east:"Home",   south:"Home",   next:"Home", prev:"Home" } }


  Jitter.routeNames = Jitter.createRouteNames( Jitter.routes )

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Jitter.init =   ( batch ) ->
    Jitter.Batch   = batch # Not necessary here, but assigned for compatibilitry
    Jitter.app     = 'Jitter'
    subjects       = ["Dir","Nav"]
    streamLog      = { subscribe:false, publish:false, subjects:subjects }
    Jitter.stream  = new Stream( subjects, streamLog )
    Jitter.mix     = new Mix(   Jitter, Jitter.routeNames )
    Jitter.nav     = new Nav(   Jitter.stream, batch, Jitter.routes, Jitter.routeNames, Jitter.komps, true )
    Jitter.touch   = new Touch( Jitter.stream, Jitter.nav )
    #itter.cache   = new Cache( Jitter.stream )
    Jitter.vue()
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Jitter.vue = () ->
    Jitter.app = createApp( Home.Dash   )
    Jitter.app.provide('app',     Jitter.app     )
    Jitter.app.provide('mix',     Jitter.mix     )
    Jitter.app.provide('nav',     Jitter.nav     )
    router = Jitter.router( Jitter.routes )
    Jitter.app.use(        router )
    Jitter.nav.router    = router
    Jitter.app.mount('j-jitter')
    Jitter.nav.doRoute( { route:'Home' } )
    return

  # Lazy loader with dynamic import()
  Jitter.lazy = (name) -> () ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( /* @vite-ignore */ path )`

  # Vue Router Routes
  Jitter.router = ( routes ) ->
    createRouter( { routes:routes, history:createWebHistory() } )

  Jitter.createRouteNames = ( routes ) ->
    routeNames = []
    for route in routes
      routeNames.push( route.name )
    routeNames

export default Jitter
