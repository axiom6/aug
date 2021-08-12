
import * as THREE from "three"
import Surface    from "./Surface.js"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Hexagon extends Surface

  constructor:( main ) ->
     super( main )

  toGeom:( obj ) ->
    obj.colors     = []
    obj.vertices   = []
    obj.normals    = []
    obj.uvs        = []
    obj.indices    = []
    obj.hexIndices = new Array(7)
    obj.hexOrient  = 60
    obj.vertex     = new THREE.Vector3()
    obj.normal     = new THREE.Vector3()
    obj.uv         = new THREE.Vector2()
    obj.sc         = 1.0 / 255.0
    obj.hueNum     = 12
    obj.satNum     = 10
    obj.hueInc     = 360 / obj.hueNum
    obj.huePri     = obj.hueInc * 2
    obj.satInc     = 100 / obj.satNum
    obj.priRadius  = 10
    obj.secRadius  = obj.priRadius * vis.cos(30)
    obj.idxOrigin  = 0
    obj.x0         = 0
    obj.y0         = 0
    obj.z0         = 0
    @initSpheres( obj )
    obj.idxOrigin = @addVertex( obj, 0, 0, obj.valFun(0,0), obj.x0, obj.z0, obj.z0 )  # Origin
    if obj.hexOrient is  30
      @hexVertices( obj, 30, obj.idxOrigin )
      @sixHexes(    obj, 60, obj.secRadius*2.0 )
      @sixHexes(    obj, 30, obj.priRadius*3.0 )
      @sixHexes(    obj, 60, obj.secRadius*4.0 )
    else if obj.hexOrient is  60
      @hexVertices( obj, 60, obj.idxOrigin )
      @sixHexes(    obj, 30, obj.secRadius*2.0 )
      @sixHexes(    obj, 60, obj.priRadius*3.0 )
      @sixHexes(    obj, 30, obj.secRadius*4.0 )
    @createBufferGeometry( obj )
    console.log( "Hexagon.toGeom()",
      { lenVertices:obj.vertices.length, lenIndices:obj.indices.length, vertices:obj.vertices, indices:obj.indices } )
    return

  hexAngles:( orient ) ->
    if orient is 60 then [0,60,120,180,240,300] else [330,30,90,150,210,270]

  sixHexes:( obj, orient, radius ) ->
    i = 1
    for ang in @hexAngles( orient )
      x = obj.x0 + radius * vis.cos(ang)
      y = obj.y0
      z = obj.z0 + radius * vis.sin(ang)
      hue = vis.hueZX(  z, x )
      hyp = vis.hypoth( z, x )
      sat = @adjSat( obj, hue, hyp )
      idx = @addVertex( obj, hue, sat, obj.valFun(hue,sat), x, y, z )
      @hexVertices( obj, obj.hexOrient, idx )
      i++
    return

  hexVertices:(    obj, orient, idxCen ) ->
    @calcVertices( obj, orient, idxCen, obj.priRadius )
    @hexIndices(   obj )
    return

  calcVertices:( obj, orient, idxCen, radius ) ->
    i  = 1
    vs = obj.vertices
    obj.hexIndices[0] = idxCen
    for ang in @hexAngles( orient )
      x = vs[3*idxCen  ] + radius * vis.cos(ang)
      y = vs[3*idxCen+1]
      z = vs[3*idxCen+2] + radius * vis.sin(ang)
      hue = vis.hueZX(  z, x )
      hyp = vis.hypoth( z, x )
      sat = @adjSat( obj, hue, hyp )
      val = obj.valFun( hue, sat )
      obj.hexIndices[i] = @addVertex( obj, hue, sat, val, x, y, z )
      console.log( "Hexagon.calcVertices",
        { idx:obj.hexIndices[i], ang:ang, hyp:hyp, hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
      i++

  adjSat:( obj, hue, hyp ) ->
    vis.round( hyp * 2.5 )
      
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
    return

export default Hexagon