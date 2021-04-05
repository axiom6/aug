var Chord;

Chord = class Chord {
  constructor(svgMgr) {
    this.ready = this.ready.bind(this);
    this.svgMgr = svgMgr;
    this.d3 = this.svgMgr.d3;
    this.svg = this.svgMgr.svg;
    this.g = this.svgMgr.g;
    this.matrix = [[0, 20, 20, 20], [20, 0, 20, 80], [20, 20, 0, 20], [20, 80, 20, 0]];
    this.range = ["#FF0000", "#00FF00", "#0000FF", "#888888"];
    this.ready();
  }

  ready() {
    this.graph = this.svgMgr.g;
    this.width = this.svgMgr.size.w;
    this.height = this.svgMgr.size.h;
    this.outer = Math.min(this.width, this.height) * 0.5 - 40;
    this.inner = this.outer - 30;
    this.format = this.d3.formatPrefix(",.0", 1e3);
    this.chord = this.createChord();
    this.arc = this.createArc(this.inner, this.outer);
    this.ribbon = this.createRibbon(this.inner);
    this.color = this.createColor(this.range);
    this.g.datum(this.chord(this.matrix));
    this.g.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
    this.group = this.createGroup(this.arc);
    this.ticks = this.createTicks(this.group, this.outer);
    this.appendRibbons(this.g, this.ribbon);
  }

  createChord() {
    return this.d3.chord().padAngle(0.05).sortSubgroups(this.d3.descending);
  }

  createArc(inner, outer) {
    return this.d3.arc().innerRadius(inner).outerRadius(outer);
  }

  createRibbon(inner) {
    return this.d3.ribbon().radius(inner);
  }

  createColor(range) {
    return this.d3.scaleOrdinal().domain(this.d3.range(4)).range(range);
  }

  createGroup(arc) {
    var group;
    group = this.g.append("g").attr("class", "groups").selectAll("g").data((d) => {
      return d.groups;
    }).enter().append("g");
    return group.append("path").style("fill", (d) => {
      return this.color(d.index);
    }).style("stroke", (d) => {
      return this.d3.rgb(this.color(d.index)).darker();
    }).attr("d", arc);
  }

  createTicks(group, outer) {
    var ticks;
    ticks = group.selectAll(".group-tick").data((d) => {
      return this.groupTicks(d, 1e3);
    }).enter().append("g").attr("class", "group-tick").attr("transform", (d) => {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outer + ",0)";
    });
    ticks.append("line").attr("x2", 6);
    ticks.filter(function(d) {
      return d.value % 5e3 === 0;
    }).append("text").attr("x", 8).attr("dy", ".35em").attr("transform", function(d) {
      if (d.angle > Math.PI) {
        return "rotate(180) translate(-16)";
      } else {
        return null;
      }
    }).style("text-anchor", function(d) {
      if (d.angle > Math.PI) {
        return "end";
      } else {
        return null;
      }
    }).text((d) => {
      return this.format(d.value);
    });
    return ticks;
  }

  appendRibbons(g, ribbon) {
    return g.append("g").attr("class", "ribbons").selectAll("path").data(function(chords) {
      return chords;
    }).enter().append("path").attr("d", ribbon).style("fill", (d) => {
      return this.color(d.target.index);
    }).style("stroke", (d) => {
      return this.d3.rgb(this.color(d.target.index)).darker();
    });
  }

  // Returns an array of tick angles and values for a given group and step.
  groupTicks(d, step) {
    var k;
    k = (d.endAngle - d.startAngle) / d.value;
    return this.d3.range(0, d.value, step).map(function(value) {
      return {
        value: value,
        angle: value * k + d.startAngle
      };
    });
  }

};

/*

xcreateFill:(  range  ) ->
  d3.scaleOrdinal().domain( d3.range(4) ).range( range )

xcreateGroups:() =>
  groups = @g.append("g").selectAll("path").data( (d) => d.groups ).enter().append("path") #
    .style("fill",   (d) => @fill( d.index ) )
    .style("stroke", (d) => @fill( d.index ) )
  groups.attr( "d", d3.arc().innerRadius(@inner).outerRadius(@outer) )
  groups.on( "mouseover", @fade(.1) ).on( "mouseout", @fade(1) )
  groups

xupdateChords:() ->
  chords = @g.append("g").attr("class", "chord").selectAll("path").datam( @chords(@matrix) ).enter().append("path")
    .attr(  "d", d3.chord().radius(@inner))
    .style( "fill", (d) => @fill( d.target.index ) )
    .style( "opacity", 1 )
  chords

 * Returns an array of tick angles and labels, given a group.
xcreateTicks:() ->
  ticks =  @g.append("g").selectAll("g").data( @chord.groups )
  ticks.enter().append("g").selectAll("g").data( @groupTicks   )
  #ticks.enter().append("g").attr("transform", (d) => "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + @outer + ",0)" )
  ticks.append("line").attr("x1", 1).attr("y1", 0).attr("x2", 5).attr("y2", 0).style( "stroke", "#000" )
  ticks.append("text").attr("x",  8).attr("dy", ".35em")
   .attr( "transform", (d) -> ( if d.angle > Math.PI then "rotate(180)translate(-16)" else null ) )
  ticks.style("text-anchor", (d) => ( if d.angle > Math.PI then "end" else null) )
  ticks.text( (d) => d.label )
  ticks

xgroupTicks: (d) ->
  k = (d.endAngle - d.startAngle) / d.value
  range = d3.range(0, d.value, 1000).map( (v,i) => { angle: v * k + d.startAngle, label: (if i % 5 then null else v / 1000 + "k") } )
  #console.log( 'groupTicks', d, k )
  range

 * Returns an event handler for fading a given chord group.
xfade: (opacity) =>
  (i) =>
      @g.selectAll(".chord path").filter( (d) =>
        d.source.index isnt i and d.target.index isnt i ).transition().style( "opacity", opacity )

 */
export default Chord;
