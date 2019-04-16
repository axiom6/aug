

import Shapes    from '../conn/Shapes'
import Embrace   from '../conn/Embrace'
import Innovate  from '../conn/Innovate'
import Encourage from '../conn/Encourage'

class Connect

  constructor:( @stream, @build, @prac, @size, @elem ) ->
    @shapes = new Shapes( @stream )
    @ready()


  createDraw:() ->
    switch @prac.column
      when 'Embrace'   then new Embrace(   @prac, @shapes, @build )
      when 'Innovate'  then new Innovate(  @prac, @shapes, @build )
      when 'Encourage' then new Encourage( @prac, @shapes, @build )
      else                  new Innovate(  @prac, @shapes, @build )

  ready:() ->
    geo = @geom( @size.width, @size.height, @size.width, @size.height )
    @graph=null; @g=null; svgId=''; gId=''; @defs=null
    [@graph,@g,svgId,gId,@defs] = @shapes.createSvg( @elem, @prac.name, @size.width, @size.height )
    @draw   = @createDraw()
    @draw.drawSvg( @g, geo, @defs )
    @htmlId = svgId

  layout:() ->
    geo  = @geom( @size.fullWidth, @size.fullHeight, @size.width, @size.height )
    @shapes.layout( @graph, @g, geo.w, geo.h, geo.sx, geo.sy )
    return

  geom:( width, height, wgpx, hgpx ) ->
    g = {}
    [g.w,g.h] = [width,height]
    g.r  = Math.min( g.w, g.h ) * 0.2  # Use for hexagons
    g.x0 = g.w * 0.5
    g.y0 = g.h * 0.5
    g.sx = g.w/wgpx
    g.sy = g.h/hgpx
    g.s  = Math.min( g.sx, g.sy )
    g.fontSize  = '2em' # @toVh( 5 )+'vh'
    g.iconSize  = '2em' # @toVh( 5 )+'vh'
    # console.log( "Connect.geom()", { wgpx:wgpx, hgpx:hgpx }, g )
    g

  toFill:( hsv ) ->
      Vis.toRgbHsvStr( hsv )


export default Connect