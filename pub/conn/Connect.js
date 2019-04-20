var Connect;

import Shapes from '../conn/Shapes';

import Embrace from '../conn/Embrace';

import Innovate from '../conn/Innovate';

import Encourage from '../conn/Encourage';

Connect = class Connect {
  constructor(stream, build, prac, size, elem) {
    this.stream = stream;
    this.build = build;
    this.prac = prac;
    this.size = size;
    this.elem = elem;
    this.shapes = new Shapes(this.stream);
    this.ready();
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
    var gId, geo, svgId;
    geo = this.geom(this.size.elemWidth, this.size.elemHeight, this.size.elemWidth, this.size.elemHeight);
    this.graph = null;
    this.g = null;
    svgId = '';
    gId = '';
    this.defs = null;
    [this.graph, this.g, svgId, gId, this.defs] = this.shapes.createSvg(this.elem, this.prac.name, this.size.elemWidth, this.size.elemHeight);
    this.draw = this.createDraw();
    this.draw.drawSvg(this.g, geo, this.defs);
    return this.htmlId = svgId;
  }

  layout(level = 'Comp') {
    var geo;
    // console.log( 'Connect.layout()', @prac, @size );
    if (level === 'Comp') { // Zoom to the entire Comp size
      geo = this.geom(this.size.compWidth, this.size.compHeight, this.size.elemWidth, this.size.elemHeight);
      this.shapes.layoutSvg(this.graph, this.g, this.size.compWidth, this.size.compHeight, geo.sx, geo.sy); // Restore to original size
    } else {
      this.shapes.layoutSvg(this.graph, this.g, this.size.elemWidth, this.size.elemHeight, 1.0, 1.0);
    }
  }

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

  toFill(hsv) {
    return Vis.toRgbHsvStr(hsv);
  }

};

export default Connect;
