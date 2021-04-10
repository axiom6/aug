
import * as d3 from 'd3'
import {sankey}  from 'd3-sankey';
import Vis     from '../../base/draw/Vis.js'

class Convey

  constructor:( @shapes, @defs, @g, @x, @y, @w, @h ) ->
    @nw = 24
    @np =  0
    @showLabel  = false
    Convey.Id++
    @shapes.gradientDef( @defs, 'WhiteBlack'+Convey.Id, 'white', 'black' )
    @gc = @g.append("g")

  doData:( graph ) =>
    @sankeyc            = @createSankeyc()
    @graph              = @sankeyc( graph )
    [@linkSvg,@nodeSvg] = @doSankey( @sankeyc, @graph  )
    return

  createSankeyc:() ->
    sankeyc = sankey().nodeWidth(@nw).nodePadding(@np).extent([[@x,@y],[@x+@w,@y+@h]])
    sankeyc.link  = @sankeyLink
    sankeyc

  sankeyLink:(d) =>
    curvature = .5
    x0 = d.source.x1
    x1 = d.target.x0
    xi = d3.interpolateNumber( x0, x1 )
    x2 = xi(curvature)
    x3 = xi(1 - curvature)
    y0 = d.y0
    y1 = d.y1 + 0.1 # 0.1 prevents a pure horizontal line that did not respond to color gradients
    'M' + x0 + ',' + y0 + 'C' + x2 + ',' + y0 + ' ' + x3 + ',' + y1 + ' ' + x1 + ',' + y1

  doSankey:( sankey, graph ) ->
    sankey.nodes(graph.nodes).links(graph.links)
    #console.log( 'Node', node ) for node in graph.nodes
    linkSvg = @doLinks( graph )
    nodeSvg = @doNodes( graph )
    [linkSvg,nodeSvg]

  # .attr( "stroke", "url(#WhiteBlack)" ).attr( "fill","none")#
  doLinks:( graph ) ->
    gLinks = @gc.append("svg:g")
    for d in graph.links
      #console.log( 'Convey.doLinks() d', d )
      id = d.source.name+d.target.name
      @shapes.gradientDef( @defs, id, d.source.color, d.target.color )
      gLink = gLinks.append("svg:g").attr( "stroke", "url(##{id})" ).attr( "fill","none")
      gLink.append("svg:path") #.attr("class", "link")
       .attr("d", @sankeyc.link(d) )
       .style("stroke-width", 1 )
       #sort( (a, b) -> (b.y1-b.y0) - (a.y1-a.y0) )
       .append("title").text( d.source.name + " → " + d.target.name )
    gLinks

  doNodes:( graph ) ->
    node = @gc.append("g").selectAll(".node")
      .data(graph.nodes).enter()
      .append("g").attr("class", "node")
      .attr("transform", (d) -> Vis.translate( d.x0,  d.y0 ) )
    node.append("rect").attr("height", (d) ->  d.y1 - d.y0 )
      .attr("width", @sankeyc.nodeWidth())
      .attr("fill",   (d) => d.color )
      .append("title").text( (d) => d.name )  #  + "\n" + d.value
    if @showLabel
      node.append("text").attr("x", -6).attr("y", (d) -> ( d.y1 - d.y0 ) / 2 )
        .attr("dy", ".35em").attr("text-anchor", "end")
        .text( (d) -> d.name )
        .filter((d) => d['x'] < @w / 2 )
        .attr("x", 6 + @sankeyc.nodeWidth())
        .attr( "text-anchor", "start" )
    node

Convey.Id = 0

export default Convey