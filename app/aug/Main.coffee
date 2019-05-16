
import Data    from '../../pub/bas/util/Data.js'
import Stream  from '../../pub/bas/util/Stream.js'
import Vis     from '../../pub/bas/util/Vis.js'
import Matcher from '../../pub/mga/ptn/Matcher.js'

class Main

  Data.local   = "http://localhost:63342/aug/app/data/"
  Data.hosted  = "https://ui-48413.firebaseapp.com/"
  Main.FontUrl = "../../css/font/three/helvetiker_regular.typeface.json"
  Main.Matcher = Matcher

  Main.Batch = {
    Cols: { url:'muse/Cols.json', data:null, type:'Pack', plane:'Cols' }
    Rows: { url:'muse/Rows.json', data:null, type:'Pack', plane:'Rows' }
    Info: { url:'muse/Info.json', data:null, type:'Pack', plane:'Info' }
    Know: { url:'muse/Know.json', data:null, type:'Pack', plane:'Know' }
    Wise: { url:'muse/Wise.json', data:null, type:'Pack', plane:'Wise' }
    Geom: { url:'muse/Geom.json', data:null, type:'Pack', plane:'Geom' }
    Cube: { url:'muse/Cube.json', data:null, type:'Pack', plane:'Cube' }
    Font: { url:Main.FontUrl,     data:null, type:'Font', plane:'Cube' } }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =  ( batch ) ->
    Main.Matcher.doMatches()
    Main.Batch = batch # Not necessary here, but assigned for compatibilitry
    subjects = ["Info","Know","Wise","Draw","Note","Cube","Navb","Tabs","Geom"]
    infoSpec = { subscribe:false, publish:false, subjects:subjects}
    Main.stream = new Stream( subjects, infoSpec )
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
      keys:(obj) ->
        Object.keys(obj)
      cols:()  ->
        Main.Batch['Cols'].data['Cols'].pracs
      comps:( compk ) ->
        Main.Batch[compk].data.comps
      pracs:( compk ) ->
        Main.Batch[compk].data[compk].pracs
      subset:( compk, filter ) ->
        filts = {}
        for own key, prac of Main.Batch[compk].data[compk].pracs when filter(prac)
          filts[key] = prac
        filts
      conns:( compk ) ->
        this.subset( compk, (prac) -> prac.row isnt 'Dim' )
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

