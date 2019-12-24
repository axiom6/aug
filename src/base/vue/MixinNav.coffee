
class MixinNav

  constructor:() ->

  mixin:() ->

    return  {

      created: () ->
        return

      methods: {

        navNav: () ->
          console.error( 'Mixin.nav() null' ) if not this.mainUtil().nav?
          this.mainUtil().nav
        touchNav: () ->
          console.error( 'Mixin.touch() null' ) if not this.mainUtil().touch?
          this.mainUtil().touch
        isTouchNav:() ->
          this.mainUtil().touch?
        isNavNav:() ->
          this.mainUtil().nav?
        navRouteNav:() ->
          if      this.isNav() then this.nav().route
          else if this.isDir() then this.dir().route
          else                      'None'
        isRouteNav:( route ) ->
          route is this.navRoute()

    }
  }

export default MixinNav