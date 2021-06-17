
import Access from '../../../lib/pub/base/util/Access.js'
import Stream from '../../../lib/pub/base/util/Stream.js'
import Nav    from '../../../lib/pub/base/nav/Nav.js'
import Touch  from '../../../lib/pub/base/nav/Touch.js'
import Cache  from '../../../lib/pub/base/util/Cache.js'
import Mix    from '../../../lib/pub/base/nav/Mix.js'


import { createApp }    from 'vue'    #
import { createRouter, createWebHistory } from 'vue-router'
import Home             from '../../../vue/data/appl/Data.vue';

import ConditionsEastJson from '../../../data/exit/ConditionsEast.json'
import ConditionsWestJson from '../../../data/exit/ConditionsWest.json'
import DealsJson          from '../../../data/exit/Deals.json'
import ForcastsJson       from '../../../data/exit/Forcasts.json'
import I70MilePostsJson   from '../../../data/exit/I70MilePosts.json'
import SegmentsEastJson   from '../../../data/exit/SegmentsEast.json'
import SegmentsWestJson   from '../../../data/exit/SegmentsWest.json'


class Exit

  Exit.appName = 'Exit'

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  # 2. Muse.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Muse.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  # Data.batchRead( Muse.Batch, Muse.init, Data.refine )

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  Exit.start = () ->
    Exit.addToHead()
    for key, val of Exit.Batch when val.refine? and val.refine
      val.data = Access.refine(val.data)
    Exit.init( Exit.Batch )
    return

  # Add these <link> tags to <head> because vite build makes a mess of them
  Exit.addToHead = () ->
    # manifest = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
    # siteLink = """<link href="https://vit-muse.web.app/" rel="canonical">"""
    maniElem                = document.createElement('link')
    maniElem.href           = "manifest.json"
    maniElem.rel            = "manifest"
    maniElem['crossorigin'] = "use-credentials"
    siteElem = document.createElement('link')
    # console.log( 'Location', window.location.href )
    siteElem.href        =   window.location.href # "https://vit-muse.web.app/" if window.location.contains('vit-muse')
    siteElem.rel         = "canonical"
    document.getElementsByTagName("head")[0].appendChild(maniElem);
    document.getElementsByTagName("head")[0].appendChild(siteElem);
    return

  Exit.Batch = {
    East:     { url:'muse/Prin.json', data:ConditionsEastJson, refine:true }
    West:     { url:'muse/Rows.json', data:ConditionsWestJson, refine:true }
    Deal:     { url:'muse/Info.json', data:DealsJson,          refine:true }
    Fore:     { url:'muse/Know.json', data:ForcastsJson,       refine:true }
    Post:     { url:'muse/Wise.json', data:I70MilePostsJson,   refine:true }
    Sege:     { url:'inno/Soft.json', data:SegmentsEastJson,   refine:true }
    SegW:     { url:'inno/Data.json', data:SegmentsWestJson,   refine:true }
  }

  Exit.routes = [
    { path:'/',      name:'Home',  components:{ Home:  Home       } },
    { path:'/Store', name:'Store', components:{ Store: Home.Store } },
    { path:'/Table', name:'Table', components:{ Table: Home.Table } },
    { path:'/Query', name:'Query', components:{ Query: Home.Query } }
  ]

  Exit.routeNames = Exit.createRouteNames( Exit.routes )

  # Toc.vue components and routes with no west or east directions
  Exit.komps = {
    Home:{ title:'Home',   key:'Home',  route:'Home',  pracs:{}, ikw:false, icon:"fas fa-home",
    north:"Query", prev:"Query", south:"Store",  next:"Store"  }
    Store:{ title:'Store', key:'Store', route:'Store', pracs:{}, ikw:true,  icon:"fas fa-cubes",
    north:"Home", prev:"Home", south:"Table",  next:"Table" }
    Table:{ title:'Table', key:'Table', route:'Table', pracs:{}, ikw:true,  icon:"fas fa-table",
    north:"Store", prev:"Store", south:"Query",  next:"Query" }
    Query:{ title:'Query', key:'Query', route:'Query', pracs:{}, ikw:true,  icon:"fas fa-question-circle",
    north:"Table", prev:"Table", south:"Home",  next:"Home" }
  }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Exit.init =   ( batch ) ->
    Exit.Batch  = batch # Not necessary here, but assigned for compatibilitry
    Exit.myName = 'Muse'
    subjects    = ["Nav"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Exit.stream = new Stream( subjects, infoSpec )
    Exit.mix    = new Mix(   Exit, Exit.routeNames )
    Exit.nav    = new Nav(   Exit.stream, batch, Exit.routes, Exit.routeNames, Exit.komps, true )
    Exit.touch  = new Touch( Exit.stream, Exit.nav )
    #ata.build  = new Build( batch, Data.komps )
    Exit.cache  = new Cache( Exit.stream )
    Access.buildInnov( batch, 'Data',   'Info' )
    Access.mergePracs( batch, 'Prin', ['Info','Know','Wise'] ) # 'Data'
    #ata.mergeCols()
    try            # A lot can go wrong with vue3 initialization so trap errors
      Exit.vue3()
    catch error
      console.error( 'Muse.vue3 app.use error', error )
    return

  Exit.vue3 = () ->
    Exit.app = createApp( Home.Dash   )
    Exit.app.provide('mix',  Exit.mix )
    Exit.app.provide('nav',  Exit.nav )
    router = Exit.router( Exit.routes )
    Exit.app.use(        router )
    Exit.nav.router    = router
    Exit.app.mount('#muse')
    Exit.nav.doRoute( { route:'Home' } )
    return

  # Lazy loader with dynamic import()
  Exit.lazy = (name) ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( /* @vite-ignore */ path )`

  # Vue Router Routes
  Exit.router = ( routes ) ->
    createRouter( { routes:routes, history:createWebHistory() } )

  Exit.createRouteNames = ( routes ) ->
    routeNames = []
    for route in routes
      routeNames.push( route.name )
    routeNames

  # Log practices for diagnostics
  Exit.logPracs = ( compk ) ->
    console.log( 'Muse.pracs', Exit.Batch[compk].data[compk].pracs )
    return

export default Exit
