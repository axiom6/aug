var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../util/Build.js';

Nav = class Nav {
  constructor(stream, batch, navs = null, isMuse = false) {
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.navs = navs;
    this.isMuse = isMuse;
    this.build = new Build(this.batch);
    this.$router = null;
    this.source = 'None';
    this.route = 'Home';
    this.compKey = 'Home'; // Also specifies current plane
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.pageKey = 'None';
    this.warnMsg = 'None';
    this.pages = {};
    this.keyEvents();
  }

  pub(msg) {
    var lastRoute, obj;
    if (this.msgOK(msg)) {
      lastRoute = this.route;
      obj = this.pubObj(msg);
      console.log('Nav.pub()', obj);
      this.stream.publish('Nav', obj);
      if ((msg.route != null) && msg.route !== lastRoute) {
        this.doRoute(msg.route);
      }
    }
  }

  msgOK(msg) {
    var ok;
    ok = true;
    if ((msg.compKey != null) && !this.hasCompKey(msg.compKey)) {
      ok = false;
    }
    return ok;
  }

  hasCompKey(compKey, dir = null) {
    var has;
    has = (compKey != null) && (this.navs != null) && (this.navs[compKey] != null);
    if ((dir != null) && has) {
      return this.navs[compKey][dir] != null;
    } else {
      return has;
    }
  }

  pubObj(msg) {
    this.set(msg);
    if (msg.warnMsg == null) {
      this.warnMsg = 'None';
    }
    if (msg.source == null) {
      this.source = 'None';
    }
    return {
      source: this.source,
      route: this.route,
      compKey: this.compKey,
      pracKey: this.pracKey,
      dispKey: this.dispKey,
      pageKey: this.pageKey,
      warnMsg: this.warnMsg
    };
  }

  doRoute(route) {
    if ((route != null) && route !== 'None') {
      if (this.$router != null) {
        this.$router.push({
          name: route
        });
      } else {
        console.error('Nav.doRoute() $router not set');
      }
      this.route = route;
    } else {
      console.error('Nav.doRoute() undefined route');
    }
  }

  set(msg) {
    var key, val;
    for (key in msg) {
      if (!hasProp.call(msg, key)) continue;
      val = msg[key];
      this[key] = val;
    }
  }

  log(source, warnMsg) {
    return console.log('Nav.log()', this.pubObj({
      source: source,
      warnMsg: warnMsg
    }));
  }

  tap() {
    console.log('Nav.tap()');
  }

  keyEvents() {
    var keyDir;
    keyDir = (event) => {
      switch (event.key) {
        case 'ArrowRight':
          return this.dir('east', event);
        case 'ArrowLeft':
          return this.dir('west', event);
        case 'ArrowDown':
          return this.dir('south', event);
        case 'ArrowUp':
          return this.dir('north', event);
        case '+':
          return this.dir('next', event);
        case '-':
          return this.dir('prev', event);
      }
    };
    document.addEventListener('keydown', (event) => {
      return keyDir(event);
    });
  }

  dir(direct, event = null) {
    this.source = direct;
    if (event === null) {
      ({});
    }
    if (this.isMuse && (direct === 'east' || direct === 'west')) {
      this.dirPage(direct);
    } else {
      switch (this.route) {
        case 'Comp':
          this.dirComp(direct);
          break;
        case 'Prac':
          this.dirPrac(direct);
          break;
        case 'Disp':
          this.dirDisp(direct);
          break;
        default:
          this.dirNavs(direct);
      }
    }
  }

  dirComp(dir) {
    var compKey, route;
    if (this.hasCompKey(this.compKey, dir)) {
      compKey = this.navs[this.compKey][dir];
      route = this.toRoute(compKey);
      this.pub({
        route: route,
        compKey: compKey,
        source: `${'Nav.dirComp'}(${dir})`
      });
    } else {

    }
  }

  toRoute(compKey) {
    if (compKey === 'Info' || compKey === 'Know' || compKey === 'Wise') {
      return 'Comp';
    } else {
      return compKey;
    }
  }

  dirPrac(dir) {
    var adj, obj;
    adj = this.adjPracObj(dir);
    if (adj.name !== 'None') {
      obj = {};
      obj.source = `${'Nav.dirPrac'}(${dir})`;
      obj.compKey = this.compKey;
      if (adj.name !== this.pracKey) {
        obj.pracKey = adj.name;
      }
      if (adj.plane !== this.compKey) {
        obj.compKey = adj.plane;
      }
      this.pub(obj);
    }
  }

  dirDisp(dir) {
    var adj, ddr, dis, obj, prc;
    prc = this.pracs(this.compKey)[this.pracKey];
    dis = prc[this.dispKey];
    adj = this.adjPracObj(dir);
    ddr = dis.dir;
    dis = this.getDispObj(adj, ddr);
    if (adj.name !== 'None') {
      obj = {};
      obj.source = `${'Nav.dirDisp'}(${dir})`;
      obj.compKey = adj.plane;
      obj.pracKey = adj.name;
      obj.dispKey = dis.name;
      this.pub(obj);
    }
  }

  dirNavs(dir) {
    var compKey, msg, route;
    if (this.hasPages(this.route) && dir === 'west' || dir === 'east') {
      this.dirPage(dir);
    } else if (this.hasCompKey(this.compKey, dir)) {
      compKey = this.navs[this.compKey][dir];
      route = this.toRoute(compKey);
      msg = {
        route: route,
        compKey: compKey,
        source: `${'Nav.dirNavs'}(${dir})`
      };
      this.pub(msg);
    } else {
      this.log(`${'Nav.dirNavs'}(${dir})`, {
        warnMsg: 'Cannot find pageKey or missing @navs'
      });
    }
  }

  dirPage(dir) {
    var pageKey;
    pageKey = this.hasPages(this.route) ? this.movePage(this.pages[this.route], dir) : 'None';
    if (pageKey !== 'None') {
      this.pub({
        source: `${'Nav.dirPage'}(${dir})`,
        pageKey: pageKey
      });
    } else {
      this.log(`${'Nav.dirPage'}(${dir})`, {
        warnMsg: 'Cannot find pageKey'
      });
    }
  }

  movePage(page, dir) {
    var idx, len, ndx, pageKey;
    pageKey = this.getPageKey(this.route, 'None');
    len = page.keys.length;
    if (pageKey !== 'None') {
      idx = page.keys.indexOf(pageKey);
      if (dir === 'east') {
        ndx = this.range(idx + 1, len);
      }
      if (dir === 'west') {
        ndx = this.range(idx - 1, len);
      }
      pageKey = page.keys[ndx];
    } else {
      pageKey = dir === 'east' ? page.keys[0] : page.keys[len - 1];
    }
    this.setPageKey(this.route, pageKey);
    return pageKey;
  }

  range(idx, len) {
    var ndx;
    ndx = idx;
    if (ndx >= len) {
      ndx = 0;
    }
    if (ndx < 0) {
      ndx = len - 1;
    }
    return ndx;
  }

  setPages(route, pagesObj) {
    this.pages[route] = {};
    this.pages[route].pages = pagesObj;
    this.pages[route].keys = Object.keys(pagesObj);
    return this.getPageKey(route, 'None');
  }

  setPageKey(route, pageKey) {
    var key, page, ref;
    this.pageKey = pageKey;
    if (!this.hasPages(route)) {
      return;
    }
    ref = this.pages[route].pages;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      page.show = key === pageKey;
    }
  }

  getPageKey(route, defn) {
    var key, page, ref;
    if (this.usePageAtt(route)) {
      return this.pageKey;
    }
    if (!this.hasPages(route)) {
      return 'None';
    }
    ref = this.pages[route].pages;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      if (page.show) {
        return key;
      }
    }
    return defn;
  }

  hasPageKey(route) {
    var key, page, ref;
    if (!this.hasPages(route)) {
      return false;
    }
    ref = this.pages[route].pages;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      if (page.show) {
        return true;
      }
    }
    return false;
  }

  usePageAtt(route) {
    return this.pageKey !== 'None' && this.hasPages(route) && (this.pages[route].pages[this.pageKey] != null) && (route === 'Prin' || route === 'Comp' || route === 'Prac' || route === 'Disp');
  }

  hasPages(route) {
    return (this.pages[route] != null) && (this.pages[route].pages != null) && this.pages[route].keys.length > 0;
  }

  isMyNav(obj, route) {
    return obj.route === route && this.hasPageKey(route);
  }

  adjPracObj(dir) {
    var adjcObj, pracObj;
    pracObj = this.pracs(this.compKey)[this.pracKey];
    adjcObj = this.build.adjacentPractice(pracObj, dir);
    return adjcObj;
  }

  getDispObj(pracObj, dirDisp) {
    var dispObj;
    dispObj = this.build.getDir(pracObj, dirDisp);
    return dispObj;
  }

  pracs(compKey) {
    return this.batch[compKey].data.pracs;
  }

  disps(compKey, pracKey) {
    return this.batch[compKey].data.pracs[pracKey].disps;
  }

};

export default Nav;
