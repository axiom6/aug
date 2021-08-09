
import * as THREE from "three"
import { vis }    from "../../../lib/pub/draw/Vis.js"

class Triangle extends THREE.BufferGeometry

  constructor:( obj, v1, v2, v3 ) ->
    super()
    vis.noop( v1, v2, v3 )
    @setAttribute( "position", new THREE.Float32BufferAttribute(  obj.vertices, 3 ) )
    @setAttribute( "color",    new THREE.Float32BufferAttribute(  obj.colors,   3 ) )

export default Triangle