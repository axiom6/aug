var Connect;

import Vis from '../../base/util/Vis';

import Shapes from './Shapes';

import Embrace from './Embrace';

import Innovate from './Innovate';

import Encourage from './Encourage';

Connect = class Connect {
  constructor(stream, build, prac, elem, size1) {
    this.stream = stream;
    this.build = build;
    this.prac = prac;
    this.elem = elem;
    this.size = size1;
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
    this.size.lastWidth = this.size.elemWidth;
    this.size.lastHeight = this.size.elemHeight;
    this.draw = this.createDraw();
    this.draw.drawSvg(this.g, geo, this.defs);
    this.htmlId = svgId;
  }

  clear() {
    this.shapes.clearSvg(this.graph);
  }

  lastSize(size) {
    this.size.lastWidth = size.elemWidth;
    return this.size.lastHeight = size.elemHeight;
  }

  layout(size, op) {
    var geo;
    // console.log( 'Connect.layout()', @prac.name, op, size );
    if (op === 'Expand') { // Zoom to the entire Comp size
      geo = this.geom(size.compWidth, size.compHeight, this.size.elemWidth, this.size.elemHeight);
      this.shapes.layoutSvg(this.graph, this.g, size.compWidth, size.compHeight, geo.sx, geo.sy);
    }
    if (op === 'Restore') { // @size is original while size is a reszize
      geo = this.geom(this.size.lastWidth, this.size.lastHeight, this.size.elemWidth, this.size.elemHeight);
      this.shapes.layoutSvg(this.graph, this.g, this.size.lastWidth, this.size.lastHeight, geo.sx, geo.sy);
    }
    if (op === 'Resize') { // @size is original while size is a reszize
      geo = this.geom(size.elemWidth, size.elemHeight, this.size.elemWidth, this.size.elemHeight);
      this.shapes.layoutSvg(this.graph, this.g, this.size.elemWidth, this.size.elemHeight, geo.sx, geo.sy);
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
    g.scaleFont = g.h / 150;
    g.fontSize = 2.0 * g.scaleFont + 'rem';
    g.iconSize = 2.0 * g.scaleFont + 'rem';
    g.dispSize = 0.8 * g.scaleFont + 'rem';
    return g;
  }

  toFill(hsv) {
    return Vis.toRgbHsvStr(hsv);
  }

};

export default Connect;
