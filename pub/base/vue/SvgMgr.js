var SvgMgr;

SvgMgr = class SvgMgr {
  constructor(name1, elem1, size, d31) {
    var gId, svgId;
    this.name = name1;
    this.elem = elem1;
    this.size = size;
    this.d3 = d31;
    this.svg = null;
    this.g = null;
    svgId = '';
    gId = '';
    this.defs = null;
    [this.svg, this.g, svgId, gId, this.defs] = this.createSvg(this.elem, this.name, this.size.elemWidth, this.size.elemHeight, this.d3);
    this.size.lastWidth = this.size.elemWidth;
    this.size.lastHeight = this.size.elemHeight;
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

  resize() {
    var geo, h, sc, sx, sy, w, xc, yc;
    geo = this.drew.geomElem();
    w = this.width;
    h = this.height;
    sx = geo.sx;
    sy = geo.sy;
    sc = Math.min(sx, sy);
    xc = w / 2;
    yc = h / 2;
    this.svg.attr("width", w).attr("height", h);
    this.g.transition().attr("transform", `translate(${xc},${yc}) scale(${sc})`);
  }

  // Not called, here for reference
  geom(compWidth, compHeight, elemWidth, elemHeight) {
    var g;
    g = {};
    [g.w, g.h] = [elemWidth, elemHeight];
    g.r = Math.min(g.w, g.h) * 0.2; // Use for hexagons
    g.x0 = g.w * 0.5;
    g.y0 = g.h * 0.5;
    g.sx = compWidth / g.w;
    g.sy = compHeight / g.h;
    g.s = Math.min(g.sx, g.sy);
    g.fontSize = '2em'; // @toVh( 5 )+'vh'
    g.iconSize = '2em'; // @toVh( 5 )+'vh'
    return g;
  }

};

export default SvgMgr;
