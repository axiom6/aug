
import * as d3  from '../../../pub/lib/d3/d3.5.9.0.esm.js'
import Vis      from '../../base/util/Vis.js'

class SvgMgr

  constructor:( @name, @elem, @stream=null ) ->
    @d3    = d3
    @level = 'Prac'
    @size  = @sizeElem( @elem )
    @origWidth  = @size.w
    @origHeight = @size.h
    @svgId = @htmlId( @name, 'Svg',  '' )
    @gId   = @htmlId( @name, 'SvgG', '' )
    @svg   = @d3.select(@elem).append("svg:svg")
    @svg.attr("id",@svgId)
        .attr("width",@size.w).attr("height",@size.h)
        .attr("xmlns","http://www.w3.org/2000/svg")
    @defs = @svg.append("svg:defs")
    @g    = @svg.append("svg:g").attr("id",@gId) # All transforms are applied to g
    window.onresize = @resize

  htmlId:( name, type, ext='' ) ->
    name + type + ext

  sizeElem:( elem ) ->
    sz = {}
    sz.w          =   elem['clientWidth' ]
    sz.h          =   elem['clientHeight']
    sz.windWidth  = window['innerWidth' ]
    sz.windHeight = window['innerHeight']
    sz.xc = sz.w * 0.5
    sz.yc = sz.h * 0.5
    sz.sx = if @origWidth  then sz.w / @origWidth  else 1.0
    sz.sy = if @origHeight then sz.h / @origHeight else 1.0
    sz.s  = Math.min( sz.sx, sz.sy )
    sz.r  = Math.min( sz.w,  sz.h ) * 0.2  # Used for hexagons
    sz.scaleFont = sz.h / 150
    sz.fontSize  = 2.0*sz.scaleFont+'rem' # '2em' @toVh( 5 )+'vh'
    sz.iconSize  = 2.0*sz.scaleFont+'rem' # '2em' @toVh( 5 )+'vh'
    sz.dispSize  = 0.8*sz.scaleFont+'rem'
    sz.iconDy    = if @level is 'Comp' then 12 else -12*sz.scaleFont
    console.log( 'SvgMgr.sizeElem()', sz )
    @size = sz
    sz

  resize2:() =>
    sz = @sizeElem( @elem )
    @svg.attr( "width", sz.w ).attr( "height", sz.h )
    @g.transition().attr("transform", """scale(#{sz.s})""" )
    return

  resize:() =>
    sz = @sizeElem( @elem )
    @svg.attr( "width", sz.w ).attr( "height", sz.h )
    trans = @g.attr("transform")
    if trans? and trans.includes("translate")
      @g.transition().attr("transform", """translate(#{sz.xc},#{sz.yc}) scale(#{sz.s})""" )
    else
      @g.transition().attr("transform", """scale(#{sz.s})""" )
    return

  toFill:( hsv ) ->
    Vis.toRgbHsvStr( hsv )

  clearSvg:() ->
    @svg.selectAll("*").remove()
    @svg.remove()
    return

export default SvgMgr