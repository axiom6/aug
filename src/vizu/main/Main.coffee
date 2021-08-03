
import { Scene, Color }   from 'three'
import Cartesian   from '../coords/Cartesian.js'
import Cylindrical from '../coords/Cylindrical.js'
import Spherical   from '../coords/Spherical.js'
import Render      from './Render.js'
import Lights      from './Lights.js'
import Cameras     from './Cameras.js'
import Content     from '../content/Content.js'
import Animate     from './Animate.js'
import Verify      from './Verify.js'

class Main

  constructor:( @stream, @nav ) ->
    @elem       = null
    @opts       = {}
    @compKey    = ""
    @pageKey    = ""
    @debug      = false
    @verifyFlag = false

  setup:() ->
    @scene        = new Scene()
    @scene.background = new Color('black')
    @cartesian    = new Cartesian(   @ )
    @cylindrical  = new Cylindrical( @ )
    @spherical    = new Spherical(   @ )
    @render       = new Render(      @ )
    @cameras      = new Cameras(     @ )
    @content      = new Content(     @ )  # Changed order so Lights can create points
    @lights       = new Lights(      @ )
    @animate      = new Animate(     @ )
    @verify       = new Verify(      @ )

    window.addEventListener( 'resize', @resizeScreen, false )

  doApp:( elem, opts, compKey, pageKey ) =>
    @elem       = elem
    @opts       = opts
    @compKey    = compKey
    @pageKey    = pageKey
    @opts.main  = if @opts.main? then @opts.main else {}
    @debug      = @opts.main.debug?  and @opts.main.debug
    @verifyFlag = @opts.main.verify? and @opts.main.verify
    @log( "Main.doApp()", { opts:opts, debug:@debug, verify:@verifyFlag } )
    @runApp( elem )
    return

  runApp:( elem ) ->
    @screen( elem )
    @setup()
    @animate.animate()
    return

  screen:( elem ) ->
    @elem         = elem
    @screenWidth  = @elem['clientWidth']
    @screenHeight = @elem['clientHeight']
    @aspectRatio  = @screenWidth  / @screenHeight
    @aspectLast   = @aspectRatio
    obj = { screenWidth:@screenWidth, screenHeight:@screenHeight, aspectRatio:@aspectRatio }
    @log( "Main.screen()", obj ) if @debug

  # object3Ds must be args... not an array
  addToScene:( object3Ds... ) ->
    for object3D in object3Ds
      @log( "Main.addToScene(object3D)", object3D ) if not @nav.inArray( object3D.type, ['Line','Points','Mesh'] )
      @verify.verify( object3D ) if @verifyFlag
      @scene.add(     object3D )
    return

  removeFromScene:( object3Ds... ) ->
    for object3D in object3Ds
      @scene.remove(  object3D )
    return

  resizeScreen:() =>
    @screenWidth  = @elem['clientWidth']
    @screenHeight = @elem['clientHeight']
    @aspectRatio  = @screenWidth  / @screenHeight
    obj = { screenWidth:@screenWidth, screenHeight:@screenHeight, aspectRatio:@aspectRatio, aspectLast:@aspectLast }
    @log( "Main.resizeScreen",  obj )
    @stream.publish( 'Resize',  obj )
    @aspectLast   = @aspectRatio
    return

  log:( klass, ptr ) ->
    return if not @debug
    logPtr = {}
    hides  = ['main','klass','opts','__proto__']
    filter = (key) => key isnt @nav.inArray(key,hides)
    for own key, obj of ptr when filter(key)
      logPtr[key] = obj
    console.log( klass, logPtr )
    return

  dispose:() ->
    # Third arg useCapture must match addEventLIstenter()
    window.removeEventListener( 'resize', @resizeScreen, false )
    @log( "Main.dispose()" ) if @debug
    # @stream.publish( 'Dispose', {} ) # Hold off for now
    return

export default Main
