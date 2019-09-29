
import Vis       from '../../base/util/Vis'
import Shapes    from './Shapes'
import Embrace   from './Embrace'
import Innovate  from './Innovate'
import Encourage from './Encourage'

class Connect

  constructor:( @stream, @build, @prac, @elem, @size, @level ) ->
    @shapes = new Shapes( @stream )
    @ready()

  createDraw:() ->
    switch @prac.column
      when 'Embrace'   then new Embrace(   @prac, @shapes, @build, @level )
      when 'Innovate'  then new Innovate(  @prac, @shapes, @build, @level )
      when 'Encourage' then new Encourage( @prac, @shapes, @build, @level )
      else                  new Innovate(  @prac, @shapes, @build, @level )

  ready:() ->
    geo = @geom( @size.elemWidth, @size.elemHeight, @size.elemWidth, @size.elemHeight )
    @graph=null; @g=null; svgId=''; gId=''; @defs=null
    [@graph,@g,svgId,gId,@defs] = @shapes.createSvg( @elem, @prac.name, @size.elemWidth, @size.elemHeight )
    @size.lastWidth  = @size.elemWidth
    @size.lastHeight = @size.elemHeight
    @draw            = @createDraw()
    @draw.drawSvg( @g, geo, @defs )
    @htmlId = svgId
    return

  clear:() ->
    @shapes.clearSvg( @graph )
    return

  lastSize:( size ) ->
    @size.lastWidth  = size.elemWidth
    @size.lastHeight = size.elemHeight

  layout:( size, op ) ->
    # console.log( 'Connect.layout()', @prac.name, op, size );
    if op is 'Expand'  # Zoom to the entire Comp size
      geo  = @geom( size.compWidth, size.compHeight, @size.elemWidth,    @size.elemHeight )
      @shapes.layoutSvg( @graph, @g, size.compWidth,  size.compHeight,    geo.sx, geo.sy   )
    if op is 'Restore'  # @size is original while size is a reszize
      geo  = @geom( @size.lastWidth, @size.lastHeight, @size.elemWidth,  @size.elemHeight )
      @shapes.layoutSvg( @graph, @g, @size.lastWidth,  @size.lastHeight,  geo.sx, geo.sy   )
    if op is 'Resize'  # @size is original while size is a reszize
      geo  = @geom(  size.elemWidth,  size.elemHeight, @size.elemWidth,  @size.elemHeight )
      @shapes.layoutSvg( @graph, @g, @size.elemWidth,  @size.elemHeight, geo.sx, geo.sy   )
    return

  geom:( compWidth, compHeight, elemWidth, elemHeight ) ->
    g = {}
    [g.w,g.h] = [elemWidth,elemHeight]
    g.r  = Math.min( g.w, g.h ) * 0.2  # Use for hexagons
    g.x0 = g.w * 0.5
    g.y0 = g.h * 0.5
    g.sx = compWidth /g.w
    g.sy = compHeight/g.h
    g.s  = Math.min( g.sx, g.sy )
    g.scaleFont = g.h / 150
    g.iconDy    = if @level is 'Comp' then 12 else -12*g.scaleFont
    g.fontSize  = 2.0*g.scaleFont+'rem'
    g.iconSize  = 2.0*g.scaleFont+'rem'
    g.dispSize  = 0.8*g.scaleFont+'rem'
    g

  toFill:( hsv ) ->
    Vis.toRgbHsvStr( hsv )

export default Connect