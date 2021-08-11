
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
    obj.originIdx = 0
    obj.vertex    = new THREE.Vector3()
    obj.normal    = new THREE.Vector3()
    obj.uv        = new THREE.Vector2()
    obj.sc        = 1.0 / 255.0
    obj.hueNum    = 12
    obj.satNum    = 10
    obj.hueInc    = 360 / obj.hueNum
    obj.huePri    = obj.hueInc * 2
    obj.satInc    = 100 / obj.satNum
    obj.hexRad    = 10

    @initSpheres( obj )
    @addVertex(   obj, 0, 0, 0, 0, 0, 0 )  # Origin
    hexOrigin = @initHex( obj.originIdx )
    @hexVerticea( obj, hexOrigin )
    console.log( "Hexagon vertices", obj.vertices )
    @createIndices( obj )
    @createBufferGeometry( obj )
    calcIndices = 6
    console.log( "Surface.toGeom Two()",
      { numVertex:obj.vertices.length/3, numIndices:obj.indices.length/3, calcIndices:calcIndices } )
    return

  # Vertex indices set the @hexIndices
  initHex:( vcen ) ->
    {  vcen:vcen, v330:-1, v030:-1, v090:-1, v150:-1, v210:-1, v270:-1 }

  hexVerticea:( obj, hex ) ->
    for own key, idx of hex when key isnt "vcen" and idx is -1
      deg = @degKey( key )
      x   = obj.vertices[hex.vcen  ] + obj.hexRad * vis.cos(deg)
      y   = obj.vertices[hex.vcen+1]
      z   = obj.vertices[hex.vcen+2] + obj.hexRad * vis.sin(deg)
      hex[key]  = obj.vertices.length
      console.log( "Hexagon.hexVerticea", { key:key, idx:hex[key], hue:hue, sat:sat, val:val, x:x, y:y, z:z } )
      hue = @vis.atan2(  z, x )
      sat = @vis.hypoth( x, x )
      val = @vis.valFun( hue, sat )
      @addVertex( obj, hue, sat, val, x, y, z )
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

# Assign vertex indexes to create all the triangular face indices
  createIndices:( obj ) ->
    n = 0
    @add6Indices( obj, n, 0, 0 )
    console.log( "Hexagon Indices", obj.indices )
    return

  addIndice:(    obj, i1, i2, i3 ) ->
    obj.indices.push( i1, i2, i3 )
    return

  add6Indices:( obj, n, i, j ) ->
    vis.noop( n, i, j )
    pcen = obj.originIdx
    p330 = 0
    p030 = 1
    p090 = 2
    p150 = 3
    p210 = 4
    p270 = 5
    @addIndice( obj, pcen, p330, p030 )
    @addIndice( obj, pcen, p030, p090 )
    @addIndice( obj, pcen, p090, p150 )
    @addIndice( obj, pcen, p150, p210 )
    @addIndice( obj, pcen, p210, p270 )
    @addIndice( obj, pcen, p270, p330 )
    return

  add60Indices:( obj, n, i, j ) ->
    pcen = n*i      + j
    p330 = n*(i+11) + j + 1
    p030 = n*(i+ 1) + j + 1
    p090 = n*(i+ 2) + j + 1
    p150 = n*(i+ 3) + j + 1
    p210 = n*(i+ 4) + j + 1
    p270 = n*(i+ 5) + j + 1
    @addIndice( obj, pcen, p330, p030 )
    @addIndice( obj, pcen, p030, p090 )
    @addIndice( obj, pcen, p090, p150 )
    @addIndice( obj, pcen, p150, p210 )
    @addIndice( obj, pcen, p210, p270 )
    @addIndice( obj, pcen, p270, p330 )
    return

export default Hexagon