var MathMgr,
  hasProp = {}.hasOwnProperty;

import Differ from './Differ.js';

import Solves from './Solves.js';

import Basics from './Basics.js';

MathMgr = class MathMgr {
  constructor() {
    this.debug = false;
  }

  createExps(page) {
    var exp, expsa, i, key;
    // page.obj = if not page.obj? then @buildExps(page.key) else page.obj # flaky but not sure why
    page.obj = this.buildExps(page.key);
    expsa = page.obj.math();
    i = 0;
    for (key in expsa) {
      if (!hasProp.call(expsa, key)) continue;
      exp = expsa[key];
      exp.klass = this.klass(i);
      i++;
    }
    if (this.debug) {
      console.log('MathND.createExp()', {
        obj: page.obj,
        exps: expsa
      });
    }
    return expsa;
  }

  buildExps(key) {
    switch (key) {
      case 'Basics':
        return new Basics();
      case 'Differ':
        return new Differ();
      case 'Solves':
        return new Solves();
      default:
        console.log('MathMgr.createExps() bad page.key', {
          key: key
        });
        return new Basics();
    }
  }

  // Generate a row column layout class
  klass(i) {
    var col, mod, ncol, row;
    ncol = 3;
    mod = i % ncol;
    row = (i - mod) / ncol + 1;
    col = mod + 1;
    return `r${row}c${col}`;
  }

};

export default MathMgr;
