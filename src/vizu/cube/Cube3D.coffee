

import {vis}  from '../../../lib/pub/draw/Vis.js'
import * as THREE from 'three'

class Cube3D

  constructor:( @plane, @row, @col, @title, @xyz, @whd, @hsv, @opacity, @font ) ->
    box = new THREE.BoxBufferGeometry()
    box.name = @title
    Cube3D.matrix.makeScale(       @whd[0], @whd[1], @whd[2] )
    box.applyMatrix4( Cube3D.matrix )
    Cube3D.matrix.makeTranslation( @xyz[0], @xyz[1], @xyz[2] )
    box.applyMatrix4( Cube3D.matrix )
    hex = vis.hex(  @hsv )
    col = new THREE.Color( hex )                    # blemding:THREE
    mat = new THREE.MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:THREE.BackSide } )
    @mesh = new THREE.Mesh( box, mat )
    @mesh.name  = @title
    @mesh.geom  = "Cube"
    @mesh.plane = @plane
    @mesh.row   = @row
    @mesh.col   = @col

    obj  = { font:@font, size:12, height:6, curveSegments:2 }
    name = if @plane is 'Cols' then "" else @title
    text = new THREE.TextBufferGeometry( name, obj )
    text.computeBoundingBox()
    face = new THREE.MeshBasicMaterial( { color: 0xffffff } )
    side = new THREE.MeshBasicMaterial( { color: 0xffffff } )

    mats = [face,side]
    dx   = 0.5 * ( text.boundingBox.max.x - text.boundingBox.min.x )
    dy   = 0.5 * ( text.boundingBox.max.y - text.boundingBox.min.y )
    Cube3D.matrix.makeTranslation( @xyz[0]-dx, @xyz[1]-dy, @xyz[2]   )
    text.applyMatrix4( Cube3D.matrix )
    @tmesh       = new THREE.Mesh( text, mats )
    @tmesh.name  = @title
    @tmesh.geom  = "Text"
    @tmesh.plane = @plane
    @tmesh.row   = @row
    @tmesh.col   = @col
    @mesh.add( @tmesh )

  colorRgb:( rgb ) ->
    "rgb(#{Math.round(rgb[0]*255)}, #{Math.round(rgb[1]*255)}, #{Math.round(rgb[2]*255)})"

#mat = new THREE.MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:THREE.BackSide, blemding:THREE.AdditiveBlending } )
#mat = new THREE.MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true } ) # blemding:THREE.AdditiveBlending

Cube3D.matrix = new THREE.Matrix4()

export default Cube3D
