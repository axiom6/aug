
import {vis} from '../../../lib/pub/draw/Vis.js'


class Axes

  constructor:( @svgMgr ) ->
    @d3  = @svgMgr.d3
    @svg = @svgMgr.svg
    @g   = @svgMgr.g
    @ready()

  ready:() ->
    sz = @svgMgr.size
    @margin = { left:40, top:40, right:40, bottom:40 }
    @width  = Math.min(sz.w,sz.h) - @margin.left - @margin.right
    @height = Math.min(sz.w,sz.h) - @margin.top  - @margin.bottom
    @xObj   = { x1:0, x2:100, xtick1:10, xtick2:1, stroke1:'#AAAAAA', stroke2:'#666666' }
    @yObj   = { y1:0, y2:100, ytick1:10, ytick2:1, stroke1:'#AAAAAA', stroke2:'#666666' }
    @xScale = @createXScale( @xObj, @width  )
    @yScale = @createYScale( @yObj, @height )
    @axes( @g, @xObj, @yObj )
    @grid( @g, @xObj, @yObj )

  axes:( g, xObj, yObj ) ->
    @attrG( g )
    @bAxis  = @createBAxis( g, xObj )
    @tAxis  = @createTAxis( g, xObj )
    @lAxis  = @createLAxis( g, yObj )
    @rAxis  = @createRAxis( g, yObj )
    if @bAxis is false and @tAxis is false and @lAxis is false and @rAxis is false then {}

  createXScale:( xObj, width ) ->
    @d3.scaleLinear().domain([xObj.x1,xObj.x2]).range([0,width]).clamp(true)

  createYScale:( yObj, height ) ->
    @d3.scaleLinear().domain([yObj.y1,yObj.y2]).range([height,0] ).clamp(true)

  attrG:( g ) ->
    g.attr("style","overflow:visible;")
     .attr("transform", "translate(#{@margin.left},#{@margin.top})" )
     .attr("style","overflow:visible;")

  createBAxis:( g, xObj ) ->
    ntick1 = (xObj.x2-xObj.x1) / xObj.xtick1 # ntick2 = xObj.xtick1/xObj.xtick2
    axisBottom = @d3.axisBottom().scale(@xScale).ticks(ntick1).tickSize(12).tickPadding(1)
    g.append("svg:g")
     .attr("class", "axis-bottom axis")
     .attr("stroke", '#FFFFFF')
     .attr("transform", "translate(0,#{@height})" )
     .call( axisBottom )
     .selectAll('.tick line').attr("stroke", '#FFFFFF')
    axisBottom

  createTAxis:( g, xObj ) ->
    ntick1 = (xObj.x2-xObj.x1) / xObj.xtick1 #ntick2 = xObj.xtick1/xObj.xtick2
    axisTop = @d3.axisTop().scale(@xScale).ticks(ntick1).tickSize(12).tickPadding(1)
    g.append("svg:g")
     .attr("class", "axis-top axis")
     .attr("stroke", '#FFFFFF')
     .call( axisTop )
     .selectAll('.tick line').attr("stroke", '#FFFFFF')
    axisTop

  createLAxis:( g, yObj ) ->
    ntick1 = (yObj.y2-yObj.y1) / yObj.ytick1 # ntick2 = ytick1/yObj.ytick2
    axisLeft  = @d3.axisLeft().scale(@yScale).ticks(ntick1).tickSize(12).tickPadding(1)
    g.append("svg:g")
     .attr("class", "axis-left axis")
     .attr("stroke", '#FFFFFF')
     .call( axisLeft )
     .selectAll('.tick line').attr("stroke", '#FFFFFF')
    axisLeft

  createRAxis:( g, yObj ) ->
    ntick1 = (yObj.y2-yObj.y1) / yObj.ytick1 #ntick2 = ytick1/yObj.ytick2
    axisRight  = @d3.axisRight().scale(@yScale).ticks(ntick1).tickSize(12).tickPadding(1)
    g.append("svg:g")
     .attr("class", "axis-right axis")
     .attr("stroke", '#FFFFFF')
     .attr("transform", "translate(#{@width},0)" )
     .call( axisRight )
     .selectAll('.tick line').attr("stroke", '#FFFFFF')
    axisRight

  grid:( g, xObj, yObj ) ->
    elem = g.append("g:g")
    @xLines( elem, xObj.x1, xObj.x2, xObj.xtick2, yObj.y1, yObj.y2, xObj.stroke2, 1 )
    @yLines( elem, yObj.y1, yObj.y2, yObj.ytick2, xObj.x1, xObj.x2, yObj.stroke2, 1 )
    @xLines( elem, xObj.x1, xObj.x2, xObj.xtick1, yObj.y1, yObj.y2, xObj.stroke1, 1 )
    @yLines( elem, yObj.y1, yObj.y2, yObj.ytick1, xObj.x1, xObj.x2, yObj.stroke1, 1 )

  line:( elem, x1, y1, x2, y2, stroke="white", thick=1, xScale=@xScale, yScale=@yScale ) ->
   elem.append("svg:line")   #attr("x1",x1).attr("y1",y1).attr("x2",x2).attr("y2",y2)
    .attr("x1",xScale(x1)).attr("y1",yScale(y1)).attr("x2",xScale(x2)).attr("y2",yScale(y2))
    .attr("stroke",stroke).attr("stroke-width",thick)

  xLines:( elem, xb, xe, dx, y1, y2, stroke, thick ) ->
    i  = 1
    x1 = vis.floor( xb, dx )
    x2 = vis.ceil(  xe, dx )
    x  = x1
    while( x <= x2 )
      @line( elem, x, y1, x, y2, stroke, thick )
      x = x1 + dx * i++

  yLines:( elem, yb, ye, dy, x1, x2, stroke, thick ) ->
    i  = 1
    y1 = vis.floor( yb, dy )
    y2 = vis.ceil(  ye, dy )
    y  = y1
    while( y <= y2 )
      @line( elem, x1, y, x2, y, stroke, thick )
      y = y1 + dy * i++

export default Axes