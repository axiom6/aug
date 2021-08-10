
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
    obj.originIdx = 0   # Will be reset
    obj.vertex    = new THREE.Vector3()
    obj.normal    = new THREE.Vector3()
    obj.uv        = new THREE.Vector2()
    obj.sc        = 1.0 / 255.0
    obj.hueNum    = 12
    obj.satNum    = 10
    obj.hueInc    = 360 / obj.hueNum
    obj.huePri    = obj.hueInc * 2
    obj.satInc    = 100 / obj.satNum
    cos30         = vis.cos(30)
    angTan        = vis.atan(1.0/6.0)
    facSec        = 1.0 / vis.cos(angTan)
    @initSpheres( obj )
    for hue in [330,30,90,150,210,270]
        sat = 50
        rad = 20
        fac = 1.0
        val = obj.valFun(hue,sat)
        @addVertex( obj, hue, sat, val, rad*fac*vis.cos(-hue-90), 0, rad*fac*vis.sin(hue-90) )
    for hue in [330,0,30,60,90,120,150,180,210,240,270,300]
      sat = 100
      rad = 40
      fac = if hue % 60 is 0  then facSec else 1.0
      val = obj.valFun(hue,sat)
      vis.noop( rad, fac, val, cos30 )
      # @addVertex( obj, hue, sat, val, rad*fac*vis.cos(-hue-90), 0, rad*fac*vis.sin(hue-90) )
    obj.originIdx = obj.vertices.length/3
    @addVertex( obj, 0, 0, 0, 0, 0, 0 )  # Origin
    console.log( "Hexagon vertices", obj.vertices )
    @createIndices( obj )
    @createBufferGeometry( obj )
    calcIndices = 6
    console.log( "Surface.toGeom Two()",
      { numVertex:obj.vertices.length/3, numIndices:obj.indices.length/3, calcIndices:calcIndices } )
    return

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