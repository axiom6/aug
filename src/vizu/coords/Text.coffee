
import FontJSON from "../../../css/font/three/helvetiker_regular.typeface.json"
import { TextBufferGeometry, MeshBasicMaterial, Mesh, Font } from 'three' # TextGeometry,

class Text

  constructor:( @main, @texts=[] ) ->
    @klass = @constructor.name
    @font  = new Font( FontJSON )
    @main.log( @klass+'()' )

  drawText:( string, size, position, rotation, color, group ) ->
    textGeom = new TextBufferGeometry( string,
      { font:@font, size:size, height:size*0.5, bevelEnabled:false } )
    # bevelThickness: bevelThickness
    # bevelSize: bevelSize,
    textGeom.computeBoundingBox()
    material = new MeshBasicMaterial( { color: color } );
    textMesh = new Mesh( textGeom, material )
    textMesh.position.x = position[0]
    textMesh.position.y = position[1]
    textMesh.position.z = position[2]
    textMesh.rotation.x = rotation[0]
    textMesh.rotation.y = rotation[1]
    textMesh.rotation.z = rotation[2]
    group.add( textMesh )
    textMesh

  # Need to remember what this was coded for
  drawTexts:( texts, group ) ->
    textMeshs = []
    for text in texts
      size     = if  text.size? then text.size else 100
      textMesh = @drawText( text.string, size, text.position, text.rotation, text.color, group )
      textMeshs.push( textMesh )
    textMeshs

export default Text