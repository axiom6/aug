var Drew;

import * as d3 from '../../../pub/lib/d3/d3.5.9.0.esm.js';

import Vis from '../../base/util/Vis.js';

import Wheel from './Wheel.js';

import Axes from './Axes.js';

import Chord from './Chord.js';

import Link from './Link.js';

import Radar from './Radar.js';

import Tree from './Tree.js';

import Hue from './Hue.js';

Drew = class Drew {
  constructor(stream, drewElem, drewSize) {
    this.transform = this.transform.bind(this);
    this.stream = stream;
    this.drewElem = drewElem;
    this.drewSize = drewSize;
    this.size = this.drewSize;
  }

  create(name, elem, size) {
    switch (name) {
      case 'Wheel':
        return new Wheel(this, d3, name, elem, size);
      case 'Axes':
        return new Axes(this, d3, name, elem, size);
      case 'Chord':
        return new Chord(this, d3, name, elem, size);
      case 'Cluster':
        return new Cluster(this, d3, name, elem, size);
      case 'Link':
        return new Link(this, d3, name, elem, size);
      case 'Radar':
        return new Radar(this, d3, name, elem, size, 'Radar');
      case 'Radial':
        return new Radial(this, d3, name, elem, size);
      case 'Tree':
        return new Tree(this, d3, name, elem, size);
      case 'Hue':
        return new Hue(this, d3, name, elem, size, 'Hue');
      default:
        console.error('Draw.create(name) unknown name', name);
        return new Axes(this, d3, name, elem, size);
    }
  }

  ready(name, elem, size) {
    var gId, svgId;
    this.size = size;
    //geo = @geom( size.elemWidth, size.elemHeight, size.elemWidth, size.elemHeight )
    this.svg = null;
    this.g = null;
    svgId = '';
    gId = '';
    this.defs = null;
    [this.svg, this.g, svgId, gId, this.defs] = this.createSvg(elem, name, size.elemWidth, size.elemHeight);
    this.size.lastWidth = size.elemWidth;
    this.size.lastHeight = size.elemHeight;
    return [this.svg, this.g];
  }

  createSvg(elem, name, w, h) {
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

  lastSize(size) {
    this.size.lastWidth = size.elemWidth;
    return this.size.lastHeight = size.elemHeight;
  }

  layout(size, op, name) {
    var geo;
    this.size = size;
    if (op === 'Expand') { // Zoom to the entire Comp size
      geo = this.geom(size.compWidth, size.compHeight, this.size.elemWidth, this.size.elemHeight);
      this.transform(this.svg, this.g, size.compWidth, size.compHeight, geo, name);
    }
    if (op === 'Restore') { // @size is original while size is a reszize
      geo = this.geom(this.size.lastWidth, this.size.lastHeight, this.size.elemWidth, this.size.elemHeight);
      this.transform(this.svg, this.g, this.size.lastWidth, this.size.lastHeight, geo, name);
    }
    if (op === 'Resize') { // @size is original while size is a reszize
      geo = this.geom(size.elemWidth, size.elemHeight, this.size.elemWidth, this.size.elemHeight);
      this.transform(this.svg, this.g, this.size.elemWidth, this.size.elemHeight, geo, name);
    }
  }

  transform(svg, g, svgWidth, svgHeight, geo, name) {
    // console.log( 'Drew.transform()', svgWidth, svgHeight, geo )
    svg.attr("width", svgWidth).attr("height", svgHeight);
    console.log('Drew', name);
    if (name === 'Chord' || 'Tree') {
      g.attr('transform', Vis.translateScale(geo.x0, geo.y0, geo.sx, geo.sy));
    } else {
      g.attr('transform', Vis.scale(geo.sx, geo.sy));
    }
  }

  geomElem() {
    return this.geom(this.size.elemWidth, this.size.elemHeight, this.size.elemWidth, this.size.elemHeight);
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

export default Drew;