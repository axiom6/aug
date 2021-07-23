
import { Group } from 'three'
import Plane     from './Plane.js'

class YZGrid

  constructor:( @main, @content ) ->
    @klass = @constructor.name
    cc     = @main.cartesian
    @group = new Group()
    @drawYLines( cc, 0xAAAAAA, 0x666666, @group )
    @drawZLines( cc, 0xAAAAAA, 0x666666, @group )
    plane = new Plane( @main, @group, 'YZ' )
    plane.mesh.receiveShadow = true
    @group.receiveShadow = true
    @main.addToScene( @group )
    @main.log( @klass+'()', @ )

  drawYLines:( cc, color1, color2, group ) ->

    z = cc.zmin
    while z <= cc.zmax
      @content.drawLine( cc.xmin, cc.ymin, z, cc.xmin, cc.ymax, z, color2, group )
      z += cc.ztick2

    z = cc.zmin
    while z <= cc.zmax
      @content.drawLine( cc.xmin, cc.ymin, z, cc.xmin, cc.ymax, z, color1, group )
      z += cc.ztick1

  drawZLines:( cc, color1, color2, group ) ->

    y = cc.ymin
    while y <= cc.ymax
      @content.drawLine( cc.xmin, y, cc.zmin, cc.xmin, y, cc.zmax, color2, group )
      y += cc.ytick2

    y = cc.xmin
    while y <= cc.ymax
      @content.drawLine( cc.xmin, y, cc.zmin, cc.xmin, y, cc.zmax, color1, group )
      y += cc.ytick1

export default YZGrid