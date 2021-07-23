
import { PlaneGeometry, MeshPhongMaterial, DoubleSide, Mesh } from 'three'

class Plane

  constructor:( @main, @group, orient ) ->
    @klass    = @constructor.name
    cc        = @main.cartesian
    planeGeo  = new PlaneGeometry( cc.xd, cc.yd )
    planeMat  = new MeshPhongMaterial( { side:DoubleSide, color:cc.hex(orient) } )
    @mesh     = new Mesh( planeGeo, planeMat )
    @mesh.rotation.set( cc.rad(90), 0,          0  ) if orient is 'XZ'
    @mesh.rotation.set( 0,          cc.rad(90), 0  ) if orient is 'YZ'
    @mesh.position.set(  cc.xc,   cc.yc,   cc.zmin ) if orient is 'XY'
    @mesh.position.set(  cc.xc,   cc.ymin, cc.zc   ) if orient is 'XZ'
    @mesh.position.set(  cc.xmin, cc.yc,   cc.zc   ) if orient is 'YZ'
    @group.add(@mesh)
    @main.log( @klass+'()', @ )

export default Plane
