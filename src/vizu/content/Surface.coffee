
import * as THREE from "three"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Surface

  constructor:( @main ) ->
    @klass   = @constructor.name
    @main.log( @klass+'()', @ )

  drawHsv:() ->
    obj        = {}
    obj.group  = new THREE.Group()
    obj.valFun = ( hue, sat ) -> 100
    @toGeom( obj )
    @main.addToScene( obj.group )
    @main.log( 'Surface.drawHsv()', {} )
    return

  toGeom:( obj ) ->
    obj.colors   = []
    obj.vertices = []
    obj.normals  = []
    obj.indices  = []
    obj.sc       = 1.0 / 255.0
    obj.hueNum   = 24
    obj.satNum   = 10
    obj.hueInc   = 360 / obj.hueNum
    obj.satInc   = 100 / obj.satNum  # scount is actually obj.satInc + 1
    for   hue in [0...360] by obj.hueInc
      for rad in [0..100]  by obj.satInc
        sat = if hue % obj.hueInc*2 is 0 then rad else rad - obj.satInc / 2
        @addVertex( obj, hue, sat, obj.valFun(hue,sat), sat*vis.cos(-hue-90)*2.5, 0, sat*vis.sin(-hue-90)*2.5 )
    @main.log( "Surface vertices", obj.vertices )
    @createIndices( obj )
    @createBufferGeometry( obj )
    return

  addVertex:( obj, hue, sat, val, x, y, z ) ->
    rgb = vis.rgb( [ hue, sat, val, "HMIR" ] )
    obj.colors.push( rgb.r*obj.sc, rgb.g*obj.sc, rgb.b*obj.sc )
    obj.vertices.push( x, y, z )
    obj.normals.push(  0, 1, 0 ) # Good only for a flat surface
    console.log( "Surface.addVertex()", { hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
    return

  createBufferGeometry:( obj ) ->
    geom = new THREE.BufferGeometry()
    geom.setIndex( obj.indices )
    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( obj.vertices, 3 ) )
    geom.setAttribute( 'normal',   new THREE.Float32BufferAttribute( obj.normals,  3 ) )
    geom.setAttribute( 'color',    new THREE.Float32BufferAttribute( obj.colors,   3 ) )
    #ire = new THREE.WireframeGeometry( geom )
    mats = new THREE.MeshBasicMaterial( { side:THREE.DoubleSide, vertexColors:true } )
    mesh = new THREE.Mesh( geom, mats )
    obj.group.add( mesh )
    return

  # Assign vertex indexes to create all the triangular face indices
  createIndices:( obj ) ->
    n0 = obj.satNum
    n1 = n0 + 1
    for i in [0...obj.hueNum] by 2
      n2 = if i < obj.hueNum-2 then n0 + 2 else 0
      oo = i * n0                       # Case where sat is zero
      se = i * n0 + 1
      ce = i * n1 + 1
      ne = i * n2 + 1
      obj.indices.push( oo, ce, se )    # We only create 3 face indices
      obj.indices.push( oo, ce, ne )
      obj.indices.push( ce, se, ne )
      console.log( "Surface.addIndices One()",
        { i:i, j:1, oo:oo, se:se, ce:ce, ne:ne } )
      for j in [1...obj.satNum]
        sw = i * n0 + j
        se = i * n0 + j + 1
        ce = i * n1
        nw = i * n2 + j
        ne = i * n2 + j + 1
        obj.indices.push( ce, sw, nw )
        obj.indices.push( ce, nw, ne )
        obj.indices.push( ce, ne, se )
        obj.indices.push( ce, se, sw )
        console.log( "Surface.addIndices One()",
          { i:i, j:j, ce:ce, sw:sw, nw:nw, ne:ne, se:se } )
    console.log( "Surface.addIndices() Two", obj.satNum*obj.hueNum/2 )
    return

  # xyzs.push(vis.cos(hue)*sat,vis.sin(hue)*sat,0)
  genHsvs:( hueInc, satInc, valFunc ) ->
    hsvs = []
    for     hue in [0...360] by hueInc
      for   sat in [0..100]  by satInc
        hsvs.push(new THREE.Vector3(hue,sat,valFunc(hue,sat)))
    hsvs

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

export default Surface