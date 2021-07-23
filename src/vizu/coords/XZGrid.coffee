
import { Group } from 'three'
import Plane     from './Plane.js'

class XZGrid

  constructor:( @main, @content ) ->
    @klass = @constructor.name
    cc     = @main.cartesian
    @group = new Group()
    @drawXLines( cc, 0xAAAAAA, 0x666666, @group )
    @drawZLines( cc, 0xAAAAAA, 0x666666, @group )
    plane = new Plane( @main, @group, 'XZ' )
    plane.mesh.receiveShadow = true
    @group.receiveShadow = true
    @main.addToScene( @group )
    @main.log( @klass+'()', @ )

  drawXLines:( cc, color1, color2, group ) ->

    z = cc.zmin
    while z <= cc.zmax
      @content.drawLine( cc.xmin, cc.ymin, z, cc.xmax, cc.ymin, z, color2, group )
      z += cc.ztick2

    z = cc.zmin
    while z <= cc.zmax
      @content.drawLine( cc.xmin, cc.ymin, z, cc.xmax, cc.ymin, z, color1, group )
      z += cc.ztick1

  drawZLines:( cc, color1, color2, group ) ->

    x = cc.xmin
    while x <= cc.xmax
      @content.drawLine( x, cc.ymin, cc.zmin, x, cc.ymin, cc.zmax, color2, group )
      x += cc.xtick2

    x = cc.xmin
    while x <= cc.xmax
      @content.drawLine( x, cc.ymin, cc.zmin, x, cc.ymin, cc.zmax, color1, group )
      x += cc.xtick1

export default XZGrid