
import Data   from '../../base/util/Data.js'
import Stream from '../../base/util/Stream.js'
import Vis    from '../../base/util/Vis.js'
#mport Cache  from '../../base/util/Cache.js'

class Main

  Main.Batch = {
    Math: { url:'augm/Math.json', data:null, type:'Pack', plane:'Math' } }

  Main.komps = {
    Draw:{ name:'Draw', comp:'Draw', pracs:{}, ikw:false, link:false, icon:"fas fa-draw-polygon" }
    Math:{ name:'Math', comp:'Math', pracs:{}, ikw:true,  link:true,  icon:"fas fa-bezier-curve" } }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =  ( batch ) ->
    Main.Batch   = batch # Not necessary here, but assigned for compatibilitry
    subjects     = ["Draw","Note","Navb","Tabs","Geom","Data","Cache"]
    streamLog    = { subscribe:false, publish:false, subjects:subjects}
    Main.stream  = new Stream( subjects, streamLog )
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
      keys:(obj) ->
        Object.keys(obj)
      comps:( compk ) ->
        Main.Batch[compk].data.comps
      kompsTocs:() ->
        Main.komps
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

