
import Util     from '../../base/util/Util.js'
import Vis      from '../../base/util/Vis.js'
import MBox     from '../mbox/MBox.js'
import Coord    from '../mbox/Coord.js'
import Color    from '../mbox/Color.js'
import MRegress from '../mbox/Regress.js'

class  Box

  @init = () ->
    Util.ready ->
      Box.doApp( MBox )

  @doApp:( MBox ) ->
    parse = Util.parseURI( window.location )
    name  = if Util.isStr(parse.fragment) then parse.fragment.substring(1) else 'Color'
    switch name
      when 'Color'    then Box.doColor(    MBox )
      when 'Rgbs'     then Box.doRgbs(     MBox )
      when 'Polar'    then Box.doPolar(    MBox )
      when 'Vecs'     then Box.doVecs(     MBox, 'hsv' )
      when 'Sphere'   then Box.doSphere(   MBox )
      when 'Regress'  then Box.doRegress(  MBox )
      when 'Color'    then Box.doColor(    MBox )
    return

  @doRgbs:( MBox ) ->
    mbox   = new MBox();
    coord  = new Coord( mbox, 11, 11, 11 );
    view   = coord.cartesian()
    coord.cartArray( view )

  @doColor:( MBox ) ->
    mbox   = new MBox()
    coord  = new Coord( mbox, 8, 20, 20 )
    view   = coord.polar()
    coord.cylVolume(  view, Vis.toRgbHsv )
    coord.cylSurface( view, Vis.toRgbHsv, mbox.sin06F )

  @doRegress:( MBox ) ->
    mbox     = new MBox()
    regress  = new MRegress( mbox )
    regress.viewLinearRegress()

  @doSphere:( MBox ) ->
    mbox   = new MBox()
    coord  = new Coord( mbox, 12, 60, 10 )
    #color = new Color( mbox )
    view   = coord.sphere()
    coord.sphVolume( view, Vis.toRgbSphere )

  @doHcs:( MBox ) ->
    mbox   = new MBox()
    coord  = new Coord( mbox, 12, 10, 10 )
    color  = new Color( mbox )
    view   = coord.polar()
    color.genWithHcs( coord, view )
    coord.cylSurface( view, Vis.toRgbHsv, mbox.sin06F )

  @doVecs:( MBox, see ) ->
    mbox   = new MBox()
    coord  = new Coord( mbox, 12, 9, 9 )
    color  = new Color( mbox )
    view   = coord.polar()
    color.genWithVecsRgb( coord, view, see )

  @doPolar:( MBox ) ->
    mbox   = new MBox()
    coord  = new Coord( mbox, 12, 9, 9 )
    color  = new Color( mbox )
    view   = coord.polar()
    color.genPolarRgbs( coord, view, false )

  @doScaleRgb:( MBox ) ->
    mbox   = new MBox()
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

Box.init()

export default Box