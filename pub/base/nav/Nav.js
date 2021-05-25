var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../util/Build.js';

import Dir from './Dir.js';

Nav = class Nav {
  constructor(stream, mix, batch, komps1, pages1) {
    this.toPub = this.toPub.bind(this);
    this.stream = stream;
    this.mix = mix;
    this.batch = batch;
    this.komps = komps1;
    this.pages = pages1;
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
    this.dir = new Dir(this);
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
    this.debug = false;
    this.pubs = [];
    this.urls = [];
    this.tabs = {};
    this.museLevels = ['Comp', 'Prac', 'Disp'];
    this.museComps = ['Home', 'Prin', 'Info', 'Know', 'Wise', 'Cube', 'Test'];
    this.museInovs = ['Info', 'Know', 'Wise', 'Soft', 'Data', 'Scie', 'Math'];
    this.musePlanes = ['Info', 'Know', 'Wise'];
  }

  pub(msg, isReplay = false) {
    var obj, url;
    obj = this.toObj(msg, isReplay);
    url = this.toUrl(obj);
    console.log('Nav.pub()', obj);
    if (!isReplay && obj.compKey !== 'Test') {
      this.pubs.push(obj);
    }
    if (!isReplay && obj.compKey !== 'Test') {
      this.urls.push(url);
    }
    this.stream.publish('Nav', obj);
  }

  toObj(msg, isReplay) {
    var obj;
    this.set(msg, isReplay);
    if (msg.source == null) {
      this.source = 'None';
    }
    if (this.level === 'Comp') {
      this.pracKey = 'None';
    }
    if (this.level !== 'Disp') {
      this.dispKey = 'None';
    }
    obj = {
      source: this.source,
      level: this.level,
      compKey: this.compKey,
      pracKey: this.pracKey,
      dispKey: this.dispKey
    };
    obj.pageKey = this.objPage(obj);
    obj.inovKey = this.objInov(obj);
    if (this.mix.isApp('Jitter')) {
      obj.choice = this.choice;
    }
    if (this.mix.isApp('Jitter')) {
      obj.checked = this.checked;
    }
    if (this.warnMsg !== 'None') {
      obj.warnMsg = this.warnMsg;
    }
    return obj;
  }

  set(msg, isReplay) {
    var compKey, key, val;
    if (isReplay) {
      if (msg.pageKey !== 'None') {
        compKey = this.getPagesKey(msg);
        this.setPageKey(compKey, msg.pageKey, {}); // Short message on 'Tab' subject
        this.stream.publish('Tab', {
          compKey: compKey,
          pageKey: msg.pageKey
        });
      }
      if (msg.inovKey !== 'None') {
        this.setPageKey(msg.compKey, msg.inovKey, {}); // Short message on 'Tab' subject
        this.stream.publish('Tab', {
          compKey: msg.compKey,
          pageKey: msg.inovKey
        });
        if (this.debug) {
          console.log('Nav.set()', {
            compKey: msg.compKey,
            inovKey: msg.inovKey
          });
        }
      }
    }
    for (key in msg) {
      if (!hasProp.call(msg, key)) continue;
      val = msg[key];
      this[key] = val;
    }
  }

  toUrl(obj) {
    var inov, page, url;
    page = this.objPage(obj);
    inov = this.objInov(obj);
    url = window.location.protocol + '//' + window.location.host;
    url += obj.compKey === 'Home' ? '' : '/' + obj.compKey;
    if (obj.pracKey !== 'None') {
      url += '/' + obj.pracKey;
    }
    if (obj.dispKey !== 'None') {
      url += '/' + obj.dispKey;
    }
    if (page !== 'None') {
      url += '?' + 'page=' + page;
    }
    if (inov !== 'None') {
      url += '&' + 'innovate=' + inov;
    }
    // console.log( 'Nav.toUrl()', url ) if @debug
    window.history.pushState({}, '', url);
    return url;
  }

  toPub(href) {
    var innovate, obj, page, paths, url;
    obj = {};
    url = new URL(href);
    page = url.searchParams.get("page");
    innovate = url.searchParams.get("innovate");
    paths = url.pathname.split('/');
    obj.source = 'Url';
    obj.compKey = this.mix.isStr(paths[1]) ? paths[1] : 'Home';
    obj.pracKey = this.mix.isStr(paths[2]) ? paths[2] : 'None';
    obj.dispKey = this.mix.isStr(paths[3]) ? paths[3] : 'None';
    obj.pageKey = page != null ? page : 'None';
    obj.inovKey = innovate != null ? innovate : 'None';
    obj.level = obj.dispKey !== 'None' ? 'Disp' : obj.pracKey !== 'None' ? 'Prac' : 'Comp';
    if (this.debug) {
      console.log('Nav.toPub()', {
        url: href,
        obj,
        obj,
        paths: paths
      });
    }
    return obj;
  }

  getPagesKey(obj) {
    var pagesKey;
    pagesKey = 'None';
    if (this.mix.isApp('Muse')) {
      if (this.mix.inArray(obj.compKey, this.musePlanes)) {
        pagesKey = obj.level;
      }
      if (obj.compKey === 'Prin' && obj.level === 'Comp') {
        pagesKey = 'Prin';
      }
      if (obj.compKey === 'Prin' && obj.level === 'Prac') {
        pagesKey = 'Prac';
      }
    } else {
      pagesKey = (function() {
        switch (obj.level) {
          case 'Comp':
            return obj.compKey;
          case 'Prac':
            return obj.pracKey;
          case 'Disp':
            return obj.dispKey;
          default:
            return obj.compKey;
        }
      })();
    }
    return pagesKey;
  }

  objPage(obj) {
    return this.getPageKey(this.getPagesKey(obj), false);
  }

  objInov(obj) {
    if (this.mix.inArray(obj.compKey, this.musePlanes)) {
      return this.getPageKey(obj.compKey);
    } else {
      return 'None';
    }
  }

  isShow(pagesKey, pageKey) {
    var pageNav;
    pageNav = this.getPageKey(pagesKey, false);
    return pageKey === pageNav;
  }

  // An important indicator of when Comps and Tabs are instanciated
  setPages(pagesKey, pages) {
    if (this.hasPages(pagesKey, false)) {
      return;
    }
    this.pages[pagesKey] = pages;
  }

  getPages(pagesKey) {
    if (this.hasPages(pagesKey, true)) {
      return this.pages[pagesKey];
    } else {
      return {};
    }
  }

  setPageKey(pagesKey, pageKey, propPages) {
    var key, page, ref;
    if (pageKey === 'None') {
      return;
    }
    ref = this.pages[pagesKey];
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      page.show = key === pageKey; // Update nav pages
      if (propPages[key] != null) {
        propPages[key].show = key === pageKey;
      }
    }
  }

  getPageKey(pagesKey, log = false) {
    var key, page, ref;
    if (!this.hasPages(pagesKey, log)) {
      return 'None';
    }
    ref = this.pages[pagesKey];
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      if (page.show) {
        return key;
      }
    }
    return 'None';
  }

  getInovKey(pagesKey) {
    if (this.mix.inArray(pagesKey, this.musePlanes)) {
      return this.getPageKey(pagesKey);
    } else {
      return 'None';
    }
  }

  hasPages(pagesKey, log = false) {
    var has;
    has = this.mix.isDef(this.pages[pagesKey]);
    if (!has && log) {
      console.log('Nav.hasPages()', {
        pagesKey: pagesKey,
        has: has,
        pages: this.pages
      });
    }
    return has;
  }

  isMyNav(obj, level, checkPageKey = false) { // @routes, @routeNames,
    if (checkPageKey) {
      return obj.level === level && this.hasPages(obj.pageKey, true);
    } else {
      return obj.level === level;
    }
  }

  pracs(compKey) {
    return this.batch[compKey].data.pracs;
  }

  disps(compKey, pracKey) {
    return this.batch[compKey].data.pracs[pracKey].disps;
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
    return this.mix.inArray(compKey, this.museInovs);
  }

  addInovToNavs(komps) {
    var navs;
    if (!this.mix.isApp('Muse')) {
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
