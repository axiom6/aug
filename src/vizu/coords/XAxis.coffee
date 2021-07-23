
import { Group } from 'three'

import Text from './Text.js'

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
    text = new Text( @main )
    x    = cc.xmin
    dy   = (cc.xmax-cc.xmin) * 0.05
    size = dy * 0.5
    rot  = Math.PI / 6
    while x <= cc.xmax
      @content.drawLine( x, cc.ymax, cc.zmin, x, cc.ymax+dy, cc.zmin, 0xAAAAAA, group )
      text.drawText( x.toString(), size, [x,cc.ymax+dy,cc.zmin], [rot,rot,0], 0xAAAAAA, group )
      x += cc.xtick1
    return

export default XAxis
