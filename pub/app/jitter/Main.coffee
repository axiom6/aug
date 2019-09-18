
import Data   from '../../base/util/Data.js'
import Stream from '../../base/util/Stream.js'
import Nav    from '../../base/util/Nav.js'
#mport Cache  from '../../base/util/Cache.js'

class Main

  Main.Batch = {
    Choice: { url:'jitter/Choice.json', data:null, type:'None', plane:'None' }
    Navs:   { url:'jitter/Navs.json',   data:null, type:'None', plane:'None' }
    Jitter: { url:'jitter/Jitter.json', data:null, type:'None', plane:'None' }
    Flavor: { url:'jitter/Flavor.json', data:null, type:'None', plane:'None' }
    Region: { url:'jitter/Region.json', data:null, type:'None', plane:'None' } }

  Main.komps = { # Used by Tocs.vue with desk top apps
    Home:{   name:'Home',   route:'Home',   icon:"fas fa-draw-polygon" }
    Flavor:{ name:'Flavor', route:'Flavor', icon:"fas fa-bezier-curve" }
    Roast:{  name:'Roast',  route:'Roast',  icon:"fas fa-bezier-curve" }
    Brew:{   name:'Brew',   route:'Brew',   icon:"fas fa-bezier-curve" }
    Drink:{  name:'Drink',  route:'Drink',  icon:"fas fa-bezier-curve" }
    Body:{   name:'Body',   route:'Body',   icon:"fas fa-bezier-curve" } }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =   (  batch ) ->
    Main.Batch   = batch # Not necessary here, but assigned for compatibilitry
    Main.app     = 'Jitter'
    subjects     = ["Nav"]
    streamLog    = { subscribe:false, publish:false, subjects:subjects}
    Main.stream  = new Stream( subjects, streamLog )
    Main.nav     = new Nav( Main.stream, Main.Batch.Navs.data, 'Home' )
    #ain.cache   = new Cache( Main.stream )
    Main.onReady()
    return

export default Main

