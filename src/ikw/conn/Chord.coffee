
import * as d3 from '../../../lib/d3/d3.5.9.0.esm.js';

class Chord

  constructor:() ->

  ready:() =>

    @matrix = [
      [11975,  5871, 8916, 2868],
      [ 1951, 10048, 2060, 6171],
      [ 8010, 16145, 8090, 8045],
      [ 1013,   990,  940, 6907] ]

    @range  = ["#000000", "#FFDD89", "#957244", "#F26223"]

    @svg    = d3.select("svg")
    @width  = @svg.attr("width")
    @height = @svg.attr("height")
    @outer  = Math.min( @width, @height) * 0.5 - 40
    @inner  = @outer - 30
    @format = d3.formatPrefix(",.0", 1e3)
    @chord  = d3.chord().padAngle(0.05).sortSubgroups(@d3.descending)
    @arc    = d3.arc().innerRadius(@inner).outerRadius(@outer)
    @ribbon = d3.ribbon().radius(@inner)
    @color  = d3.scaleOrdinal().domain( d3.range(4) ).range(@range)
    @g      = @svg.append("g").attr("transform", "translate(" + @width / 2 + "," + @height / 2 + ")").datum(@chord(@matrix))

    @group  = @g.append("g")
      .attr("class", "groups")
      .selectAll("g")
      .data( (d) => d.groups )
      .enter().append("g")

    @group.append("path")
      .style("fill",   (d) => @color(d.index) )
      .style("stroke", (d) => d3.rgb( @color(d.index)).darker() )
      .attr("d", @arc )

    @groupTick = @group.selectAll(".group-tick")
      .data(  (d) => @groupTicks(d, 1e3) )
      .enter().append("g")
      .attr("class", "group-tick")
      .attr("transform", (d) => "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + @outer + ",0)" )

    @groupTick.append("line").attr("x2", 6)

    @groupTick
      .filter(              (d) -> d.value % 5e3 is 0 ).append("text").attr("x", 8).attr("dy", ".35em")
      .attr("transform",    (d) -> ( if d.angle > Math.PI then "rotate(180) translate(-16)" else null ) )
      .style("text-anchor", (d) -> ( if d.angle > Math.PI then "end" else null ) )
      .text( (d) => @format(d.value) )

    @g.append("g")
      .attr("class", "ribbons")
      .selectAll("path")
      .data( (chords) -> chords )
      .enter().append("path")
      .attr("d", @ribbon )
      .style("fill",   (d) => @color(d.target.index) )
      .style("stroke", (d) => d3.rgb( @color(d.target.index)).darker() )

  # Returns an array of tick angles and values for a given group and step.
  groupTicks:( d, step) ->
    k = ( d.endAngle - d.startAngle) / d.value
    d3.range( 0, d.value, step).map( (value) -> { value: value, angle: value * k + d.startAngle } )

`export default Chord`

