var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../util/Build.js';

//mport { NavigationFailureType, isNavigationFailure } from 'vue-router'
Nav = class Nav {
  constructor(stream, batch, komps1, pages1, isMuse = false) { // @routes, @routeNames,
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.komps = komps1;
    this.pages = pages1;
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
    this.source = 'None';
    this.level = 'None'; // set to either Comp Prac or Disp by Tocs.vue
    this.compKey = 'Home'; // Also specifies current plane
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.pageKey = 'None';
    this.inovKey = 'None'; // Only used by Tabs to Tocs.vue and Comp.vue
    this.choice = 'None';
    this.checked = false;
    this.warnMsg = 'None';
    this.debug = true;
    this.replays = {};
    this.url = 'None';
    this.museLevels = ['Comp', 'Prac', 'Disp'];
    this.museComps = ['Home', 'Prin', 'Info', 'Know', 'Wise', 'Cube', 'Test'];
    this.museInovs = ['Info', 'Know', 'Wise', 'Soft', 'Data', 'Scie', 'Math'];
    this.musePlanes = ['Info', 'Know', 'Wise'];
    this.keyEvents();
    this.urlListen();
  }

  pub(msg, isReplay = false) {
    var obj, objName;
    if (this.msgOK(msg)) {
      obj = this.toObj(msg);
      this.url = this.toUrl(obj);
      console.log('Nav.pub()', obj);
      if (!isReplay && obj.compKey !== 'Test') {
        objName = obj.compKey + ':' + obj.pracKey + ':' + obj.pageKey + ':' + obj.inovKey;
        this.replays[objName] = obj;
      }
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
    var obj, pagesName;
    this.set(msg);
    pagesName = this.inArray(this.compKey, this.musePlanes) ? this.level : this.compKey;
    if (msg.source == null) {
      this.source = 'None';
    }
    if (this.level === 'Comp') {
      this.pracKey = 'None';
    }
    this.pageKey = this.getPageKey(pagesName);
    this.inovKey = this.getInovKey(this.compKey);
    obj = {
      source: this.source,
      level: this.level,
      compKey: this.compKey,
      pracKey: this.pracKey,
      pageKey: this.pageKey,
      inovKey: this.inovKey,
      dispKey: this.dispKey
    };
    if (!this.isMuse) {
      obj.choice = this.choice;
    }
    if (!this.isMuse) {
      obj.checked = this.checked;
    }
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

  toUrl(msg) {
    var url;
    url = window.location.protocol + '//' + window.location.host;
    url += msg.compKey === 'Home' ? '/' : '/' + msg.compKey;
    if (msg.pracKey !== 'None') {
      url += '/' + msg.pracKey;
    }
    if (msg.dispKey !== 'None') {
      url += '/' + msg.dispKey;
    }
    if (msg.pageKey !== 'None') {
      url += '?' + 'page=' + msg.pageKey;
    }
    if (msg.inovKey !== 'None' && msg.level === 'Comp') {
      url += '&' + 'inovate=' + msg.inovKey;
    }
    if (this.debug) {
      console.log('Nav.toUrl()', url);
    }
    window.history.pushState({}, '', url);
    return url;
  }

  // str arg is a test mode used in TestMgr.coffee
  toMsg(str = null) {
    var href, innovate, obj, page, paths, url;
    obj = {};
    href = str != null ? str : document.location.href;
    url = new URL(href);
    page = url.searchParams.get("page");
    innovate = url.searchParams.get("innovate");
    paths = url.pathname.split('/');
    obj.source = 'Url';
    obj.compKey = paths[1] != null ? paths[1] : 'None';
    obj.pracKey = paths[2] != null ? paths[2] : 'None';
    obj.dispKey = paths[3] != null ? paths[3] : 'None';
    obj.pageKey = page != null ? page : 'None';
    obj.inovKey = innovate != null ? innovate : 'None';
    if (str != null) {
      console.log('Nav.toMsg()', {
        url: str,
        obj,
        obj
      });
    }
    if (this.debug) {
      console.log('Nav.toMsg()', {
        url: href,
        obj,
        obj
      });
    }
    return obj;
  }

  urlChanged(event) {
    var obj;
    //vent.preventDefault() # Not really needed
    console.log('Mav.urlChanged()', event); // if @debug
    window.stop();
    obj = toMsg();
    this.pub(obj);
  }

  urlPrevent(event) {
    // await window.stop()
    // window.location.reload(false)
    // document.execCommand('Stop')
    console.log('Mav.urlPrevent()', event); // if @debug
  }

  urlListen() {
    window.addEventListener('beforeunload', (event) => {
      return this.urlPrevent(event);
    });
    window.addEventListener('popstate', (event) => {
      return this.urlChanged(event);
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
      this.pub(msg);
    } else if (this.hasActivePageDir(this.route, dir)) {
      this.dirPage(dir);
    } else {
      this.log(msg, {
        warnMsg: `Missing adjacent component for ${dir} ${this.compKey}`
      });
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

  // Need to int page.keys = Object.keys(pages)
  movePage(page, dir) {
    var idx, len, ndx, pageKey;
    pageKey = this.getPageKey(this.compKey);
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
    this.pages[pagesName] = pages;
  }

  getPages(pagesName) {
    if (this.hasPages(pagesName, true)) {
      return this.pages[pagesName];
    } else {
      return {};
    }
  }

  setPageKey(pagesName, pageKey, propPages) {
    var key, page, ref;
    ref = this.pages[pagesName];
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      page.show = key === pageKey; // Update nav pages
      if (propPages[key] != null) {
        propPages[key].show = key === pageKey; // Also update the propPages in Tabs.vue because it is a copy
      } else {
        console.log('Nav.setPageKey() missing propPages key', {
          key: key,
          propPages: propPages
        });
      }
    }
  }

  getPageKey(pagesName, log = false) {
    var key, page, ref;
    if (!this.hasPages(pagesName, log)) {
      return 'None';
    }
    ref = this.pages[pagesName];
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
    if (this.inArray(pagesName, this.musePlanes)) {
      return this.getPageKey(pagesName);
    } else {
      return 'None';
    }
  }

  hasPages(pagesName, log = false) {
    var has;
    has = this.isDef(this.pages[pagesName]) && this.isDef(this.pages[pagesName]);
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

  isMyNav(obj, level, checkPageKey = false) { // @routes, @routeNames,
    if (checkPageKey) {
      return obj.level === level && this.hasPages(obj.pageKey, true);
    } else {
      return obj.level === level;
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

  // Called as await sleep(2000) inside an asych function
  sleep(ms) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
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
