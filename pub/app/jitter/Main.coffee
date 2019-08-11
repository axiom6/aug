
import Data   from '../../base/util/Data.js'
import Stream from '../../base/util/Stream.js'
import Nav    from '../../base/util/Nav.js'
import Vis    from '../../base/util/Vis.js'
#mport Cache  from '../../base/util/Cache.js'

class Main

  Main.Batch = {
    Choice: { url:'jitter/Choice.json', data:null, type:'None', plane:'None' }
    Navs:   { url:'jitter/Navs.json',   data:null, type:'None', plane:'None' }
    Jitter: { url:'jitter/Jitter.json', data:null, type:'None', plane:'None' }
    Flavor: { url:'jitter/Flavor.json', data:null, type:'None', plane:'None' }
    Region: { url:'jitter/Region.json', data:null, type:'None', plane:'None' } }

  Main.komps = { # Used by Tocs.vue with desk top apps
    Home:{   name:'Home',   comp:'Home',   icon:"fas fa-draw-polygon" }
    Flavor:{ name:'Flavor', comp:'Flavor', icon:"fas fa-bezier-curve" }
    Roast:{  name:'Roast',  comp:'Roast',  icon:"fas fa-bezier-curve" }
    Brew:{   name:'Brew',   comp:'Brew',   icon:"fas fa-bezier-curve" }
    Drink:{  name:'Drink',  comp:'Drink',  icon:"fas fa-bezier-curve" }
    Body:{   name:'Body',   comp:'Body',   icon:"fas fa-bezier-curve" } }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =  ( batch ) ->
    Main.Batch   = batch # Not necessary here, but assigned for compatibilitry
    subjects     = ["Nav"]
    streamLog    = { subscribe:false, publish:false, subjects:subjects}
    Main.stream  = new Stream( subjects, streamLog )
    Main.nav     = new Nav( Main.stream, Main.Batch.Navs.data, 'Home' )
    #ain.cache   = new Cache( Main.stream )
    Main.onReady()
    return

  Main.vueMixin = {
    created:() ->
       # console.log( 'Main.vueMixin.created() globally' )
       return
    methods: {
      isDef:(d) ->
        d isnt null and typeof(d) isnt 'undefined'
      subscribe:( subject, source, onMethod ) ->
        Main['stream'].subscribe( subject, source, onMethod )
        return
      publish:( subject, object ) ->
        Main['stream'].publish( subject, object )
        return
      stream:() ->
        Main.stream
      batch:() ->
        Main.Batch
      nav:() ->
        Main.nav
      keys:(obj) ->
        Object.keys(obj)
      comps:( compk ) ->
        Main.Batch[compk].data.comps
      kompsTocs:() ->
        Main.komps
      choice:() ->
        Main.Batch.Choice.data
      pracs:( compk ) ->
        Main.Batch[compk].data[compk].pracs
      subset:( compk, filter ) ->
        filts = {}
        for own key, prac of Main.Batch[compk].data[compk].pracs when filter(prac)
          filts[key] = prac
        filts
      toRgbaHsv:( hsv ) ->
         Vis.toRgbaHsv(hsv)
    }
  }

`export default Main`

