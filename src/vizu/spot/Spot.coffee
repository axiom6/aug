
import * as THREE        from 'three'
import { TWEEN }         from 'three/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

class Spot
  
  constructor:( @elem, @mix ) ->
    @debug = true
    @doSpot()
    @init()
    @render()
    @animate()
    
  doSpot:() ->
    
    @renderer = new THREE.WebGLRenderer()
    @renderer.setPixelRatio( window.devicePixelRatio )

    @camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 2000 )

    @controls = new OrbitControls( @camera, @renderer.domElement )

    @scene = new THREE.Scene()

    @matFloor = new THREE.MeshPhongMaterial()
    @matBox   = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } )

    @geoFloor = new THREE.PlaneGeometry( 2000, 2000 )
    @geoBox   = new THREE.BoxGeometry( 3, 1, 2  )

    @mshFloor = new THREE.Mesh( @geoFloor, @matFloor )
    @mshFloor.rotation.x = - Math.PI * 0.5
    @mshBox  = new THREE.Mesh( @geoBox, @matBox )

    @ambient = new THREE.AmbientLight( 0x111111 )

    @spotLight1 = @createSpotlight( 0xFF7F00 )
    @spotLight2 = @createSpotlight( 0x00FF7F )
    @spotLight3 = @createSpotlight( 0x7F00FF )

    return


  init:() ->

    @renderer.shadowMap.enabled = true
    @renderer.shadowMap.type    = THREE.PCFSoftShadowMap
    @renderer.outputEncoding    = THREE.sRGBEncoding

    @camera.position.set( 46, 22, - 21 )

    @spotLight1.position.set( 15, 40, 45 )
    @spotLight2.position.set( 0, 40, 35 )
    @spotLight3.position.set( - 15, 40, 45 )

    @lightHelper1 = new THREE.SpotLightHelper( @spotLight1 )
    @lightHelper2 = new THREE.SpotLightHelper( @spotLight2 )
    @lightHelper3 = new THREE.SpotLightHelper( @spotLight3 )

    @matFloor.color.set( 0x808080 )

    @mshFloor.receiveShadow = true
    @mshFloor.position.set( 0, - 0.05, 0 )

    @mshBox.castShadow = true
    @mshBox.receiveShadow = true
    @mshBox.position.set( 0, 5, 0 )

    @addToScene( @mshFloor )
    @addToScene( @mshBox )
    @addToScene( @ambient )
    @addToScene( @spotLight1,   @spotLight2,   @spotLight3   )
    @addToScene( @lightHelper1, @lightHelper2, @lightHelper3 )

    @elem.appendChild( @renderer.domElement )
    @onWindowResize()
    window.addEventListener( 'resize', @onWindowResize, false )

    @controls.target.set( 0, 7, 0 )
    @controls.maxPolarAngle = Math.PI / 2
    @controls.update()

    return

  addToScene:( args... ) ->
    for arg in args
      console.log( arg ) if @debug
      @scene.add( arg )
    return

  createSpotlight:( color ) ->
    newObj = new THREE.SpotLight( color, 2 )
    newObj.castShadow = true
    newObj.angle = 0.3
    newObj.penumbra = 0.2
    newObj.decay = 2
    newObj.distance = 50
    newObj

  dispose:() ->
    # Third arg useCapture must match addEventLIstenter()
    window.removeEventListener( 'resize', @onWindowResize, false )
    return

  onWindowResize:() =>
    @camera.aspect = window.innerWidth / window.innerHeight
    @camera.updateProjectionMatrix()
    @renderer.setSize( window.innerWidth, window.innerHeight )
    return

  animate:() =>
    @tween( @spotLight1 )
    @tween( @spotLight2 )
    @tween( @spotLight3 )
    setTimeout( @animate, 5000 )
    return

  render:() =>
    TWEEN.update()
    @lightHelper1.update() if @lightHelper1?
    @lightHelper2.update() if @lightHelper2?
    @lightHelper3.update() if @lightHelper3?
    @renderer.render( @scene, @camera )
    requestAnimationFrame( @render )
    return

  tween:( light ) =>

    new TWEEN.Tween( light ).to( {
        angle:  ( Math.random() * 0.7 ) + 0.1,
        penumbra: Math.random() + 1 },
        Math.random() * 3000 + 2000 ).easing( TWEEN.Easing.Quadratic.Out ).start()

    new TWEEN.Tween( light.position ).to( {
        x: ( Math.random() * 30 ) - 15,
        y: ( Math.random() * 10 ) + 15,
        z: ( Math.random() * 30 ) - 15 },
        Math.random() * 3000 + 2000 ).easing( TWEEN.Easing.Quadratic.Out ).start()

    return


export default Spot