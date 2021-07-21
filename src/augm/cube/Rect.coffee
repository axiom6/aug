
import {vis}      from '../../../lib/pub/draw/Vis.js'
import * as THREE from 'three'

class Rect

  constructor:( @plane, @row, @col, @title, @xyz, @wh, @hsv, @opacity, @font, @fontColor ) ->
    rec = new THREE.PlaneGeometry( @wh[0], @wh[1] )
    rec.translate(      @xyz[0], @xyz[1], @xyz[2] )

    col   = vis.hex( @hsv )
    mat   = new THREE.MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true, side:THREE.DoubleSide } )
    @mesh = new THREE.Mesh( rec, mat )
    @mesh.name  = @title
    @mesh.geom  = "Rect"
    @mesh.plane = @plane
    @mesh.row   = @row
    @mesh.col   = @col

    obj  = { font:@font, size:10, height:5, curveSegments:2 }
    text = new THREE.TextBufferGeometry( @title, obj )
    text.computeBoundingBox()
    face = new THREE.MeshBasicMaterial( { color: @fontColor } )
    side = new THREE.MeshBasicMaterial( { color: @fontColor } )

    mats = [face,side]
    offsetY = not vis.inStr( @title, '\n' )
    dx   = 0.5 * ( text.boundingBox.max.x - text.boundingBox.min.x )
    dy   = if offsetY then 0.5 * ( text.boundingBox.max.y - text.boundingBox.min.y ) else 0
    Rect.matrix.makeTranslation( @xyz[0]-dx, @xyz[1]-dy, @xyz[2]   )
    text.applyMatrix( Rect.matrix )
    @tmesh       = new THREE.Mesh( text, mats )
    @tmesh.name  = @title
    @tmesh.geom  = "Text"
    @tmesh.plane = @plane
    @tmesh.row   = @row
    @tmesh.col   = @col
    @mesh.add( @tmesh )

  colorRgb:( rgb ) ->
    "rgb(#{Math.round(rgb[0]*255)}, #{Math.round(rgb[1]*255)}, #{Math.round(rgb[2]*255)})"

Rect.matrix = new THREE.Matrix4()

`export default Rect`