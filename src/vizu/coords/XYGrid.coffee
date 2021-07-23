
import { Group } from 'three'
import Plane     from './Plane.js'

class XYGrid

  constructor:( @main, @content ) ->
    @klass = @constructor.name
    cc     = @main.cartesian
    @group = new Group()
    @drawXLines( cc, 0x666666, 0x333333, @group ) # @drawXLines( cc, 0xAAAAAA, 0x666666, @group )
    @drawYLines( cc, 0x666666, 0x333333, @group ) # @drawYLines( cc, 0xAAAAAA, 0x666666, @group )
    plane = new Plane( @main, @group, 'XY' )
    plane.mesh.receiveShadow = true
    @group.receiveShadow     = true
    @main.addToScene( @group )
    @main.log( @klass+'()', @ )

  drawXLines:( cc, color1, color2, group ) ->

    y = cc.ymin
    while y <= cc.ymax
      @content.drawLine( cc.xmin, y, cc.zmin, cc.xmax, y, cc.zmin, color2, group )
      y += cc.ytick2

    y = cc.ymin
    while y <= cc.ymax
      @content.drawLine( cc.xmin, y, cc.zmin, cc.xmax, y, cc.zmin, color1, group )
      y += cc.ytick1

  drawYLines:( cc, color1, color2, group ) ->

    x = cc.xmin
    while x <= cc.xmax
      @content.drawLine( x, cc.ymin, 0, x, cc.ymax, 0, color2, group )
      x += cc.xtick2

    x = cc.xmin
    while x <= cc.xmax
      @content.drawLine( x, cc.ymin, 0, x, cc.ymax, 0, color1, group )
      x += cc.xtick1


export default XYGrid