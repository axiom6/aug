
import { Group } from 'three'
import { Text  } from 'troika-three-text'

class XAxis

  constructor:( @main, @content ) ->
    @klass = @constructor.name
    cc     = @main.cartesian
    @group = new Group()
    @content.drawLine( cc.xmin, cc.ymin, cc.zmin, cc.xmax, cc.ymin, cc.zmin, 'blue', @group )
    @annotate( cc,    @group )
    @main.addToScene( @group )
    @main.log( @klass+'()', @ )

  annotate:( cc, group ) ->

    x    = cc.xmin
    dy   = (cc.xmax-cc.xmin) * 0.03
    size = dy * 0.75
    rot  = Math.PI / 6
    while x <= cc.xmax
      @content.drawLine( x, cc.ymax, cc.zmin, x, cc.ymax+dy, cc.zmin, 0xFFFFFF, group )
      @drawText( x.toString(), size, [x-dy*0.5,cc.ymax+dy*1.75,cc.zmin], [0,rot,0], 0xFFFFFF, group )
      x += cc.xtick1
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

export default XAxis
