

import { Group } from 'three'
import { Text  } from 'troika-three-text'

class ZAxis

  constructor:( @main, @content ) ->
    @klass = @constructor.name
    cc     = @main.cartesian
    @group = new Group()
    @content.drawLine( cc.xmin, cc.ymin, cc.zmin, cc.xmin, cc.ymin, cc.zmax, 'blue', @group )
    @annotate(  cc,   @group )
    @main.addToScene( @group )
    @main.log( @klass+'()', @ )

  annotate:( cc, group ) ->
    z    = cc.zmin + cc.ztick1
    dy   = (cc.ymax-cc.ymin) * 0.05
    size = dy * 0.75
    rot  = Math.PI / 6
    while z <= cc.zmax
      @content.drawLine( cc.xmin, cc.ymax, z, cc.xmin, cc.ymax+dy, z, 0xFFFFFF, group )
      @drawText( z.toString(), size, [cc.xmin,cc.ymax+dy*2,z+dy], [rot,rot,rot], 0xFFFFFF, group )
      z += cc.ztick1

  drawText:( str, size, [x,y,z], [rx,ry,rz], color, group ) ->
    text = new Text()
    text.text       = str
    text.fontSize   = size
    text.align      = "center"
    text.position.x = x
    text.position.y = y
    text.position.z = z
    text.rotateX( rx )
    text.rotateY( ry )
    text.rotateZ( rz )
    text.color = color
    text.sync()
    group.add( text )
    text.sync()
    return

export default ZAxis