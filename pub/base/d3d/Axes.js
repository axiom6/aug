var Axes;

import Vis from '../../base/util/Vis.js';

Axes = class Axes {
  constructor(svgMgr) {
    this.svgMgr = svgMgr;
    this.d3 = this.svgMgr.d3;
    this.svg = this.svgMgr.svg;
    this.g = this.svgMgr.g;
    this.ready();
  }

  ready() {
    var sz;
    sz = this.svgMgr.size;
    this.margin = {
      left: 40,
      top: 40,
      right: 40,
      bottom: 40
    };
    this.width = Math.min(sz.w, sz.h) - this.margin.left - this.margin.right;
    this.height = Math.min(sz.w, sz.h) - this.margin.top - this.margin.bottom;
    this.xObj = {
      x1: 0,
      x2: 100,
      xtick1: 10,
      xtick2: 1,
      stroke1: '#AAAAAA',
      stroke2: '#666666'
    };
    this.yObj = {
      y1: 0,
      y2: 100,
      ytick1: 10,
      ytick2: 1,
      stroke1: '#AAAAAA',
      stroke2: '#666666'
    };
    this.xScale = this.createXScale(this.xObj, this.width);
    this.yScale = this.createYScale(this.yObj, this.height);
    this.axes(this.g, this.xObj, this.yObj);
    return this.grid(this.g, this.xObj, this.yObj);
  }

  axes(g, xObj, yObj) {
    this.attrG(g);
    this.bAxis = this.createBAxis(g, xObj);
    this.tAxis = this.createTAxis(g, xObj);
    this.lAxis = this.createLAxis(g, yObj);
    this.rAxis = this.createRAxis(g, yObj);
    if (this.bAxis === false && this.tAxis === false && this.lAxis === false && this.rAxis === false) {
      return {};
    }
  }

  createXScale(xObj, width) {
    return this.d3.scaleLinear().domain([xObj.x1, xObj.x2]).range([0, width]).clamp(true);
  }

  createYScale(yObj, height) {
    return this.d3.scaleLinear().domain([yObj.y1, yObj.y2]).range([height, 0]).clamp(true);
  }

  attrG(g) {
    return g.attr("style", "overflow:visible;").attr("transform", `translate(${this.margin.left},${this.margin.top})`).attr("style", "overflow:visible;");
  }

  createBAxis(g, xObj) {
    var axisBottom, ntick1;
    ntick1 = (xObj.x2 - xObj.x1) / xObj.xtick1; // ntick2 = xObj.xtick1/xObj.xtick2
    axisBottom = this.d3.axisBottom().scale(this.xScale).ticks(ntick1).tickSize(12).tickPadding(1);
    g.append("svg:g").attr("class", "axis-bottom axis").attr("stroke", '#FFFFFF').attr("transform", `translate(0,${this.height})`).call(axisBottom).selectAll('.tick line').attr("stroke", '#FFFFFF');
    return axisBottom;
  }

  createTAxis(g, xObj) {
    var axisTop, ntick1;
    ntick1 = (xObj.x2 - xObj.x1) / xObj.xtick1; //ntick2 = xObj.xtick1/xObj.xtick2
    axisTop = this.d3.axisTop().scale(this.xScale).ticks(ntick1).tickSize(12).tickPadding(1);
    g.append("svg:g").attr("class", "axis-top axis").attr("stroke", '#FFFFFF').call(axisTop).selectAll('.tick line').attr("stroke", '#FFFFFF');
    return axisTop;
  }

  createLAxis(g, yObj) {
    var axisLeft, ntick1;
    ntick1 = (yObj.y2 - yObj.y1) / yObj.ytick1; // ntick2 = ytick1/yObj.ytick2
    axisLeft = this.d3.axisLeft().scale(this.yScale).ticks(ntick1).tickSize(12).tickPadding(1);
    g.append("svg:g").attr("class", "axis-left axis").attr("stroke", '#FFFFFF').call(axisLeft).selectAll('.tick line').attr("stroke", '#FFFFFF');
    return axisLeft;
  }

  createRAxis(g, yObj) {
    var axisRight, ntick1;
    ntick1 = (yObj.y2 - yObj.y1) / yObj.ytick1; //ntick2 = ytick1/yObj.ytick2
    axisRight = this.d3.axisRight().scale(this.yScale).ticks(ntick1).tickSize(12).tickPadding(1);
    g.append("svg:g").attr("class", "axis-right axis").attr("stroke", '#FFFFFF').attr("transform", `translate(${this.width},0)`).call(axisRight).selectAll('.tick line').attr("stroke", '#FFFFFF');
    return axisRight;
  }

  grid(g, xObj, yObj) {
    var elem;
    elem = g.append("g:g");
    this.xLines(elem, xObj.x1, xObj.x2, xObj.xtick2, yObj.y1, yObj.y2, xObj.stroke2, 1);
    this.yLines(elem, yObj.y1, yObj.y2, yObj.ytick2, xObj.x1, xObj.x2, yObj.stroke2, 1);
    this.xLines(elem, xObj.x1, xObj.x2, xObj.xtick1, yObj.y1, yObj.y2, xObj.stroke1, 1);
    return this.yLines(elem, yObj.y1, yObj.y2, yObj.ytick1, xObj.x1, xObj.x2, yObj.stroke1, 1);
  }

  line(elem, x1, y1, x2, y2, stroke = "white", thick = 1, xScale = this.xScale, yScale = this.yScale) {
    return elem.append("svg:line").attr("x1", xScale(x1)).attr("y1", yScale(y1)).attr("x2", xScale(x2)).attr("y2", yScale(y2)).attr("stroke", stroke).attr("stroke-width", thick); //attr("x1",x1).attr("y1",y1).attr("x2",x2).attr("y2",y2)
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
