

import { Group } from 'three'
import Text from './Text.js'

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
    text = new Text( @main )
    z    = cc.zmin + cc.ztick1
    dy   = (cc.ymax-cc.ymin) * 0.05
    size = dy * 0.5
    rot  = Math.PI / 6
    while z <= cc.zmax
      @content.drawLine( cc.xmin, cc.ymax, z, cc.xmin, cc.ymax+dy, z, 0xAAAAAA, group )
      text.drawText( z.toString(), size, [cc.xmin,cc.ymax+dy,z], [rot,rot,rot], 0xAAAAAA, group )
      z += cc.ztick1

export default ZAxis