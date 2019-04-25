
import Data from '../util/Data.js'

class Cluster

  constructor:( @drew, @d3 ) ->
    @ready()

  ready:() ->
    geo    = @drew.geomElem()
    @graph = @drew.svg
    @g     = @graph.g
    @w     = geo.w
    @h     = geo.h
    @tree  = @d3.cluster()
    @tree.size([@h*0.6,@w*0.75])
    Data.asynJSON( 'draw/Prin.json', (data) => @doCluster(data,@g) )

    @graph.$svg

  doCluster:( data, g ) =>
    if g is false then {}
    @root = @d3.hierarchy( data )
    @tree(  @root )
    #@sort( @root )
    @tree(  @root )
    @doLink()
    @doNode()
    return

  sort:( root ) ->
    root.sort(  (a, b) -> (a.height - b.height) || a.id.localeCompare(b.id) )
    return

  doLink:() ->
    link = @g.selectAll(".link")
      .data(@root.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", (d) => @moveTo(d) )
    if link is false then {}

  moveTo:(d) ->
    p = d.parent
    """M#{d.y},#{d.x}C#{p.y+100},#{d.x} #{p.y+100},#{p.x} #{p.y},#{p.x}"""

  doNode:() ->
    node = @g.selectAll(".node")
      .data(@root.descendants())
      .enter().append("g")
      .attr("class",     (d) -> "node" + (d.children ? " node--internal" : " node--leaf") )
      .attr("transform", (d) -> "translate(" + d.y + "," + d.x + ")" )
    node.append("circle").attr("r", 5.0)
    node.append("svg:text")
      .attr("dy", 3 )
      .attr("x",  (d) -> if d.children? then -8 else 8 )
      .attr("y",  3 )
      .text(      (d) -> d.name )
      .attr("stroke", "yellow" )
      .style("text-anchor", (d) -> if d.children? then "end" else "start" )
      #text(                (d) -> d.name.substring(d.name.lastIndexOf(".") + 1) )

export default Cluster