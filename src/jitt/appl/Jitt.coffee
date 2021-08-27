
import { tester } from  '../../../lib/pub/test/Tester.js'
import Access     from '../../../lib/pub/util/Access.js'
import Stream     from '../../../lib/pub/util/Stream.js'
import Touch      from '../../../lib/pub/navi/Touch.js'
import Cache      from '../../../lib/pub/util/Cache.js'
import Mix        from '../../../lib/pub/navi/Mix.js'
import Nav        from '../../../lib/pub/navi/Nav.js'
import Choice     from '../../../lib/pub/navi/Choice.js'

import { createApp } from 'vue'    #
import { createRouter, createWebHistory } from 'vue-router'

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

  Jitter.appName   = 'Jitter'
  Jitter.mode      = `import.meta.env.MODE`

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Jitter.Batch. Call Jitter.init() when complete.
  # 2. Jitter.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Jitter.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Jitter.Batch. Call Jitter.init() when complete.
  Jitter.start = () ->
    Jitter.addToHead()
    for key, val of Jitter.Batch when val.refine? and val.refine
      val.data = Access.refine(val.data)
    Jitter.init( Jitter.Batch )
    return

  # Add these <link> tags to <head> because vite build makes a mess of them
  Jitter.addToHead = () ->
    # manifest = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
    # siteLink = """<link href="https://vit-muse.web.app/" rel="canonical">"""
    maniElem                = document.createElement('link')
    maniElem.href           = "manifest.json?v=2"
    maniElem.rel            = "manifest"
    maniElem['crossorigin'] = "use-credentials"
    siteElem      = document.createElement('link')
    siteElem.href = window.location.href
    siteElem.rel  = "canonical"
    head          = document.getElementsByTagName("head")[0]
    head.appendChild(maniElem)
    head.appendChild(siteElem)
    return

  Jitter.Batch = {
    Jitter: { url:'jitter/Jitter.json', data:JitterJson, type:'none', plane:'none', refine:true }
    Flavor: { url:'jitter/Flavor.json', data:FlavorJson, type:'none', plane:'none', refine:true } }

  # Vue Router Routes
  Jitter.routes = [
    { path: '/',       name:'Home',   components:{ Home:   Home    } }
    { path: '/Flavor', name:'Flavor', components:{ Flavor: Flavor  } }
    { path: '/Roast',  name:'Roast',  components:{ Roast:  Roast   } }
    { path: '/Brew',   name:'Brew',   components:{ Brew:   Brew    } }
    { path: '/Drink',  name:'Drink',  components:{ Brew:   Drink   } }
    { path: '/Body',   name:'Body',   components:{ Body:   Body    } }
    { path: '/Done',   name:'Done',   components:{ Done:   Done    } } ]

  # Toc.vue components and route Nav() directions
  Jitter.komps = Access.kompsDirs( {
    Home:{   name:'Home',   route:'Home',   icon:"fas fa-draw-polygon" }
    Flavor:{ name:'Flavor', route:'Flavor', icon:"fas fa-bezier-curve" }
    Roast:{  name:'Roast',  route:'Roast',  icon:"fas fa-bezier-curve" }
    Brew:{   name:'Brew',   route:'Brew',   icon:"fas fa-bezier-curve" }
    Drink:{  name:'Drink',  route:'Drink',  icon:"fas fa-bezier-curve" }
    Body:{   name:'Body',   route:'Body',   icon:"fas fa-bezier-curve" }
    Done:{   name:'Done',   route:'Done',   icon:"fas fa-bezier-curve" } } )

  Jitter.routeNames = Jitter.createRouteNames( Jitter.routes )

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Jitter.init =   () ->
    Jitter.app     = 'Jitter'
    subjects       = ["Dir","Nav"]
    streamLog      = { subscribe:false, publish:false, subjects:subjects }
    Jitter.stream  = new Stream( subjects, streamLog )
    Jitter.mix     = new Mix(    Jitter, Jitter.routeNames )
    Jitter.nav     = new Nav(    Jitter, Jitter.stream, Jitter.komps, {}, true )
    Jitter.choice  = new Choice( Jitter.nav )
    Jitter.touch   = new Touch(  Jitter.stream, Jitter.nav )
    Jitter.cache   = new Cache(  Jitter.stream ) if Jitter.mode is 'production'
    tester.setOptions( { testing:true, archive:true, verbose:false, debug:false } )
    Jitter.vue()
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Jitter.vue = () ->
    Jitter.app = createApp( Home.Dash   )
    Jitter.app.provide('app',    Jitter.app )
    Jitter.app.provide('mix',    Jitter.mix )
    Jitter.app.provide('nav',    Jitter.nav )
    Jitter.app.provide('choice', Jitter.choice )
    Jitter.app.provide('tester', tester     )
    router = Jitter.router( Jitter.routes )
    Jitter.app.use(        router )
    Jitter.nav.router    = router
    Jitter.app.mount('j-jitter')
    Jitter.nav.doRoute( { compKey:'Home' } )
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
