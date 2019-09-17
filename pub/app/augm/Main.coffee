
import Data   from '../../base/util/Data.js'
import Stream from '../../base/util/Stream.js'
import Nav    from '../../base/util/Nav.js'
import Vis    from '../../base/util/Vis.js'
import Cache  from '../../base/util/Cache.js'
#mport Test   from './Test.js'

class Main

  #ata.local   = "app/data/"
  #ata.hosted  = "https://augm-d4b3c.firebaseapp.com/app/data/"

  Main.Batch = {
    Math: { url:'augm/Math.json', data:null, type:'Pack', plane:'Math' }
    Geom: { url:'augm/Geom.json', data:null, type:'Pack', plane:'Geom' }
    Data: { url:'augm/Data.json', data:null, type:'Pack', plane:'Data' } }

  Main.komps = {
    Math:{ title:'Math', key:'Math', route:'Math', pracs:{}, ikw:true,  icon:"fas fa-bezier-curve" }
    Geom:{ title:'Geom', key:'Geom', route:'Geom', pracs:{}, ikw:true,  icon:"fas fa-shapes"       }
    Data:{ title:'Data', key:'Data', route:'Data', pracs:{}, ikw:true,  icon:"fas fa-database"     }
    Note:{ title:'Note', key:'Note', route:'Note', pracs:{}, ikw:false, icon:"fab fa-leanpub"      }
    Draw:{ title:'Draw', key:'Draw', route:'Draw', pracs:{}, ikw:false, icon:"fas fa-draw-polygon" }
    Wood:{ title:'Wood', key:'Wood', route:'Wood', pracs:{}, ikw:false, icon:"fas fa-tree"         } }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =  ( batch ) ->
    window['Geom'] = {} # May still be needed by Ganjs
    Main.Batch   = batch # Not necessary here, but assigned for compatibilitry
    subjects     = ["Draw","Note","Menu","Tabs","Geom","Data","Cache","Navd"]
    streamLog    = { subscribe:false, publish:false, subjects:subjects}
    Main.stream  = new Stream( subjects, streamLog )
    Main.nav     = new Nav(   Main.stream, batch, 'Info' )
    #ain.cache   = new Cache( Main.stream )
    Main.onReady()
    # new Test()
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
        ['Home','Math','Geom','Data','Draw','Note','Wood']
      subset:( compk, filter ) ->
        filts = {}
        for own key, prac of this.pracs(compk) when filter(prac)
          filts[key] = prac
        filts
      conns:( compk ) ->
        filter = if compk isnt 'Prin' then (prac) -> prac.row isnt 'Dim' else (prac) -> prac.row is 'Dim'
        this.subset( compk, filter )
      pracs:( compk ) ->
        Main.Batch[compk].data.pracs
      disps:( compk, prack ) ->
        Main.Batch[compk].data[prack].disps
      areas:( compk, prack, dispk ) ->
        Main.Batch[compk].data[prack][dispk].areas
      items:( compk, prack, dispk, areak ) ->
        Main.Batch[compk].data[prack][dispk][areak].items
      bases:( compk, prack, dispk, areak, itemk  ) ->
        Main.Batch[compk].data[prack][dispk][areak][itemk].bases
      compObject:( compKey ) ->
        Main.Batch[compKey].data.pracs
      pracObject:( compKey, pracKey ) ->
        this.pracs(compKey)[pracKey]
      dispObject:( compKey, pracKey,  dispKey ) ->
        this.disps(compKey, pracKey )[dispKey]
      toRgbaHsv:( hsv ) ->
        hsu = if not hsv then [30,90,90] else hsv
        Vis.toRgbaHsv(hsu)
      showPages:( pages, pageKey ) ->
        hasPage = false
        for own key, page  of pages
          page.show = key  is pageKey
          hasPage   = true if page.show
        # console.log( 'Main.showPages()', { pageKey:pageKey, hasPage:hasPage, pages:pages })
        hasPage
    }
  }

`export default Main`

