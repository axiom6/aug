
import * as THREE from "three"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Surface

  constructor:( @main ) ->
    @klass   = @constructor.name
    @main.log( @klass+'()', @ )

  drawHsv:( orient ) ->
    obj         = {}
    obj.orient  = orient
    obj.group   = new THREE.Group()
    obj.valFun = ( hue, sat ) -> 50
    @toGeom( obj )
    @main.addToScene( obj.group )
    @main.addToScene( obj.sphereGroup )
    @main.log( 'Surface.drawHsv()', obj )
    return

  toGeom:( obj ) ->
    obj.colors    = []
    obj.vertices  = []
    obj.normals   = []
    obj.uvs       = []
    obj.indices   = []
    obj.vertex    = new THREE.Vector3()
    obj.normal    = new THREE.Vector3()
    obj.uv        = new THREE.Vector2()
    obj.sc        = 1.0 / 255.0
    obj.hueNum    = 24
    obj.satNum    = 10
    obj.hueInc    = 360 / obj.hueNum
    obj.huePri    = obj.hueInc * 2
    obj.satInc    = 100 / obj.satNum
    @initSpheres( obj )
    for   hue in [0...360] by obj.hueInc
      for rad in [0..100]  by obj.satInc
        sat = if hue % obj.huePri is 0  then rad else rad + obj.satInc/2
        fac = if hue % obj.huePri is 0  then 1.0 else 1.0 - rad/2000  # 2000 has been determined empiriaclly
        @main.log( "Surface.toGeom", { hue:hue, rad:rad, sat:sat } )
        val = obj.valFun(hue,sat)
        @addVertex( obj, hue, sat, val, sat*fac*vis.cos(-hue-90), 0, sat*fac*vis.sin(hue-90) ) # -90 needs adjust
    @main.log( "Surface vertices", obj.vertices )
    @createIndices( obj )
    @createBufferGeometry( obj )
    numIndices = 3 * obj.hueNum/2 + 4 * obj.satNum * obj.hueNum/2
    console.log( "Surface.toGeom Two()",
      { numVertex:obj.vertices.length/3, numIndices:obj.indices.length/3, calcIndices:numIndices } )
    return

  initSpheres:( obj ) ->
    radius             = 2
    count              = 3 * obj.hueNum + 4 * obj.hueNum * obj.satNum
    obj.sphereIndex    = 0
    obj.sphereGeometry = new THREE.SphereGeometry( radius, 16, 16 )
    obj.sphereMaterial = new THREE.MeshBasicMaterial( { transparent:false, side:THREE.FrontSide } )
    obj.sphereMesh     = new THREE.InstancedMesh( obj.sphereGeometry, obj.sphereMaterial, count )
    obj.sphereMatrix   = new THREE.Matrix4()
    obj.sphereColor    = new THREE.Color()
    obj.sphereGroup    = new THREE.Group()
    obj.sphereGroup.add( obj.sphereMesh )
    return

  vertexIndexXYZ:( obj, x, y, z ) ->
    vs = obj.vertices
    for i in [0...vs.length] by 3
      return i/3 if vis.isCoord( x, vs[i], y, vs[i+1], z, vs[i+2] )
    -1

  vertexIndex:( obj ) ->
    obj.vertices.length / 3

  addVertex:( obj, hue, sat, val, x, y, z ) ->
    index = @vertexIndexXYZ( obj, x, y, z )
    if index is -1
      index = @vertexIndex( obj )
      rgb = vis.rgb( [ hue, sat, val, "HMIR" ] )
      obj.colors.push( rgb.r*obj.sc, rgb.g*obj.sc, rgb.b*obj.sc )
      obj.vertex.x = x
      obj.vertex.y = y
      obj.vertex.z = z
      obj.vertices.push( obj.vertex.x, obj.vertex.y, obj.vertex.z )
      obj.normal.copy(   obj.vertex ).normalize();
      obj.normals.push(  obj.normal.x, obj.normal.y, obj.normal.z )
      obj.uv.x = hue / obj.hueInc / obj.hueNum
      obj.uv.y = sat / obj.satInc / obj.satNum
      obj.uvs.push( obj.uv.x, obj.uv.y )
      @addSphere( obj, rgb, x, y, z )
    @main.log( "Surface.addVertex()", { index:index, hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
    index

  addSphere:( obj, rgb, x, y, z ) ->
    obj.sphereMatrix.setPosition( x, y, z );
    obj.sphereColor.setRGB( rgb.r*obj.sc, rgb.g*obj.sc, rgb.b*obj.sc )
    obj.sphereMesh.setMatrixAt( obj.sphereIndex, obj.sphereMatrix )
    obj.sphereMesh.setColorAt(  obj.sphereIndex, obj.sphereColor  )
    obj.sphereIndex++
    return

  createBufferGeometry:( obj ) ->
    geom = new THREE.BufferGeometry()
    geom.setIndex( obj.indices )
    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( obj.vertices, 3 ) )
    geom.setAttribute( 'normal',   new THREE.Float32BufferAttribute( obj.normals,  3 ) )
    geom.setAttribute( 'uv',       new THREE.Float32BufferAttribute( obj.uvs,      2 ) )
    geom.setAttribute( 'color',    new THREE.Float32BufferAttribute( obj.colors,   3 ) )
    vertMat  = new THREE.MeshBasicMaterial( { side:THREE.DoubleSide, vertexColors:THREE.FaceColors } )
    geomMesh = new THREE.Mesh( geom, vertMat )
    wireMat  = new THREE.MeshBasicMaterial( { wireframe:true, color:0x000000 } )
    wireMesh = new THREE.Mesh( geom, wireMat )
    geomMesh.add(  wireMesh )
    obj.group.add( geomMesh )
    return

  # Assign vertex indexes to create all the triangular face indices
  createIndices:( obj ) ->
    n = obj.satNum + 1
    for i0 in [0...obj.hueNum] by 2
      i1 = i0 + 1
      i2 = if i0 < obj.hueNum-2 then i0 + 2 else 0
      @add3Indices(   obj, n, i0, i1, i2 )
      for j in [0...obj.satNum]
        @add4Indices( obj, n, i0, i1, i2, j )
    return

  addIndice:(    obj, i1, i2, i3 ) ->
    obj.indices.push( i1, i2, i3 )
    # @addLine(  obj, i1, i2, i3 )
    return

  add3Indices:( obj, n, i0, i1, i2 ) ->
    oo = i0 * n                     
    se = i0 * n + 1
    ce = i1 * n
    ne = i2 * n + 1
    @addIndice( obj, oo, ce, se )    # We only create 3 face indices
    @addIndice( obj, oo, ce, ne )
    @addIndice( obj, ce, se, ne )
    @main.log( "Surface.add3Indices()", { i0:i0, oo:oo, ce:ce, se:se, ne:ne } )
    return

  add4Indices:( obj, n, i0, i1, i2, j ) ->
    sw = i0 * n + j
    se = i0 * n + j + 1
    ce = i1 * n + j
    nw = i2 * n + j
    ne = i2 * n + j + 1
    @addIndice( obj, ce, sw, se )
    @addIndice( obj, ce, se, ne )
    @addIndice( obj, ce, ne, nw )
    @addIndice( obj, ce, nw, sw )
    @main.log( "Surface.add4Indices()", { i0:i0, j:j, ce:ce, sw:sw, nw:nw, ne:ne, se:se } )
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

  # Not called. Kept as a reference
  addLine:( obj, i1, i2, i3 ) ->
    vc = ( i, j ) -> obj.vertices[i*3+j]
    points = []
    v1      = new THREE.Vector3( vc(i1,0), vc(i1,1), vc(i1,2) )
    v2      = new THREE.Vector3( vc(i2,0), vc(i2,1), vc(i2,2) )
    v3      = new THREE.Vector3( vc(i3,0), vc(i3,1), vc(i3,2) )
    points.push( v1, v2, v3 )
    geom  = new THREE.BufferGeometry().setFromPoints( points )
    mat   = new THREE.LineBasicMaterial({ color: 0x000000 } )
    line  = new THREE.LineLoop( geom, mat )
    vis.noop( line )
    # obj.lineGroup.add( line )
    return

export default Surface