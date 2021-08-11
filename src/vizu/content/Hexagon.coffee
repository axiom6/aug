
import * as THREE from "three"
import Surface    from "./Surface.js"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Hexagon extends Surface

  constructor:( main ) ->
     super( main )

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
    obj.hueNum    = 12
    obj.satNum    = 10
    obj.hueInc    = 360 / obj.hueNum
    obj.huePri    = obj.hueInc * 2
    obj.satInc    = 100 / obj.satNum
    obj.priRadius = 10
    obj.secRadius = obj.priRadius * vis.cos(30)
    obj.satScale  = 4.0 # Scaling factor for convert coords to sat
    obj.originIdx = 0
    obj.x0        = 0
    obj.y0        = 0
    obj.z0        = 0
    @initSpheres( obj )
    @addVertex(   obj, 0, 0, obj.valFun(0,0), obj.x0, obj.z0, obj.z0 )  # Origin
    hexOrigin = @initHex( obj.originIdx )
    @hexVertices( obj, hexOrigin )
    @sixHexes( obj, 60, obj.secRadius*2.0 )
    @sixHexes( obj, 30, obj.priRadius*3.0 )
    @sixHexes( obj, 60, obj.secRadius*4.0 )
    console.log( "Hexagon vertices", obj.vertices )
    @createBufferGeometry( obj )
    console.log( "Surface.toGeom Two()",
      { lenVertices:obj.vertices.length, lenIndices:obj.indices.length } )
    return

  sixHexes:( obj, orient, radius ) ->
    angs = if orient is 60 then [0,60,120,180,240,300] else [330,30,90,150,210,270]
    for ang in angs
      x = obj.x0 + radius * vis.cos(ang)
      y = obj.y0
      z = obj.z0 + radius * vis.sin(ang)
      hue = vis.hueZX( z, x )
      sat = vis.round( vis.hypoth( x, z ) ) * obj.satScale
      vcen = @vertexIndex(obj)
      @addVertex(   obj, hue, sat, obj.valFun(hue,sat), x, y, z )
      @hexVertices( obj, @initHex(vcen) )
    return

  vertexIndex:( obj ) ->
    obj.vertices.length / 3

  # Vertex indices set the @hexIndices
  initHex:( vcen ) ->
    { vcen:vcen, v330:-1, v030:-1, v090:-1, v150:-1, v210:-1, v270:-1 }

  hexVertices:( obj, hex ) ->
    for own key, idx of hex when key isnt "vcen" and idx is -1
      deg = @degKey( key )
      x = obj.vertices[hex.vcen*3  ] + obj.priRadius * vis.cos(deg)
      y = obj.vertices[hex.vcen*3+1]
      z = obj.vertices[hex.vcen*3+2] + obj.priRadius * vis.sin(deg)
      hex[key] = @vertexIndex(obj)
      hue = vis.hueZX( z, x )
      sat = vis.round( vis.hypoth( x, z ) ) * obj.satScale
      val = obj.valFun( hue, sat )
      @addVertex(  obj, hue, sat, val, x, y, z )
      console.log( "Hexagon.hexVerticea", { key:key, idx:hex[key], hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
    @hexIndices(  obj, hex )
    return
      
  hexIndices:(  obj, hex ) ->
    @addIndice( obj, hex.vcen, hex.v330, hex.v030 )
    @addIndice( obj, hex.vcen, hex.v030, hex.v090 )
    @addIndice( obj, hex.vcen, hex.v090, hex.v150 )
    @addIndice( obj, hex.vcen, hex.v150, hex.v210 )
    @addIndice( obj, hex.vcen, hex.v210, hex.v270 )
    @addIndice( obj, hex.vcen, hex.v270, hex.v330 )
    return

  degKey:( key ) ->
    switch key
      when "v330" then 330
      when "v030" then  30
      when "v090" then  90
      when "v150" then 150
      when "v210" then 210
      when "v270" then 270
      else               0

  addIndice:(    obj, i1, i2, i3 ) ->
    obj.indices.push( i1, i2, i3 )
    return

export default Hexagon