
import { MathUtils } from 'three'

class Animate

  constructor:( @main ) ->
    @klass       = @constructor.name
    @opts        = @main.opts.animate
    @cc          = @main.cartesian
    @theta       = if @opts.rotate? and @opts.rotate.theta?  then @opts.rotate.theta  else 0
    @radius      = if @opts.rotate? and @opts.rotate.radius? then @opts.rotate.radius else @cc.dist
    @camControls = @main.cameras.controls
    @camControls.addEventListener( 'change', () => @main.needsRender = true ) if @camControls?
    @main.log( @klass+'()', @ )

  # Call before animate to insure an initial rendering
  # Significant step. Not called when scene is static
  render:() =>
    if @main.needsRender or @main.animateOn
       @main.render.renderer.render( @main.scene, @main.cameras.camera )
       @main.needsRender = false
    return

  animate:() =>
    @rotate()       if @opts.rotate?
    @lightHelpers() if @main.needsRender and @main.lights.lightHelpers.length > 0
    @controls()     if @main.needsRender and @camControls?
    @doAnimations() if @main.animateOn
    @render()
    requestAnimationFrame( @animate )
    return

  doAnimations:() =>
    if @main.hexagon?
       @main.hexagon.animate()
    return

  controls:() =>
    @camControls.update()       # if @camControls.enableDamping or @camControls.autoRotate
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
    @main.needsRender = true
    return

  delayNeedsRender:() ->
    callback = () => @main.needsRender = true
    @main.nav.delayCallback( 1000, callback )
    return

export default Animate