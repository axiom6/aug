
import * as d3 from '../../../lib/d3/d3.5.9.0.esm.js';
import Util    from '../../bas/util/Util.js'
import Vis     from '../../bas/util/Vis.js'

class Innovate

  constructor:( @spec, @shapes, @build ) ->
    @studies = @shapes.arrange( @spec )
    @cos30   = @shapes.cos30
    @t  = 24
    @xh =  0
    @yh =  0
    @r  =  0
    @thick  = 1
    @stroke = 'black'

  drawSvg:( g, geom, defs ) ->
    Util.noop( defs )
    @lay       = @shapes.layout( geom, @spec.column, @shapes.size(@studies), @shapes.size(@studies) )
    @rings( g, geom, @t )
    switch @spec.row
      when 'Learn' then @concept(    g, geom )
      when 'Do'    then @technology( g, geom )
      when 'Share' then @facilitate( g, geom )
      else              @technology( g, geom ) # Default for group spec
    for key, study of @studies
      @hexStudy( g, geom, study )
    return

  rings:( g, geom, t ) ->
    colorRing = Vis.toRgbHsvStr( [70,55,70] )
    colorBack = 'rgba(97, 56, 77, 1.0 )'
    @shapes.round( g, t,     t,     geom.w-t*2,   geom.h-t*2,   t, t, colorRing, 'none' )
    @shapes.round( g, t*2.5, t*2.5, geom.w-t*5.0, geom.h-t*5.0, t, t, colorBack, 'none' )
    @shapes.text(  g, t*4,   t*2+2, @spec.name,   @spec.name+'Text', 'black', '1.8em' )

  concept:( g, geom ) ->
    @eastInovate(  g, geom )
    @westInovate(  g, geom )
    @southInovate( g, geom, (study) -> study.dir isnt 'north' )
    return

  # "ArchitectEngineerConstruct":{"dir":"pradd","icon":"fa-university","hsv":[ 30,60,90]}
  technology:( g, geom ) ->
    @eastInovate(  g, geom )
    @westInovate(  g, geom )
    @northInovate( g, geom, (study) -> study.dir isnt 'south' )
    @southInovate( g, geom, (study) -> study.dir isnt 'north' )
    return

  facilitate:( g, geom ) ->
    @eastInovate(  g, geom )
    @westInovate(  g, geom )
    @northInovate( g, geom )
    return

  westInovate:( g, geom ) ->
    r0   = @lay.ri # geom.x0/2 - 36
    w    = 24
    h    = r0 / @shapes.size(@studies)
    x0   = geom.w  - w
    y0   = geom.y0 - r0/2
    for key, study of @studies
      fill = @shapes.toFill(study)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      y0 += h
    return

  eastInovate:( g, geom ) ->
    r0 = @lay.ri # geom.x0/2 - 36
    w  = 24
    h  = r0 /  @shapes.size(@studies)
    x0 = 0
    y0 = geom.y0 - r0/2
    for key, study of @studies
      fill = @shapes.toFill(study)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      y0 += h
    return

  northInovate:( g, geom ) ->
    w    = 18
    h    = 24
    dx   = geom.r * 1.5
    x0   = geom.x0 - dx - w / 2
    y0   = 0
    ordered = @build.toOrder( @studies, ['west','north','east'] )
    for key, study of ordered
      fill = @shapes.toFill(study)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      x0 += dx
    return

  southInovate:( g, geom ) ->
    w    = 18
    h    = 24
    dx   = geom.r * 1.5
    x0   = geom.x0 - dx - w / 2
    y0   = geom.h  - h
    ordered = @build.toOrder( @studies, ['west','north','east'] )
    for key, study of ordered
      fill = @shapes.toFill(study)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      x0 += dx
    return

  hexStudy:( g, geom, study ) =>
    @r = geom.r
    dx = @r * 1.5
    dy = @r * 2.0 * @cos30
    x0 = geom.x0
    y0 = geom.y0 # - 26
    j = 0
    i = 0
    [j,i] = @hexPosTier( study.dir )
    yh    = if j % 2 is 0 then 0 else  @r*@cos30
    x     =  j*dx + x0
    y     = -i*dy + y0 + yh
    fill  = @shapes.toFill(study)
    uc    = Vis.unicode( study.icon )
    # console.log( 'Innovate.hexStudy()', study.icon, uc )
    @hexPath( fill,       g, x, y, @shapes.htmlId( study.name, 'HexPath' ) )
    @hexText( study.name, g, x, y, @shapes.htmlId( study.name, 'HexText' ) )
    @hexIcon( uc,         g, x, y, @shapes.htmlId( study.name, 'HexIcon' ) )
    return

  hexPosTier:( dir ) ->
    switch dir
      when 'west', 'westd'  then [-1,   0.5]
      when 'north','northd' then [ 0,   0.5]
      when 'east', 'eastd'  then [ 1,   0.5]
      when 'south','southd' then [ 0,  -0.5]
      when 'nw',   'nwd'    then [-1,   1.5]
      when 'ne',   'ned'    then [ 1,   1.5]
      when 'sw',   'swd'    then [-1,  -0.5]
      when 'se',   'sed'    then [ 1,  -0.5]
      else
        console.error( 'Innovate.hexPos() unknown dir', dir, 'returning [0, 0.5] for Service' )
        [0, 0.5]

  line:() =>
    d3.line()
      .x( (ang) => @r * Vis.cosSvg(ang) + @xh )
      .y( (ang) => @r * Vis.sinSvg(ang) + @yh )

  hexPath:( fill, g, x0, y0, pathId ) ->
    xp = (ang) => @r * Vis.cosSvg(ang) + x0
    yp = (ang) => @r * Vis.sinSvg(ang) + y0
    path = d3.path()
    path.moveTo( xp(0),   yp(0) )
    path.lineTo( xp(ang), yp(ang) ) for ang in [60,120,180,240,300,360]
    path.closePath()
    # console.log( 'hexPathV4 path', path )
    g.append("svg:path").attr( "d", path ).attr("id", pathId )
    .attr("stroke-width", @thick ).attr("stroke", @stroke ).attr("fill", fill )
    return

  hexText:( text, g, x0, y0, textId ) ->
    path = g.append("svg:text").text(text).attr("id",textId).attr("x",x0).attr("y",y0+16)
            .attr("text-anchor","middle").attr("font-size","0.9em")
            .attr("font-family",@shapes.fontText)
           #.attr("font-weight","bold")
    @shapes.click( path, text )
    return

  hexIcon:( icon, g, x0, y0, iconId ) ->
    g.append("svg:text").text(icon).attr("x",x0).attr("y",y0-2).attr("id",iconId)
     .attr("text-anchor","middle").attr("font-size","1.5em")
     .attr("font-family","FontAwesome").attr("font-weight","normal")
    return

export default Innovate