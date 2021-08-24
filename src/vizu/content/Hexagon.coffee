
import * as THREE from "three"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Hexagon

  constructor:( @main ) ->
     @main.hexagon   = @
     @main.animateOn = false

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
    @obj              = obj
    vis.smooth        = true
    obj.animateOn     = false
    obj.animateDebug  = true
    obj.animateCount  = 0
    obj.animateFactor = 0.01
    obj.oscilate      = 4
    obj.valSin        = ( hue, sat ) ->
      50 + 50*Math.sin( obj.oscilate*sat + obj.animateCount * obj.animateFactor )
    obj.valSinCos     = ( hue, sat ) ->
      anim = obj.animateCount * obj.animateFactor
      50 + 25*Math.sin( obj.oscilate*hue + anim ) + 25*Math.sin( obj.oscilate*sat + anim )
    obj.valFun       = obj.valSin
    obj.valBeg       = 100
    obj.val          = obj.valBeg
    obj.colors100    = []
    obj.colors       = []
    obj.vertices     = []
    obj.normals      = []
    obj.uvs          = []
    obj.indices      = []
    obj.spheres      = []
    obj.vertexCount  = 0
    obj.indiceCount  = 0
    obj.vertexGeom   = null
    obj.hexIndices   = new Array(7)
    obj.vertex       = new THREE.Vector3()
    obj.normal       = new THREE.Vector3()
    obj.uv           = new THREE.Vector2()
    obj.sc           = 1.0 / 255.0
    obj.hueNum       = 12
    obj.satNum       = 10
    obj.hueInc       = 360 / obj.hueNum
    obj.huePri       = obj.hueInc * 2
    obj.satInc       = 100 / obj.satNum
    obj.priRadius    = 10
    obj.secRadius    = obj.priRadius * vis.cos(30)
    obj.idxOrigin    = 0
    obj.x0           = 0
    obj.y0           = 0
    obj.z0           = if obj.hexOrient is 30 then obj.secRadius*6 else obj.priRadius*5
    @initSpheres( obj )
    obj.idxOrigin = @addVertex( obj, 0, 0, obj.valBeg, obj.x0, obj.y0, obj.z0 )  # Origin
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
      z   = vs[3*idxCen+2]
      hueSat = @hueSat( x, y )
      val = obj.valBeg
      obj.hexIndices[i] = @addVertex( obj, hueSat.hue, hueSat.sat, val, x, y, z )
      if callHexVertices
        @hexVertices( obj, obj.hexOrient, obj.hexIndices[i] )
      @main.log( "Hexagon.calcVertices", { idx:obj.hexIndices[i],
      ang1:ang1, ang:ang, angOffset:angOffset, radius:radius,
      hue:hueSat.hue, sat:hueSat.sat, val:val, x:x, y:y, z:z } )
      i++

  adjSat:( hue, hyp ) ->
    vis.round( hyp * 2.0 )

  hueSat:( x, y ) ->
    hue = vis.hueZX(  y, x )
    hyp = vis.hypoth( y, x )
    sat = @adjSat( hue, hyp )
    { hue:hue, sat:sat }
      
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
      rgq = vis.rgb( [ hue, sat, 100, "HMIR" ] )
      obj.colors.push(    rgb.r*obj.sc, rgb.g*obj.sc, rgb.b*obj.sc )
      obj.colors100.push( rgq.r*obj.sc, rgq.g*obj.sc, rgq.b*obj.sc )
      obj.vertex.x = x
      obj.vertex.y = y
      obj.vertex.z = z
      obj.vertices.push( obj.vertex.x, obj.vertex.y, obj.vertex.z )
      obj.normal.copy(   obj.vertex ).normalize();
      obj.normals.push(  obj.normal.x, obj.normal.y, obj.normal.z )
      obj.uv.x = hue / obj.hueInc / obj.hueNum
      obj.uv.y = sat / obj.satInc / obj.satNum
      obj.uvs.push( obj.uv.x, obj.uv.y )
      @updateSphere( obj, index, x, y, z )
      obj.vertexCount++
    @main.log( "Surface.addVertex()", { index:index, hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
    index

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
    obj.sphereMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage )
    return

  updateSphere:( obj, i, x, y, z ) ->
    cs = obj.colors
    j  = i * 3
    obj.sphereMatrix.setPosition( x, y, z )
    obj.sphereColor.setRGB( cs[j], cs[j+1], cs[j+2] )
    obj.sphereMatrix.needsUpdate = true
    obj.sphereColor.needsUpdate  = true
    obj.sphereMesh.setMatrixAt( i, obj.sphereMatrix )
    obj.sphereMesh.setColorAt(  i, obj.sphereColor  )
    return

  vertexIndex:( obj ) ->
    obj.vertices.length / 3

  vertexIndexXYZ:( obj, x, y, z ) ->
    vs = obj.vertices
    for i in [0...vs.length] by 3
      return i/3 if vis.isCoord( x, vs[i], y, vs[i+1], z, vs[i+2] )
    -1

  createBufferGeometry:( obj ) ->
    obj.vertexGeometry = new THREE.BufferGeometry()
    obj.vertexGeometry.setIndex( obj.indices )
    @updateVertexGeometry( obj )
    vertMat  = new THREE.MeshBasicMaterial( { side:THREE.DoubleSide, vertexColors:THREE.FaceColors } )
    geomMesh = new THREE.Mesh( obj.vertexGeometry, vertMat )
    wireMat  = new THREE.MeshBasicMaterial( { wireframe:true, color:0x000000 } )
    wireMesh = new THREE.Mesh( obj.vertexGeometry, wireMat )
    vertMat.needsUpdate = true
    geomMesh.add(  wireMesh )
    obj.group.add( geomMesh )
    return

  updateVertexGeometry:( obj ) ->
    @normals( obj )
    obj.vertexGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( obj.vertices, 3 ) )
    obj.vertexGeometry.setAttribute( 'normal',   new THREE.Float32BufferAttribute( obj.normals,  3 ) )
    obj.vertexGeometry.setAttribute( 'uv',       new THREE.Float32BufferAttribute( obj.uvs,      2 ) )
    obj.vertexGeometry.setAttribute( 'color',    new THREE.Float32BufferAttribute( obj.colors,   3 ) )
    obj.vertexGeometry.attributes.position.needsUpdate = true
    obj.vertexGeometry.attributes.normal.needsUpdate   = true
    obj.vertexGeometry.attributes.uv.needsUpdate       = true
    obj.vertexGeometry.attributes.color.needsUpdate    = true
    obj.sphereMesh.instanceMatrix.needsUpdate          = true
    obj.sphereMesh.instanceColor.needsUpdate           = true
    return

  normals:( obj ) ->
    vs = obj.vertices
    ns = obj.normals
    for i in [0...obj.vertexCount]
      j = i * 3
      obj.vertex.x = vs[j  ]
      obj.vertex.y = vs[j+1]
      obj.vertex.z = vs[j+2]
      obj.normal.copy( obj.vertex ).normalize()
      ns[j  ] = obj.normal.x
      ns[j+1] = obj.normal.y
      ns[j+2] = obj.normal.z
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
        for v in [0..100]  by 10
          x = vis.cos(h) * s * p.radius
          y = vis.sin(h) * s * p.radius
          z = v              * p.radius
          p.matrix.setPosition( x, y, z )
          hsv = if p.ysv then [h,s,v,"HMI"] else [h,s,v,"HMIR"]
          rgb = vis.rgb( hsv )
          p.color.setRGB( rgb.r*p.sc, rgb.g*p.sc, rgb.b*p.sc )
          p.inMesh.setMatrixAt( p.i, p.matrix )
          p.inMesh.setColorAt(  p.i, p.color  )
          @main.log( 'Hexagon.pallettes()', { h:h, s:s, v:v, rgb:rgb } )
          p.i++

  updateValues:( obj ) ->
    vs     = obj.vertices
    radius = if obj.hexOrient is 30 then obj.secRadius*0.06 else obj.priRadius*0.05
    for i in [0...obj.vertexCount]
      j = i * 3
      hueSat  = @hueSat( vs[j], vs[j+1] )
      val     = obj.valFun( hueSat.hue, hueSat.sat )
      vs[j+2] = val * radius
      @updateColor(  obj, i, val )
      @updateSphere( obj, i, vs[j], vs[j+1], vs[j+2] )
    return

  updateColor:( obj, i, val ) ->
    os  = obj.colors100
    cs  = obj.colors
    j = 3*i
    percent = val * 0.01
    cs[j  ] = os[j  ] * percent
    cs[j+1] = os[j+1] * percent
    cs[j+2] = os[j+2] * percent
    return

  animateLog:( obj ) ->
    if obj.animateDebug and obj.animateCount % 100 is 0
      @main.log( "Hexagon.animate()", { timer:obj.animateCount } )
    return

  animate:() =>
    obj   = @obj
    obj.animateCount++
    # return if obj.animateCount % 100 isnt 0
    @updateValues( obj )
    @updateVertexGeometry( obj )
    @animateLog( obj )
    return

export default Hexagon
