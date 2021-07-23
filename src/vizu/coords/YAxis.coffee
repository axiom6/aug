
import Text from './Text.js'
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
    text = new Text( @main )
    y    = cc.ymin
    dy   = (cc.ymax-cc.ymin) * 0.05
    size = dy * 0.5
    rot  = Math.PI / 6
    while y <= cc.xmax
      @content.drawLine( cc.xmin, y, cc.zmax, cc.xmin, y, cc.zmax+dy, 0xAAAAAA, group )
      text.drawText( y.toString(), size, [cc.xmin,y,cc.zmax+dy], [rot,rot,rot], 0xAAAAAA, group )
      y += cc.ytick1
    return

export default YAxis