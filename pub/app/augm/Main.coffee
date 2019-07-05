
import Data    from '../../bas/util/Data.js'
import Stream  from '../../bas/util/Stream.js'
import Vis     from '../../bas/util/Vis.js'
import Manage  from '../../bas/sw/Manage.js'
#mport Test    from './Test.js'

class Main

  Data.local   = "app/data/"
  Data.hosted  = "https://ui-48413.firebaseapp.com/"
  Main.FontUrl = "css/font/three/helvetiker_regular.typeface.json"

  Main.Batch = {
    Math: { url:'augm/Math.json', data:null, type:'Pack', plane:'Math' }
    Geom: { url:'augm/Geom.json', data:null, type:'Pack', plane:'Geom' }
    Data: { url:'augm/Data.json', data:null, type:'Pack', plane:'Data' } }

  Main.komps = {
    Math:{ name:'Math', comp:'Math', pracs:{}, ikw:true,  link:true,  icon:"fas fa-bezier-curve" }
    Geom:{ name:'Geom', comp:'Geom', pracs:{}, ikw:true,  link:true,  icon:"fas fa-shapes"       }
    Data:{ name:'Data', comp:'Data', pracs:{}, ikw:true,  link:true,  icon:"fas fa-database"     }
    Note:{ name:'Note', comp:'Note', pracs:{}, ikw:false, link:false, icon:"fab fa-leanpub"      }
    Draw:{ name:'Draw', comp:'Draw', pracs:{}, ikw:false, link:false, icon:"fas fa-draw-polygon" }
    Wood:{ name:'Wood', comp:'Wood', pracs:{}, ikw:false, link:false, icon:"fas fa-tree"         } }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =  ( batch ) ->
    window['Geom'] = {} # May still be needed by Ganjs
    Main.Batch  = batch # Not necessary here, but assigned for compatibilitry
    subjects    = ["Draw","Note","Navb","Tabs","Geom","Data","Work"]
    streamLog   = { subscribe:false, publish:false, subjects:subjects}
    Main.stream = new Stream( subjects, streamLog )
    Main.online( Main.stream )
    Main.manage = new Manage( Main.stream )
    Main.onReady()
    # new Test()
    return

  Main.online = ( stream ) ->
    window.addEventListener("load", () ->
      handleNetworkChange = (event) ->
        if event is false then {}
        status = if navigator.onLine then 'Online' else 'Offline'
        stream.publish( 'Netw', status )
        return
      window.addEventListener("online",  handleNetworkChange )
      window.addEventListener("offline", handleNetworkChange ) )
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

