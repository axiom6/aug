var Axes;

import Vis from '../util/Vis.js';

Axes = class Axes {
  constructor(drew, d3, name, elem1, size) {
    this.drew = drew;
    this.d3 = d3;
    this.name = name;
    this.elem = elem1;
    this.size = size;
    [this.svg, this.g] = this.drew.ready(this.name, this.elem, this.size);
    this.ready();
  }

  ready() {
    var geo;
    geo = this.drew.geomElem();
    this.margin = {
      left: 40,
      top: 40,
      right: 40,
      bottom: 40
    };
    this.width = geo.w - this.margin.left - this.margin.right;
    this.height = geo.h - this.margin.top - this.margin.bottom;
    this.xObj = {
      x1: 0,
      x2: 100,
      xtick1: 10,
      xtick2: 1
    };
    this.yObj = {
      y1: 0,
      y2: 100,
      ytick1: 10,
      ytick2: 1
    };
    this.xScale = this.createXScale(this.xObj, this.width);
    this.yScale = this.createYScale(this.yObj, this.height);
    this.xAxis = this.createXAxis(this.xObj, this.width, this.xScale);
    this.yAxis = this.createYAxis(this.yObj, this.height, this.yScale);
    this.attrG(this.g);
    this.bAxis = this.createBAxis(this.g, this.xAxis);
    this.tAxis = this.createTAxis(this.g, this.xAxis);
    this.lAxis = this.createLAxis(this.g, this.yAxis);
    this.rAxis = this.createRAxis(this.g, this.yAxis);
    if (this.bAxis === false && this.tAxis === false && this.lAxis === false && this.rAxis === false) {
      ({});
    }
    return this.grid(this.g, this.xObj, this.yObj);
  }

  //$('path.domain').hide()
  //@d3d.transform( @svg.$s, @g, geo.w/2, geo.h/2, geo.s )
  createXScale(xObj, width) {
    return this.d3.scaleLinear().domain([xObj.x1, xObj.x2]).range([0, width]).clamp(true);
  }

  createYScale(yObj, height) {
    return this.d3.scaleLinear().domain([yObj.y1, yObj.y2]).range([height, 0]).clamp(true);
  }

  createXAxis(xObj, width, xScale) {
    var ntick1, ntick2, xtick1;
    xtick1 = xObj.xtick1 != null ? xObj.xtick1 : (this.x2 - this.x1) / 10;
    ntick1 = (xObj.x2 - xObj.x1) / xObj.xtick1;
    ntick2 = xObj.xtick2 != null ? xtick1 / xObj.xtick2 : 0;
    if (ntick2 === false) {
      ({});
    }
    return this.d3.axisLeft().scale(xScale).ticks(ntick1).tickSize(12); // tickSubdivide(ntick2) .tickPadding(1)
  }

  createYAxis(yObj, height, yScale) {
    var ntick1, ntick2, ytick1;
    ytick1 = yObj.ytick1 != null ? yObj.ytick1 : (this.y2 - this.y1) / 10;
    ntick1 = (yObj.y2 - yObj.y1) / yObj.ytick1;
    ntick2 = yObj.ytick2 != null ? ytick1 / yObj.ytick2 : 0;
    if (ntick2 === false) {
      ({});
    }
    return this.d3.axisTop().scale(yScale).ticks(ntick1).tickSize(12);
  }

  attrG(g) {
    return g.attr("style", "overflow:visible;").attr("transform", `translate(${this.margin.left},${this.margin.top})`).attr("style", "overflow:visible;");
  }

  createBAxis(s) {
    return s.append("svg:g").attr("class", "axis-bottom axis").attr("stroke", '#FFFFFF').attr("transform", `translate(0,${this.height})`);
  }

  //call(xAxis.orient("bottom"))
  createTAxis(g) {
    return g.append("svg:g").attr("class", "axis-top axis").attr("stroke", '#FFFFFF');
  }

  //call(xAxis.orient("top"))
  createLAxis(g) {
    return g.append("svg:g").attr("class", "axis-left axis").attr("stroke", '#FFFFFF');
  }

  //call(yAxis.orient("left"))
  createRAxis(g) {
    return g.append("svg:g").attr("class", "axis-right axis").attr("stroke", '#FFFFFF').attr("transform", `translate(${this.width},0)`);
  }

  //call(yAxis.orient("right"))
  grid(g, xObj, yObj) {
    var elem;
    elem = g.append("g:g");
    this.xLines(elem, xObj.x1, xObj.x2, xObj.xtick2, yObj.y1, yObj.y2, '#000000', 1);
    this.yLines(elem, yObj.y1, yObj.y2, yObj.ytick2, xObj.x1, xObj.x2, '#000000', 1);
    this.xLines(elem, xObj.x1, xObj.x2, xObj.xtick1, yObj.y1, yObj.y2, '#888888', 1);
    return this.yLines(elem, yObj.y1, yObj.y2, yObj.ytick1, xObj.x1, xObj.x2, '#888888', 1);
  }

  line(elem, x1, y1, x2, y2, stroke = "white", thick = 1, xScale = this.xScale, yScale = this.yScale) {
    return elem.append("svg:line").attr("x1", xScale(x1)).attr("y1", yScale(y1)).attr("x2", xScale(x2)).attr("y2", yScale(y2)).attr("stroke", stroke).attr("stroke-width", thick);
  }

  xLines(elem, xb, xe, dx, y1, y2, stroke, thick) {
    var i, results, x, x1, x2;
    i = 1;
    x1 = Vis.floor(xb, dx);
    x2 = Vis.ceil(xe, dx);
    x = x1;
    results = [];
    while (x <= x2) {
      this.line(elem, x, y1, x, y2, stroke, thick);
      results.push(x = x1 + dx * i++);
    }
    return results;
  }

  yLines(elem, yb, ye, dy, x1, x2, stroke, thick) {
    var i, results, y, y1, y2;
    i = 1;
    y1 = Vis.floor(yb, dy);
    y2 = Vis.ceil(ye, dy);
    y = y1;
    results = [];
    while (y <= y2) {
      this.line(elem, x1, y, x2, y, stroke, thick);
      results.push(y = y1 + dy * i++);
    }
    return results;
  }

};

export default Axes;
