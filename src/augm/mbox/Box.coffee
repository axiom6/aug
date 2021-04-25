
import Util     from '../../base/util/Util.js'
import Vis      from '../../base/draw/Vis.js'
import MBox     from './MBox.js'
import Coord    from './Coord.js'
import Color    from './Color.js'
import MRegress from './Regress.js'

class  Box

  @init = () ->
     Util.ready ->
       elem = document.querySelector('#App')
       Box.doApp('Color', elem )
       return

  @doApp:( name, elem ) ->
    switch name
      when 'Color'    then Box.doColor(    elem )
      when 'Rgbs'     then Box.doRgbs(     elem )
      when 'Polar'    then Box.doPolar(    elem )
      when 'Vecs'     then Box.doVecs(     elem, 'hsv' )
      when 'Sphere'   then Box.doSphere(   elem )
      when 'Regress'  then Box.doRegress(  elem )
      when 'Color'    then Box.doColor(    elem )
    return

  @doRgbs:( elem ) ->
    mbox   = new MBox( elem );
    coord  = new Coord( mbox, 11, 11, 11 );
    view   = coord.cartesian()
    coord.cartArray( view )

  @doColor:( elem ) ->
    mbox   = new MBox( elem )
    coord  = new Coord( mbox, 8, 20, 20 )
    view   = coord.polar()
    coord.cylVolume(  view, Vis.toRgbHsv )
    coord.cylSurface( view, Vis.toRgbHsv, mbox.sin06F )

  @doRegress:( elem ) ->
    mbox     = new MBox( elem )
    regress  = new MRegress( mbox )
    regress.viewLinearRegress()

  @doSphere:( elem ) ->
    mbox   = new MBox( elem )
    coord  = new Coord( mbox, 12, 60, 10 )
    view   = coord.sphere()
    coord.sphVolume( view, Vis.toRgbSphere )

  @doHcs:( elem ) ->
    mbox   = new MBox( elem )
    coord  = new Coord( mbox, 12, 10, 10 )
    color  = new Color( mbox )
    view   = coord.polar()
    color.genWithHcs( coord, view )
    coord.cylSurface( view, Vis.toRgbHsv, mbox.sin06F )

  @doVecs:( elem, see ) ->
    mbox   = new MBox(  elem )
    coord  = new Coord( mbox, 12, 9, 9 )
    color  = new Color( mbox )
    view   = coord.polar()
    color.genWithVecsRgb( coord, view, see )

  @doPolar:( elem ) ->
    mbox   = new MBox(  elem )
    coord  = new Coord( mbox, 12, 9, 9 )
    color  = new Color( mbox )
    view   = coord.polar()
    color.genPolarRgbs( coord, view, false )

  @doScaleRgb:( elem ) ->
    mbox   = new MBox(  elem )
    coord  = new Coord( mbox, 12, 9, 9 )
    color  = new Color( mbox )
    view   = coord.polar()
    color.genPolarRgbs( coord, view, true )

  @doRgbHcv:( ) ->
    s   = 100
    c   = 100
    for hue in [0,60,120,180,240,300]
        console.log( 'RgbHsv', { hue:hue, c:c, s:s }, Vis.toRgbHsv( hue, c, s ) )
    for hue in [0,60,120,180,240,300]
      for c   in [0,20,40,60,80,100]
        console.log( 'RgbHsv', { hue:hue, c:c, s:s }, Vis.toRgbHsv( hue, c, s ) )

# Box.init()

export default Box