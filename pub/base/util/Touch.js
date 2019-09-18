var Touch;

import Tocca from '../../../pub/lib/touch/Tocca.esm.js';

Touch = class Touch {
  constructor() {
    this.tocca = Tocca();
    this.dirs = ['up', 'down', 'left', 'right'];
    this.evts = ['tap', 'dbltap', 'longtap', 'swipeleft', 'swipeup', 'swiperight', 'swipedown'];
  }

  onDir(elem, dir) {
    this.tap(elem, function(e) {
      return dir.touch('next', e);
    });
    this.dbl(elem, function(e) {
      return dir.touch('next', e);
    });
    this.hold(elem, function(e) {
      return dir.touch('prev', e);
    });
    this.right(elem, function(e) {
      return dir.touch('west', e); // All directions reversed
    });
    this.down(elem, function(e) {
      return dir.touch('north', e);
    });
    this.left(elem, function(e) {
      return dir.touch('east', e);
    });
    this.up(elem, function(e) {
      return dir.touch('south', e);
    });
  }

  tap(elem, onEvent) {
    elem.addEventListener('tap', onEvent);
  }

  dbl(elem, onEvent) {
    elem.addEventListener('dbltap', onEvent);
  }

  hold(elem, onEvent) {
    elem.addEventListener('longtap', onEvent);
  }

  left(elem, onEvent) {
    elem.addEventListener('swipeleft', onEvent);
  }

  up(elem, onEvent) {
    elem.addEventListener('swipeup', onEvent);
  }

  right(elem, onEvent) {
    elem.addEventListener('swiperight', onEvent);
  }

  down(elem, onEvent) {
    elem.addEventListener('swipedown', onEvent);
  }

};

export default Touch;
