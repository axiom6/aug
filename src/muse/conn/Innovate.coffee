
import * as d3 from 'd3'
import {vis}   from '../../../lib/pub/draw/Vis.js'

class Innovate

  constructor:( @spec, @shapes, @build ) ->
    @studies = @shapes.arrange( @spec )
    @cos30   = @shapes.cos30
    @xh =  0
    @yh =  0
    @r  =  0
    @thick  = 1
    @stroke = 'black'

  drawSvg:( g, size, defs ) ->
    vis.noop( defs )
    @lay       = @shapes.layout( size, @spec.column, @shapes.size(@studies), @shapes.size(@studies) )
    @rings( g, size )
    switch @spec.row
      when 'Dim'   then @principle(  g, size )
      when 'Learn' then @concept(    g, size )
      when 'Do'    then @technology( g, size )
      when 'Share' then @facilitate( g, size )
      else              @technology( g, size ) # Default for group spec
    for key, study of @studies
      @hexStudy( g, size, study )
    return

  # getComputedTextLength()
  rings:( g, size ) ->
    wt = size.w / 13
    ht = size.h /  6
    wr = if size.level is 'Comp' then  wt     else size.w * 0.75
    hr = if size.level is 'Comp' then  ht     else size.h * 0.50
    xi = if size.level is 'Comp' then  wt*1.6 else wt*1.5
    xt = xi + size.w * 0.04
    yt = if size.level is 'Comp' then  ht*1.7  else size.h / 4.2
    uc = vis.unicode( @spec.icon )
    # console.log( 'Innovate.rings()', { wt:wt, wr:wr, hr:hr, xt:xt, yt:yt } )
    colorRing = vis.css( [70,55,70] )
    colorBack = 'rgba(97, 56, 77, 1.0 )'
    h2 = Math.max(size.h-wt*2,wt)
    h5 = Math.max(size.h-wt*5,wt)
    @shapes.round( g, wt,      wt,     size.w-wt*2,   h2, wt, wt, colorRing, 'none' )
    #shapes.round( g, wt*2.5,  wt*2.5, size.w-wt*5.0, h5, wt, wt, colorBack, 'none' )
    @shapes.rect(  g, wt,      wt,     wr,            hr,         colorRing, 'none' )
    @shapes.icon(  g, xi, yt, @spec.name, @spec.name+'Icon', 'black', size.bannSize,  uc )
    @shapes.text(  g, xt, yt, @spec.name, @spec.name+'Text', 'black', size.bannSize , "start" )
    return

  principle:( g, size ) ->
    @eastInovate(  g, size )
    @westInovate(  g, size )
    return

  concept:( g, size ) ->
    @eastInovate(  g, size )
    @westInovate(  g, size )
    @southInovate( g, size, (study) -> study.dir isnt 'north' )
    return

  # "ArchitectEngineerConstruct":{"dir":"pradd","icon":"fa-university","hsv":[ 30,60,90]}
  technology:( g, size ) ->
    @eastInovate(  g, size )
    @westInovate(  g, size )
    @northInovate( g, size, (study) -> study.dir isnt 'south' )
    @southInovate( g, size, (study) -> study.dir isnt 'north' )
    return

  facilitate:( g, size ) ->
    @eastInovate(  g, size )
    @westInovate(  g, size )
    @northInovate( g, size )
    return

  westInovate:( g, size ) ->
    w    = size.ringSize
    h    = size.h / 15
    x0   = size.w  - w
    y0   = size.yc - h * 2 # 4 studies
    for key, study of @studies
      fill = @shapes.toFill(study)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      y0 += h
    return

  eastInovate:( g, size ) ->
    w    = size.ringSize
    h  = size.h / 15
    x0 = 0
    y0 = size.yc - h * 2 # 4 studies
    for key, study of @studies
      fill = @shapes.toFill(study)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      y0 += h
    return

  northInovate:( g, size ) ->
    w    = size.w / 23
    h    = if size.level is 'Comp' then size.h / 6 else  size.h / 7.3
    dx   = size.r * 1.5
    x0   = size.xc - dx - w / 2
    y0   = 0
    ordered = @build.toOrder( @studies, ['west','north','east'] )
    for key, study of ordered
      fill = @shapes.toFill(study)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      x0 += dx
    return

  southInovate:( g, size ) ->
    w    = size.w / 23
    h    = size.h /  6
    dx   = size.r * 1.5
    x0   = size.xc - dx - w / 2
    y0   = size.h  - h
    ordered = @build.toOrder( @studies, ['west','north','east'] )
    for key, study of ordered
      fill = @shapes.toFill(study)
      @shapes.rect( g, x0, y0, w, h, fill, 'none' )
      x0 += dx
    return

  hexStudy:( g, size, study ) =>
    @r = size.r
    dx = @r * 1.5
    dy = @r * 2.0 * @cos30
    x0 = size.xc
    y0 = size.yc # - 26
    j = 0
    i = 0
    [j,i] = @hexPosTier( study.dir )
    yh    = if j % 2 is 0 then 0 else  @r*@cos30
    x      =  j*dx + x0
    y      = -i*dy + y0 + yh
    yt     = if size.level is 'Comp' then y+10 else y+4.5*size.scaleFont
    yi     = if size.level is 'Comp' then y-2  else y-2.0*size.scaleFont
    fill  = @shapes.toFill(study)
    uc    = vis.unicode( study.icon )
    # console.log( 'Innovate.hexStudy()', study.icon, uc )
    @hexPath( fill,       g, x, y,  @shapes.htmlId( study.name, 'HexPath' ) )
    @hexText( study.name, g, x, yt, @shapes.htmlId( study.name, 'HexText' ), size.dispSize )
    @hexIcon( uc,         g, x, yi, @shapes.htmlId( study.name, 'HexIcon' ), size.dispSize )
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
      .x( (ang) => @r * vis.cosSvg(ang) + @xh )
      .y( (ang) => @r * vis.sinSvg(ang) + @yh )

  hexPath:( fill, g, x0, y0, pathId ) ->
    xp = (ang) => @r * vis.cosSvg(ang) + x0
    yp = (ang) => @r * vis.sinSvg(ang) + y0
    path = d3.path()
    path.moveTo( xp(0),   yp(0) )
    path.lineTo( xp(ang), yp(ang) ) for ang in [60,120,180,240,300,360]
    path.closePath()
    # console.log( 'hexPathV4 path', path )
    g.append("svg:path").attr( "d", path ).attr("id", pathId )
    .attr("stroke-width", @thick ).attr("stroke", @stroke ).attr("fill", fill )
    return

  hexText:( text, g, x0, y0, textId, size ) ->
    path = g.append("svg:text").text(text).attr("id",textId).attr("x",x0).attr("y",y0)
            .attr("text-anchor","middle").attr("font-size",size)
            .attr("font-family",@shapes.fontText)
           #.attr("font-weight","bold")
    @shapes.click( path, text )
    return

  hexIcon:( icon, g, x0, y0, iconId, size ) ->
    g.append("svg:text").text(icon).attr("x",x0).attr("y",y0).attr("id",iconId)
     .attr("text-anchor","middle").attr("font-size",size)
     .attr("font-family","FontAwesome").attr("font-weight","normal")
    return

export default Innovate