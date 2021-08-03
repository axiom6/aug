
import * as THREE from "three"

class Surface

  constructor:( @main ) ->
    @klass   = @constructor.name
    @main.log( @klass+'()', @ )

  parametric:() ->
    i        = 0
    # inc      = 10
    num      = 100
    count    = Math.pow( num, 2 )
    geometry = new THREE.ParametricGeometry( @radialWave, num, num );
    material = new THREE.MeshBasicMaterial( { transparent:false, side:THREE.FrontSide } )
    inMesh   = new THREE.InstancedMesh( geometry, material, 1 )
    matrix   = new THREE.Matrix4()
    color    = new THREE.Color()
    group    = new THREE.Group()
    matrix.setPosition( 0, 0, 0 )
    color.setRGB( 128, 128, 128 )
    inMesh.setMatrixAt( 0, matrix )
    inMesh.setColorAt(  0, color  )
    group.add( inMesh )
    @main.addToScene( group )
    @main.log( 'Surface.parametric()', { i:i, count:count } )
    return

  rgbs:( inMesh, nx, ny, inc ) ->
    i      = 0
    matrix = new THREE.Matrix4()
    color  = new THREE.Color()
    for   x in [0..nx] by inc
      for y in [0..ny] by inc
        z = ( x + y ) * 0.5
        matrix.setPosition( x, y, z )
        color.setRGB( x, y, z )           # Just a place holder
        inMesh.setMatrixAt( i, matrix )
        inMesh.setColorAt(  i, color  )
        i++
    i

  funcXY:( x, y, pt ) ->
    pt.x = x
    pt.y = y
    pt.z = ( x + y ) * 0.5

  klein:(u, v) ->
      u *=     Math.PI
      v *= 2 * Math.PI
      u = u * 2;
      x = 0
      y = 0
      z = 0;
      if u < Math.PI
        x =  3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v)
        z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v)
      else
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI)
        z = -8 * Math.sin(u)
      y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v)
      new THREE.Vector3(x, y, z)

  radialWave:( u, v, pt ) ->
      r  = 50
      x  = Math.sin(u) * r
      z  = Math.sin(v / 2) * 2 * r
      y  = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8
      pt.x = x
      pt.y = y
      pt.z = z
      pt


export default Surface