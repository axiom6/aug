
import Util   from '../../pub/util/Util.js'
import Data   from '../../pub/util/Data.js'
import Stream from '../../pub/util/Stream.js'

class Main

  Data.local  = "http://localhost:63342/aug/app/data/"
  Data.hosted = "https://ui-48413.firebaseapp.com/"

  Main.Batch =
    Cols: { url:'muse/Cols.json', data:null, type:'Pack', plane:'Cols' }
    Rows: { url:'muse/Rows.json', data:null, type:'Pack', plane:'Rows' }
    Info: { url:'muse/Info.json', data:null, type:'Pack', plane:'Info' }
    Know: { url:'muse/Know.json', data:null, type:'Pack', plane:'Know' }
    Wise: { url:'muse/Wise.json', data:null, type:'Pack', plane:'Wise' }
    Cube: { url:'muse/Cube.json', data:null, type:'Pack', plane:'Cube' }

  Main.begin  =  ( onReady ) ->
    Main.onReady = onReady
    Data.batchRead( Main.Batch, Main.init, Data.refine )
    return

  Main.init =  ( batch ) ->
    Main.Batch = batch # Not necessary here, but assigned for compatibilitry
    subjects = ["Info","Know","Wise"]
    subjects = subjects.concat( Main.NavbSubjects )
    infoSpec = { subscribe:false, publish:false, subjects:subjects}
    Main.stream = new Stream( subjects, infoSpec )
    Main.onReady()
    # Main.logPracs( 'Info' )
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
      comps:( compk ) ->
        Main.Batch[compk].data.comps
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
    }
  }


  Main.NavbSubjects = ["Search","Contact","Settings","SignOn"]
  Main.NavbSpecs    = [
    { type:"NavBarLeft" }
    { type:"Item",      name:"Home",   icon:"fa-home", topic:'SelectView', subject:"Select" }
    { type:"NavBarEnd" }
    { type:"NavBarRight"}
    { type:"Search",    name:"Search",    icon:"fa-search", size:"10", topic:'Search', subject:"Search" }
    { type:"Contact",   name:"Contact",   icon:"fa-user", topic:"http://twitter.com/TheTomFlaherty", subject:"Contact" }
    { type:"Dropdown",  name:"Settings",  icon:"fa-cog", items: [
      { type:"Item",    name:"Preferences", topic:"Preferences", subject:"Settings" }
      { type:"Item",    name:"Connection",  topic:"Connection",  subject:"Settings" }
      { type:"Item",    name:"Privacy",     topic:"Privacy",     subject:"Settings" } ] }
    { type:"SignOn",    name:"SignOn", icon:"fa-sign-in", size:"10", topic:'SignOn', subject:"SignOn" }
    { type:"NavBarEnd"  } ]

  Util.noop( Main.NavbSpecs )

`export default Main`

