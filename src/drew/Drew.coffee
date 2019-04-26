
import * as d3  from '../../lib/d3/d3.5.9.0.esm.js';
import Vis      from '../util/Vis.js'
import Axes     from '../drew/Axes.js'
import Chord    from '../drew/Chord.js'
import Cluster  from '../drew/Cluster.js'
import Link     from '../drew/Link.js'
import Radar    from '../drew/Radar.js'
import Radial   from '../drew/Radial.js'
import Tree     from '../drew/Tree.js'
import Wheel    from '../drew/Wheel.js'

class Drew

  constructor:( @stream ) ->
    @size = {}

  create:( name, elem, size ) ->

    switch name
      when 'Axes'    then new Axes(    @, d3, name, elem, size )
      when 'Chord'   then new Chord(   @, d3, name, elem, size )
      when 'Cluster' then new Cluster( @, d3, name, elem, size )
      when 'Link'    then new Link(    @, d3, name, elem, size )
      when 'Radar'   then new Radar(   @, d3, name, elem, size, 'Radar'  )
      when 'Radial'  then new Radial(  @, d3, name, elem, size )
      when 'Tree'    then new Tree(    @, d3, name, elem, size )
      when 'Wheel'   then new Wheel(   @, d3, name, elem, size, 'Wheelc' )
      else
        console.error( 'Draw.create(name) unknown name', name )
        new Axes(    @ )

  ready:( name, elem, size ) ->
    @size = size
    #geo = @geom( size.elemWidth, size.elemHeight, size.elemWidth, size.elemHeight )
    @svg=null; @g=null; svgId=''; gId=''; @defs=null
    [@svg,@g,svgId,gId,@defs] = @createSvg( elem, name, size.elemWidth, size.elemHeight )
    @size.lastWidth  = size.elemWidth
    @size.lastHeight = size.elemHeight
    @htmlId = svgId
    return [@svg,@g]

  createSvg:( elem,  name, w, h ) =>
    svgId = @htmlId( name, 'Svg',  '' )
    gId   = @htmlId( name, 'SvgG', '' )
    svg   = d3.select(elem).append("svg:svg")
    svg.attr("id",svgId).attr("width",w).attr("height",h)
       .attr("xmlns","http://www.w3.org/2000/svg")
    defs   = svg.append("svg:defs")
    g      = svg.append("svg:g").attr("id",gId) # All transforms are applied to g
    [svg,g,svgId,gId,defs]

  htmlId:( name, type, ext='' ) ->
    name + type + ext

  lastSize:( size ) ->
    @size.lastWidth  = size.elemWidth
    @size.lastHeight = size.elemHeight

  layout:( size, op ) ->
    if op is 'Expand'  # Zoom to the entire Comp size
      geo  = @geom( size.compWidth, size.compHeight, @size.elemWidth,    @size.elemHeight )
      @transform( @svg, @g, size.compWidth, size.compHeight,    geo.sx, geo.sy   )
    if op is 'Restore'  # @size is original while size is a reszize
      geo  = @geom( @size.lastWidth, @size.lastHeight, @size.elemWidth,  @size.elemHeight )
      @transform( @svg, @g, @size.lastWidth, @size.lastHeight,  geo.sx, geo.sy   )
    if op is 'Resize'  # @size is original while size is a reszize
      geo  = @geom(  size.elemWidth,  size.elemHeight, @size.elemWidth,  @size.elemHeight )
      @transform( @svg, @g, @size.elemWidth,  @size.elemHeight, geo.sx, geo.sy   )
    return

  transform:( svg, g, svgWidth, svgHeight, sx, sy ) =>
    # console.log( 'Drew.transform()', svgWidth, svgHeight, sx, sy )
    svg.attr( "width", svgWidth ).attr("height", svgHeight )
    g  .attr( 'transform', Vis.scale( sx, sy ) )
    return
    
  geomElem:() ->
    @geom( @size.elemWidth, @size.elemHeight, @size.elemWidth,  @size.elemHeight )

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

  toFill:( hsv ) ->
    Vis.toRgbHsvStr( hsv )

export default Drew