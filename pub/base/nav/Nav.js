var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../util/Build.js';

Nav = class Nav {
  constructor(stream, batch, komps1 = null, isMuse = false) {
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.komps = komps1;
    this.isMuse = isMuse;
    this.navs = this.addInovToNavs(this.komps);
    this.build = new Build(this.batch);
    this.$router = null;
    this.source = 'None';
    this.route = 'Home';
    this.routeLast = 'None';
    this.compKey = 'Home'; // Also specifies current plane
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.pageKey = 'None';
    this.warnMsg = 'None';
    this.mixins = null;
    this.pages = {};
    this.keyEvents();
  }

  pub(msg) {
    var obj;
    if (this.msgOK(msg)) {
      obj = this.toObj(msg);
      this.doRoute(obj.route); // Creates route if necessary to publish to
      console.log('Nav.pub()', obj);
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

  set(msg) {
    var key, val;
    msg = this.tabInov(msg); // Revise tab innovate messages
    for (key in msg) {
      if (!hasProp.call(msg, key)) continue;
      val = msg[key];
      this[key] = val;
    }
  }

  setMixinMethods(methods) {
    this.mixins = methods;
  }

  doRoute(route) {
    if (route === this.routeLast || this.isInov(route)) {
      return;
    }
    if ((route != null) && route !== 'None') {
      if (this.$router != null) {
        this.$router.push({
          name: route
        });
      } else {
        console.error('Nav.doRoute() $router not set');
      }
      this.routeLast = this.route;
      this.route = route;
    } else {
      console.error('Nav.doRoute() undefined route');
    }
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

  dir(direct, event = null) {
    this.source = direct;
    if (event === null) {
      ({});
    }
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
        case 'Sect':
          this.dirSect(direct);
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
      this.doRoute(msg.route);
      msg.pageKey = this.getPageKey(msg.route);
      this.pub(msg);
      this.pubInov(msg, dir); // Publish Innovate pageKey to Innovate Tabs if necessary
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
    if (this.isMuse && this.inArray(compKey, ['Info', 'Data', 'Know', 'Wise'])) {
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

  dirSect(dir) {
    var msg, talkObj, talkObjs;
    msg = {};
    msg.source = `${'Nav.dirSect'}(${dir})`;
    talkObjs = this.mixin.compObject('Talk');
    talkObj = talkObjs[msg.pracKey];
    msg.pracKey = dir === 'east' ? this.prevKey(this.pracKey, talkObj.pracKeys) : this.nextKey(this.pracKey, talkObj.pracKeys);
    msg.dispKey = talkObj.pracKeys[0];
    this.pub(msg);
  }

  dirPres(dir) {
    var msg, sectKeys, sectObj, sectObjs, talkObj, talkObjs;
    msg = {};
    msg.source = `${'Nav.dirPres'}(${dir})`;
    talkObjs = this.mixin.compObject('Talk');
    talkObj = talkObjs[msg.pracKey];
    sectObjs = this.compObject(talkObj.sect);
    sectObj = sectObjs[this.pracKey];
    sectKeys = sectObj.dispKeys;
    msg.dispKey = dir === 'east' ? this.prevKey(this.dispKey, sectKeys) : this.nextKey(this.dispKey, sectKeys);
    this.pub(msg);
  }

  prevKey(key, keys) {
    var kidx, pidx;
    kidx = keys.indexOf(key);
    pidx = kidx - 1;
    if (pidx === -1) {
      pidx = keys.length - 1;
    }
    return keys(pidx);
  }

  nextKey(key, keys) {
    var kidx, nidx;
    kidx = keys.indexOf(key);
    nidx = kidx + 1;
    if (nidx === keys.length) {
      nidx = 0;
    }
    return keys(nidx);
  }

  dirPage(dir) {
    var msg, pageKey;
    msg = {};
    msg.source = `${'Nav.dirPage'}(${dir})`;
    pageKey = this.hasActivePageDir(this.route, dir) ? this.movePage(this.pages[this.route], dir) : 'None';
    if (pageKey !== 'None') {
      msg.pageKey = pageKey;
      this.pub(msg);
    } else {
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

  // An important indicator of when Comps and Tabs are instanciated
  setPages(route, pagesObj, defn = null) {
    // if not @pages[route]?
    this.pages[route] = {};
    this.pages[route].pages = pagesObj;
    this.pages[route].keys = Object.keys(pagesObj);
    // console.log( 'Nav().setPages', route, @pages[route] )
    return this.getPageKey(route, defn);
  }

  setPageKey(route, pageKey) {
    var key, page, ref;
    if (!this.isInov(route)) {
      this.pageKey = pageKey;
    }
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

  // Jumps through hoops to set the right pageKey
  // Defn implies not to use first key as default
  getPageKey(route, defn = null) {
    var key, page, pageKey, ref;
    pageKey = 'Sign';
    if (this.hasPageKey(route, this.pageKey)) {
      pageKey = this.pageKey;
    } else if (!this.hasPages(route)) {
      pageKey = this.isPageKey(this.pageKey) ? this.pageKey : 'Sign';
    } else {
      ref = this.pages[route].pages;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        page = ref[key];
        if (page.show) {
          return key;
        }
      }
      pageKey = defn != null ? defn : this.pages[route].keys[0];
    }
    // console.trace()
    // console.log( 'Nav.getPageKey()', { pageKey:pageKey, defn:defn } )
    return pageKey;
  }

  // Inov plays a roll is validating pageKey
  isPageKey(pageKey) {
    return (pageKey != null) && pageKey !== 'None' && !this.isInov(pageKey);
  }

  hasPageKey(route, pageKey) {
    return pageKey !== 'None' && this.hasPages(route) && (this.pages[route].pages[pageKey] != null);
  }

  hasActivePage(route) {
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

  hasPages(route) {
    var has;
    has = (this.pages[route] != null) && (this.pages[route].pages != null) && this.pages[route].keys.length > 0;
    // console.log( 'Nav.hasPages()', { route:route, has:has } )
    return has;
  }

  hasActivePageDir(route, dir) {
    return this.hasActivePage(route) && (dir === 'west' || dir === 'east');
  }

  isMyNav(obj, route) {
    return obj.route === route; // and @hasActivePage(route)
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
    return d !== null && typeof d !== 'undefined';
  }

  isArray(a) {
    return this.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

  inArray(e, a) {
    return this.isArray(a) && a.indexOf(e) > -1;
  }

  // --- Innovate --- Inov in one place

  // Across the board Inov detector for compKey pageKey and route
  isInov(e) {
    return this.inArray(e, ['Info', 'Data', 'Inov']);
  }

  // A hack for Innovate Tabs
  tabInov(msg) {
    if ((msg.route != null) && this.isInov(msg.route) && msg.source === 'Tabs') {
      msg.route = 'Comp';
      msg.compKey = msg.pageKey;
      msg.pageKey = this.getPageKey('Comp');
    }
    return msg;
  }

  // Publish a message after dirComp() to update Innovate Tabs
  pubInov(msg, dir) {
    var msh, saveKey;
    if (!this.isInov(msg.compKey)) {
      return;
    }
    saveKey = this.pageKey;
    msh = Object.assign({}, msg);
    this.setPageKey('Inov', msh.compKey);
    msh.source = `${'Nav.dirInov'}(${dir})`;
    msh.route = 'Inov';
    msh.pageKey = msh.compKey;
    this.pub(msh);
    this.pageKey = saveKey;
  }

  addInovToNavs(komps) {
    var navs;
    if (!this.isMuse) {
      return komps != null;
    }
    navs = Object.assign({}, komps);
    navs = this.insInov(navs, 'Info', 'Data', 'Know');
    return navs;
  }

  insInov(navs, prev, inov, next) {
    navs[prev].south = inov;
    navs[prev].next = inov;
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
