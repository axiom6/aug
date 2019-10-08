var D3D;

import SvgMgr from '../base/SvgMgr.js';

import Wheel from './Wheel.js';

import Axes from './Axes.js';

import Chord from './Chord.js';

import Link from './Link.js';

import Radar from './Radar.js';

import Tree from './Tree.js';

import Hue from './Hue.js';

D3D = class D3D {
  constructor(stream) {
    this.stream = stream;
  }

  create(name, elem) {
    var svgMgr;
    svgMgr = new SvgMgr(name, elem, 'Comp', this.stream);
    switch (name) {
      case 'Wheel':
        return new Wheel(svgMgr);
      case 'Axes':
        return new Axes(svgMgr);
      case 'Chord':
        return new Chord(svgMgr);
      case 'Link':
        return new Link(svgMgr);
      case 'Radar':
        return new Radar(svgMgr, 'Radar');
      case 'Tree':
        return new Tree(svgMgr);
      case 'Hue':
        return new Hue(svgMgr, 'Hue');
      default:
        console.error('Draw.create(name) unknown name', name);
        return new Axes(svgMgr);
    }
  }

};

export default D3D;
