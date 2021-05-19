
import Access from '../../base/util/Access.js'
import Build  from '../../base/util/Build.js'
import Stream from '../../base/util/Stream.js'
import Nav    from '../../base/nav/Nav.js'
import Touch  from '../../base/nav/Touch.js'
#mport Cache  from '../../base/util/Cache.js'
import Mix    from '../../base/nav/Mix.js'

import { createApp }    from 'vue'    #

import Home             from '../../../vue/muse/appl/Home.vue';
import Dash             from '../../../vue/muse/appl/Dash.vue';

#mport MuseLDjs from './MuseLD.js'
import MuseLD   from '../../../src/muse/appl/MuseLD.json'
import PrinJson from '../../../data/muse/Prin.json'
import RowsJson from '../../../data/muse/Rows.json'
import InfoJson from '../../../data/muse/Info.json'
import KnowJson from '../../../data/muse/Know.json'
import WiseJson from '../../../data/muse/Wise.json'
import SoftJson from '../../../data/inno/Soft.json'
import DataJson from '../../../data/inno/Data.json'
import ScieJson from '../../../data/inno/Scie.json'
import MathJson from '../../../data/inno/Math.json'
import TestJson from '../../../data/muse/Test.json'

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
    jsonLD        = document.createElement('script')
    jsonLD.type   = "application/ld+json"
    jsonLD.text   = JSON.stringify(MuseLD)
    head          = document.getElementsByTagName("head")[0]
    head.appendChild(maniElem)
    head.appendChild(siteElem)
    head.appendChild(jsonLD)
    return

  Muse.Batch = {
    Prin: { url:'muse/Prin.json', data:PrinJson, refine:true }
    Rows: { url:'muse/Rows.json', data:RowsJson, refine:true }
    Info: { url:'muse/Info.json', data:InfoJson, refine:true }
    Know: { url:'muse/Know.json', data:KnowJson, refine:true }
    Wise: { url:'muse/Wise.json', data:WiseJson, refine:true }
    Soft: { url:'inno/Soft.json', data:SoftJson, refine:true }
    Data: { url:'inno/Data.json', data:DataJson, refine:true }
    Scie: { url:'inno/Scie.json', data:ScieJson, refine:true }
    Math: { url:'inno/Math.json', data:MathJson, refine:true }
    Test: { url:'muse/Test.json', data:TestJson, refine:true } }

  #{ path:"/Comp", name:"Comp", components:{ Comp:Home.Comp } },
  #{ path:'/Prac', name:'Prac', components:{ Prac:Home.Prac } },

  # Toc.vue components and routes with no west or east directions
  Muse.komps = {
    Home:{ title:'Home', key:'Home', route:'Home', pracs:{}, ikw:false, icon:"fas fa-home",
    north:"Test", prev:"Test", south:"Prin",  next:"Prin"  }
    Prin:{ title:'Prin', key:'Prin', route:'Prin', pracs:{}, ikw:true,  icon:"fas fa-balance-scale",
    north:"Home", prev:"Home", south:"Info",  next:"Info" }
    Info:{ title:'Info', key:'Info', route:'Info', pracs:{}, ikw:true,  icon:"fas fa-th",
    north:"Prin", prev:"Prin", south:"Know",  next:"Know" }
    Know:{ title:'Know', key:'Know', route:'Know', pracs:{}, ikw:true,  icon:"fas fa-university",
    north:"Info", prev:"Info", south:"Wise",  next:"Wise" }
    Wise:{ title:'Wise', key:'Wise', route:'Wise', pracs:{}, ikw:true,  icon:"fab fa-tripadvisor",
    north:"Know", prev:"Know", south:"Home",  next:"Home" }
    Cube:{ title:'Cube', key:'Cube', route:'Cube', pracs:{}, ikw:false, icon:"fas fa-cubes",
    north:"Wise", prev:"Wise", south:"Wise",  next:"Test"  }
    Test:{ title:'Test', key:'Test', route:'Test', pracs:{}, ikw:false, icon:"fas fa-stethoscope",
    north:"Cube", prev:"Cube", south:"Cube",  next:"Home"  } }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Muse.init =   ( batch ) ->
    Muse.Batch  = batch # Not necessary here, but assigned for compatibilitry
    Muse.myName = 'Muse'
    subjects    = ["Nav"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Muse.stream = new Stream( subjects, infoSpec )
    Muse.mix    = new Mix(   Muse )
    Muse.nav    = new Nav(   Muse.stream, batch, Muse.komps, Muse.pages, true )
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
    Muse.app = createApp( Dash )
    Muse.app.provide('mix',  Muse.mix )
    Muse.app.provide('nav',  Muse.nav )
    Muse.app.mount('#muse')
    Muse.nav.pub( { source:"Muse", route:"Home", level:"Comp", compKey:"Home" } )
    return

  # Lazy loader with dynamic import()
  Muse.lazy = (name) ->
    path = "../../#{name}.js"
    if path is false then {}
    return `import( /* @vite-ignore */ path )`

  # Merges principles and innovations into comp practices
  Muse.mergeCols = ( ) ->
    Muse.build.dimDisps() # Add disps to every dim - dimension
    Muse.build.colPracs() # Add pracs to every col
    return

  # Log practices for diagnostics
  Muse.logPracs = ( compk ) ->
    console.log( 'Muse.pracs', Muse.Batch[compk].data[compk].pracs )
    return

  Muse.pages = {
    Comp: {
      Icons:{  title:'Icons',  key:'Icons',  show:true  },
      Topics:{ title:'Topics', key:'Topics', show:false },
      Graphs:{ title:'Graphs', key:'Graphs', show:false },
      Texts:{  title:'Texts',  key:'Texts',  show:false } }
    Prac: {
      Topics: { title:'Topics', key:'Topics', show:true  },
      Graphs: { title:'Graphs', key:'Graphs', show:false },
      Texts:  { title:'Texts',  key:'Texts',  show:false } }
    Disp: {
      Topics: { title:'Topics', key:'Topics', show:true  },
      Texts:  { title:'Texts',  key:'Texts',  show:false } }
    Info: {
      Core:{ title:'Core', key:"Core", show:true,  icon:"fas fa-th"},
      Soft:{ title:'Soft', key:"Soft", show:false, icon:"fas fa-codepen"},
      Data:{ title:'Data', key:"Data", show:false, icon:"fas fa-table"} }
    Know: {
      Core:{    title:'Core',    key:"Core",    show:true,  icon:"fas fa-university"},
      Science:{ title:'Science', key:"Science", show:false, icon:"fas fa-flask" },
      Math:{    title:'Math',    key:"Math",    show:false, icon:"fas fa-calculator"} }
    Wise: {
      Core:{ title:'Core', key:"Core", show:true, icon:"fas fa-tripadvisor"} }
    Rows: {
      Plane:{ name:'Info',  dir:'cm', icon:"fas fa-th" },
      Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap"},
      Do:{    name:'Do',    dir:'do', icon:"fas fa-cog"},
      Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square"} }
    Prin:{
      Icons:  { title:'Icons',  key:'Icons',  show:true  },
      Topics: { title:'Topics', key:'Topics', show:false } }
  }

export default Muse

###
import { createRouter, createWebHashHistory } from 'vue-router'

  Muse.vue3 = () ->
    Muse.app = createApp( Dash )
    Muse.app.provide('mix',  Muse.mix )
    Muse.app.provide('nav',  Muse.nav )
    router = Muse.router( Muse.routes )
    router.beforeEach( (to,from) => false )
    Muse.app.use(        router )
    Muse.nav.router    = router
    Muse.app.mount('#muse')
    Muse.nav.doRoute( { route:'Home' } )
    return

  # Vue Router Routes
  Muse.mix    = new Mix(   Muse, Muse.routeNames )
  Muse.nav    = new Nav(   Muse.stream, batch, Muse.routes, Muse.routeNames, Muse.komps, true )

  Muse.router = ( routes ) ->
    createRouter( { routes:routes, history:createWebHashHistory() } )


  Muse.routes = [
    {   path:"/",           name:"Home",       components:{ Home:      Home      } },
    {   path:"/Prin",       name:"Prin",       components:{ Prin:      Home.Prin } },
      { path:"/Embrace",    name:"Embrace",    components:{ Embrace:   Home.Prac } },
      { path:"/Innovate",   name:"Innovate",   components:{ Innovate:  Home.Prac } },
      { path:"/Encourage",  name:"Encourage",  components:{ Encourage: Home.Prac } },
    {   path:"/Info",       name:"Info",       components:{ Info:      Home.Comp } },
      { path:"/Team",       name:"Team",       components:{ Team:      Home.Prac } },
      { path:"/Domain",     name:"Domain",     components:{ Domain:    Home.Prac } },
      { path:"/Relate",     name:"Relate",     components:{ Relate:    Home.Prac } },
      { path:"/Adapt",      name:"Adapt",      components:{ Adapt:     Home.Prac } },
      { path:"/Tech",       name:"Tech",       components:{ Tech:      Home.Prac } },
      { path:"/Benefit",    name:"Benefit",    components:{ Benefit:   Home.Prac } },
      { path:"/Change",     name:"Change",     components:{ Change:    Home.Prac } },
      { path:"/Deliver",    name:"Deliver",    components:{ Deliver:   Home.Prac } },
      { path:"/Govern",     name:"Govern",     components:{ Govern:    Home.Prac } },
    {   path:"/Know",       name:"Know",       components:{ Know:      Home.Comp } },
      { path:"/Involve",    name:"Involve",    components:{ Involve:   Home.Prac } },
      { path:"/Discover",   name:"Discover",   components:{ Discover:  Home.Prac } },
      { path:"/Understand", name:"Understand", components:{ Understand:Home.Prac } },
      { path:"/Conduct",    name:"Conduct",    components:{ Conduct:   Home.Prac } },
      { path:"/Cognition",  name:"Cognition",  components:{ Cognition: Home.Prac } },
      { path:"/Reason",     name:"Reason",     components:{ Reason:    Home.Prac } },
      { path:"/Evolve",     name:"Evolve",     components:{ Evolve:    Home.Prac } },
      { path:"/Educate",    name:"Educate",    components:{ Educate:   Home.Prac } },
      { path:"/Culture",    name:"Culture",    components:{ Culture:   Home.Prac } },
    {   path:"/Wise",       name:"Wise",       components:{ Wise:      Home.Comp } },
      { path:"/Trust",      name:"Trust",      components:{ Trust:     Home.Prac } },
      { path:"/Nature",     name:"Nature",     components:{ Nature:    Home.Prac } },
      { path:"/Truth",      name:"Truth",      components:{ Truth:     Home.Prac } },
      { path:"/Aware",      name:"Aware",      components:{ Aware:     Home.Prac } },
      { path:"/Create",     name:"Create",     components:{ Create:    Home.Prac } },
      { path:"/Mind",       name:"Mind",       components:{ Mind:      Home.Prac } },
      { path:"/Emerge",     name:"Emerge",     components:{ Emerge:    Home.Prac } },
      { path:"/Inspire",    name:"Inspire",    components:{ Inspire:   Home.Prac } },
      { path:"/Actualize",  name:"Actualize",  components:{ Actualize: Home.Prac } },
    {   path:"/Cube",       name:"Cube",       components:{ Cube:      Home.Cube } },
    {   path:"/Test",       name:"Test",       components:{ Cube:      Home.Test } },
      { path:'/Replay',     name:'Replay',     components:{ Replay:    Home.Replay } },
      { path:'/Result',     name:'Result',     components:{ Result:    Home.Result } }
]

  Muse.createRouteNames = ( routes ) ->
    routeNames = []
    for route in routes
      routeNames.push( route.name )
      if route.children?
        for child in route.children
          routeNames.push( child.name )
    routeNames

  Muse.routeNames = Muse.createRouteNames( Muse.routes ) # For router-links in View.vue

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
