
import { Text  } from 'troika-three-text'
import { Group } from 'three'

class YAxis

  constructor:( @main, @content ) ->
    @klass = @constructor.name
    cc     = @main.cartesian
    @group = new Group()
    @content.drawLine( cc.xmin, cc.ymin, cc.zmin, cc.xmin, cc.ymax, cc.zmin, 'blue', @group )
    @annotate(  cc,   @group )
    @main.addToScene( @group )
    @main.log( @klass+'()', @ )

  annotate:( cc, group ) ->
    y    = cc.ymin
    dy   = (cc.ymax-cc.ymin) * 0.05
    size = dy * 0.7
    rot  = Math.PI / 6
    while y <= cc.xmax
      @content.drawLine( cc.xmin, y, cc.zmax, cc.xmin, y, cc.zmax+dy, 0xFFFFFF, group )
      @drawText( y.toString(), size, [cc.xmin,y+dy*0.5,cc.zmax+dy*2.2], [rot,rot,rot], 0xFFFFFF, group )
      y += cc.ytick1
    return

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
    return

export default YAxis