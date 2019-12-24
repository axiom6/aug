
import Util from '../util/Util.js'
import Vis  from '../../draw/base/Vis.js'

class Mixin

  constructor:( Main, views ) ->
    Mixin.Main  = Main
    Mixin.views = views

  mixin:() ->
    return  {

      created: () ->
        return

      methods: {

        # Util
        isDef: (d) ->
          d isnt null and typeof (d) isnt 'undefined'
        isStr: (s) ->
          this.isDef(s) and typeof (s) == "string" and s.length > 0
        isArray:(a) ->
          this.isDef(a) and typeof(a)!="string" and a.length? and a.length > 0
        inArray:(e,a) ->
          this.isArray(a) and a.indexOf(e) > -1
        isChild:( key ) ->
          a = key.charAt(0)
          b = key.charAt(key.length-1)
          a is a.toUpperCase() and a isnt '$' and b isnt '_'
        keys: (obj) ->
          Object.keys(obj)
        hasElem:(elem) ->
          elem? and elem['clientHeight']? and elem['clientHeight'] > 0
        getElem:($refs,name) ->  # Not called
          elem = $refs[name]
          console.log( 'Mixin.getElem() $refs[name]   ', $refs, elem, name )
          if not @hasElem(elem) and elem[0]?
            elem = $refs[name][0]
            console.log( 'Mixin.getElem() $refs[name][0]', $refs, elem, name )
            if not @hasElem(elem)
              console.error( 'Mixin.hasElem() unable to find elem in $refs[name]', name )
              console.dir($refs)
              elem = null
          else
            console.error( 'Mixin.hasElem() unable to find elem in $refs[name][0]', name )
            elem = null
          elem
        styleObj:( ikwObj, fontSize=undefined ) ->
          hsv = [30, 90, 90]
          if this.isDef(ikwObj)
            if this.isDef(ikwObj.hsv)
              hsv = ikwObj.hsv
            else if this.isDef(ikwObj.dir)
              hsv = switch ikwObj.dir
                when 'west'  then [195, 90, 70]
                when 'north' then [ 90, 90, 90]
                when 'east'  then [ 30, 60, 90]
                when 'south' then [ 60, 90, 90]
                else              [ 30, 90, 90]
          style = { backgroundColor:Vis.toRgbaHsv(hsv) }
          style['fontSize'] = fontSize+'rem' if fontSize
          style
        toRgbaHsv: (hsv) ->
          Vis.toRgbaHsv(hsv)

        # Main
        app:() ->
          Mixin.Main.app
        isMuse:() ->
          'Muse' is this.app()
        subscribe: (subject, source, onMethod) ->
          Mixin.Main['stream'].subscribe(subject, source, onMethod)
          return
        publish: (subject, object) ->
          Mixin.Main['stream'].publish(subject, object)
          return
        stream: () ->
          Mixin.Main.stream
        batch: () ->
          Mixin.Main.Batch
        fontSize:( scale ) ->  # JavaScript font-size the matches themeFS in theme.less
          fs = if Mixin.Main.fontSize? then Mixin.Main.fontSize else 2
          sc = if scale?               then scale               else 1
          sc * fs + 'vmin'
        fontSizeCss:( scale ) ->
          { fontSize:@fontSize(scale) }
          
        # Nav
        nav: () ->
          console.error( 'Mixin.nav() null' ) if not Mixin.Main.nav?
          Mixin.Main.nav
        touch: () ->
          console.error( 'Mixin.touch() null' ) if not Mixin.Main.touch?
          Mixin.Main.touch
        isTouch:() ->
          Mixin.Main.touch?
        isNav:() ->
          Mixin.Main.nav?
        navRoute:() ->
          if      this.isNav() then this.nav().route
          else if this.isDir() then this.dir().route
          else                      'None'
        isRoute:( route ) ->
          route is this.navRoute()

        # Batch
        prin: ()  ->
          Mixin.Main.Batch['Prin'].data.pracs
        comps: (compk) ->
          Mixin.Main.Batch[compk].data.comps
        kompsTocs: () ->   # For Tocs.vue
          Mixin.Main.komps
        views: () ->
          Mixin.views
        subset: (compk, filter) ->
          filts = {}
          for own key, prac of this.pracs(compk) when filter(prac)
            filts[key] = prac
          filts
        conns: (compk) ->
          filter = if compk isnt 'Prin' then (prac) -> prac.row isnt 'Dim' else (prac) -> prac.row is 'Dim'
          this.subset(compk, filter)
        pracs: (compk) ->
          Mixin.Main.Batch[compk].data.pracs
        disps: (compk, prack) ->
          Mixin.Main.Batch[compk].data[prack].disps
        areas: (compk, prack, dispk) ->
          Mixin.Main.Batch[compk].data[prack][dispk].areas
        items: (compk, prack, dispk, areak) ->
          Mixin.Main.Batch[compk].data[prack][dispk][areak].items
        bases: (compk, prack, dispk, areak, itemk) ->
          Mixin.Main.Batch[compk].data[prack][dispk][areak][itemk].bases

        # Talk
        compObject: (compKey) ->
          if Mixin.Main.Batch[compKey]?
             Mixin.Main.Batch[compKey].data.pracs
          else
             console.error( 'Mixin.compObject() bad compKey', compKey )
             {}
        pracObject:( compKey, pracKey ) ->
          prac = {}
          if this.pracs(compKey)?
            if this.pracs(compKey)[pracKey]?
              prac = this.pracs(compKey)[pracKey]
            else
              console.error( 'Mixin.pracObj() unknown pracKey', { compKey:compKey, pracKey:pracKey } )
          else
            console.error( 'Mixin.pracObj() unknown compKey', { compKey:compKey, pracKey:pracKey } )
          prac

        sectObject:( pracKey, dispKey ) ->
          talkObjs      = @compObject('Talk')
          talkObj       = talkObjs[pracKey]
          sectObjs      = @compObject(talkObj.comp)
          talkObj.keys  = if talkObj.keys?  then talkObj.keys else Util.childKeys(sectObjs)
          dispKey       = if dispKey is 'None' then @keys(sectObjs)[0] else dispKey
          sectObj       = sectObjs[dispKey]
          sectObj.src   = talkObj.src
          sectObj.name  = dispKey
          sectObj.peys  = talkObj.keys
          sectObj.keys  = if sectObj.keys?  then sectObj.keys else Util.childKeys(sectObj)
          # console.log( 'Mixin.sectObj()', { pracKey:pracKey, dispKey:dispKey, sectObj:sectObj } )
          sectObj

        pageObject:( sectObj, pageKey ) ->
          pageKey = if pageKey is 'None' and sectObj.keys[0]? then sectObj.keys[0] else pageKey
          pageObj = null
          if pageKey isnt 'None' and sectObj[pageKey]?
             pageObj      = sectObj[pageKey]
             pageObj.src  = sectObj.src
             pageObj.name = pageKey
             pageObj.peys = sectObj.keys
             pageObj.keys = if pageObj.keys?  then pageObj.keys else Util.childKeys(pageObj)
          # console.log( 'Mixin.pageObj()', { dispKey:sectObj.name, pageKey:pageKey, pageObj:pageObj } )
          pageObj

        dataObject:( sectObj, pageKey ) ->
          dataObj = null
          if sectObj.type is 'Prac'
             dataObj = @pracObject( sectObj.src, sectObj.name )
          else if sectObj.type is 'Disp' and  pageKey isnt 'None'
             dataObj = @dispObject( sectObj.src, sectObj.name, pageKey )
          dataObj
        dispObject: (compKey, pracKey, dispKey) ->
          this.disps(compKey, pracKey)[dispKey]

        isPageKeyComp:( pageKey ) ->
          pageKey is'Info' or pageKey is 'Data' # this.app() is 'Muse' and



        # Choice
        choice:() ->
          Mixin.Main.Batch.Choice.data
        choices:( name ) ->
          obj = this.choice()[name]
          if obj?
             obj.choices
          else
            console.error( 'Mixin.choices() bad choice name', { name:name } )
            []
        choose:( name, choice ) ->
          obj = this.choice()[name]
          if obj?
             obj.choices[obj.idx] = choice;
             obj.idx = ++obj.idx % obj.choices.length;
          else
            console.error( 'Mixin.choose() bad choice', { name:name, choice:choice } )
          return
        choosen:( name, choice ) ->
          this.choice()[name]? and this.inArray( choice, this.choices(name) )
        choiceIndex:( name, choice ) ->
          obj = this.choice()[name]
          idx = 0
          if obj?
             idx = obj.choices.indexOf(choice)
             idx = if idx is -1 then 0 else idx
          else
            console.error( 'Mixin.choiceIndex() bad choice name', { name:name, idx:idx } )
          idx

      }
    }

export default Mixin