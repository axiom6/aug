
class SvgMgr

  constructor:( @name, @elem, @size, @d3 ) ->
    @svg=null; @g=null; svgId=''; gId=''; @defs=null
    [@svg,@g,svgId,gId,@defs] = @createSvg( @elem, @name, @size.elemWidth, @size.elemHeight, @d3 )
    @size.lastWidth  = @size.elemWidth
    @size.lastHeight = @size.elemHeight

  createSvg:( elem,  name, w, h, d3 ) ->
    svgId = @htmlId( name, 'Svg',  '' )
    gId   = @htmlId( name, 'SvgG', '' )
    svg   = d3.select(elem).append("svg:svg")
    svg.attr("id",svgId)
       .attr("width",w).attr("height",h)
       .attr("xmlns","http://www.w3.org/2000/svg")
    defs   = svg.append("svg:defs")
    g      = svg.append("svg:g").attr("id",gId) # All transforms are applied to g
    [svg,g,svgId,gId,defs]

  htmlId:( name, type, ext='' ) ->
    name + type + ext

  resize:() ->
    geo = @drew.geomElem()
    w   = @width
    h   = @height
    sx  = geo.sx
    sy  = geo.sy
    sc  = Math.min( sx, sy )
    xc  = w/2
    yc  = h/2
    @svg.attr( "width", w ).attr( "height", h )
    @g.transition().attr("transform", """translate(#{xc},#{yc}) scale(#{sc})""" )
    return

  # Not called, here for reference
  geom:( compWidth, compHeight, elemWidth, elemHeight ) ->
    g = {}
    [g.w,g.h] = [elemWidth,elemHeight]
    g.r  = Math.min( g.w, g.h ) * 0.2  # Use for hexagons
    g.x0 = g.w * 0.5
    g.y0 = g.h * 0.5
    g.sx = compWidth /g.w
    g.sy = compHeight/g.h
    g.s  = Math.min( g.sx, g.sy )
    g.fontSize  = '2em' # @toVh( 5 )+'vh'
    g.iconSize  = '2em' # @toVh( 5 )+'vh'
    g


export default SvgMgr