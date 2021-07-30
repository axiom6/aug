var D3D;

import Choice from '../../../lib/pub/navi/Choice.js';

import SvgMgr from '../../../lib/pub/draw/SvgMgr.js';

import Wheel from './Wheel.js';

import Axes from './Axes.js';

import Chord from './Chord.js';

import Link from './Link.js';

import Radar from './Radar.js';

import Tree from './Tree.js';

import Hue from './Hue.js';

D3D = class D3D {
  static create(name, elem, nav) {
    var choice, svgMgr;
    choice = new Choice(nav);
    svgMgr = new SvgMgr(name, elem, 'Comp');
    switch (name) {
      case 'Flavor':
        return new Wheel(svgMgr, choice, false);
      case 'Axes':
        return new Axes(svgMgr);
      case 'Chord':
        return new Chord(svgMgr);
      case 'Link':
        return new Link(svgMgr);
      case 'Radar':
        return new Radar(svgMgr, 'Radar', nav);
      case 'Tree':
        return new Tree(svgMgr, nav);
      case 'Hue':
        return new Hue(svgMgr, 'Hue');
      default:
        console.error('Draw.create(name) unknown name', name);
        return new Axes(svgMgr);
    }
  }

};

export default D3D;

//# sourceMappingURL=D3D.js.map
