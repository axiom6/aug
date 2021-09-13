
import {vis}  from '../../../lib/pub/draw/vis.js'

class MBox

  constructor:( elem ) ->
    @debug  = true
    console.log( 'MBox()', window ) if @debug
    THREE   = window['THREE']
    mathBox = window['mathBox']
    @mathbox  = mathBox( {
      element:elem,
      plugins:['core','controls','cursor', 'stats'],
      controls: { klass: THREE.OrbitControls } } ) # TrackballControls  OrbitControls
    console.error('mathbox WebGL not supported') if @mathbox.fallback
    @three = @mathbox.three
    @three.renderer.setClearColor( new THREE.Color(0x000000), 1.0 )
    #@mathbox.set( { focus:3, scale: 720 } )
    vis.time  = 0
    @setupTime()

  setupTime:() ->
    @three.on('update', () -> vis.time = @three.Time.clock )
    vis.noop()
    return

  pv1v2:( p, v1, v2 ) ->
    p1 = p * 0.01
    p2 = 1.0 - p1
    v3 = [0,0,0]
    for i in [0...3]
      v3[i] = v1[i]*p1 + v2[i]*p2
    v3

  toRad:( i, n ) ->
    hue = ( i * 360/n) % 360
    vis.rad( hue )

  toHue:( i, n ) ->
    h = ( i * 360/n) % 360
    vis.toInt(h)

  sin9:(      x, y ) -> 0.5 + 0.25*Math.sin( 12*x + vis.time*0.3 ) + 0.25*Math.sin( 12*y + vis.time*0.3 )

  sin12:(     x, y ) -> 0.5 + 0.50*Math.sin( 12*x + vis.time*0.3 ) + 0.50*Math.sin( 12*y + vis.time*0.3 )

  sinNorm:(   x, y ) -> Math.sin( 12*x + vis.time*0.3 ) + Math.sin( 12*y + vis.time*0.3 )

  sin9Pq:(    a, r ) -> 0.5 + 0.25*Math.sin( 12*(r+a) + vis.time*1.2 + π/12 ) + 0.25*Math.cos( 12*(a)  )

  sin9P:(     a, r ) -> 0.5*Math.sin( 12*(a+r) + vis.time*1.2 + π/12) + 0.5*Math.cos( 12*(a) )

  sin9R:(     a, r ) -> 0.5 + 0.25*Math.sin( 12*r*a + vis.time*1.2 ) + 0.25*Math.sin( 6*a )

  sin9P:(     a, r ) -> 0.5 + 0.25*Math.sin( 12*r + vis.time*0.3 + π/12 )    + 0.25*Math.sin( 12*a + π/12 )

  sin9PJan:(  a, r ) -> 0.5 *      Math.sin( 12*(a+r) + vis.time*1.2 + π/12) + 0.50*Math.cos( 12*(a) )


  sin9QJan:(  a, r ) -> 0.5 + 0.25*Math.sin( 12*r + vis.time*0.3 + π/12 ) + 0.25*Math.sin( 12*a + π/12 )

  sin12P:(    a, r ) -> 0.5*Math.sin( 12*(r+a) + vis.time*1.2 )  + 0.5*Math.cos( 12*(a)  )
  sin12R:(    a, r ) -> .5 + 0.25*Math.sin( r + a ) + 0.25*Math.cos( r + a * vis.time*0.5 )


  sin12PMar:( a, r ) -> .5 + .5 * Math.sin( 12 * (r + a) + vis.time ) * Math.sin(  9*a + vis.time )
  sin12CMar:( a, r ) -> .5 + .5 * Math.sin( 12 * (r + a) + vis.time ) * Math.sin(  9*a + vis.time ) * Math.cos(r)
  sin09PMar:( a, r ) -> .5 + .5 * Math.sin(  9 * (r + a) + vis.time ) * Math.sin(  9*a + vis.time )
  sin01Oct:(  a, r ) -> .5 + .5 * Math.sin(  a           + vis.time ) * Math.sin(    r + vis.time )
  sin09Oct:(  a, r ) -> .5 + .5 * Math.sin(  9 *  a      + vis.time ) * Math.sin(  9*r + vis.time )
  sin12Oct:(  a, r ) -> .5 + .5 * Math.sin( 12 *  a      + vis.time ) * Math.sin( 12*r + vis.time )
  cos01Oct:(  a, r ) -> .5 + .5 * Math.cos(       a      + vis.time ) * Math.cos(    r + vis.time )

  sin12AMay:( a    ) -> .5 + .50 * Math.cos( 12 * a + vis.time )
  sin12RMay:( a, r ) -> .5 + .50                                     * Math.cos( 12 * r + vis.time )
  sin12MMay:( a, r ) -> .5 + .50 * Math.cos( 12 * a + vis.time ) * Math.cos( 12 * r + vis.time )


  sin12PMay:( a, r ) -> .5 + .25 * Math.cos( 12 * a + vis.time ) +  .25 * Math.cos( 12 * r + vis.time )
  sin12QMay:( a, r ) -> .5 + .25 * Math.cos( 12 * a + vis.time ) +  .25 * Math.cos( 12 * r + vis.time )

  sin12QJan:( a, r ) -> .50 + .50 * Math.sin( 12 * (r + a) + vis.time * 1.2  )
  sin12AJan:( a    ) -> .50 + .50 * Math.sin( 12 *      a  + vis.time * 1.2  )
  sin06AJan:( a    ) -> .50 + .50 * Math.sin(  3 *      a  + vis.time * 1.2  )         # Keep

  sin06B:(    a    ) -> .55 + .45 * Math.sin(  3 * a + vis.time )
  sin06C:(    a    ) -> .60 + .40 * Math.sin(  3 * a + vis.time )
  sin03D:(    a, r ) -> .60 + .40 * Math.sin(  3 * a + vis.time ) * Math.sin( r * 0.11 + vis.time )
  sin06D:(    a, r ) -> .60 + .40 * Math.sin(  6 * a + vis.time ) * Math.sin( r * 0.11 + vis.time )
  sin06E:(    a, r ) -> .60 + .40 * Math.sin(  6 * a + vis.time ) * Math.sin( r / 12   + vis.time )
  sin06F:(    a, r ) -> .60 + .40 * Math.sin(  6 * a + vis.time ) * Math.sin( r /  8   + vis.time )

  sigmoidal:( x, k, x0=0.5 ) ->
    1 / ( 1 + Math.exp(-k*(x-x0)) )

  depth:() ->
    Math.abs( Math.cos( vis.time*0.5  ) )

  toDep:( a, r ) ->
    Math.abs( Math.cos( 6*(r+a) + vis.time*0.5  ) )

export default MBox




