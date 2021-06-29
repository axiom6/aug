var Box;

import Vis from '../../../lib/pub/base/draw/Vis.js';

import MBox from './MBox.js';

import Coord from './Coord.js';

import Color from './Color.js';

import MRegress from './Regress.js';

Box = class Box {
  static doApp(name, elem) {
    switch (name) {
      case 'Color':
        Box.doColor(elem);
        break;
      case 'Rgbs':
        Box.doRgbs(elem);
        break;
      case 'Polar':
        Box.doPolar(elem);
        break;
      case 'Vecs':
        Box.doVecs(elem, 'hsv');
        break;
      case 'Sphere':
        Box.doSphere(elem);
        break;
      case 'Regress':
        Box.doRegress(elem);
        break;
      default:
        Box.doColor(elem);
    }
  }

  static doRgbs(elem) {
    var coord, mbox, view;
    mbox = new MBox(elem);
    coord = new Coord(mbox, 11, 11, 11);
    view = coord.cartesian();
    return coord.cartArray(view);
  }

  static doColor(elem) {
    var coord, mbox, view;
    mbox = new MBox(elem);
    coord = new Coord(mbox, 8, 20, 20);
    view = coord.polar();
    coord.cylVolume(view, Vis.rgba);
    return coord.cylSurface(view, Vis.rgba, mbox.sin06F);
  }

  static doRegress(elem) {
    var mbox, regress;
    mbox = new MBox(elem);
    regress = new MRegress(mbox);
    return regress.viewLinearRegress();
  }

  static doSphere(elem) {
    var coord, mbox, view;
    mbox = new MBox(elem);
    coord = new Coord(mbox, 12, 60, 10);
    view = coord.sphere();
    return coord.sphVolume(view, Vis.sphere);
  }

  static doHcs(elem) {
    var color, coord, mbox, view;
    mbox = new MBox(elem);
    coord = new Coord(mbox, 12, 10, 10);
    color = new Color(mbox);
    view = coord.polar();
    color.genWithHcs(coord, view);
    return coord.cylSurface(view, Vis.rgba, mbox.sin06F);
  }

  static doVecs(elem, see) {
    var color, coord, mbox, view;
    mbox = new MBox(elem);
    coord = new Coord(mbox, 12, 9, 9);
    color = new Color(mbox);
    view = coord.polar();
    return color.genWithVecsRgb(coord, view, see);
  }

  static doPolar(elem) {
    var color, coord, mbox, view;
    mbox = new MBox(elem);
    coord = new Coord(mbox, 12, 9, 9);
    color = new Color(mbox);
    view = coord.polar();
    return color.genPolarRgbs(coord, view, false);
  }

  static doScaleRgb(elem) {
    var color, coord, mbox, view;
    mbox = new MBox(elem);
    coord = new Coord(mbox, 12, 9, 9);
    color = new Color(mbox);
    view = coord.polar();
    return color.genPolarRgbs(coord, view, true);
  }

  static doRgbHcv() {
    var c, hue, i, j, len, len1, ref, ref1, results, s;
    s = 100;
    c = 100;
    ref = [0, 60, 120, 180, 240, 300];
    for (i = 0, len = ref.length; i < len; i++) {
      hue = ref[i];
      console.log('RgbHsv', {
        hue: hue,
        c: c,
        s: s
      }, Vis.rgba([hue, c, s]));
    }
    ref1 = [0, 60, 120, 180, 240, 300];
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      hue = ref1[j];
      results.push((function() {
        var k, len2, ref2, results1;
        ref2 = [0, 20, 40, 60, 80, 100];
        results1 = [];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          c = ref2[k];
          results1.push(console.log('RgbHsv', {
            hue: hue,
            c: c,
            s: s
          }, Vis.rgba([hue, c, s])));
        }
        return results1;
      })());
    }
    return results;
  }

};

/*
@init = () ->
  Vis.ready ->
    elem = document.querySelector('#App')
    Box.doApp('Color', elem )
    return
 Box.init()
*/
export default Box;

//# sourceMappingURL=Box.js.map
