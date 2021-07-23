

import {vis}        from '../../lib/pub/base/draw/Vis.js'
import { BoxBufferGeometry, Color, MeshPhongMaterial, Mesh, TextBufferGeometry,
         MeshBasicMaterial, Matrix4, BackSide } from 'three'

class Cube3D

  constructor:( @plane, @row, @col, @title, @xyz, @whd, @hsv, @opacity, @font ) ->
    box = new BoxBufferGeometry()
    box.name = @title
    Cube3D.matrix.makeScale(       @whd[0], @whd[1], @whd[2] )
    box.applyMatrix4( Cube3D.matrix )
    Cube3D.matrix.makeTranslation( @xyz[0], @xyz[1], @xyz[2] )
    box.applyMatrix4( Cube3D.matrix )
    hex = vis.hex(  @hsv, 'ysv' )
    col = new Color( hex )                   # blemding:THREE
    mat = new MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:BackSide } )
    @mesh = new Mesh( box, mat )
    @mesh.name  = @title
    @mesh.geom  = "Cube"
    @mesh.plane = @plane
    @mesh.row   = @row
    @mesh.col   = @col

    obj  = { font:@font, size:12, height:6, curveSegments:2 }
    name = if @plane is 'Cols' then "" else @title
    text = new TextBufferGeometry( name, obj )
    text.computeBoundingBox()
    face = new MeshBasicMaterial( { color: 0xffffff } )
    side = new MeshBasicMaterial( { color: 0xffffff } )

    mats = [face,side]
    dx   = 0.5 * ( text.boundingBox.max.x - text.boundingBox.min.x )
    dy   = 0.5 * ( text.boundingBox.max.y - text.boundingBox.min.y )
    Cube3D.matrix.makeTranslation( @xyz[0]-dx, @xyz[1]-dy, @xyz[2]   )
    text.applyMatrix4( Cube3D.matrix )
    @tmesh       = new Mesh( text, mats )
    @tmesh.name  = @title
    @tmesh.geom  = "Text"
    @tmesh.plane = @plane
    @tmesh.row   = @row
    @tmesh.col   = @col
    @mesh.add( @tmesh )


#mat = new MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:BackSide, blemding:AdditiveBlending } )
#mat = new MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true } ) # blemding:AdditiveBlending

Cube3D.matrix = new Matrix4()

export default Cube3D
