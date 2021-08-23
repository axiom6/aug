
import { PerspectiveCamera, OrthographicCamera, CameraHelper } from 'three'
import { OrbitControls     } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

class Cameras

  constructor:( @main ) ->
    @klass    = @constructor.name
    cc        = @main.cartesian
    @optsCam  = @main.opts.cameras
    @camera   = @selectCamera(   @optsCam, cc )
    @controls = @selectControls( @optsCam, cc, @camera )
    @main.stream.subscribe( 'Resize',  @klass, (obj) => @onResize( obj) )
    @main.stream.subscribe( 'Dispose', @klass, (obj) => @onDispose(obj) )
    @main.log( @klass+'()', @, @optsCam )

  initDefs:( cc ) ->
    defs = {}
    defs.aspect   = @main.aspectRatio
    defs.dist     = cc.dist
    defs.scale    = 2.0
    defs.position = { x:defs.dist*0.2, y:defs.dist*0.2, z:defs.dist*0.20 }
    defs.fov      = 75
    defs

  processOpts:( optsCamera, cc, defs ) ->
    opts          = Object.assign( {}, optsCamera )
    opts.aspect   = @main.aspectRatio
    opts.dist     = cc.dist
    opts.scale    = if opts.scale?     then opts.scale     else defs.scale
    opts.scaleXYZ = { x:opts.aspect/opts.scale, y:opts.aspect/opts.scale, z:opts.aspect/opts.scale }
    opts.scenePos = @main.scene.position
    opts.position = if opts.position?  then opts.position  else defs.position
    opts.fov      = if opts.fov?       then opts.fov       else defs.fov
    opts.left     = if opts.left?      then opts.left      else defs.left
    opts.right    = if opts.right?     then opts.right     else defs.right
    opts.top      = if opts.top?       then opts.top       else defs.top
    opts.bottom   = if opts.bottom?    then opts.bottom    else defs.bottom
    opts.near     = if opts.near?      then opts.near      else defs.near
    opts.far      = if opts.far?       then opts.far       else defs.far
    return opts

  selectCamera:( optsCam, cc ) ->
    return @orthographic( optsCam, cc ) if not optsCam? and not optsCam.camera?
    switch optsCam.camera
      when 'OrthoXYZ'     then @orthoXYZ(     optsCam, cc )
      when 'OrthoISO'     then @orthoISO(     optsCam, cc )
      when 'Orthographic' then @orthographic( optsCam, cc )
      when 'Perspective'  then @perspective(  optsCam, cc )
      when 'Muse'         then @muse(         optsCam, cc )
      else
        console.error( 'Cameras.selectCamera() unknown camera', optsCam )
        @orthographic( optsCam, cc )

  selectControls:( optsCam, cc, camera ) ->
    @main.log( "Camera.selectControls()", optsCam, cc )
    return @orbit( optsCam, cc ) if not optsCam? and optsCam.controls?
    switch optsCam.controls
      when 'Orbit'     then @orbit(     camera, cc  )
      when 'Trackball' then @trackball( camera, cc  )
      else
        console.error( 'Cameras.selectControls() unknown controls', optsCam.controls )
        @orbit( optsCam, cc )

  orthoXYZ:( camOpts, cc ) ->
    defs        = @initDefs( cc )
    defs.near   = -defs.dist * 5.0
    defs.far    =  defs.dist * 5.0
    defs.left   = -defs.dist * defs.aspect 
    defs.right  =  defs.dist * defs.aspect
    defs.top    =  defs.dist
    defs.bottom = -defs.dist
    opts        = @processOpts( camOpts, cc, defs )
    camera      = @ortho( opts )
    @projectionMatrix( camera.projectionMatrix, opts )
    camera

  orthoISO:( camOpts, cc ) ->
    defs        = @initDefs( cc )
    defs.near   = -defs.dist * 5.0
    defs.far    =  defs.dist * 5.0
    defs.left   = -defs.dist * defs.aspect   # Orthographic
    defs.right  =  defs.dist * defs.aspect
    defs.top    =  defs.dist
    defs.bottom = -defs.dist
    opts        = @processOpts( camOpts, cc, defs )
    camera      = @ortho( opts )
    @projectionMatrix( camera.projectionMatrix, opts )
    camera

  projectionMatrix:( matrix, opts ) ->
    s     = opts.scaleXYZ
    xAxis = { x:s.x, y:1,   z:1   }
    yAxis = { x:1,   y:s.y, z:1   }
    zAxis = { x:1,   y:1,   z:s.z }
    matrix.makeBasis( xAxis, yAxis, zAxis )
    return

  orthographic:( camOpts, cc ) ->  # Uses world coordinates
    defs        = @initDefs( cc )
    defs.near   = -defs.dist * 5.0
    defs.far    =  defs.dist * 5.0
    defs.left   = -defs.dist * defs.aspect   # Orthographic
    defs.right  =  defs.dist * defs.aspect
    defs.top    =  defs.dist
    defs.bottom = -defs.dist
    opts        = @processOpts( camOpts, cc, defs )
    @ortho( opts )

  ortho:( opts ) ->  # Uses world coordinates
    camera = new OrthographicCamera( opts.left, opts.right, opts.top, opts.bottom, opts.near, opts.far )
    camera.scale.set(    opts.scaleXYZ.x, opts.scaleXYZ.y, opts.scaleXYZ.z )
    camera.position.set( opts.position.x, opts.position.y, opts.position.z )
    camera.lookAt(       opts.scenePos.x, opts.scenePos.y, opts.scenePos.z )

    if opts.helper? and opts.helper
      helper = new CameraHelper( camera )
      @main.addToScene( helper )
    camera

  perspective:( camOpts, cc ) ->
    defs      = @initDefs( cc )
    defs.fov  = 75
    defs.near = defs.dist * 0.01
    defs.far  = defs.dist * 100
    opts      = @processOpts( camOpts, cc, defs )
    camera    = new PerspectiveCamera( opts.fov, @main.aspectRatio, opts.near, opts.far )
    camera.scale.set(    opts.scaleXYZ.x, opts.scaleXYZ.y, opts.scaleXYZ.z )
    camera.position.set( opts.position.x, opts.position.y, opts.position.z )
    camera.lookAt(       opts.scenePos.x, opts.scenePos.y, opts.scenePos.z )

    if opts.helper? and opts.helper
      helper = new CameraHelper( camera )
      @main.addToScene( helper )
    camera

  muse:( camOpts, cc ) ->
    defs          = @initDefs( cc )
    defs.fov      = 45
    defs.near     = 1
    defs.far      = 10000
    defs.position = { "x":0, "y":6, "z":1600 }
    opts          = @processOpts( camOpts, cc, defs )
    @perspective( opts )

  orbit:( camera, cc ) ->
    if cc then false
    controls = new OrbitControls( camera, @main.render.renderer.domElement )
    scenePos = @main.scene.position
    controls.target.set( scenePos.x, scenePos.y, scenePos.z )
    controls.update()
    controls

  trackball:( camera, cc ) ->
    if cc then false
    controls = new TrackballControls( camera, @main.render.renderer.domElement )
    scenePos = @main.scene.position
    controls.target.set( scenePos.x, scenePos.y, scenePos.z )
    controls.update()
    controls

  onResize:( obj ) =>
    @main.log( @klass+'.onResize()', obj )
    @camera.aspect = obj.aspectRatio
    r              = obj.aspectRatio / obj.aspectLast
    if @optsCam.camera is 'Orthographic'
      cscale    = @camera.scale
      nscale    = {  "x":cscale.x*r, "y":cscale.y*r, "z":cscale.y*r }
      @camera.scale.set( nscale.x,       nscale.y,       nscale.z   )
    @camera.updateProjectionMatrix()
    return

  onDispose:( obj ) =>
    @main.log( @klass+'onDispose()', obj )
    # @isometric.dispose()   if @isometric?
    # @perspective.dispose() if @@perspective?

export default Cameras
