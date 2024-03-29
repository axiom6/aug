
import { tester } from  '../../../lib/pub/test/Tester.js'
import Access from      '../../../lib/pub/util/Access.js'
import Stream from      '../../../lib/pub/util/Stream.js'
import Nav    from      '../../../lib/pub/navi/Nav.js'
import Touch  from      '../../../lib/pub/navi/Touch.js'
import Cache  from      '../../../lib/pub/util/Cache.js'
import Mix    from      '../../../lib/pub/navi/Mix.js'

import { createApp }    from 'vue'    #
import { createRouter, createWebHistory } from 'vue-router'
import Home             from '../../../vue/data/appl/Data.vue';

import PrinJson from '../../../data/muse/Prin.json'
import RowsJson from '../../../data/muse/Rows.json'
import InfoJson from '../../../data/muse/Info.json'
import KnowJson from '../../../data/muse/Know.json'
import WiseJson from '../../../data/muse/Wise.json'
import SoftwareJson from '../../../data/inno/Software.json'
import DataScienceJson from '../../../data/inno/DataScience.json'
import ScienceJson from '../../../data/inno/Science.json'
import MathJson from '../../../data/inno/Math.json'
import HuesJson from '../../../data/draw/Hues.json'


class Data

  Data.appName = 'Data'
  Data.mode    = `import.meta.env.MODE`

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  # 2. Muse.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Muse.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  # Data.batchRead( Muse.Batch, Muse.init, Data.refine )

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  Data.start = () ->
    Data.addToHead()
    for key, val of Data.Batch when val.refine? and val.refine
      val.data = Access.refine(val.data)
    Data.init( Data.Batch )
    return

  # Add these <link> tags to <head> because vite build makes a mess of them
  Data.addToHead = () ->
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

  Data.Batch = {
    Prin:     { url:'muse/Prin.json', data:PrinJson, refine:true }
    Rows:     { url:'muse/Rows.json', data:RowsJson, refine:true }
    Info:     { url:'muse/Info.json', data:InfoJson, refine:true }
    Know:     { url:'muse/Know.json', data:KnowJson, refine:true }
    Wise:     { url:'muse/Wise.json', data:WiseJson, refine:true }
    Software: { url:'inno/Software.json', data:SoftwareJson, refine:true }
    DataScience:     { url:'inno/DataScience.json', data:DataScienceJson, refine:true }
    Science:  { url:'inno/Science.json', data:ScienceJson, refine:true }
    Math:     { url:'inno/Math.json', data:MathJson, refine:true }
    Hues:     { url:'draw/Hues.json', data:HuesJson, refine:false }
  }

  Data.routes = [
    { path:'/',      name:'Home',  components:{ Home:  Home       } },
    { path:'/Store', name:'Store', components:{ Store: Home.Store } },
    { path:'/Table', name:'Table', components:{ Table: Home.Table } },
    { path:'/Query', name:'Query', components:{ Query: Home.Query } }
  ]

  Data.routeNames = Data.createRouteNames( Data.routes )

  # Toc.vue components and routes with no west or east directions
  Data.komps = Access.kompsDirs( {
    Home:{ title:'Home',   key:'Home',  route:'Home',  pracs:{}, ikw:false, icon:"fas fa-home" }
    Store:{ title:'Store', key:'Store', route:'Store', pracs:{}, ikw:true,  icon:"fas fa-cubes" }
    Table:{ title:'Table', key:'Table', route:'Table', pracs:{}, ikw:true,  icon:"fas fa-table" }
    Query:{ title:'Query', key:'Query', route:'Query', pracs:{}, ikw:true,  icon:"fas fa-question-circle" } } )

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Data.init =   () ->
    Data.myName = 'Muse'
    subjects    = ["Nav"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Data.stream = new Stream( subjects, infoSpec )
    Data.mix    = new Mix(   Data )
    Data.nav    = new Nav(   Data, Data.stream, Data.komps, {}, true )
    Data.touch  = new Touch( Data.stream, Data.nav )
    Data.cache  = new Cache( Data.stream ) if Data.mode is 'production'
    tester.setOptions( { testing:true, archive:false, verbose:false, debug:false } )
    Access.buildInnov( Data.Batch, 'DataScience',   'Info' )
    Access.mergePracs( Data.Batch, 'Prin', ['Info','Know','Wise'] ) # 'Data'
    #ata.mergeCols()
    try            # A lot can go wrong with vue3 initialization so trap errors
      Data.vue3()
    catch error
      console.error( 'Muse.vue3 app.use error', error )
    return

  Data.vue3 = () ->
    Data.app = createApp( Home.Dash   )
    Data.app.provide('mix',  Data.mix )
    Data.app.provide('nav',  Data.nav )
    Data.app.provide('tester', tester )
    router = Data.router( Data.routes )
    Data.app.use(        router )
    Data.nav.router    = router
    Data.app.mount('#muse')
    Data.nav.doRoute( { compKey:'Home' } )
    return

  # Lazy loader with dynamic import()
  Data.lazy = (name) ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( /* @vite-ignore */ path )`

  # Vue Router Routes
  Data.router = ( routes ) ->
    createRouter( { routes:routes, history:createWebHistory() } )

  Data.createRouteNames = ( routes ) ->
    routeNames = []
    for route in routes
      routeNames.push( route.name )
    routeNames

  # Merges principles and innovations into comp practices
  # Data.mergeCols = ( ) ->
  #  Data.build.dimDisps() # Add disps to every dim - dimension
  #  Data.build.colPracs() # Add pracs to every col
  #  return

  # Log practices for diagnostics
  Data.logPracs = ( compk ) ->
    console.log( 'Muse.pracs', Data.Batch[compk].data[compk].pracs )
    return

export default Data
