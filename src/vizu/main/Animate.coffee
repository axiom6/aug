
import { MathUtils } from 'three'

class Animate

  constructor:( @main ) ->
    @klass       = @constructor.name
    @opts        = @main.opts.animate
    @cc          = @main.cartesian
    @theta       = if @opts.rotate? and @opts.rotate.theta?  then @opts.rotate.theta  else 0
    @radius      = if @opts.rotate? and @opts.rotate.radius? then @opts.rotate.radius else @cc.dist
    @needsRender = true
    @camControls = @main.cameras.controls
    @camControls.addEventListener( 'change', () => @needsRender = true ) if @camControls?
    @main.log( @klass+'()', @ )

  # Call before animate to insure an initial rendering
  render:() =>
    if @needsRender # Significant step. Not called when scene is static
       @main.render.renderer.render( @main.scene, @main.cameras.camera )
       @needsRender = false
    return

  animate:() =>
    @rotate()       if @opts.rotate?
    @lightHelpers() if @needsRender and @main.lights.lightHelpers.length > 0
    @controls()     if @needsRender and @camControls?
    @render()
    requestAnimationFrame( @animate )
    return

  controls:() =>
    @camControls.update() # if @camControls.enableDamping or @camControls.autoRotate
    return

  lightHelpers:() ->
    for lightHelper in @main.lights.lightHelpers
        lightHelper.update()
    return

  rotate:() =>
    camera = @main.cameras.camera
    @theta += 0.1
    camera.position.x = @radius * Math.sin( MathUtils.degToRad( @theta ) )
    camera.position.y = @radius * Math.sin( MathUtils.degToRad( @theta ) )
    camera.position.z = @radius * Math.cos( MathUtils.degToRad( @theta ) )
    camera.lookAt( @main.scene.position );
    camera.updateMatrixWorld()
    @needsRender = true
    return

export default Animate