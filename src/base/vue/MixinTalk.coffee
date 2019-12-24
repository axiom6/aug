

class MixinTalk

  constructor:() ->

  mixin:() ->

    return  {

      created: () ->
        return

      methods: {

        compObjectTalk: (compKey) ->
          if this.batchDataUtil(compKey)?
             this.batchDataUtil(compKey).pracs
          else
             console.error( 'Mixin.compObject() bad compKey', compKey )
             {}

        pracObjectTalk:( compKey, pracKey ) ->
          prac = {}
          if         this.compObjectTalk(compKey)?
            if       this.compObjectTalk(compKey)[pracKey]?
              prac = this.compObjectTalk(compKey)[pracKey]
            else
              console.error( 'Mixin.pracObj() unknown pracKey', { compKey:compKey, pracKey:pracKey } )
          else
            console.error( 'Mixin.pracObj() unknown compKey', { compKey:compKey, pracKey:pracKey } )
          prac

        sectObjectTalk:( pracKey, dispKey ) ->
          talkObjs      = this.compObjectTalk('Talk')
          talkObj       = talkObjs[pracKey]
          sectObjs      = this.compObjectTalk(talkObj.comp)
          talkObj.keys  = if talkObj.keys?  then talkObj.keys else this.childKeysUtil(sectObjs)
          dispKey       = if dispKey is 'None' then this.keysUtil(sectObjs)[0] else dispKey
          sectObj       = sectObjs[dispKey]
          sectObj.src   = talkObj.src
          sectObj.name  = dispKey
          sectObj.peys  = talkObj.keys
          sectObj.keys  = if sectObj.keys?  then sectObj.keys else this.childKeysUtil(sectObj)
          # console.log( 'Mixin.sectObj()', { pracKey:pracKey, dispKey:dispKey, sectObj:sectObj } )
          sectObj

        pageObjectTalk:( sectObj, pageKey ) ->
          pageKey = if pageKey is 'None' and sectObj.keys[0]? then sectObj.keys[0] else pageKey
          pageObj = null
          if pageKey isnt 'None' and sectObj[pageKey]?
            pageObj      = sectObj[pageKey]
            pageObj.src  = sectObj.src
            pageObj.name = pageKey
            pageObj.peys = sectObj.keys
            pageObj.keys = if pageObj.keys?  then pageObj.keys else this.childKeysUtil(pageObj)
            # console.log( 'Mixin.pageObj()', { dispKey:sectObj.name, pageKey:pageKey, pageObj:pageObj } )
          pageObj

        dataObjectTalk:( sectObj, pageKey ) ->
          dataObj = null
          if sectObj.type is 'Prac'
            dataObj = this.pracObjectTalk( sectObj.src, sectObj.name )
          else if sectObj.type is 'Disp' and  pageKey isnt 'None'
            dataObj = this.dispObjectTalk( sectObj.src, sectObj.name, pageKey )
          dataObj

        dispObjectTalk: (compKey, pracKey, dispKey) ->
          comp = this.compObjectTalk(compKey)
          prac = if comp[pracKey]? then comp[pracKey] else null
          disp = if prac? and prac.disps? and prac.disps[pracKey]?prac.disps[dispKey] else null
          if not disp?
            console.error( 'MixinTalk.dispObjectTalk() unable to find disp for', { compKey:compKey, pracKey:pracKey, dispKey:dispKey } )
          disp

        isPageKeyCompTalk:( pageKey ) ->
          pageKey is'Info' or pageKey is 'Data' # this.app() is 'Muse' and

      }
    }

export default MixinTalk