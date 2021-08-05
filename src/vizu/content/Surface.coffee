
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
    group    = new THREE.Group()
    valFun   = ( hue, sat ) -> 100
    @toGeom( valFun, group )
    @main.addToScene( group )
    @main.log( 'Surface.drawHsv()', {} )
    return

  toGeom:( valFun, group ) ->
    colors   = []
    vertices = []
    normals  = []
    # indices  = []
    sc       = 1.0 / 255.0
    hueIdx   = 0
    vertices.push( 0, 0, 0 )
    for     hueIdx in [0...12]
      # for   satIdx in [0..10]
        satIdx = 10
        hue = hueIdx * 30
        sat = satIdx * 10
        val = valFun(hue,sat)
        rgb = vis.rgb( [ hue, sat, val, "HMIR" ] )
        colors.push( rgb.r*sc, rgb.g*sc, rgb.b*sc )
        vertices.push( sat*vis.cos(hue)*2.5, 0, sat*vis.sin(hue)*2.5 )
        normals.push( 0, 1, 0 ) # Good only for a flat surface
    console.log( "Surface vertices", vertices )
    indices = @createIndices()

    geom = new THREE.BufferGeometry()
    geom.setIndex( indices )
    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) )
    geom.setAttribute( 'normal',   new THREE.Float32BufferAttribute( normals,  3 ) )
    geom.setAttribute( 'color',    new THREE.Float32BufferAttribute( colors,   3 ) )
    mats = new THREE.MeshBasicMaterial( { side:THREE.DoubleSide, vertexColors:true } )
    mesh = new THREE.Mesh( geom, mats )
    group.add( mesh )
    return

  createIndices:() ->
    indices = []
    a = 0
    for   hueIdx in [0...10]
      b = hueIdx+1
      c = if hueIdx < 11 then hueIdx+2 else 1
      indices.push( a, b, c )
    console.log( "Surface.addIndices()", indices )
    indices

  addIndices1:( i, j, n, indices ) ->
    a = i * ( n + 1 ) + ( j + 1 )
    b = i * ( n + 1 ) + j
    c = ( i + 1 ) * ( n + 1 ) + j
    d = ( i + 1 ) * ( n + 1 ) + ( j + 1 )

    # generate two faces (triangles) per iteration
    indices.push( a, b, d ); # face one
    indices.push( b, c, d ); # face two
    return

  toFace:( indice, color, group ) ->
    console.log( "Surface.toFace()", indice )
    sc   = 1.0 / 255.0
    rgb  = vis.rgb( [0,100,100,"HMIR"] )
    color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
    face = new THREE.BufferGeometry().setFromPoints( indice )
    mat  = new THREE.MeshBasicMaterial( { color:color, transparent:false, side:THREE.FrontSide } )
    mesh = new THREE.Mesh( face, mat )
    group.add( mesh )
    return
    
  ###
  console.log( "Surface.toGeom()", vertices )
  toFace:( v1, v2, v3, color, group ) ->
    console.log( "Surface.toFace()", { v1:v1, v2:v2, v3:v3 } )
    sc   = 1.0 / 255.0
    rgb  = vis.rgb( [0,100,100,"HMIR"] )
    color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
    face = new THREE.BufferGeometry().setFromPoints( [v1,v2,v3] )
    mat  = new THREE.MeshBasicMaterial( { color:color, transparent:false, side:THREE.FrontSide } )
    mesh = new THREE.Mesh( face, mat )
    group.add( mesh )
    return

    positions = geometry.getAttribute("position")
    vertices  = []
    for i in [0...positions.count]
      vertex = new THREE.Vector3()
      vertex.fromBufferAttribute( positions, i );
      vertices.push( vertex )
    pointg = new THREE.BufferGeometry().setFromPoints( vertices )
    pointm = new THREE.PointsMaterial( { color:0x0000FF, size:10 } )
    points = new THREE.Points( pointg, pointm )

      for   hue in [0...360] by hueInc
      for sat in [0..100]  by satInc
        rgb = vis.rgb( [hue,sat,100,"HMIR"] )
        color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
        hsv.setColor( color )
  hueInc   = 30
  satInc   = 10
  valFunc  = ( hue, sat ) ->
  vis.noop(  hue )
  sat
  hsvs     = @genHsvs( hueInc, satInc, valFunc )
  color    = new THREE.Color()
  color.setRGB( 0.5, 0.5, 0.5 )
  geometry.setColor( color )
  sc       = 1.0 / 255.0
  # faces    = geometry['convexHull'].faces
  for hsv in hsvs
    rgb = vis.rgb( [hsv[0],hsv[1],hsv[2],"HMIR"] )
    color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
    hsv.setColor( color )
  ###

  drawHsv2:() ->
    hueInc   = 30
    hunNum   = 360 / hueInc
    satInc   = 10
    satNum   = 100 / satInc + 1

    geometry = new THREE.ParametricGeometry( @hmiWave, hunNum, satNum )
    material = new THREE.MeshBasicMaterial( { color:0x808080, transparent:false, side:THREE.DoubleSide } )
    inMesh   = new THREE.InstancedMesh( geometry, material, count )
    matrix   = new THREE.Matrix4()
    group    = new THREE.Group()
    matrix.setPosition( 0, 0, 0 )
    inMesh.setMatrixAt( 0, matrix )
    indices = geometry.getIndex()
    console.log( "Surface.drawHsv()", indices )
    # for i in [0...indices.length]
    #  @toFace( indices[i], color, group )
    group.add( inMesh )
    @main.addToScene( group )
    @main.log( 'Surface.drawHsv()', { i:i, count:count } )
    return

  # xyzs.push(vis.cos(hue)*sat,vis.sin(hue)*sat,0)
  genHsvs:( hueInc, satInc, valFunc ) ->
    hsvs = []
    for     hue in [0...360] by hueInc
      for   sat in [0..100]  by satInc
        hsvs.push(new THREE.Vector3(hue,sat,valFunc(hue,sat)))
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
    hue  = u * 360
    sat  = v * 100
    val  = 50
    x    = vis.cos(hue) * sat
    z    = vis.sin(hue) * sat
    y    = val # * ( 1.0 + vis.sin(16*hue) )
    # console.log( "Surface.hmiWave()", { uv:[u,v], hsv:[hue,sat,val], xyz:[x,y,z] } )
    pt.set( x, y, z )

export default Surface