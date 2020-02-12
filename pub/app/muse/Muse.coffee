
import Data      from '../../base/util/Data.js'
import Build     from '../../base/util/Build.js'
import Stream    from '../../base/util/Stream.js'
import Nav       from '../../base/nav/Nav.js'
#mport Cache     from '../../base/util/Cache.js'

import Mixin     from '../../base/vue/Mixin.js'
import Vue       from '../../lib/vue/vue.esm.browser.js'
import Router    from '../../lib/vue/vue-router.esm.js'
import Home      from './Home.js'

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
    Prin:     { url:'muse/Prin.json', data:null }
    Rows:     { url:'muse/Rows.json', data:null }
    Info:     { url:'muse/Info.json', data:null }
    Know:     { url:'muse/Know.json', data:null }
    Wise:     { url:'muse/Wise.json', data:null }
    Data:     { url:'muse/Data.json', data:null }
    Talk:     { url:'talk/Talk.json', data:null }
    PrinTalk: { url:'talk/Prin.json', data:null }
    RowsTalk: { url:'talk/Rows.json', data:null }
    ConnTalk: { url:'talk/Conn.json', data:null }
    InfoTalk: { url:'talk/Info.json', data:null }
    KnowTalk: { url:'talk/Know.json', data:null }
    WiseTalk: { url:'talk/Wise.json', data:null }
    SoftTalk: { url:'talk/Soft.json', data:null }
    DataTalk: { url:'talk/Data.json', data:null }
    ScieTalk: { url:'talk/Scie.json', data:null }
    NatuTalk: { url:'talk/Natu.json', data:null }
  }

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Muse.init =   ( batch ) ->
    Muse.Batch  = batch # Not necessary here, but assigned for compatibilitry
    Muse.app    = 'Muse'
    subjects    = ["Nav"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Muse.stream = new Stream( subjects, infoSpec )
    Muse.nav    = new Nav( Muse.stream, batch, Muse.komps, true )
    Muse.build  = new Build( batch, Muse.komps )
    #use.cache  = new Cache( Muse.stream )
    Data.buildInnov( batch, 'Data',   'Info' )
    Data.mergePracs( batch, 'Prin', ['Info','Know','Wise','Data'] )
    Muse.mergeCols()
    Muse.vue()
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Muse.vue = () ->
    Muse.mixin = new Mixin( Muse, ['Home','Imgs','Talk','Cube','Prin','Comp','Prac','Disp'] ) # Can't use komps
    Muse.nav.setMix( Muse.mixin.mixin().methods )
    Vue['mixin'](    Muse.mixin.mixin() )
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
        { path: '/imgs', name:'Imgs', components:{ Imgs: Home.Imgs } },
        { path: '/talk', name:'Talk', components:{ Talk: Home.Talk } },
        { path: '/cube', name:'Cube', components:{ Cube: Home.Cube } },
        { path: '/prin', name:'Prin', components:{ Prin: Home.Prin } },
        { path: '/comp', name:'Comp', components:{ Comp: Home.Comp } },
        { path: '/prac', name:'Prac', components:{ Prac: Home.Prac } },
        { path: '/disp', name:'Disp', components:{ Disp: Home.Disp } }
      ] } )

  # Toc.vue components and routes with no west or east directions
  Muse.komps = {
    Home:{ title:'Home', key:'Home', route:'Home', pracs:{}, ikw:false, icon:"fas fa-home",
    north:"Wise", prev:"Wise", south:"Cube",  next:"Cube"  }
    Imgs:{ title:'Imgs', key:'Imgs', route:'Imgs', pracs:{}, ikw:false,  icon:"fas fa-images",
    north:"Home", prev:"Home", south:"Talk",  next:"Talk"  }
    Talk:{ title:'Talk', key:'Talk', route:'Talk', pracs:{}, ikw:true,  icon:"fas fa-portrait",
    north:"Imgs", prev:"Imgs", south:"Cube",  next:"Cube"  }
    Cube:{ title:'Cube', key:'Cube', route:'Cube', pracs:{}, ikw:false, icon:"fas fa-cubes",
    north:"Talk", prev:"Talk", south:"Prin",  next:"Prin"  }
    Prin:{ title:'Prin', key:'Prin', route:'Prin', pracs:{}, ikw:true,  icon:"fas fa-balance-scale",
    north:"Home", prev:"Home", south:"Info",  next:"Info" }
    Info:{ title:'Info', key:'Info', route:'Comp', pracs:{}, ikw:true,  icon:"fas fa-th",
    north:"Prin", prev:"Prin", south:"Know",  next:"Know" }
    Know:{ title:'Know', key:'Know', route:'Comp', pracs:{}, ikw:true,  icon:"fas fa-university",
    north:"Info", prev:"Info", south:"Wise",  next:"Wise" }
    Wise:{ title:'Wise', key:'Wise', route:'Comp', pracs:{}, ikw:true,  icon:"fab fa-tripadvisor",
    north:"Know", prev:"Know", south:"Home",  next:"Home" }  }

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
