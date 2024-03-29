
import * as d3  from 'd3'
import { vis  } from '../draw//Vis.js'

class SvgMgr

  constructor:( @name, @elem, @level ) ->
    @d3    = d3
    @size  = @sizeElem( @elem, @level )
    @svgId = @htmlId( @name, 'Svg',  '' )
    @gId   = @htmlId( @name, 'SvgG', '' )
    @svg   = @d3.select(@elem).append("svg:svg")
    @svg.attr("id",@svgId)
        .attr("width",@size.w)
        .attr("height",@size.h)
        .attr("xmlns","http://www.w3.org/2000/svg")
    @defs = @svg.append("svg:defs")
    @g    = @svg.append("svg:g").attr("id",@gId) # All transforms are applied to g
    window.onresize = @resize

  htmlId:( name, type, ext='' ) ->
    name + type + ext

  sizeElem:( elem, level ) ->
    sz = {}
    sz.w          = elem['clientWidth' ]
    sz.h          = elem['clientHeight']
    sz.aspect     = sz.w / sz.h
    #sz.w          = if sz.aspect > 2.0 then sz.h else sz.w
    #sz.h          = if sz.aspect < 0.5 then sz.w else sz.h
    sz.xc         = sz.w * 0.5
    sz.yc         = sz.h * 0.5
    sz.sx         = 1.0
    sz.sy         = 1.0
    sz.smin       = Math.min( sz.sx, sz.sy )
    sz.smax       = Math.max( sz.sx, sz.sy )
    sz.s          = sz.smin
    sz.r          = Math.min( sz.w,  sz.h ) * 0.2  # Used for hexagons
    sz.level      = level
    sz.scaleFont  = sz.h / 100
    sz.ringSize   = sz.w / 13 # if sz.level is 'Comp' then 24 else 6*sz.scaleFont
    sz.ringIcon   = 12.0*sz.scaleFont
    sz.iconSize   = 20.0*sz.scaleFont+'px'
    sz.bannSize   = if sz.level is 'Comp' then 11.0*sz.scaleFont+'px' else 9.0*sz.scaleFont+'px'
    sz.pracSize   = 10.0*sz.scaleFont+'px'
    sz.dispSize   =  7.0*sz.scaleFont+'px'
    sz.iconDy     = if sz.level is 'Comp' then  7.5*sz.scaleFont else 7.5*sz.scaleFont
    sz.bannDy     = if sz.level is 'Comp' then  2.0*sz.scaleFont                else 0
    sz.pracDy     = 0
    sz.dispDy     = if sz.level is 'Comp' then  0                else 0
    # console.log( 'SvgMgr.sizeElem()', sz )
    sz

  resize:() =>
    sz = @sizeElem( @elem )
    @svg.attr( "width", sz.w ).attr( "height", sz.h )
    @g.transition().attr("transform", """scale(#{sz.smin})""" )
    return

  resize2:() =>
    sz = @sizeElem( @elem )
    @svg.attr( "width", sz.w ).attr( "height", sz.h )
    trans = @g.attr("transform")
    if trans? and trans.includes("translate")
      @g.transition().attr("transform", """translate(#{sz.xc},#{sz.yc}) scale(#{sz.s})""" )
    else
      @g.transition().attr("transform", """scale(#{sz.s})""" )
    return

  toFill:( hsv ) ->
    vis.str( hsv, 'ysv' )

  clearSvg:() ->
    @svg.selectAll("*").remove()
    @svg.remove()
    return

export default SvgMgr