var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../util/Build.js';

//mport { NavigationFailureType, isNavigationFailure } from 'vue-router'
Nav = class Nav {
  constructor(stream, batch, routes1, routeNames, komps1, isMuse = false) {
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.routes = routes1;
    this.routeNames = routeNames;
    this.komps = komps1;
    this.isMuse = isMuse;
    this.dirs = {
      west: true,
      east: true,
      north: true,
      south: true,
      prev: true,
      next: true
    };
    this.navs = this.addInovToNavs(this.komps);
    this.touch = null;
    this.build = new Build(this.batch);
    this.router = null;
    this.source = 'None';
    this.route = 'Home';
    this.routeLast = 'None';
    this.choice = 'None';
    this.checked = false;
    this.level = 'None'; // set to either Comp Prac or Disp by Tocs.vue
    this.compKey = 'Home'; // Also specifies current plane
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.pageKey = 'None';
    this.inovKey = 'None'; // Only used by Tabs to Tocs.vue and Comp.vue
    this.warnMsg = 'None';
    this.debug = false;
    this.pages = {};
    this.museLevels = ['Comp', 'Prac', 'Disp'];
    this.museComps = ['Info', 'Know', 'Wise', 'Prin', 'Cube'];
    this.museInovs = ['Info', 'Know', 'Wise', 'Soft', 'Data', 'Scie', 'Math'];
    this.inovComps = ['Info', 'Know', 'Wise'];
    this.keyEvents();
    this.routeChange();
  }

  pub(msg) {
    var obj;
    if (this.msgOK(msg)) {
      obj = this.toObj(msg);
      console.log('Nav.pub()', obj);
      this.doRoute(obj); // Creates route if necessary to publish to
      this.stream.publish('Nav', obj);
    }
  }

  msgOK(msg) {
    var ok;
    ok = true;
    if (this.isMuse && (msg.compKey != null) && !this.hasCompKey(msg.compKey)) {
      ok = false;
    }
    return ok;
  }

  toObj(msg) {
    var obj;
    this.set(msg);
    if (msg.source == null) {
      this.source = 'None';
    }
    this.inovKey = this.getInovKey(this.compKey);
    obj = {
      source: this.source,
      route: this.route,
      level: this.level,
      compKey: this.compKey,
      pracKey: this.pracKey,
      pageKey: this.pageKey,
      inovKey: this.inovKey,
      dispKey: this.dispKey,
      choice: this.choice,
      checked: this.checked
    };
    if (this.warnMsg !== 'None') {
      obj.warnMsg = this.warnMsg;
    }
    return obj;
  }

  set(msg) {
    var key, val;
    for (key in msg) {
      if (!hasProp.call(msg, key)) continue;
      val = msg[key];
      this[key] = val;
    }
  }

  doRoute(obj) {
    if (this.debug) {
      console.log('Nav.doRoute()', {
        objRoute: obj.route,
        routeLast: this.routeLast
      });
    }
    if (obj.source === 'Tabs' || obj.route === 'None' || obj.route === this.routeLast) { // or @isInov(obj.route)
      return;
    }
    if ((obj.route != null) && this.inArray(obj.route, this.routeNames)) {
      if (this.router != null) {
        this.router.push({
          name: obj.route
        }).then(this.debug ? console.log('Nav.doRoute() success', {
          route: obj.route
        }) : void 0).catch((failure) => {
          return console.log('Nav.doRoute() failure', {
            route: obj.route,
            failure: failure
          });
        });
      } else {
        console.error('Nav.doRoute() router not set');
      }
      this.routeLast = obj.route;
      this.route = obj.route;
    } else {
      console.error('Nav.doRoute() undefined or unnamed route', obj.route);
    }
  }

  routeOK(path) {
    var i, len1, ref, route;
    ref = this.routeNames;
    for (i = 0, len1 = ref.length; i < len1; i++) {
      route = ref[i];
      if (path === route) {
        return true;
      }
    }
    return false;
  }

  // Not working
  routeChange() {
    window.addEventListener('popstate', (event) => {
      console.log('Nav.routeChange', window.location.pathname, event);
      if (this.routeOK(window.location.pathname)) {
        return this.doRoute(window.location.pathname);
      }
    });
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

  adjCompKey(compKey, dir) {
    if (this.hasCompKey(compKey, dir)) {
      return this.navs[compKey][dir];
    } else {
      return 'None';
    }
  }

  log(msg, warnMsg) {
    msg.warnMsg = warnMsg;
    return console.log('Nav.log()', this.toObj(msg));
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

  dir(direct) {
    this.source = direct;
    if (this.isMuse) {
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
          this.dirComp(direct);
      }
    } else {
      this.dirComp(direct);
    }
  }

  dirComp(dir) {
    var msg;
    msg = {};
    msg.source = `${'Nav.dirComp'}(${dir})`;
    if (this.hasCompKey(this.compKey, dir)) {
      msg.compKey = this.adjCompKey(this.compKey, dir);
      msg.route = this.toRoute(msg.compKey);
      this.doRoute({
        route: msg.route
      });
      this.pub(msg);
    } else if (this.hasActivePageDir(this.route, dir)) {
      this.dirPage(dir);
    } else {
      this.log(msg, {
        warnMsg: `Missing adjacent component for ${dir} ${this.compKey}`
      });
    }
  }

  // Map compKeys to a single Comp route for Muse
  toRoute(compKey) {
    if (this.isMuse && this.inArray(compKey, this.museComps)) {
      return 'Comp';
    } else {
      return compKey;
    }
  }

  dirPrac(dir) {
    var adj, msg;
    msg = {};
    msg.source = `${'Nav.dirPrac'}(${dir})`;
    msg.compKey = this.compKey;
    adj = this.adjPracObj(dir);
    if (adj.name !== 'None') {
      if (adj.name !== this.pracKey) {
        msg.pracKey = adj.name;
      }
      if (adj.plane !== this.compKey) {
        msg.compKey = adj.plane;
      }
      this.pub(msg);
    } else {
      this.log(msg, `Missing adjacent practice for ${dir} ${this.compKey} ${this.pracKey}`);
    }
  }

  dirDisp(dir) {
    var adj, ddr, dis, msg, prc;
    msg = {};
    msg.source = `${'Nav.dirDisp'}(${dir})`;
    prc = this.pracs(this.compKey)[this.pracKey];
    dis = prc[this.dispKey];
    adj = this.adjPracObj(dir);
    ddr = dis.dir;
    dis = this.getDispObj(adj, ddr);
    if (adj.name !== 'None') {
      msg.compKey = adj.plane;
      msg.pracKey = adj.name;
      msg.dispKey = dis.name;
      this.pub(msg);
    } else {
      this.log(msg, `Missing adjacent displine for ${dir} ${this.compKey} ${this.pracKey}`);
    }
  }

  prevKey(key, keys) {
    var kidx, pidx;
    kidx = keys.indexOf(key);
    pidx = kidx - 1;
    if (pidx === -1) {
      pidx = keys.length - 1;
    }
    return keys[pidx];
  }

  nextKey(key, keys) {
    var kidx, nidx;
    kidx = keys.indexOf(key);
    nidx = kidx + 1;
    if (nidx === keys.length) {
      nidx = 0;
    }
    return keys[nidx];
  }

  // Special case
  nextPage(key, keys, peys) {
    if (key !== keys[keys.length - 1]) {
      return this.nextKey(key, keys);
    } else {
      this.dispKey = this.nextKey(this.dispKey, peys);
      return 'None';
    }
  }

  dirPage(dir) {
    var msg, pageKey;
    msg = {};
    msg.source = `${'Nav.dirPage'}(${dir})`;
    pageKey = this.hasPages(this.route) ? this.movePage(this.pages[this.route], dir) : 'None';
    if (pageKey !== 'None') {
      this.setPageKey(this.route, pageKey);
    } else {
      // @pub( msg )
      this.log(msg, {
        warnMsg: `Cannot find pageKey for ${dir}`
      });
    }
  }

  movePage(page, dir) {
    var idx, len, ndx, pageKey;
    pageKey = this.getPageKey(this.route);
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

  isShow(pagesName, pageKey) {
    var pageNav;
    pageNav = this.getPageKey(pagesName, false);
    return pageKey === pageNav;
  }

  // An important indicator of when Comps and Tabs are instanciated
  setPages(pagesName, pages) {
    if (this.hasPages(pagesName, false)) {
      return;
    }
    this.pages[pagesName] = {};
    this.pages[pagesName].pages = pages;
    this.pages[pagesName].keys = Object.keys(pages);
  }

  getPages(pagesName) {
    if (this.hasPages(pagesName, true)) {
      return this.pages[pagesName].pages;
    } else {
      return {};
    }
  }

  setPageKey(pagesName, pageKey, propPages) {
    var key, page, ref;
    ref = this.pages[pagesName].pages;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      page.show = key === pageKey; // Update nav pages
      propPages[key].show = key === pageKey; // Also update the propPages in Tabs.vue because it is a copy
    }
  }

  getPageKey(pagesName, log = false) {
    var key, page, ref;
    if (!this.hasPages(pagesName, log)) {
      return 'None';
    }
    ref = this.pages[pagesName].pages;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      if (page.show) {
        return key;
      }
    }
    return 'None';
  }

  getInovKey(pagesName) {
    if (this.inArray(pagesName, this.inovComps)) {
      return this.getPageKey(pagesName);
    } else {
      return 'None';
    }
  }

  hasPages(pagesName, log = false) {
    var has;
    has = this.isDef(this.pages[pagesName]) && this.isDef(this.pages[pagesName].pages) && this.pages[pagesName].keys.length > 0;
    if (!has && log) {
      console.log('Nav.hasPages()', {
        pagesName: pagesName,
        has: has,
        pages: this.pages
      });
    }
    return has;
  }

  logAllPages() {
    var key, page, pagesKey, pagesObj, ref;
    ref = this.pages;
    for (pagesKey in ref) {
      if (!hasProp.call(ref, pagesKey)) continue;
      pagesObj = ref[pagesKey];
      for (key in pagesObj) {
        if (!hasProp.call(pagesObj, key)) continue;
        page = pagesObj[key];
        console.log(page);
      }
    }
  }

  isMyNav(obj, level, routes = null, checkPageKey = false) {
    if (routes == null) {
      return obj.level === level;
    } else {
      if (checkPageKey) {
        return obj.level === level && this.inArray(obj.route, routes) && this.hasPages(obj.pageKey, true);
      } else {
        return obj.level === level && this.inArray(obj.route, routes);
      }
    }
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

  isDef(d) {
    return d !== null && typeof d !== 'undefined' && d !== 'None';
  }

  isStr(s) {
    return this.isDef(s) && typeof s === "string" && s.length > 0;
  }

  isArray(a) {
    return this.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

  inArray(e, a) {
    return this.isArray(a) && a.indexOf(e) > -1;
  }

  // --- Innovate --- Inov in one place

    // Across the board Inov detector for compKey pageKey and route
  isInov(compKey) {
    return this.inArray(compKey, this.museInovs);
  }

  addInovToNavs(komps) {
    var navs;
    if (!this.isMuse) {
      return komps != null;
    }
    navs = Object.assign({}, komps);
    //avs = @insInov( navs, @museInovs )
    return navs;
  }

  insInov(navs, prev, inov, next) {
    if (navs[prev] != null) {
      navs[prev].south = inov;
    }
    if (navs[next] != null) {
      navs[prev].next = inov;
    }
    navs[inov] = {
      north: prev,
      prev: prev,
      south: next,
      next: next
    };
    navs[next].north = inov;
    navs[next].prev = inov;
    return navs;
  }

};

export default Nav;

/*
    prevImg:() ->
    if @imgsIdx > 0 then @imgsIdx-1 else @imgsNum-1

  nextImg:() ->
    if @imgsIdx < @imgsNum-1 then @imgsIdx+1 else 0
*/
