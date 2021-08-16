
import * as THREE from "three"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Hexagon

  constructor:( @main ) ->
     @main.hexagon = @

  drawHsv:( orient ) ->
    obj           = {}
    obj.hexOrient = orient
    obj.group     = new THREE.Group()
    @toGeom( obj )
    @main.addToScene( obj.group )
    @main.addToScene( obj.sphereGroup )
    @main.log( 'Heagon.drawHsv()', obj )
    return

  toGeom:( obj ) ->
    @obj            = obj
    vis.smooth      = true
    obj.valFun      = ( hue, sat ) ->
      100 * vis.sin( 90 * (1.0-sat*0.01) )
    obj.valBase     = 100
    obj.animateOn   = false
    obj.colors      = []
    obj.vertices    = []
    obj.normals     = []
    obj.uvs         = []
    obj.indices     = []
    obj.vertexCount = 0
    obj.indiceCount = 0
    obj.hexIndices  = new Array(7)
    obj.vertex      = new THREE.Vector3()
    obj.normal      = new THREE.Vector3()
    obj.uv          = new THREE.Vector2()
    obj.sc          = 1.0 / 255.0
    obj.hueNum      = 12
    obj.satNum      = 10
    obj.hueInc      = 360 / obj.hueNum
    obj.huePri      = obj.hueInc * 2
    obj.satInc      = 100 / obj.satNum
    obj.priRadius   = 10
    obj.secRadius   = obj.priRadius * vis.cos(30)
    obj.idxOrigin   = 0
    obj.x0          = 0
    obj.y0          = 0
    obj.z0          = 0
    @initSpheres( obj )
    obj.idxOrigin = @addVertex( obj, 0, 0, obj.valFun(0,0), obj.x0, obj.z0, obj.z0 )  # Origin
    x = obj.priRadius*4.5
    y = obj.secRadius
    angle  = vis.atan2(  y, x )
    radius = vis.hypoth( y, x )
    if obj.hexOrient is  30
      @hexVertices( obj, 30, obj.idxOrigin )
      @sixHexes(    obj, 60, obj.secRadius*2.0, 0 )
      @sixHexes(    obj, 30, obj.priRadius*3.0, 0 )
      @sixHexes(    obj, 60, obj.secRadius*4.0, 0 )
      @sixHexes(    obj, 30, radius, -angle )
      @sixHexes(    obj, 30, radius,  angle )
      @sixHexes(    obj, 60, obj.secRadius*6.0, 0 )
    else if obj.hexOrient is  60
      @hexVertices( obj, 60, obj.idxOrigin )
      @sixHexes(    obj, 30, obj.secRadius*2.0, 0 )
      @sixHexes(    obj, 60, obj.priRadius*3.0, 0 )
      @sixHexes(    obj, 30, obj.secRadius*4.0, 0 )
      @sixHexes(    obj, 60, radius, -angle )
      @sixHexes(    obj, 60, radius,  angle )
      @sixHexes(    obj, 30, obj.secRadius*6.0, 0 )
    @createBufferGeometry( obj )
    @drawCircle(    obj.priRadius*5.0 )
    @pallettes(     obj, false )
    @applyValues(   obj )
    console.log( "Hexagon.toGeom()",
      { vertexLength:obj.vertices.length, vertexCount:obj.vertexCount,
      indiceKength:obj.indices.length,    indiceCount:obj.indiceCount,
      sphereCountCalc:obj.sphereCountCalc, vertices:obj.vertices } )
    return

  hexAngles:( orient ) ->
    if orient is 60 then [0,60,120,180,240,300] else [330,30,90,150,210,270]

  sixHexes:(       obj, orient,    radius, angOffset ) ->
    @calcVertices( obj, orient, 0, radius, angOffset, true )
    return

  hexVertices:(    obj, orient, idxCen ) ->
    @calcVertices( obj, orient, idxCen, obj.priRadius, 0, false )
    @hexIndices(   obj )
    return

  # valRadius from @pallettePoints()
  calcVertices:( obj, orient, idxCen, radius, angOffset, callHexVertices ) ->
    i  = 1
    vs = obj.vertices
    obj.hexIndices[0] = idxCen

    for ang1 in @hexAngles( orient )
      ang = ang1 + angOffset
      x   = vs[3*idxCen  ] + radius * vis.cos(ang)
      y   = vs[3*idxCen+1] + radius * vis.sin(ang)
      hue = vis.hueZX(  y, x )
      hyp = vis.hypoth( y, x )
      sat = @adjSat( obj, hue, hyp )
      val = obj.valBase
      z   = vs[3*idxCen+2] 
      obj.hexIndices[i] = @addVertex( obj, hue, sat, val, x, y, z )
      if callHexVertices
        @hexVertices( obj, obj.hexOrient, obj.hexIndices[i] )
      @main.log( "Hexagon.calcVertices", { idx:obj.hexIndices[i],
      ang1:ang1, ang:ang, angOffset:angOffset, radius:radius,
      hyp:hyp, hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
      i++

  adjSat:( obj, hue, hyp ) ->
    vis.round( hyp * 2.0 )
      
  hexIndices:(  obj ) ->
    a = obj.hexIndices
    @addIndice( obj, a[0], a[1], a[2] )
    @addIndice( obj, a[0], a[2], a[3] )
    @addIndice( obj, a[0], a[3], a[4] )
    @addIndice( obj, a[0], a[4], a[5] )
    @addIndice( obj, a[0], a[5], a[6] )
    @addIndice( obj, a[0], a[6], a[1] )
    return

  addIndice:(    obj, i1, i2, i3 ) ->
    obj.indices.push( i1, i2, i3 )
    obj.indiceCount++
    return

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
      obj.vertexCount++
    @main.log( "Surface.addVertex()", { index:index, hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
    index

  vertexIndex:( obj ) ->
    obj.vertices.length / 3

  vertexIndexXYZ:( obj, x, y, z ) ->
    vs = obj.vertices
    for i in [0...vs.length] by 3
      return i/3 if vis.isCoord( x, vs[i], y, vs[i+1], z, vs[i+2] )
    -1

  addSphere:( obj, rgb, x, y, z ) ->
    obj.sphereMatrix.setPosition( x, y, z )
    obj.sphereColor.setRGB( rgb.r*obj.sc, rgb.g*obj.sc, rgb.b*obj.sc )
    obj.sphereMesh.setMatrixAt( @vertexIndex(obj), obj.sphereMatrix )
    obj.sphereMesh.setColorAt(  @vertexIndex(obj), obj.sphereColor  )
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

  initSpheres:( obj ) ->
    radius              = 2
    obj.sphereCountCalc = obj.hueNum * (obj.satNum+1) + 1 # Look into
    obj.sphereGeometry  = new THREE.SphereGeometry( radius, 16, 16 )
    obj.sphereMaterial  = new THREE.MeshBasicMaterial( { transparent:false, side:THREE.FrontSide } )
    obj.sphereMesh      = new THREE.InstancedMesh( obj.sphereGeometry, obj.sphereMaterial, obj.sphereCountCalc )
    obj.sphereMatrix    = new THREE.Matrix4()
    obj.sphereColor     = new THREE.Color()
    obj.sphereGroup     = new THREE.Group()
    obj.sphereGroup.add( obj.sphereMesh )
    return

  drawCircle:( radius ) ->
    geometry = new THREE.CircleGeometry( radius, 24 )
    #eometry.rotateX( Math.PI / 2 )
    geometry.translate( 0, 0, 0 )
    material = new THREE.MeshBasicMaterial( { color:0xffff00, transparent:true, opacity:1.0, wireframe:true } )
    circle   = new THREE.Mesh( geometry, material )
    @main.addToScene( circle )
    return

  pallettes:( obj, ysv=false ) ->
    p          = {}
    p.ysv      = ysv
    p.i        = 0
    p.sc       = 1.0 / 255.0
    p.hueInc   = if p.ysv then 45 else 60
    p.satInc   = if obj.hexOrient is 30 then 100/6              else 20
    p.satNum   = if obj.hexOrient is 30 then   7                else  6
    p.radius   = if obj.hexOrient is 30 then obj.secRadius*0.06 else obj.priRadius*0.05
    p.count    = (360/p.hueInc)*p.satNum*(100/10+1)
    @main.log( "Hexagon.pallettes()",
      { orient:obj.hexOrient, satInc:p.satInc, satNum:p.satNum, radius:p.radius, count:p.count } )
    p.geometry = new THREE.SphereGeometry( 2, 16, 16 )
    p.material = new THREE.MeshBasicMaterial( { transparent:false, side:THREE.FrontSide } )
    p.inMesh   = new THREE.InstancedMesh( p.geometry, p.material, p.count )
    p.matrix   = new THREE.Matrix4()
    p.color    = new THREE.Color()
    p.group    = new THREE.Group()
    @pallettePoints( p )
    p.group.add( p.inMesh )
    @main.addToScene( p.group )
    @main.log( 'Hexagon.pallettes()', { i:p.i, count:p.count } )
    return

  pallettePoints:( p ) ->
    for     h in [0...360] by p.hueInc
      for   s in [0..101]  by p.satInc
        for v in [0...100]  by 10
          x = vis.cos(h) * s * p.radius
          y = vis.sin(h) * s * p.radius
          z = v              * p.radius
          p.matrix.setPosition( x, y, z )
          hsv = if p.ysv then [h,s,100-v,"HMI"] else [h,s,100-v,"HMIR"]
          rgb = vis.rgb( hsv )
          p.color.setRGB( rgb.r*p.sc, rgb.g*p.sc, rgb.b*p.sc )
          p.inMesh.setMatrixAt( p.i, p.matrix )
          p.inMesh.setColorAt(  p.i, p.color  )
          @main.log( 'Hexagon.pallettes()', { h:h, s:s, v:v, rgb:rgb } )
          p.i++

  applyValues:( obj ) ->
    val = 50
    vs  = obj.vertices
    fac = if obj.hexOrient is 30 then obj.secRadius*0.03 else obj.priRadius*0.025
    for i in [0...obj.vertexCount]
      vs[3*i+2] = val * fac
    return

  animate:( timer ) =>
    obj   = @obj
    count = 0
    for i in [0...obj.vertexCount]
      obj.sphereMesh.getMatrixAt( i, obj.sphereMatrix )
      obj.sphereMesh.getColorAt(  i, obj.sphereColor  )

      position = new THREE.Vector3()
      position.setFromMatrixPosition( obj.sphereMatrix )
      rgb = obj.sphereColor.toArray()

      pc = 0.5 - 0.5 * vis.sin( 12 * ( position.x + position.y + timer ) )

      obj.sphereMatrix.setPosition( position.x, position.y, position.z*pc )
      obj.sphereColor.setRGB( rgb[0]*pc, rgb[1]*pc, rgb[2]*pc )

      count++
      if count % 100 is 0
        rrgb = vis.roundRGB( rgb, 255 )
        console.log( "Hexagon.animateSpheres()", { pc:pc, position:position, rgb:rrgb } )

    # console.log( "Hexagon.animateSpheres()" )
    return

export default Hexagon