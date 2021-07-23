import Util       from '../../../lib/pub/util/Util.js'
import {vis}       from '../../../lib/pub/draw/Vis.js'
import { PlaneGeometry, Color, MeshBasicMaterial, Mesh, TextBufferGeometry, Matrix4, DoubleSide } from 'three'

class Rect3D

  constructor:( @plane, @row, @col, @title, @xyz, @wh, @hsv, @opacity, @font, @fontColor ) ->
    rec = new PlaneGeometry( @wh[0], @wh[1] )
    rec.translate(      @xyz[0], @xyz[1], @xyz[2] )

    hex  = vis.hex( @hsv, 'ysv' )
    col   = new Color( hex )
    mat   = new MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true, side:DoubleSide } )
    @mesh = new Mesh( rec, mat )
    @mesh.name  = @title
    @mesh.geom  = "Rect"
    @mesh.plane = @plane
    @mesh.row   = @row
    @mesh.col   = @col

    obj  = { font:@font, size:10, height:5, curveSegments:2 }
    text = new TextBufferGeometry( @title, obj )
    text.computeBoundingBox()
    face = new MeshBasicMaterial( { color: @fontColor } )
    side = new MeshBasicMaterial( { color: @fontColor } )

    mats = [face,side]
    offsetY = not Util.inString( @title, '\n' )
    dx   = 0.5 * ( text.boundingBox.max.x - text.boundingBox.min.x )
    dy   = if offsetY then 0.5 * ( text.boundingBox.max.y - text.boundingBox.min.y ) else 0
    Rect3D.matrix.makeTranslation( @xyz[0]-dx, @xyz[1]-dy, @xyz[2]   )
    text.applyMatrix4( Rect3D.matrix )
    @tmesh       = new Mesh( text, mats )
    @tmesh.name  = @title
    @tmesh.geom  = "Text"
    @tmesh.plane = @plane
    @tmesh.row   = @row
    @tmesh.col   = @col
    @mesh.add( @tmesh )

Rect3D.matrix = new Matrix4()

export default Rect3D