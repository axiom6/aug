var SvgMgr;

import * as d3 from 'd3';

import {
  vis
} from '../draw//Vis.js';

SvgMgr = class SvgMgr {
  constructor(name1, elem1, level1) {
    this.resize = this.resize.bind(this);
    this.resize2 = this.resize2.bind(this);
    this.name = name1;
    this.elem = elem1;
    this.level = level1;
    this.d3 = d3;
    this.size = this.sizeElem(this.elem, this.level);
    this.origWidth = this.size.w;
    this.origHeight = this.size.h;
    this.svgId = this.htmlId(this.name, 'Svg', '');
    this.gId = this.htmlId(this.name, 'SvgG', '');
    this.svg = this.d3.select(this.elem).append("svg:svg");
    this.svg.attr("id", this.svgId).attr("width", this.size.w).attr("height", this.size.h).attr("xmlns", "http://www.w3.org/2000/svg");
    this.defs = this.svg.append("svg:defs");
    this.g = this.svg.append("svg:g").attr("id", this.gId); // All transforms are applied to g
    window.onresize = this.resize;
  }

  htmlId(name, type, ext = '') {
    return name + type + ext;
  }

  sizeElem(elem, level) {
    var sz;
    sz = {};
    sz.w = elem['clientWidth'];
    sz.h = elem['clientHeight'];
    sz.windWidth = window['innerWidth'];
    sz.windHeight = window['innerHeight'];
    sz.xc = sz.w * 0.5;
    sz.yc = sz.h * 0.5;
    sz.sx = this.origWidth ? sz.w / this.origWidth : 1.0;
    sz.sy = this.origHeight ? sz.h / this.origHeight : 1.0;
    sz.smin = Math.min(sz.sx, sz.sy);
    sz.smax = Math.max(sz.sx, sz.sy);
    sz.s = sz.smin;
    sz.r = Math.min(sz.w, sz.h) * 0.2; // Used for hexagons
    sz.level = level;
    sz.scaleFont = sz.h / 100;
    sz.ringSize = sz.w / 13; // if sz.level is 'Comp' then 24 else 6*sz.scaleFont
    sz.ringIcon = 12.0 * sz.scaleFont;
    sz.iconSize = 20.0 * sz.scaleFont + 'px';
    sz.bannSize = sz.level === 'Comp' ? 11.0 * sz.scaleFont + 'px' : 9.0 * sz.scaleFont + 'px';
    sz.pracSize = 10.0 * sz.scaleFont + 'px';
    sz.dispSize = 7.0 * sz.scaleFont + 'px';
    sz.iconDy = sz.level === 'Comp' ? 7.5 * sz.scaleFont : 7.5 * sz.scaleFont;
    sz.bannDy = sz.level === 'Comp' ? 2.0 * sz.scaleFont : 0;
    sz.pracDy = 0;
    sz.dispDy = sz.level === 'Comp' ? 0 : 0;
    // console.log( 'SvgMgr.sizeElem()', sz )
    return sz;
  }

  resize() {
    var sz;
    sz = this.sizeElem(this.elem);
    this.svg.attr("width", sz.w).attr("height", sz.h);
    this.g.transition().attr("transform", `scale(${sz.smin})`);
  }

  resize2() {
    var sz, trans;
    sz = this.sizeElem(this.elem);
    this.svg.attr("width", sz.w).attr("height", sz.h);
    trans = this.g.attr("transform");
    if ((trans != null) && trans.includes("translate")) {
      this.g.transition().attr("transform", `translate(${sz.xc},${sz.yc}) scale(${sz.s})`);
    } else {
      this.g.transition().attr("transform", `scale(${sz.s})`);
    }
  }

  toFill(hsv) {
    return vis.str(hsv, 'ysv');
  }

  clearSvg() {
    this.svg.selectAll("*").remove();
    this.svg.remove();
  }

};

export default SvgMgr;

//# sourceMappingURL=SvgMgr.js.map
