var Connect;

import SvgMgr from '../../../lib/pub/base/draw/SvgMgr.js';

import Build from '../../../lib/pub/base/util/Build.js';

import Shapes from './Shapes.js';

import Embrace from './Embrace.js';

import Innovate from './Innovate.js';

import Encourage from './Encourage.js';

Connect = class Connect {
  constructor(stream, batch, prac, elem, level) {
    this.stream = stream;
    this.batch = batch;
    this.prac = prac;
    this.elem = elem;
    this.level = level;
    this.build = new Build(this.batch);
    this.shapes = new Shapes(this.stream);
    this.svgMgr = new SvgMgr(this.prac.name, this.elem, this.level);
    this.draw = this.createDraw();
    this.draw.drawSvg(this.svgMgr.g, this.svgMgr.size, this.svgMgr.defs);
  }

  createDraw() {
    switch (this.prac.column) {
      case 'Embrace':
        return new Embrace(this.prac, this.shapes, this.build, this.level);
      case 'Innovate':
        return new Innovate(this.prac, this.shapes, this.build, this.level);
      case 'Encourage':
        return new Encourage(this.prac, this.shapes, this.build, this.level);
      default:
        return new Innovate(this.prac, this.shapes, this.build, this.level);
    }
  }

  clearSvg() {
    this.svgMgr.clearSvg();
  }

  resize() {
    this.svgMgr.resize();
  }

};

export default Connect;

//# sourceMappingURL=Connect.js.map
