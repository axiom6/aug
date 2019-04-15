var Connect;

import Shapes from '../conn/Shapes';

import Embrace from '../conn/Embrace';

import Innovate from '../conn/Innovate';

import Encourage from '../conn/Encourage';

Connect = class Connect {
  constructor(stream, build, prac, size) {
    this.stream = stream;
    this.build = build;
    this.prac = prac;
    this.size = size;
    this.shapes = new Shapes(this.stream);
  }

  createDraw() {
    switch (this.prac.column) {
      case 'Embrace':
        return new Embrace(this.prac, this.shapes, this.build);
      case 'Innovate':
        return new Innovate(this.prac, this.shapes, this.build);
      case 'Encourage':
        return new Encourage(this.prac, this.shapes, this.build);
      default:
        return new Innovate(this.prac, this.shapes, this.build);
    }
  }

  ready() {
    var gId, svgId;
    this.geom = this.geom(this.size.width, this.size.height, this.size.width, this.size.height);
    this.graph = null;
    this.g = null;
    svgId = '';
    gId = '';
    this.defs = null;
    [this.graph, this.g, svgId, gId, this.defs] = this.shapes.createSvg(this.prac.name, this.htmlId, this.width, this.height);
    this.draw = this.createDraw();
    this.draw.drawSvg(this.g, this.geom, this.defs);
    return this.htmlId = svgId;
  }

  layout() {
    var geom;
    geom = this.geom(this.size.fullWidth, this.size.fullHeight, this.size.width, this.size.height);
    this.shapes.layout(this.graph, this.g, geom.w, geom.h, geom.sx, geom.sy);
  }

  geom(width, height, wgpx, hgpx) {
    var g;
    g = {};
    [g.w, g.h] = [width, height];
    g.r = Math.min(g.w, g.h) * 0.2; // Use for hexagons
    g.x0 = g.w * 0.5;
    g.y0 = g.h * 0.5;
    g.sx = g.w / wgpx;
    g.sy = g.h / hgpx;
    g.s = Math.min(g.sx, g.sy);
    g.fontSize = this.toVh(5) + 'vh';
    g.iconSize = this.toVh(5) + 'vh';
    // console.log( "Connect.geom()", { wgpx:wgpx, hgpx:hgpx }, g )
    return g;
  }

  toFill(hsv) {
    return Vis.toRgbHsvStr(hsv);
  }

};

export default Connect;
