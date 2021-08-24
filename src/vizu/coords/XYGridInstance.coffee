
import * as THREE from "three"
import Plane      from './Plane.js'

class XYGrid

  constructor:( @main, @content ) ->
    @klass    = @constructor.name
    cc        = @main.cartesian
    @count    = cc.ymax/cc.ytick2 + cc.ymax/cc.ytick1 + cc.xmax/cc.xtick2 + cc.xmax/cc.xtick1 + 4
    @geometry = new THREE.BufferGeometry()
    @material = new THREE.MeshBasicMaterial( { transparent:false, side:THREE.FrontSide } )
    @inMesh   = new THREE.InstancedMesh( geometry, material, count )
    @group    = new THREE.Group()
    @drawXLines( cc, 0x666666, 0x333333, @group, @geometry, @inMesh )
    @drawYLines( cc, 0x666666, 0x333333, @group, @geometry, @inMesh )
    plane = new Plane( @main, @group, 'XY' )
    plane.mesh.receiveShadow = true
    @group.receiveShadow     = true
    @main.addToScene( @group )
    @main.log( @klass+'()', @ )

  drawXLines:( cc, color1, color2, group, geometry, inMesh ) ->

    y = cc.ymin
    while y <= cc.ymax
      @content.addLine( cc.xmin, y, cc.zmin, cc.xmax, y, cc.zmin, color2, group, geometry, inMesh )
      y += cc.ytick2

    y = cc.ymin
    while y <= cc.ymax
      @content.addLine( cc.xmin, y, cc.zmin, cc.xmax, y, cc.zmin, color1, group, geometry, inMesh )
      y += cc.ytick1

  drawYLines:( cc, color1, color2, group, geometry, inMesh ) ->

    x = cc.xmin
    while x <= cc.xmax
      @content.addLine( x, cc.ymin, 0, x, cc.ymax, 0, color2, group, geometry, inMesh )
      x += cc.xtick2

    x = cc.xmin
    while x <= cc.xmax
      @content.addLine( x, cc.ymin, 0, x, cc.ymax, 0, color1, group, geometry, inMesh )
      x += cc.xtick1

export default XYGrid