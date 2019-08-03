
import Data    from '../../base/util/Data.js'
import Stream  from '../../base/util/Stream.js'
import Nav     from '../../base/util/NavMuse.js' # Expanded from basic Nav class
import Vis     from '../../base/util/Vis.js'
import Cache   from '../../base/util/Cache.js'

class Main

  #ata.local   = "app/data/"
  #ata.hosted  = "https://muse-b90e1.firebaseapp.com/app/data/"
  Main.FontUrl = "css/font/three/helvetiker_regular.typeface.json"

  Main.Batch = {
    Cols: { url:'muse/Cols.json', data:null, type:'Pack', plane:'Cols' }
    Rows: { url:'muse/Rows.json', data:null, type:'Pack', plane:'Rows' }
    Info: { url:'muse/Info.json', data:null, type:'Pack', plane:'Info' }
    Know: { url:'muse/Know.json', data:null, type:'Pack', plane:'Know' }
    Wise: { url:'muse/Wise.json', data:null, type:'Pack', plane:'Wise' }
    Cube: { url:'muse/Cube.json', data:null, type:'Pack', plane:'Cube' }
    Font: { url:Main.FontUrl,     data:null, type:'Font', plane:'Cube' } }

  Main.komps = {
    Info:{ name:'Info', comp:'Info', pracs:{}, ikw:true,  link:false, icon:"fas fa-th"           }
    Know:{ name:'Know', comp:'Know', pracs:{}, ikw:true,  link:false, icon:"fas fa-university"   }
    Wise:{ name:'Wise', comp:'Wise', pracs:{}, ikw:true,  link:false, icon:"fab fa-tripadvisor"  }
    Cube:{ name:'Cube', comp:'Cube', pracs:{}, ikw:false, link:false, icon:"fas fa-cubes"        } }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =  ( batch ) ->
    Main.Batch  = batch # Not necessary here, but assigned for compatibilitry
    subjects    = ["Info","Know","Wise","Cube","Menu","Tabs","Nav","Toc","Cache"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Main.stream = new Stream( subjects, infoSpec )
    Main.nav    = new Nav(   Main.stream, batch, 'Info' )
    #ain.cache  = new Cache( Main.stream )
    Main.mergePracsCols()
    Main.onReady()
    return

  Main.mergePracsCols = () ->
    cols = Main.Batch['Cols'].data['Cols'].pracs
    for comp in ['Info','Know','Wise']
      prcs = Main.Batch[comp].data[comp].pracs
      for own  key, col of cols
        prcs[key] = col
      # console.log( 'Main.mergePracsCols', prcs )
    return

  Main.logPracs = ( compk ) ->
    console.log( 'Main.pracs', Main.Batch[compk].data[compk].pracs )
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
      cols:()  ->
        Main.Batch['Cols'].data['Cols'].pracs
      comps:( compk ) ->
        Main.Batch[compk].data.comps
      kompsTocs:() ->   # For Tocs.vue
        Main.komps
      subset:( compk, filter ) ->
        filts = {}
        for own key, prac of this.pracs(compk) when filter(prac)
          filts[key] = prac
        filts
      conns:( compk ) ->
        this.subset( compk, (prac) -> prac.row isnt 'Dim' )
      pracs:( compk ) ->
        Main.Batch[compk].data[compk].pracs
      disps:( compk, prack ) ->
        Main.Batch[compk].data[compk][prack].disps
      areas:( compk, prack, dispk ) ->
        Main.Batch[compk].data[compk][prack][dispk].areas
      items:( compk, prack, dispk, areak ) ->
        Main.Batch[compk].data[compk][prack][dispk][areak].items
      bases:( compk, prack, dispk, areak, itemk  ) ->
        Main.Batch[compk].data[compk][prack][dispk][areak][itemk].bases
      toRgbaHsv:( hsv ) ->
         Vis.toRgbaHsv(hsv)
      #navbSpecs:() ->
      #  Main.NavbSpecs
    }
  }

`export default Main`

