
import Access from '../../base/util/Access.js'
import Build  from '../../base/util/Build.js'
import Stream from '../../base/util/Stream.js'
import Nav    from '../../base/nav/Nav.js'
import Touch  from '../../base/nav/Touch.js'
#mport Cache  from '../../base/util/Cache.js'
import Mix    from '../../base/nav/Mix.js'
#mport MuseLD from './MuseLD.js'


import { createApp }    from 'vue'    #
import { createRouter, createWebHistory } from 'vue-router'
import Home             from '../../../vue/muse/appl/Muse.vue';

#mport MuseLink from './MuseLD.json'
import PrinJson from '../../../data/muse/Prin.json'
import RowsJson from '../../../data/muse/Rows.json'
import InfoJson from '../../../data/muse/Info.json'
import KnowJson from '../../../data/muse/Know.json'
import WiseJson from '../../../data/muse/Wise.json'
import SoftJson from '../../../data/inno/Soft.json'
import DataJson from '../../../data/inno/Data.json'
import ScieJson from '../../../data/inno/Scie.json'
import MathJson from '../../../data/inno/Math.json'


class Muse

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  # 2. Muse.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Muse.vue() launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  # Data.batchRead( Muse.Batch, Muse.init, Data.refine )

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Muse.Batch. Call Muse.init() when complete.
  Muse.start = () ->
    #useLD   = new MuseLD( Home )
    # routesLD = museLD.toRoutes()
    # console.log( 'MuseLD.toRoutes()', routesLD )
    Muse.addToHead()
    for key, val of Muse.Batch when val.refine? and val.refine
      val.data = Access.refine(val.data)
    Muse.init( Muse.Batch )
    return

  # Add these <link> tags to <head> because vite build makes a mess of them
  Muse.addToHead = () ->
    # manifest = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
    # siteLink = """<link href="https://vit-muse.web.app/" rel="canonical">"""
    maniElem                = document.createElement('link')
    maniElem.href           = "manifest.json"
    maniElem.rel            = "manifest"
    maniElem['crossorigin'] = "use-credentials"
    siteElem = document.createElement('link')
    # console.log( 'Location', window.location.href )
    siteElem.href = window.location.href # "https://vit-muse.web.app/" if window.location.contains('vit-muse')
    siteElem.rel  = "canonical"
    #sonLDem      = document.createElement('script')
    #sonLDem.type = "application/ld+json"
    #sonLDem.text = MuseLink
    head          = document.getElementsByTagName("head")[0]
    head.appendChild(maniElem)
    head.appendChild(siteElem)
    #ead.appendChild(jsonLDem)
    return

  Muse.Batch = {
    Prin:     { url:'muse/Prin.json', data:PrinJson, refine:true }
    Rows:     { url:'muse/Rows.json', data:RowsJson, refine:true }
    Info:     { url:'muse/Info.json', data:InfoJson, refine:true }
    Know:     { url:'muse/Know.json', data:KnowJson, refine:true }
    Wise:     { url:'muse/Wise.json', data:WiseJson, refine:true }
    Soft:     { url:'inno/Soft.json', data:SoftJson, refine:true }
    Data:     { url:'inno/Data.json', data:DataJson, refine:true }
    Scie:     { url:'inno/Scie.json', data:ScieJson, refine:true }
    Math:     { url:'inno/Math.json', data:MathJson, refine:true } }

  #{ path:"/Comp", name:"Comp", components:{ Comp:Home.Comp } },
  #{ path:'/Prac', name:'Prac', components:{ Prac:Home.Prac } },

  Muse.routes = [
    {   path:"/",                name:"Home",       components:{ Home:      Home      } },
    {   path:"/Prin",            name:"Prin",       components:{ Prin:      Home.Prin } },
      { path:"/Prin/Embrace",    name:"Embrace",    components:{ Embrace:   Home.Prac } },
      { path:"/Prin/Innovate",   name:"Innovate",   components:{ Innovate:  Home.Prac } },
      { path:"/Prin/Encourage",  name:"Encourage",  components:{ Encourage: Home.Prac } },
    {   path:"/Info",            name:"Info",       components:{ Info:      Home.Comp } },
      { path:"/Info/Team",       name:"Team",       components:{ Team:      Home.Prac } },
      { path:"/Info/Domain",     name:"Domain",     components:{ Domain:    Home.Prac } },
      { path:"/Info/Relate",     name:"Relate",     components:{ Relate:    Home.Prac } },
      { path:"/Info/Adapt",      name:"Adapt",      components:{ Adapt:     Home.Prac } },
      { path:"/Info/Tech",       name:"Tech",       components:{ Tech:      Home.Prac } },
      { path:"/Info/Benefit",    name:"Benefit",    components:{ Benefit:   Home.Prac } },
      { path:"/Info/Change",     name:"Change",     components:{ Change:    Home.Prac } },
      { path:"/Info/Deliver",    name:"Deliver",    components:{ Deliver:   Home.Prac } },
      { path:"/Info/Govern",     name:"Govern",     components:{ Govern:    Home.Prac } },
    {   path:"/Know",            name:"Know",       components:{ Know:      Home.Comp } },
      { path:"/Know/Involve",    name:"Involve",    components:{ Involve:   Home.Prac } },
      { path:"/Know/Discover",   name:"Discover",   components:{ Discover:  Home.Prac } },
      { path:"/Know/Understand", name:"Understand", components:{ Understand:Home.Prac } },
      { path:"/Know/Conduct",    name:"Conduct",    components:{ Conduct:   Home.Prac } },
      { path:"/Know/Cognition",  name:"Cognition",  components:{ Cognition: Home.Prac } },
      { path:"/Know/Reason",     name:"Reason",     components:{ Reason:    Home.Prac } },
      { path:"/Know/Evolve",     name:"Evolve",     components:{ Evolve:    Home.Prac } },
      { path:"/Know/Educate",    name:"Educate",    components:{ Educate:   Home.Prac } },
      { path:"/Know/Culture",    name:"Culture",    components:{ Culture:   Home.Prac } },
    {   path:"/Wise",            name:"Wise",       components:{ Wise:      Home.Comp } },
      { path:"/Wise/Trust",      name:"Trust",      components:{ Trust:     Home.Prac } },
      { path:"/Wise/Nature",     name:"Nature",     components:{ Nature:    Home.Prac } },
      { path:"/Wise/Truth",      name:"Truth",      components:{ Truth:     Home.Prac } },
      { path:"/Wise/Aware",      name:"Aware",      components:{ Aware:     Home.Prac } },
      { path:"/Wise/Create",     name:"Create",     components:{ Create:    Home.Prac } },
      { path:"/Wise/Mind",       name:"Mind",       components:{ Mind:      Home.Prac } },
      { path:"/Wise/Emerge",     name:"Emerge",     components:{ Emerge:    Home.Prac } },
      { path:"/Wise/Inspire",    name:"Inspire",    components:{ Inspire:   Home.Prac } },
      { path:"/Wise/Actualize",  name:"Actualize",  components:{ Actualize: Home.Prac } },
    { path:"/Cube", name:"Cube", components:{ Cube:Home.Cube } } ]

  Muse.routeNames = Muse.createRouteNames( Muse.routes ) # For router-links in View.vue

  # Toc.vue components and routes with no west or east directions
  Muse.komps = {
    Home:{ title:'Home', key:'Home', route:'Home', pracs:{}, ikw:false, icon:"fas fa-home",
    north:"Cube", prev:"Cube", south:"Prin",  next:"Prin"  }
    Prin:{ title:'Prin', key:'Prin', route:'Prin', pracs:{}, ikw:true,  icon:"fas fa-balance-scale",
    north:"Home", prev:"Home", south:"Info",  next:"Info" }
    Info:{ title:'Info', key:'Info', route:'Info', pracs:{}, ikw:true,  icon:"fas fa-th",
    north:"Prin", prev:"Prin", south:"Know",  next:"Know" }
    Know:{ title:'Know', key:'Know', route:'Know', pracs:{}, ikw:true,  icon:"fas fa-university",
    north:"Info", prev:"Info", south:"Wise",  next:"Wise" }
    Wise:{ title:'Wise', key:'Wise', route:'Wise', pracs:{}, ikw:true,  icon:"fab fa-tripadvisor",
    north:"Know", prev:"Know", south:"Home",  next:"Home" }
    Cube:{ title:'Cube', key:'Cube', route:'Cube', pracs:{}, ikw:false, icon:"fas fa-cubes",
    north:"Wise", prev:"Wise", south:"Wise",  next:"Home"  } }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Muse.init =   ( batch ) ->
    Muse.Batch  = batch # Not necessary here, but assigned for compatibilitry
    Muse.myName = 'Muse'
    subjects    = ["Nav"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Muse.stream = new Stream( subjects, infoSpec )
    Muse.mix    = new Mix(   Muse, Muse.routeNames )
    Muse.nav    = new Nav(   Muse.stream, batch, Muse.routes, Muse.routeNames, Muse.komps, true )
    Muse.touch  = new Touch( Muse.stream, Muse.nav )
    Muse.build  = new Build( batch, Muse.komps )
    #use.cache  = new Cache( Muse.stream )
    Access.buildInnov( batch, 'Data',   'Info' )
    Access.mergePracs( batch, 'Prin', ['Info','Know','Wise'] ) # 'Data'
    Muse.mergeCols()
    try            # A lot can go wrong with vue3 initialization so trap errors
      Muse.vue3()
    catch error
      console.error( 'Muse.vue3 app.use error', error )
    return

  Muse.vue3 = () ->
    Muse.app = createApp( Home.Dash   )
    Muse.app.provide('mix',  Muse.mix )
    Muse.app.provide('nav',  Muse.nav )
    router = Muse.router( Muse.routes )
    Muse.app.use(        router )
    Muse.nav.router    = router
    Muse.app.mount('#muse')
    Muse.nav.doRoute( { route:'Home' } )
    return

  # Lazy loader with dynamic import()
  Muse.lazy = (name) ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( /* @vite-ignore */ path )`

  # Vue Router Routes
  Muse.router = ( routes ) ->
    createRouter( { routes:routes, history:createWebHistory() } )

  Muse.createRouteNames = ( routes ) ->
    routeNames = []
    for route in routes
      routeNames.push( route.name )
      if route.children?
        for child in route.children
          routeNames.push( child.name )
    routeNames

  # Merges principles and innovations into comp practices
  Muse.mergeCols = ( ) ->
    Muse.build.dimDisps() # Add disps to every dim - dimension
    Muse.build.colPracs() # Add pracs to every col
    return

  # Log practices for diagnostics
  Muse.logPracs = ( compk ) ->
    console.log( 'Muse.pracs', Muse.Batch[compk].data[compk].pracs )
    return

export default Muse

###
  Muse.routes = [
    { path:"/",     name:"Home", components:{ Home:Home } },
    { path:"/Principles",  name:"Prin", components:{ Prin: Home.Prin }, children:[
      { path:"Embrace",    name:"Embrace",   components:{ Embrace:  Home.Prac } },
      { path:"Innovate",   name:"Innovate",  components:{ Innovate: Home.Prac } },
      { path:"Encourage",  name:"Encourage", components:{ Encourage:Home.Prac } } ] },
    { path:"/Information", name:"Info",     components:{ Info:Home.Comp }, children:[
      { path:"Team",    name:"Team",     component:Home.Prac },
      { path:"Domain",  name:"Domain",   components:{ Domain: Home.Prac } },
      { path:"Relate",  name:"Relate",   components:{ Relate: Home.Prac } },
      { path:"Adapt",   name:"Adapt",    components:{ Adapt:  Home.Prac } },
      { path:"Tech",    name:"Tech",     components:{ Tech:   Home.Prac } },
      { path:"Benefit", name:"Benefit",  components:{ Benefit:Home.Prac } },
      { path:"Change",  name:"Change",   components:{ Change: Home.Prac } },
      { path:"Deliver", name:"Deliver",  components:{ Deliver:Home.Prac } },
      { path:"Govern",  name:"Govern",   components:{ Govern: Home.Prac } } ] },
    { path:"/Knowledge", name:"Know",    components:{ Know:Home.Comp }, children:[
      { path:"Involve",    name:"Involve",    components:{ Involve:   Home.Prac } },
      { path:"Discover",   name:"Discover",   components:{ Discover:  Home.Prac } },
      { path:"Understand", name:"Understand", components:{ Understand:Home.Prac } },
      { path:"Conduct",    name:"Conduct",    components:{ Conduct:   Home.Prac } },
      { path:"Cognition",  name:"Cognition",  components:{ Cognition: Home.Prac } },
      { path:"Reason",     name:"Reason",     components:{ Reason:    Home.Prac } },
      { path:"Evolve",     name:"Evolve",     components:{ Evolve:    Home.Prac } },
      { path:"Educate",    name:"Educate",    components:{ Educate:   Home.Prac } },
      { path:"Culture",    name:"Culture",    components:{ Culture:   Home.Prac } } ] },
    { path:"/Wisdom", name:"Wise", components:{ Wise:Home.Comp }, children:[
      { path:"Trust",     name:"Trust",     components:{ Trust:    Home.Prac } },
      { path:"Nature",    name:"Nature",    components:{ Nature:   Home.Prac } },
      { path:"Truth",     name:"Truth",     components:{ Truth:    Home.Prac } },
      { path:"Aware",     name:"Aware",     components:{ Aware:    Home.Prac } },
      { path:"Create",    name:"Create",    components:{ Create:   Home.Prac } },
      { path:"Mind",      name:"Mind",      components:{ Mind:     Home.Prac } },
      { path:"Emerge",    name:"Emerge",    components:{ Emerge:   Home.Prac } },
      { path:"Inspire",   name:"Inspire",   components:{ Inspire:  Home.Prac } },
      { path:"Actualize", name:"Actualize", components:{ Actualize:Home.Prac } } ] },
    { path:"/Cube", name:"Cube", components:{ Cube:Home.Cube } } ]


  Muse.routes1 = [
    { path: '/',     name:'Home', components:{ Home: Home      } },
    { path: '/Prin', name:'Prin', components:{ Prin: Home.Prin } },
    { path: '/Comp', name:'Comp', components:{ Comp: Home.Comp } },
    { path: '/Prac', name:'Prac', components:{ Prac: Home.Prac } },
    { path: '/Disp', name:'Disp', components:{ Disp: Home.Disp } },
    { path: '/Cube', name:'Cube', components:{ Cube: Home.Cube } } ]
###
