
import * as THREE from "three"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Surface

  constructor:( @main ) ->
    @klass   = @constructor.name
    @main.log( @klass+'()', @ )

  drawHsv:() ->
    obj         = {}
    obj.group   = new THREE.Group()
    obj.valFun = ( hue, sat ) -> 50
    @toGeom( obj )
    @main.addToScene( obj.group )
    @main.addToScene( obj.sphereGroup )
    #main.addToScene( obj.faceGroup   )
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
    obj.huePri   = obj.hueInc * 2
    obj.satInc   = 100 / obj.satNum  # scount is actually obj.satInc + 1
    @initSpheres( obj )
    # @initFaces( obj )
    for   hue in [0...360] by obj.hueInc
      for rad in [0..100]  by obj.satInc
        sat = if hue % obj.huePri is 0 then rad else rad - obj.satInc / 2
        @addVertex( obj, hue, sat, obj.valFun(hue,sat), sat*vis.cos(-hue-90)*2.5, 0, sat*vis.sin(-hue-90)*2.5 )
    @main.log( "Surface vertices", obj.vertices )
    @createIndices( obj )
    @createBufferGeometry( obj )
    return

  initSpheres:( obj ) ->
    radius             = 8
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

  initFaces:( obj ) ->
    radius             = 8
    count              = obj.hueNum * ( obj.satNum + 1 )
    obj.faceIndex    = 0
    obj.faceGeometry = new THREE.SphereGeometry( radius, 16, 16 )
    obj.faceMaterial = new THREE.MeshBasicMaterial( { transparent:false, side:THREE.FrontSide } )
    obj.faceMesh     = new THREE.InstancedMesh( obj.faceGeometry, obj.faceMaterial, count )
    obj.faceGroup    = new THREE.Group()
    obj.faceGroup.add( obj.faceMesh )
    return

  addVertex:( obj, hue, sat, val, x, y, z ) ->
    rgb = vis.rgb( [ hue, sat, val, "HMIR" ] )
    obj.colors.push( rgb.r*obj.sc, rgb.g*obj.sc, rgb.b*obj.sc )
    obj.vertices.push( x, y, z )
    obj.normals.push(  0, 1, 0 ) # Good only for a flat surface
    @addSphere( obj, rgb, x, y, z )
    @main.log( "Surface.addVertex()", { hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
    return

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
    geom.setAttribute( 'color',    new THREE.Float32BufferAttribute( obj.colors,   3 ) )
    vertMat  = new THREE.MeshBasicMaterial( { side:THREE.DoubleSide, vertexColors:true } )
    wireMat  = new THREE.MeshBasicMaterial( { wireframe:true, color:0xFFFFFF } )
    geomMesh = new THREE.Mesh( geom, vertMat )
    wireMesh = new THREE.Mesh( geom, wireMat )
    geomMesh.add( wireMesh )
    obj.group.add( geomMesh )
    return

  # Assign vertex indexes to create all the triangular face indices
  createIndices:( obj ) ->
    n = obj.satNum+1
    for i0 in [0...obj.hueNum] by 2
      i1 = i0 + 1
      i2 = if i0 < obj.hueNum-2 then i0 + 2 else 0
      oo = i0 * n                      # Case where sat is zero
      se = i0 * n + 1
      ce = i1 * n + 1
      ne = i2 * n + 1
      @addIndice( obj, oo, ce, se )    # We only create 3 face indices
      @addIndice( obj, oo, ce, ne )
      @addIndice( obj, ce, se, ne )
      @main.log( "Surface.addIndices One()", { i0:i0, j:1, oo:oo, se:se, ce:ce, ne:ne } )
      for j in [1..obj.satNum]
        sw = i0 * n + j
        se = i0 * n + j + 1
        ce = i1 * n
        nw = i2 * n + j
        ne = i2 * n + j + 1
        @addIndice( obj, ce, sw, nw )
        @addIndice( obj, ce, nw, ne )
        @addIndice( obj, ce, ne, se )
        @addIndice( obj, ce, se, sw )
        @main.log( "Surface.addIndices One()", { i0:i0, j:j, ce:ce, sw:sw, nw:nw, ne:ne, se:se } )
    console.log( "Surface.addIndices() Two", { numIndices:obj.indices.length } )
    return

  addIndice:(    obj, i1, i2, i3 ) ->
    obj.indices.push( i1, i2, i3 )
    # @addFace(  obj, i1, i2, i3 )
    return

  addFace:( obj, i1, i2, i3 ) ->
    vc = ( i, j ) -> obj.vertices[i*3] + j
    v1 = new THREE.Vector3( vc(i1,0), vc(i1,1), vc(i1,2) )
    v2 = new THREE.Vector3( vc(i2,0), vc(i2,1), vc(i2,2) )
    v3 = new THREE.Vector3( vc(i3,0), vc(i3,1), vc(i3,2) )
    obj.faceTriangle = THREE.Triangle( v1, v2, v3 )
    obj.faceIndex++

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