
import Data   from '../../base/util/Data.js'
import Stream from '../../base/util/Stream.js'
import Nav    from '../../base/util/Nav.js'
import Cache  from '../../base/util/Cache.js'
#mport Test   from './Test.js'

class Main

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
    Main.app     = 'Augm'
    subjects     = ["Draw","Note","Menu","Tabs","Geom","Data","Cache","Navd"]
    streamLog    = { subscribe:false, publish:false, subjects:subjects}
    Main.stream  = new Stream( subjects, streamLog )
    Main.nav     = new Nav(   Main.stream, batch, 'Info' )
    #ain.cache   = new Cache( Main.stream )
    Main.onReady()
    # new Test()
    return

export default Main

