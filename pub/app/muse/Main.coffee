
import Data    from '../../base/util/Data.js'
import Stream  from '../../base/util/Stream.js'
import Nav     from '../../base/util/NavMuse.js' # Expanded from basic Nav class
import Vis     from '../../base/util/Vis.js'
import Cache   from '../../base/util/Cache.js'

class Main

  Main.FontUrl = "css/font/three/helvetiker_regular.typeface.json"

  Main.Batch = {
    Prin: { url:'muse/Prin.json', data:null, type:'Pack', plane:'Prin' }
    Rows: { url:'muse/Rows.json', data:null, type:'Pack', plane:'Rows' }
    Info: { url:'muse/Info.json', data:null, type:'Pack', plane:'Info' }
    Know: { url:'muse/Know.json', data:null, type:'Pack', plane:'Know' }
    Wise: { url:'muse/Wise.json', data:null, type:'Pack', plane:'Wise' }
    Cube: { url:'muse/Cube.json', data:null, type:'Pack', plane:'Cube' }
    Font: { url:Main.FontUrl,     data:null, type:'Font', plane:'Cube' } }

  Main.komps = {
    Prin:{ name:'Prin', comp:'Prin', pracs:{}, ikw:true,  link:false, icon:"fas fa-balance-scale" }
    Info:{ name:'Info', comp:'Info', pracs:{}, ikw:true,  link:false, icon:"fas fa-th"            }
    Know:{ name:'Know', comp:'Know', pracs:{}, ikw:true,  link:false, icon:"fas fa-university"    }
    Wise:{ name:'Wise', comp:'Wise', pracs:{}, ikw:true,  link:false, icon:"fab fa-tripadvisor"   }
    Cube:{ name:'Cube', comp:'Cube', pracs:{}, ikw:false, link:false, icon:"fas fa-cubes"         } }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =  ( batch ) ->
    Main.Batch  = batch # Not necessary here, but assigned for compatibilitry
    subjects    = ["Info","Know","Wise","Cube","Menu","Page","Nav","Toc","Cache"]
    infoSpec    = { subscribe:false, publish:false, subjects:subjects}
    Main.stream = new Stream( subjects, infoSpec )
    Main.nav    = new Nav(   Main.stream, batch, 'Info' )
    #ain.cache  = new Cache( Main.stream )
    Main.mergePracsPrin()
    Main.onReady()
    return

  Main.mergePracsPrin = () ->
    cols = Main.Batch['Prin'].data['Prin'].pracs
    for comp in ['Info','Know','Wise']
      prcs = Main.Batch[comp].data[comp].pracs
      for own  key, col of cols
        prcs[key] = col
      # console.log( 'Main.mergePracsPrin', prcs )
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
      isStr:(s) ->
        this.isDef(s) and typeof(s)=="string" and s.length > 0
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
      prin:()  ->
        Main.Batch['Prin'].data['Prin'].pracs
      comps:( compk ) ->
        Main.Batch[compk].data.comps
      kompsTocs:() ->   # For Tocs.vue
        Main.komps
      views:() ->
        ['Home','Cube','Comp','Prac','Disp','Conn']
      subset:( compk, filter ) ->
        filts = {}
        for own key, prac of this.pracs(compk) when filter(prac)
          filts[key] = prac
        filts
      conns:( compk ) ->
        filter = if compk isnt 'Prin' then (prac) -> prac.row isnt 'Dim' else (prac) -> prac.row is 'Dim'
        this.subset( compk, filter )
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
         hsu = if not hsv then [30,90,90] else hsv
         Vis.toRgbaHsv(hsu)
      #navbSpecs:() ->
      #  Main.NavbSpecs
    }
  }

`export default Main`

