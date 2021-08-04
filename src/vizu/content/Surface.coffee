
import * as THREE from "three"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Surface

  constructor:( @main ) ->
    @klass   = @constructor.name
    @main.log( @klass+'()', @ )

  parametric:() ->
    i        = 0
    ndeginc  = 12
    nsatinc  = 10
    count    = ndeginc * nsatinc
    geometry = new THREE.ParametricGeometry( @hmiWave, ndeginc, nsatinc );
    material = new THREE.MeshBasicMaterial( { transparent:false, side:THREE.FrontSide } )
    inMesh   = new THREE.InstancedMesh( geometry, material, 1 )
    matrix   = new THREE.Matrix4()
    # color  = new THREE.Color()
    group    = new THREE.Group()
    matrix.setPosition( 0, 0, 0 )
    #color.setRGB( 128, 128, 128 )
    inMesh.setMatrixAt( 0, matrix )
    # inMesh.setColorAt(  0, color  )
    @applyColor( geometry )
    group.add( inMesh )
    @main.addToScene( group )
    @main.log( 'Surface.parametric()', { i:i, count:count } )
    return

  drawHsv:() ->
    radius   = 8
    i        = 0
    sc       = 1.0 / 255.0
    hueInc   = 30
    satInc   = 10
    count    = (360/hueInc)*(1+100/satInc)
    geometry = new THREE.SphereGeometry( radius, 16, 16 )
    material = new THREE.MeshBasicMaterial( { transparent:false, side:THREE.DoubleSide } )
    inMesh   = new THREE.InstancedMesh( geometry, material, count )
    matrix   = new THREE.Matrix4()
    color    = new THREE.Color()
    group    = new THREE.Group()
    val      = 100
    sc       = 1.0 / 255.0
    for   hue in [0...360] by hueInc
      for sat in [0..100]  by satInc
        x = 2.5 * vis.cos( hue) * sat
        z = 2.5 * vis.sin(-hue) * sat
        y = 125 + 125*vis.sin(4*hue)
        matrix.setPosition( x, y, z )
        rgb = vis.rgb( [hue,sat,val,"HMIR"] )
        color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
        inMesh.setMatrixAt( i, matrix )
        inMesh.setColorAt(  i, color  )
        # console.log( 'Content.drawYsv()', { h:h, s:s, v:v, rgb:rgb } )
        i++
    group.add( inMesh )
    @main.addToScene( group )
    @main.log( 'Surface.drawHsv()', { i:i, count:count } )
    return

  genHsvsDisc:( hueInc, satInc ) ->
    hsvs = []
    xyzs = []
    for     hue in [0...360] by hueInc
      for   sat in [0..100]  by satInc
        hsvs.push([hue,sat,0,"HMIR"])
        xyzs.push(vis.cos(hue)*sat,vis.sin(hue)*sat,0)
    hsvs

  applyColor:( geometry ) ->
    geometry.computeBoundingBox()
    vertObj  = geometry.getAttribute("position")
    # faceObj  = geometry.getAttribute("normal")
    vertices = vertObj.array
    # faces  = faceObj.array
    # colorObj = geometry.getAttribute("color")
    # colors   = colorObj.array
    colors     = []
    console.log( "Surface.applyColor()", { vlen:vertObj.count, vertices:vertices } )
    # faceIndices = ['a','b','c','d']                   # faces are indexed using characters
    sc = 1.0 / 255.0
    for i in [0...vertices.length]           # first, assign colors to vertices as desired
      hsv  = vertices[i].slice()
      hsv.push("HMIR")
      rgb = vis.rgb( hsv )
      color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
      color = new THREE.Color(  rgb.r,  rgb.g,  rgb.b )
      colors.push( color )

  	# copy the colors as necessary to the face's vertexColors array.
    ###
    for i in [0...faces.length]
      face = faces[i]
      numberOfSides = 3                  # ( face instanceof THREE.Face ) ? 3 : 4
      for j in [0...numberOfSides]
        vertexIndex = face[ faceIndices[j] ]
        face.vertexColors[j] = colors[vertexIndex]  # Not right yet
    ###
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
    pt.set( x, y, (x+y)*0.5 )

  klein:( u, v, pt ) ->
    u *=     Math.PI
    v *= 2 * Math.PI
    u = u * 2
    x = 0
    y = 0
    z = 0
    if u < Math.PI
      x =  3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v)
      z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v)
    else
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI)
      z = -8 * Math.sin(u)
    y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v)
    pt.set( x, y, z )

  radialWave:( u, v, pt ) ->
    r  = 100
    x  = Math.sin(u) * r
    z  = Math.sin(v / 2) * 2 * r
    y  = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8
    pt.set( x, y, z )

  # val 0.25*Math.sin( 12*x + vis.time*0.3 ) + 0.25*Math.sin( 12*y + vis.time*0.3 )
  hmiWave:( u, v, pt ) ->
    hue  = u * 30
    sat  = v * 10
    x    = vis.cos(hue) * sat
    y    = vis.sin(hue) * sat
    z    = 50 * 25*vis.sin( 12*x ) * 25*vis.sin( 12*y )
    pt.set( x, y, z )

export default Surface