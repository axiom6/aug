var Touch;

import Tocca from '../../../pub/lib/touch/Tocca.esm.js';

Touch = class Touch {
  constructor(stream, navs) {
    this.doTouch = this.doTouch.bind(this);
    this.stream = stream;
    this.navs = navs;
    this.tocca = Tocca();
    this.dirs = ['up', 'down', 'left', 'right'];
    this.evts = ['tap', 'dbltap', 'longtap', 'swipeleft', 'swipeup', 'swiperight', 'swipedown'];
    this.route = 'Home';
    this.$router = null; // Set later
  }

  onDir(elem) {
    this.tap(elem, (e) => {
      return this.doTouch('next', e);
    });
    this.dbl(elem, (e) => {
      return this.doTouch('next', e);
    });
    this.hold(elem, (e) => {
      return this.doTouch('prev', e);
    });
    this.right(elem, (e) => {
      return this.doTouch('west', e); // All directions reversed
    });
    this.down(elem, (e) => {
      return this.doTouch('north', e);
    });
    this.left(elem, (e) => {
      return this.doTouch('east', e);
    });
    this.up(elem, (e) => {
      return this.doTouch('south', e);
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

  doTouch(dir, event = null) {
    var obj, route;
    // return if dir is 'prev'
    if (event === null) {
      ({});
    }
    route = this.navs[this.route][dir];
    obj = {
      source: 'Dir',
      route: route
    };
    this.pub(obj);
    this.doRoute(route, dir);
  }

  pub(obj) {
    // console.log('Dir.pub()', obj )
    this.stream.publish('Dir', obj);
  }

  doRoute(route) {
    if (this.$router != null) {
      this.$router.push({
        name: route
      });
    } else {
      console.error('Nav.router() $router not set');
    }
    // console.log('Dir.doRoute()', { beg:@route, dir:dir, end:route } )
    this.route = route;
  }

};

export default Touch;
