
import Vis  from '../../draw/base/Vis.js'

class MixinUtil  # Global Vue Mixin

  constructor:( Main, views ) ->
    MixinUtil.Main  = Main
    MixinUtil.views = views

  mixin:() ->

    return  {

      created: () ->
        return

      methods: {

        isDefUtil: (d) ->
          d isnt null and typeof (d) isnt 'undefined'
        isStrUtil: (s) ->
          this.isDef(s) and typeof (s) == "string" and s.length > 0
        isArrayUtil: (a) ->
          this.isDef(a) and typeof (a) != "string" and a.length? and a.length > 0
        inArrayUtil: (e, a) ->
          this.isArray(a) and a.indexOf(e) > -1
        isChildUtil: (key) ->
          a = key.charAt(0)
          b = key.charAt(key.length - 1)
          a is a.toUpperCase() and a isnt '$' and b isnt '_'
        childKeys:( obj ) ->
          vals = []
          for own key, val of obj
            vals.push(key) if this.isChildUtil(key)
          vals
        keysUtil: (obj) ->
          Object.keys(obj)

        mainUtil:() ->
          MixinUtil.Main
        viewsUtil:() ->
          MixinUtil.views
        batchUtil: () ->
          this.mainUtil().Batch
        batchDataUtil: ( name ) ->
          this.mainUtil().Batch[name].data
        kompsUtil: () ->   # For Tocs.vue
          this.mainUtil().komps
        appUtil:() ->
          this.mainUtil().app
        isMuseUtil:() ->
          'Muse' is this.app()
        subscribeUtil: (subject, source, onMethod) ->
          this.mainUtil()['stream'].subscribe(subject, source, onMethod)
          return
        publishUtil: (subject, object) ->
          this.mainUtil()['stream'].publish(subject, object)
          return
        streamUtil: () ->
          this.mainUtil().stream

        fontSize:( scale ) ->  # JavaScript font-size the matches themeFS in theme.less
          fs = if Mixin.Main.fontSize? then Mixin.Main.fontSize else 2
          sc = if scale?               then scale               else 1
          sc * fs + 'vmin'
        fontSizeCss:( scale ) ->
          { fontSize:@fontSize(scale) }
        hasElemUtil: (elem) ->
          elem? and elem['clientHeight']? and elem['clientHeight'] > 0
        getElemUtil: ($refs, name) ->  # Not called
          elem = $refs[name]
          console.log('Mixin.getElem() $refs[name]   ', $refs, elem, name)
          if not @hasElem(elem) and elem[0]?
            elem = $refs[name][0]
            console.log('Mixin.getElem() $refs[name][0]', $refs, elem, name)
            if not @hasElem(elem)
              console.error('Mixin.hasElem() unable to find elem in $refs[name]', name)
              console.dir($refs)
              elem = null
          else
            console.error('Mixin.hasElem() unable to find elem in $refs[name][0]', name)
            elem = null
          elem
        styleObjUtil: (ikwObj, fontSize = undefined) ->
          hsv = [30, 90, 90]
          if this.isDef(ikwObj)
            if this.isDef(ikwObj.hsv)
              hsv = ikwObj.hsv
            else if this.isDef(ikwObj.dir)
              hsv = switch ikwObj.dir
                when 'west'  then [195, 90, 70]
                when 'north' then [90, 90, 90]
                when 'east'  then [30, 60, 90]
                when 'south' then [60, 90, 90]
                else
                  [30, 90, 90]
          style = {backgroundColor: this.toRgbaHsv(hsv)}
          style['fontSize'] = fontSize + 'rem' if fontSize
          style
        toRgbaHsvUtil: (hsv) ->
          Vis.toRgbaHsv(hsv)

      }
    }