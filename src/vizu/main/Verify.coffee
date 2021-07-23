
class Verify

  constructor:( @main ) ->
    @klass = @constructor.name
    @opts  = @main.opts

  verify:( object3D ) ->
    klass  = object3D.constructor.name
    props  = ["rotation","scale","matrix"]   # "matrixWorld","modelViewMatrix","normalMatrix","quaternion"]
    names  = ["elements","x","_x","y","_y","z","_z","w","_w"]
    @verifyPosition( klass, object3D.position )
    @verifyMatrix(   klass, object3D.matrix   )
    # p = object3D.position
    # console.log( 'Main.verify()', { class:klass, position:p, matrix:object3D.matrix, x:p.x, y:p.y, z:p.z } )
    for prop in props
      obj = object3D[prop]
      for n,v of obj when @mix.inArray(n,names)
        if ( not @mix.isArray(v) and isNaN(v) ) or ( n is 'elements' and @arrayHasNaN(v) )
          console.log( 'Main.verify() NaN ', { class:klass, prop:prop, type:obj, n:n, v:v } )
    return

  verifyPosition:( klass, p ) ->
    if isNaN(p.x) or isNaN(p.y) or isNaN(p.z)
      console.log(  'Main.verifyPosition() NaN ', { class:klass, position:p } )
    # p.set( p.x, p.y, p.z )
    return

  verifyMatrix:( klass, m ) ->
    if m.elements.includes(NaN)
      console.log(  'Main.verifyMatrix() NaN ', { class:klass, matrix:m } )
    # midentity()
    return

  arrayHasNaN:( array ) ->
    return if not @mix.isArray(array)
    for e in array
      return true if isNaN(e)
    false

export default Verify