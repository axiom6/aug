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
    this.compKey = 'None';
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.pageKey = 'None';
    this.inovKey = 'None'; // Only used by Tabs to Tocs.vue and Comp.vue
    this.choice = 'None';
    this.checked = false;
    this.warnMsg = 'None';
    this.debug = true;
    this.pubs = [];
    this.urls = [];
    this.tabs = {};
    this.museLevels = ['Comp', 'Prac', 'Disp'];
    this.museComps = ['Home', 'Prin', 'Info', 'Know', 'Wise', 'Cube', 'Test'];
    this.museInovs = ['Info', 'Know', 'Wise', 'Soft', 'Data', 'Scie', 'Math'];
    this.musePlanes = ['Info', 'Know', 'Wise'];
  }

  pub(msg, isReplay = false) {
    var changeView, obj, url;
    changeView = this.viewChange(msg);
    obj = this.toObj(msg);
    url = this.toUrl(obj);
    console.log('Nav.pub()', obj);
    if (!isReplay && obj.compKey !== 'Test') {
      this.pubs.push(obj);
    }
    if (!isReplay && obj.compKey !== 'Test') {
      this.urls.push(url);
    }
    if (changeView) {
      this.stream.publish('View', obj);
    }
    this.stream.publish('Nav', obj);
  }

  viewChange(obj) {
    var change;
    if (!this.mix.isDef(obj.compKey)) {
      obj.compKey = this.compKey;
    }
    if (!this.mix.isDef(obj.pracKey)) {
      obj.pracKey = this.pracKey;
    }
    change = !(obj.compKey === this.compKey && obj.pracKey === this.pracKey);
    if (this.debug && change) {
      console.log('Nav.viewChange()', {
        change: change,
        compObj: obj.compKey,
        compNav: this.compKey,
        pracObj: obj.pracKey,
        pracNav: this.pracKey
      });
    }
    return change;
  }

  toObj(msg) {
    var obj;
    this.set(msg);
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
    this.tab(obj); // Publisn pageKey and inovKey to tabs
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

  tab(obj) {
    var tabsKey;
    if (this.mix.isDef(obj.pageKey)) {
      this.pageKye = obj.pageKey;
      tabsKey = this.getTabsKey(obj);
      this.setPageKey(tabsKey, obj.pageKey, {}); // Short message on 'Tab' subject
      this.stream.publish('Tab', {
        compKey: tabsKey,
        pageKey: obj.pageKey
      });
      if (this.debug) {
        console.log('Nav.set() pageKey', {
          compKey: tabsKey,
          pageKey: obj.pageKey
        });
      }
    }
    if (this.mix.isDef(obj.inovKey)) {
      this.inovKey = obj.inovKey;
      this.setPageKey(obj.compKey, obj.inovKey, {}); // Short message on 'Tab' subject
      this.stream.publish('Tab', {
        compKey: obj.compKey,
        pageKey: obj.inovKey
      });
      if (this.debug) {
        console.log('Nav.set() inovKey', {
          compKey: obj.compKey,
          inovKey: obj.inovKey
        });
      }
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

  getTabsKey(obj) {
    var tabsKey;
    tabsKey = 'None';
    if (this.mix.isApp('Muse')) {
      if (this.mix.inArray(obj.compKey, this.musePlanes)) {
        tabsKey = obj.level;
      }
      if (obj.compKey === 'Prin' && obj.level === 'Comp') {
        tabsKey = 'Prin';
      }
      if (obj.compKey === 'Prin' && obj.level === 'Prac') {
        tabsKey = 'Prac';
      }
    } else {
      tabsKey = (function() {
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
    return tabsKey;
  }

  objPage(obj) {
    return this.getPageKey(this.getTabsKey(obj), false);
  }

  objInov(obj) {
    if (this.mix.inArray(obj.compKey, this.musePlanes)) {
      return this.getPageKey(obj.compKey);
    } else {
      return 'None';
    }
  }

  isShow(tabsKey, pageKey) {
    var pageNav;
    pageNav = this.getPageKey(tabsKey, false);
    return pageKey === pageNav;
  }

  // An important indicator of when Comps and Tabs are instanciated
  setTabs(tabsKey, pages) {
    if (this.hasTabs(tabsKey, false)) {
      return;
    }
    this.pages[tabsKey] = pages;
  }

  getTabs(tabsKey) {
    if (this.hasTabs(tabsKey, true)) {
      return this.pages[tabsKey];
    } else {
      return {};
    }
  }

  setPageKey(tabsKey, pageKey, propTabs) {
    var key, page, ref;
    if (pageKey === 'None') {
      return;
    }
    ref = this.pages[tabsKey];
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      page.show = key === pageKey; // Update nav pages
      if (propTabs[key] != null) {
        propTabs[key].show = key === pageKey;
      }
    }
  }

  getPageKey(tabsKey, log = false) {
    var key, page, ref;
    if (!this.hasTabs(tabsKey, log)) {
      return 'None';
    }
    ref = this.pages[tabsKey];
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      if (page.show) {
        return key;
      }
    }
    return 'None';
  }

  hasPage(tabsKey, pageKey, log = true) {
    if (this.mix.isDef(tabsKey) && this.hasTabs(tabsKey)) {
      if (this.mix.isDef(pageKey) && (this.pages[tabsKey][pageKey] != null)) {
        return true;
      } else {
        if (log) {
          console.log('Nav.hasPage() bad pageKey', {
            tabsKey: tabsKey,
            pageKey: pageKey,
            pages: {
              getTabs: tabsKey
            }
          });
        }
        return false;
      }
    } else {
      if (log) {
        console.log('Nav.hasPage() bad tabsKey', {
          tabsKey: tabsKey,
          pageKey: pageKey
        });
      }
      return false;
    }
  }

  getPage(tabsKey, pageKey, log = false) {
    if (this.hasTabs(tabsKey, log) && (this.pages[tabsKey][pageKey] != null)) {
      return this.pages[tabsKey][pageKey];
    } else {
      console.error('Nav.getPage() bad page', {
        tabsKey: tabsKey,
        pageKey: pageKey
      });
      return 'None';
    }
  }

  getInovKey(tabsKey) {
    if (this.mix.inArray(tabsKey, this.musePlanes)) {
      return this.getPageKey(tabsKey);
    } else {
      return 'None';
    }
  }

  hasTabs(tabsKey, log = false) {
    var has;
    has = this.mix.isDef(tabsKey) && this.mix.isDef(this.pages[tabsKey]);
    if (!has && log) {
      console.log('Nav.hasTabs()', {
        tabsKey: tabsKey,
        has: has,
        pages: this.pages
      });
    }
    return has;
  }

  isMyNav(obj, level, checkPageKey = false) { // @routes, @routeNames,
    if (checkPageKey) {
      return obj.level === level && this.hasTabs(obj.pageKey, true);
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

/*
  set:( msg, isReplay ) ->
    if isReplay
       if msg.pageKey isnt 'None'
          tabsKey = @getTabsKey(msg)
          @setPageKey( tabsKey, msg.pageKey, {} ) # Short message on 'Tab' subject
          @stream.publish( 'Tab',           { compKey:tabsKey, pageKey:msg.pageKey } )
          console.log( 'Nav.set() pageKey', { compKey:tabsKey, pageKey:msg.pageKey } ) if @debug
       if msg.inovKey isnt 'None'
         @setPageKey( msg.compKey, msg.inovKey, {} ) # Short message on 'Tab' subject
         @stream.publish( 'Tab',   { compKey:msg.compKey, pageKey:msg.inovKey } )
         console.log( 'Nav.set() inovKey', { compKey:msg.compKey, inovKey:msg.inovKey } ) if @debug
    for own key, val of msg
      @[key] = val
    return
*/
