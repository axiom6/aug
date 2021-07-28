
import { PerspectiveCamera, OrthographicCamera, CameraHelper } from 'three'
import { OrbitControls     } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

class Cameras

  constructor:( @main ) ->
    @klass    = @constructor.name
    @opts     = @main.opts.cameras
    cc        = @main.cartesian
    @camera   = @selectCamera(   @opts, cc )
    @controls = @selectControls( @opts, cc, @camera )
    @main.stream.subscribe( 'Resize',  @klass, (obj) => @onResize( obj) )
    @main.stream.subscribe( 'Dispose', @klass, (obj) => @onDispose(obj) )
    @main.log( @klass+'()', @, @opts )

  selectCamera:( opts, cc ) ->
    return @orthographic( opts, cc ) if not opts? and not opts.camera?
    switch opts.camera
      when 'Orthographic' then @orthographic( opts, cc )
      when 'Perspective'  then @perspective(  opts, cc )
      when 'Muse'         then @muse(         opts, cc )
      else
        console.error( 'Cameras.selectCamera() unknown camera', opts.camera )
        @orthographic( opts, cc )

  selectControls:( opts, cc, camera ) ->
    return @orbit( opts, cc ) if not opts? and opts.controls?
    switch opts.controls
      when 'Orbit'     then @orbit(     camera, cc  )
      when 'Trackball' then @trackball( camera, cc  )
      else
        console.error( 'Cameras.selectControls() unknown controls', opts.controls )
        @orbit( opts, cc )

  orthographic:( opts, cc ) ->  # Uses world coordinates
    aspect   = @main.aspectRatio
    dist     = cc.dist
    left     = if opts.left?      then opts.left      else -dist * aspect
    right    = if opts.right?     then opts.right     else  dist * aspect
    top      = if opts.top?       then opts.top       else  dist
    bottom   = if opts.bottom?    then opts.bottom    else -dist
    near     = if opts.near?      then opts.near      else -dist * 5.0
    far      = if opts.far?       then opts.far       else  dist * 5.0
    position = if opts.position?  then opts.position  else { "x":dist*0.2, "y":dist*0.2, "z":dist*0.2 }
    s        = 1.25
    scale    = { "x":s*aspect, "y":s*aspect, "z":s*aspect }
    scenePos = @main.scene.position

    camera = new OrthographicCamera( left, right, top, bottom, near, far )
    camera.scale.set(    scale.x,    scale.y,    scale.z    )
    camera.position.set( position.x, position.y, position.z )
    camera.lookAt(       scenePos.x, scenePos.y, scenePos.z )

    if opts.helper? and opts.helper
      helper = new CameraHelper( camera )
      @main.addToScene( helper )
    camera

  perspective:( opts, cc ) ->
    dist     = cc.dist
    fov      = if opts.fov?       then opts.fov       else  75
    near     = if opts.near?      then opts.near      else   0.01 * dist
    far      = if opts.far?       then opts.far       else 100    * dist
    position = if opts.position?  then opts.position  else { "x":0, "y":0.6*dist, "z":16*dist }
    scenePos = @main.scene.position
    camera   = new PerspectiveCamera( fov, @main.aspectRatio, near, far )
    camera.position.set( position.x, position.y, position.z )
    camera.lookAt(       scenePos.x, scenePos.y, scenePos.z )
    if opts.helper? and opts.helper
      helper = new CameraHelper( camera )
      @main.addToScene( helper )
    camera

  muse:( opts, cc ) ->
    if cc then false
    fov      = if opts.fov?       then opts.fov       else    45
    near     = if opts.near?      then opts.near      else     1
    far      = if opts.far?       then opts.far       else 10000
    position = if opts.position?  then opts.position  else { "x":0, "y":6, "z":1600 }
    scenePos = @main.scene.position
    camera   = new PerspectiveCamera( fov, @main.aspectRatio, near, far )
    camera.position.set( position.x, position.y, position.z )
    camera.lookAt(       scenePos.x, scenePos.y, scenePos.z )
    if opts.helper? and opts.helper
      helper = new CameraHelper( camera )
      @main.addToScene( helper )
    camera

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
    if @opts.camera is 'Orthographic'
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

