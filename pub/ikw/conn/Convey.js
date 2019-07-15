var Convey;

import * as d3 from '../../../pub/lib/d3/d3.5.9.0.esm.js';

import Sankey from '../../../pub/lib/d3/d3-sankey.esm.js';

import Vis from '../../base/util/Vis.js';

Convey = class Convey {
  constructor(shapes, defs, g, x, y, w, h) {
    this.doData = this.doData.bind(this);
    this.sankeyLink = this.sankeyLink.bind(this);
    this.shapes = shapes;
    this.defs = defs;
    this.g = g;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.nw = 24;
    this.np = 0;
    this.showLabel = false;
    Convey.Id++;
    this.shapes.gradientDef(this.defs, 'WhiteBlack' + Convey.Id, 'white', 'black');
    this.gc = this.g.append("g");
  }

  doData(graph) {
    this.sankeyc = this.createSankeyc();
    this.graph = this.sankeyc(graph);
    [this.linkSvg, this.nodeSvg] = this.doSankey(this.sankeyc, this.graph);
  }

  createSankeyc() {
    var sankeyc;
    sankeyc = Sankey().nodeWidth(this.nw).nodePadding(this.np).extent([[this.x, this.y], [this.x + this.w, this.y + this.h]]);
    sankeyc.link = this.sankeyLink;
    return sankeyc;
  }

  sankeyLink(d) {
    var curvature, x0, x1, x2, x3, xi, y0, y1;
    curvature = .5;
    x0 = d.source.x1;
    x1 = d.target.x0;
    xi = d3.interpolateNumber(x0, x1);
    x2 = xi(curvature);
    x3 = xi(1 - curvature);
    y0 = d.y0;
    y1 = d.y1 + 0.1; // 0.1 prevents a pure horizontal line that did not respond to color gradients
    return 'M' + x0 + ',' + y0 + 'C' + x2 + ',' + y0 + ' ' + x3 + ',' + y1 + ' ' + x1 + ',' + y1;
  }

  doSankey(sankey, graph) {
    var linkSvg, nodeSvg;
    sankey.nodes(graph.nodes).links(graph.links);
    //console.log( 'Node', node ) for node in graph.nodes
    linkSvg = this.doLinks(graph);
    nodeSvg = this.doNodes(graph);
    return [linkSvg, nodeSvg];
  }

  // .attr( "stroke", "url(#WhiteBlack)" ).attr( "fill","none")#
  doLinks(graph) {
    var d, gLink, gLinks, i, id, len, ref;
    gLinks = this.gc.append("svg:g");
    ref = graph.links;
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      //console.log( 'Convey.doLinks() d', d )
      id = d.source.name + d.target.name;
      this.shapes.gradientDef(this.defs, id, d.source.color, d.target.color);
      gLink = gLinks.append("svg:g").attr("stroke", `url(#${id})`).attr("fill", "none");
      //sort( (a, b) -> (b.y1-b.y0) - (a.y1-a.y0) )
      gLink.append("svg:path").attr("d", this.sankeyc.link(d)).style("stroke-width", 1).append("title").text(d.source.name + " → " + d.target.name); //.attr("class", "link")
    }
    return gLinks;
  }

  doNodes(graph) {
    var node;
    node = this.gc.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
      return Vis.translate(d.x0, d.y0);
    });
    node.append("rect").attr("height", function(d) {
      return d.y1 - d.y0;
    }).attr("width", this.sankeyc.nodeWidth()).attr("fill", (d) => {
      return d.color;
    }).append("title").text((d) => {
      return d.name; //  + "\n" + d.value
    });
    if (this.showLabel) {
      node.append("text").attr("x", -6).attr("y", function(d) {
        return (d.y1 - d.y0) / 2;
      }).attr("dy", ".35em").attr("text-anchor", "end").text(function(d) {
        return d.name;
      }).filter((d) => {
        return d['x'] < this.w / 2;
      }).attr("x", 6 + this.sankeyc.nodeWidth()).attr("text-anchor", "start");
    }
    return node;
  }

};

Convey.Id = 0;

export default Convey;
