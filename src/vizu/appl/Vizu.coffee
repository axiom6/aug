
import Access     from '../../../lib/pub/util/Access.js'
import Stream     from '../../../lib/pub/util/Stream.js'
import Nav        from '../../../lib/pub/navi/Nav.js'
import Mix        from '../../../lib/pub/navi/Mix.js'

import { tester } from '../../../lib/pub/test/tester.js'
import Main       from '../main/Main.js'
import Dash       from '../../../vue/vizu/appl/Dash.vue'

import { createApp }    from 'vue'

import MainJson from '../../../data/opts/Main.json'
import PrinJson from '../../../data/muse/Prin.json'
import RowsJson from '../../../data/muse/Rows.json'
import InfoJson from '../../../data/muse/Info.json'
import KnowJson from '../../../data/muse/Know.json'
import WiseJson from '../../../data/muse/Wise.json'
import CubeJson from '../../../data/muse/Cube.json'
import TestJson from '../../../data/muse/Test.json'
import FontJson from '../../../LIB/css/font/three/helvetiker_regular.typeface.json'

class Vizu

  Vizu.appName = 'Viz'
  Vizu.debug   = true

  Vizu.Batch = {
    Main:   { url:'opts/Main.json',     data:MainJson, refine:false }
    Prin:   { url:'muse/Prin.json',     data:PrinJson, refine:true  }
    Rows:   { url:'muse/Rows.json',     data:RowsJson, refine:true  }
    Info:   { url:'muse/Info.json',     data:InfoJson, refine:true  }
    Know:   { url:'muse/Know.json',     data:KnowJson, refine:true  }
    Wise:   { url:'muse/Wise.json',     data:WiseJson, refine:true  }
    Test:   { url:'muse/Test.json',     data:TestJson, refine:true  }
    Cube:   { url:'muse/Cube.json',     data:CubeJson, refine:true  }
    Font:   { url: '',                  data:FontJson, refine:false } }

  Vizu.komps = Access.kompsDirs( {
    Home:{ title:'Home', key:'Home', pracs:{}, ikw:false, icon:"fas fa-home" }
    Main:{ title:'Main', key:'Main', pracs:{}, ikw:false, icon:"fas fa-bezier-curve" }
    Hues:{ title:'Hues', key:'Hues', pracs:{}, ikw:false, icon:"fas fa-palette" }
    Cube:{ title:'Cube', key:'Cube', pracs:{}, ikw:false, icon:"fas fa-cubes" }
    #pot:{ title:'Spot', key:'Spot', pracs:{}, ikw:false, icon:"fas fa-lightbulb" }
    Test:{ title:'Test', key:'Test', pracs:{}, ikw:false, icon:"fas fa-stethoscope" } } )

  # Initialization is accomplished in 3 steps:
  # 1. Read in all the JSON config files in Viz.Batch. Call Viz.init() when complete.
  # 2. Viz.init() initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  # 3. Viz.vue3() launches Vue with Home page and a Toc for Prin Info Know and Wise practices

  # Called by muse.html to kick things off
  # 1. Read in all the JSON config files in Viz.Batch. Call Viz.init() when complete.
  Vizu.start = (href) ->
    console.log( "Viz.start()", href )
    Vizu.href = href
    Vizu.addToHead()
    for key, val of Vizu.Batch when val.refine? and val.refine
      val.data = Access.refine(val.data)
    Vizu.init()
    return

  # Add these <link> tags to <head> because vite build makes a mess of them
  Vizu.addToHead = () ->
  # manifest   = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
  # siteLink   = """<link href="https://vit-muse.web.app/" rel="canonical">"""
    maniElem       = document.createElement('link')
    maniElem.href  = "manifest.json"
    maniElem.rel   = "manifest"
    maniElem['crossorigin'] = "use-credentials"
    siteElem = document.createElement('link')
    siteElem.href  =   window.location.href
    siteElem.rel   = "canonical"
    head           = document.getElementsByTagName("head")[0]
    head.appendChild(maniElem)
    head.appendChild(siteElem)
    return

  Vizu.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json"

  # 2. Initializes publish, subscribe and navigation with Stream and refines Practices with Build and merge.
  Vizu.init =   () ->
    subjects     = ["Nav","Tab","View"]
    streamLog    = { subscribe:false, publish:false, subjects:subjects }
    Vizu.stream   = new Stream( subjects, streamLog )
    Vizu.mix      = new Mix(  Vizu )
    Vizu.nav      = new Nav(  Vizu, Vizu.stream, Vizu.komps, Vizu.pages )
    Vizu.main     = new Main( Vizu.stream, Vizu.nav )
    Vizu.tester   = tester
    #izu.mix.opts = Vizu.Batch.Main.data # JSON.parse( batch.Main.data )
    #Viz.cache  = new Cache( Viz.stream )
    try
      Vizu.vue3()
    catch error
      console.error( 'Viz.vue app.use error', error )
    return

  # 3. Launches Vue with Home page and a Toc for Prin Info Know and Wise practices
  Vizu.vue3 = () ->
    Vizu.app = createApp( Dash  )
    Vizu.app.provide('mix',  Vizu.mix  )
    Vizu.app.provide('nav',  Vizu.nav  )
    Vizu.app.provide('main', Vizu.main )
    Vizu.app.mount('#vizu')
    Vizu.nav.pub( Vizu.nav.toPub(Vizu.href), true )
    return

  # Lazy loader with dynamic import()
  Vizu.lazy = (name) -> () ->
    path = "../../#{name}.vue"
    if path is false then {}
    return `import( /* @vite-ignore */ path )`

  # This does not make sense
  Vizu.pages = {
    Main: {
      Surface: { title:'Surface',  key:'Surface',  show:false },
      Grids:   { title:'Grids',    key:'Grids',    show:false },
      Rgb:     { title:'Rgb',      key:'Rgb',      show:false },
      Face:    { title:'Face',     key:'Face',     show:false },
      Ysv:     { title:'Ysv',      key:'Ysv',      show:false },
      Hsv:     { title:'Hsv',      key:'Hsv',      show:false } },
    Hues: {
      Red:     { title:'Red',     key:'Red',     show:false },
      Orange:  { title:'Orange',  key:'Orange',  show:false },
      Yellow:  { title:'Yellow',  key:'Yellow',  show:false },
      Lime:    { title:'Lime',    key:'Lime',    show:false },
      Green:   { title:'Green',   key:'Green',   show:false },
      Cyan:    { title:'Cyan',    key:'Cyan',    show:false },
      Blue:    { title:'Blue',    key:'Blue',    show:false },
      Magenta: { title:'Magenta', key:'Magenta', show:false } } }


export default Vizu
