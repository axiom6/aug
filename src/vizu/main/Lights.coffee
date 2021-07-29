
import { AmbientLight, DirectionalLight, DirectionalLightHelper,
  SpotLight, SpotLightHelper, Object3D, HemisphereLight } from 'three'

class Lights

  constructor:( @main ) ->
    @klass        = @constructor.name
    @opts         = @main.opts.lights
    @cc           = @main.cartesian
    @lightHelpers = [] # Light Helpers are pushed into this array for animate updates
    @lights       = @selectLight( @opts, @cc ) # An array
    @main.log( @klass+'()', @ )

  selectLight:( opts, cc ) ->
    return @ambient( opts ) if not opts? and not opts.light?
    switch opts.light
      when 'Ambient'      then @ambient(      opts     )
      when 'SpotLight'    then @spotLight(    opts     )
      when 'Directional'  then @directional(  opts, cc )
      when 'Hemisphere'   then @hemisphere(            )
      when 'DirectColor'  then @directColor(  opts, cc )
      when 'Muse'         then @muse(         opts     )
      when 'Orthographic' then @orthographic( opts, cc )
      else
        console.log( 'Lights.selectLight() unknown light', opts.light )
        @ambient( opts )

  ambient:( opts ) ->
    color     = if opts.color? then opts.color?         else 0xFFFFFF
    intensity = if opts.intensity? then opts.intensity? else 1.0
    light     = new AmbientLight( color, intensity )
    light.position.set( 1, 1, 1 ).normalize()
    @main.addToScene(light)
    [light]

  spotlight:( opts ) ->
    color     = if opts.color?     then opts.color?     else 0xFFFFFF
    intensity = if opts.intensity? then opts.intensity? else 1.0
    light            = new SpotLight( color, intensity )
    light.castShadow = true
    light.angle      = 0.3
    light.penumbra   = 0.2
    light.decay      = 2
    light.distance   = 50
    @main.addToScene(light)
    if opts.helper? and opts.helper
      helper = new SpotLightHelper( light )
      @main.addToScene( helper )
    [light]

  hemisphere:(  ) ->
    light1 = new HemisphereLight( 0xffffff, 0x000088 )
    light2 = new HemisphereLight( 0xffffff, 0x880000, 0.5 )
    light1.position.set( -1,  1.5,  1 )
    light2.position.set( -1, -1.5, -1 )
    @main.addToScene( light1, light2 )
    [ light1, light2 ]

  muse:( opts ) ->

    if opts then false

    backLight  = new DirectionalLight( 'white', 0.15 )
    backLight.position.set(6,3,9)
    backLight.name = 'Back light'
    @main.addToScene( backLight )

    keydLight = new DirectionalLight( 'white', 0.35 );
    keydLight.position.set(-6, -3, 0)
    keydLight.name   = 'Key light'
    @main.addToScene( keydLight )

    fillLight = new DirectionalLight( 'white', 0.55 )
    fillLight.position.set(9, 9, 6)
    fillLight.name = 'Fill light'
    @main.addToScene( fillLight )

    spotLight = new SpotLight( 0xffffff )
    spotLight.position.set( 3, 30, 3 )
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width  = 2048
    spotLight.shadow.mapSize.height = 2048
    spotLight.shadow.camera.near    = 1
    spotLight.shadow.camera.far     = 4000
    spotLight.shadow.camera.fov     = 45
    @main.addToScene( spotLight )
    [ backLight, keydLight, fillLight, spotLight ]

  orthographic:( opts, cc ) ->
    spotLightXY = new SpotLight( 0xFF7F00, 2 )
    spotLightXY.castShadow = true
    targetXY    = new Object3D()
    spotLightXY.position.set( cc.xc, cc.yc, cc.zd*2.0 )
    targetXY.position.set(    cc.xc, cc.yc, cc.zmin   )
    spotLightXY.angle  = 0.36
    spotLightXY.target = targetXY
    console.log( "Lights.spotLightXY.position", spotLightXY.position, targetXY.position )
    spotHelperXY  = new SpotLightHelper( spotLightXY )
    @lightHelpers.push( spotHelperXY )  # We do this for updates in @animate
    @main.addToScene(   spotLightXY, spotLightXY.target, spotHelperXY  )
    [ spotLightXY ]

  directional:( opts, cc ) ->
    xy = @directPlane( opts, cc, 'XY' )
    xz = @directPlane( opts, cc, 'XZ' )
    yz = @directPlane( opts, cc, 'YZ' )
    [ xy, xz, yz ]

  directPlane:( opts, cc, plane, castShadow=true ) ->
    direct = new DirectionalLight( cc.hex(plane), 2 )  # [60,90,90] 0xFF7F00
    target = new Object3D()
    dist = switch plane
      when 'XY'
        direct.position.set( cc.xc, cc.yc, cc.zd*2.0 )
        target.position.set( cc.xc, cc.yc, cc.zmin   )
        cc.zd
      when 'XZ'
        direct.position.set( cc.xc, cc.yd*2.0, cc.zc )
        target.position.set( cc.xc, cc.ymin,   cc.zc )
        cc.yd
      when 'YZ'
        direct.position.set( cc.xd*2.0, cc.yc, cc.zc )
        target.position.set( cc.xmin,   cc.yc, cc.zc )
        cc.xd
    direct.castShadow            =  castShadow
    direct.shadow.camera.left    = -dist * cc.aspect
    direct.shadow.camera.right   =  dist * cc.aspect
    direct.shadow.camera.top     = -dist
    direct.shadow.camera.bottom  =  dist
    direct.shadow.camera.near    = -dist * 5.0
    direct.shadow.camera.far     =  dist * 5.0
    direct.target = target
    helper        = new DirectionalLightHelper( direct )
    @lightHelpers.push( helper )  # We do this for updates in @animate
    @main.addToScene(   direct, direct.target, helper )
    [ direct ]

  directColor:( opts, cc ) ->
    xy = @directPlane( opts, cc, 'XY', false )
    xz = @directPlane( opts, cc, 'XZ', false )
    [ xy, xz ]

export default Lights
