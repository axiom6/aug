
import { WebGLRenderer, PCFSoftShadowMap, sRGBEncoding } from 'three'

class Render

  constructor:( @main ) ->
    @klass = @constructor.name
    @opts  = if @main.opts.render? then @main.opts.render else {}
    @clearColor = if @opts.clearColor? then @opts.clearColor else 0x000000 # 0x333F47, 1
    @renderer = new WebGLRenderer( { antialias:true } )
    @main.elem.appendChild( @renderer.domElement )
    @renderer.setSize( @main.screenWidth, @main.screenHeight )
    @renderer.setClearColor( @clearColor, 1 )
    @renderer.setPixelRatio( window.devicePixelRatio )
    if @opts.shadowMap? and @opts.shadowMap
      @renderer.shadowMap.enabled = true
      @renderer.shadowMap.type    = PCFSoftShadowMap
      @renderer.shadowMapSoft     = true
      @renderer.outputEncoding    = sRGBEncoding
    @main.stream.subscribe( 'Resize', @klass, (obj) => @onResize(obj) )
    @main.log( @klass+'()', @ )

  onResize:( obj ) =>
    @main.log( @klass+'.onResize()', obj )
    @renderer.setSize( obj.screenWidth, obj.screenHeight )
    return

export default Render
