var Chord;

import * as d3 from '../../pub/lib/d3/d3.5.9.0.esm.js';

Chord = class Chord {
  constructor() {
    this.ready = this.ready.bind(this);
  }

  ready() {
    this.matrix = [[11975, 5871, 8916, 2868], [1951, 10048, 2060, 6171], [8010, 16145, 8090, 8045], [1013, 990, 940, 6907]];
    this.range = ["#000000", "#FFDD89", "#957244", "#F26223"];
    this.svg = d3.select("svg");
    this.width = this.svg.attr("width");
    this.height = this.svg.attr("height");
    this.outer = Math.min(this.width, this.height) * 0.5 - 40;
    this.inner = this.outer - 30;
    this.format = d3.formatPrefix(",.0", 1e3);
    this.chord = d3.chord().padAngle(0.05).sortSubgroups(this.d3.descending);
    this.arc = d3.arc().innerRadius(this.inner).outerRadius(this.outer);
    this.ribbon = d3.ribbon().radius(this.inner);
    this.color = d3.scaleOrdinal().domain(d3.range(4)).range(this.range);
    this.g = this.svg.append("g").attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")").datum(this.chord(this.matrix));
    this.group = this.g.append("g").attr("class", "groups").selectAll("g").data((d) => {
      return d.groups;
    }).enter().append("g");
    this.group.append("path").style("fill", (d) => {
      return this.color(d.index);
    }).style("stroke", (d) => {
      return d3.rgb(this.color(d.index)).darker();
    }).attr("d", this.arc);
    this.groupTick = this.group.selectAll(".group-tick").data((d) => {
      return this.groupTicks(d, 1e3);
    }).enter().append("g").attr("class", "group-tick").attr("transform", (d) => {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + this.outer + ",0)";
    });
    this.groupTick.append("line").attr("x2", 6);
    this.groupTick.filter(function(d) {
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
    return this.g.append("g").attr("class", "ribbons").selectAll("path").data(function(chords) {
      return chords;
    }).enter().append("path").attr("d", this.ribbon).style("fill", (d) => {
      return this.color(d.target.index);
    }).style("stroke", (d) => {
      return d3.rgb(this.color(d.target.index)).darker();
    });
  }

  // Returns an array of tick angles and values for a given group and step.
  groupTicks(d, step) {
    var k;
    k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map(function(value) {
      return {
        value: value,
        angle: value * k + d.startAngle
      };
    });
  }

};

export default Chord;
