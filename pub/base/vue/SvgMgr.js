var SvgMgr;

SvgMgr = class SvgMgr {
  constructor(name1, elem1, d31) {
    var gId, svgId;
    this.name = name1;
    this.elem = elem1;
    this.d3 = d31;
    this.size = this.sizeElem(this.elem);
    this.svg = null;
    this.g = null;
    svgId = '';
    gId = '';
    this.defs = null;
    [this.svg, this.g, svgId, gId, this.defs] = this.createSvg(this.elem, this.name, this.size.w, this.size.h, this.d3);
  }

  createSvg(elem, name, w, h, d3) {
    var defs, g, gId, svg, svgId;
    svgId = this.htmlId(name, 'Svg', '');
    gId = this.htmlId(name, 'SvgG', '');
    svg = d3.select(elem).append("svg:svg");
    svg.attr("id", svgId).attr("width", w).attr("height", h).attr("xmlns", "http://www.w3.org/2000/svg");
    defs = svg.append("svg:defs");
    g = svg.append("svg:g").attr("id", gId); // All transforms are applied to g
    return [svg, g, svgId, gId, defs];
  }

  htmlId(name, type, ext = '') {
    return name + type + ext;
  }

  sizeElem(elem) {
    var sz;
    sz = {};
    sz.w = elem['clientWidth'];
    sz.h = elem['clientHeight'];
    sz.windWidth = window['clientWidth'];
    sz.windHeight = window['clientHeight'];
    sz.xc = sz.w * 0.5;
    sz.yc = sz.h * 0.5;
    sz.sx = this.size.lastWidth != null ? sz.w / this.size.lastWidth : 1.0;
    sz.sy = this.size.lastHeight != null ? sz.h / this.size.lastHeight : 1.0;
    sz.s = Math.min(sz.sx, sz.sy);
    sz.r = Math.min(sz.w, sz.h) * 0.2; // Used for hexagons
    sz.fontSize = '2em'; // @toVh( 5 )+'vh'
    sz.iconSize = '2em'; // @toVh( 5 )+'vh'
    sz.lastWidth = sz.w;
    sz.lastHeight = sz.h;
    this.size = sz;
    return sz;
  }

  resize() {
    var sz;
    sz = this.sizeElem(this.elem);
    this.svg.attr("width", sz.w).attr("height", sz.h);
    this.g.transition().attr("transform", `translate(${sz.xc},${sz.yc}) scale(${sz.sc})`);
  }

};

export default SvgMgr;
