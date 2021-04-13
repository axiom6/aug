var D3D;

import SvgMgr from '../../base/draw/SvgMgr.js';

import Wheel from './Wheel.js';

import Axes from './Axes.js';

import Chord from './Chord.js';

import Link from './Link.js';

import Radar from './Radar.js';

import Tree from './Tree.js';

import Hue from './Hue.js';

D3D = class D3D {
  static onChoice(choice, checked) {
    console.log('D3D.onChoice()', {
      choice: choice,
      checked: checked
    });
  }

  static create(name, elem, mix) {
    var svgMgr;
    svgMgr = new SvgMgr(name, elem, 'Comp');
    switch (name) {
      case 'Flavor':
        return new Wheel(svgMgr, D3D.onChoice, mix, false);
      case 'Axes':
        return new Axes(svgMgr);
      case 'Chord':
        return new Chord(svgMgr);
      case 'Link':
        return new Link(svgMgr);
      case 'Radar':
        return new Radar(svgMgr, 'Radar', mix);
      case 'Tree':
        return new Tree(svgMgr, mix);
      case 'Hue':
        return new Hue(svgMgr, 'Hue');
      default:
        console.error('Draw.create(name) unknown name', name);
        return new Axes(svgMgr);
    }
  }

};

export default D3D;
