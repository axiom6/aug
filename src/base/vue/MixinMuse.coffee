

class MixinMuse

  constructor:() ->

  mixin:() ->

    return  {

      created: () ->
        return

      methods: {

        prin: ()  ->
          this.batchDataUtil('Prin').pracs
        comps: (compk) ->
          this.batchDataUtil(compk).comps

        subset: (compk, filter) ->
          filts = {}
          for own key, prac of this.pracs(compk) when filter(prac)
            filts[key] = prac
          filts
        conns: (compk) ->
          filter = if compk isnt 'Prin' then (prac) -> prac.row isnt 'Dim' else (prac) -> prac.row is 'Dim'
          this.subset(compk, filter)
        pracs: (compk) ->
          this.batchDataUtil(compk).pracs
        disps: (compk, prack) ->
          this.batchDataUtil(compk)[prack].disps
        areas: (compk, prack, dispk) ->
          this.batchDataUtil(compk)[prack][dispk].areas
        items: (compk, prack, dispk, areak) ->
          this.batchDataUtil(compk)[prack][dispk][areak].items
        bases: (compk, prack, dispk, areak, itemk) ->
          this.batchDataUtil(compk)[prack][dispk][areak][itemk].bases

      }
    }

export default MixinMuse