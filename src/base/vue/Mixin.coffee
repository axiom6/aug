
import Vis from '../util/Vis.js'

class Mixin

  # Muse   ['Home','Prin','Comp','Prac','Disp','Cube']
  # Augn   ['Home','Math','Geom','Data','Draw','Note','Wood' ]
  # Jitter ['Home','Flavor','Roast','Brew','Drink','Body']

  constructor:(   Main, views ) ->
    Mixin.Main  = Main
    Mixin.views = views

  mixin:() ->
    return  {
      created: () ->
        # console.log( 'Main.vueMixin.created() globally' )
        return
      methods: {
        isDef: (d) ->
          d isnt null and typeof (d) isnt 'undefined'
        isStr: (s) ->
          this.isDef(s) and typeof (s) == "string" and s.length > 0
        isArray:(a) ->
          this.isDef(a) and typeof(a)!="string" and a.length? and a.length > 0
        inArray:(e,a) ->
          this.isArray(a) and a.indexOf(e) > -1
        app:() ->
          Mixin.Main.app
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
        nav: () ->
          console.error( 'Mixin.nav() null' ) if not Mixin.Main.nav?
          Mixin.Main.nav
        dir: () ->
          console.error( 'Mixin.dir() null' ) if not Mixin.Main.dir?
          Mixin.Main.dir
        keys: (obj) ->
          Object.keys(obj)
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
        compObject: (compKey) ->
          Mixin.Main.Batch[compKey].data.pracs
        pracObject: (compKey, pracKey) ->
          this.pracs(compKey)[pracKey]
        dispObject: (compKey, pracKey, dispKey) ->
          this.disps(compKey, pracKey)[dispKey]
        toRgbaHsv: (hsv) ->
          hsu = if not hsv then [30, 90, 90] else hsv
          Vis.toRgbaHsv(hsu)
        showPages: (pages, pageKey) ->
          hasPage = false
          for own key, page  of pages
            page.show = key is pageKey
            hasPage = true if page.show
          # console.log( 'Main.showPages()', { pageKey:pageKey, hasPage:hasPage, pages:pages })
          hasPage
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