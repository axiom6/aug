var Touch;

import Tocca from '../../../pub/lib/touch/Tocca.esm.js';

Touch = class Touch {
  constructor() {
    this.tocca = Tocca();
    this.dirs = ['up', 'down', 'left', 'right'];
    this.evts = ['tap', 'dbltap', 'longtap', 'swipeleft', 'swipeup', 'swiperight', 'swipedown'];
  }

  onNav(elem, nav) {
    this.tap(elem, function(e) {
      return nav.dir('next', e);
    });
    this.dbl(elem, function(e) {
      return nav.dir('next', e);
    });
    this.hold(elem, function(e) {
      return nav.dir('prev', e);
    });
    this.right(elem, function(e) {
      return nav.dir('west', e); // All directions reversed
    });
    this.down(elem, function(e) {
      return nav.dir('north', e);
    });
    this.left(elem, function(e) {
      return nav.dir('east', e);
    });
    this.up(elem, function(e) {
      return nav.dir('south', e);
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
