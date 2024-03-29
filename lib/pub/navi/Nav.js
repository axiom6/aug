var Nav,
  hasProp = {}.hasOwnProperty,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import Mix from './Mix.js';

import Build from '../util/Build.js';

import Dir from './Dir.js';

Nav = class Nav extends Mix {
  constructor(Main, stream, komps = null, pages = {}, isRoutes = false) {
    super(Main);
    this.toPub = this.toPub.bind(this);
    this.stream = stream;
    this.komps = komps;
    this.pages = pages;
    this.isRoutes = isRoutes;
    this.navs = this.komps ? this.addInovToNavs(this.komps) : null;
    this.touch = null;
    this.build = new Build(this.batch);
    this.dir = new Dir(this);
    this.source = 'none';
    this.level = 'none'; // set to either Comp Prac or Disp by Tocs.vue
    this.compKey = 'none';
    this.pracKey = 'none';
    this.dispKey = 'none';
    this.pageKey = 'none';
    this.inovKey = 'none'; // Only used by Tabs to Tocs.vue and Comp.vue
    this.choice = 'none';
    this.checked = false;
    this.warnMsg = 'none';
    this.debug = false;
    this.pubs = [];
    this.urls = [];
    this.tabs = {};
    this.router = null;
    this.routeLast = 'none';
    this.museLevels = ['Comp', 'Prac', 'Disp'];
    this.museComps = ['Home', 'Prin', 'Info', 'Know', 'Wise', 'Cube', 'Test'];
    this.museInovs = ['Info', 'Know', 'Wise', 'Software', 'Data', 'Science', 'Math'];
    this.musePlanes = ['Info', 'Know', 'Wise'];
  }

  // Special publsher for Vizu side bar
  pubVizu(obj) {
    // console.log('Nav.pubVizu()', obj )
    this.stream.publish('Vizu', obj);
  }

  pub(msg, isReplay = false) {
    var changeView, obj, url;
    changeView = this.viewChange(msg);
    obj = this.toObj(msg);
    url = this.toUrl(obj);
    console.log('Nav.pub()', obj);
    if (this.isRoutes) {
      this.doRoute(obj);
    }
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
    if (!this.isDef(obj.compKey)) {
      obj.compKey = this.compKey;
    }
    if (!this.isDef(obj.pracKey)) {
      obj.pracKey = this.pracKey;
    }
    if (!this.isDef(obj.dispKey)) {
      obj.dispKey = this.dispKey;
    }
    change = !(obj.compKey === this.compKey && obj.pracKey === this.pracKey && obj.dispKey === this.dispKey);
    if (this.debug && change) {
      console.log('Nav.viewChange()', {
        change: change,
        compObj: obj.compKey,
        compNav: this.compKey,
        pracObj: obj.pracKey,
        pracNav: this.pracKey,
        dispObj: obj.dispKey,
        dispNav: this.dispKey
      });
    }
    return change;
  }

  toObj(msg) {
    var obj;
    this.set(msg);
    if (msg.source == null) {
      this.source = 'none';
    }
    if (this.level === 'Comp') {
      this.pracKey = 'none';
    }
    if (this.level !== 'Disp') {
      this.dispKey = 'none';
    }
    obj = {
      source: this.source,
      level: this.level,
      compKey: this.compKey,
      pracKey: this.pracKey,
      dispKey: this.dispKey,
      pageKey: this.pageKey
    };
    obj.pageKey = this.objPage(obj);
    obj.inovKey = this.objInov(obj);
    if (this.isApp('Jitter')) {
      obj.choice = this.choice;
    }
    if (this.isApp('Jitter')) {
      obj.checked = this.checked;
    }
    if (this.warnMsg !== 'none') {
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
    if (this.isDef(obj.pageKey)) {
      this.pageKey = obj.pageKey;
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
    if (this.isDef(obj.inovKey)) {
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
    if (obj.pracKey !== 'none') {
      url += '/' + obj.pracKey;
    }
    if (obj.dispKey !== 'none') {
      url += '/' + obj.dispKey;
    }
    if (page !== 'none') {
      url += '?' + 'page=' + page;
    }
    if (inov !== 'none') {
      url += '&' + 'innovate=' + inov;
    }
    if (this.debug) {
      console.log('Nav.toUrl()', url);
    }
    window.history.pushState({}, '', url);
    return url;
  }

  toPub(href) {
    var innovate, obj, page, paths, url;
    boundMethodCheck(this, Nav);
    obj = {};
    url = new URL(href);
    page = url.searchParams.get("page");
    innovate = url.searchParams.get("innovate");
    paths = url.pathname.split('/');
    obj.source = 'Url';
    obj.compKey = this.isStr(paths[1]) ? paths[1] : 'Home';
    obj.pracKey = this.isStr(paths[2]) ? paths[2] : 'none';
    obj.dispKey = this.isStr(paths[3]) ? paths[3] : 'none';
    obj.pageKey = page != null ? page : 'none';
    obj.inovKey = innovate != null ? innovate : 'none';
    obj.level = obj.dispKey !== 'none' ? 'Disp' : obj.pracKey !== 'none' ? 'Prac' : 'Comp';
    if (this.debug) {
      console.log('Nav.toPub()', {
        url: href,
        obj: obj,
        paths: paths
      });
    }
    return obj;
  }

  doDir(direct) {
    this.dir.dir(direct);
  }

  mountTouch(msg, elem, nextTick, incKlasses, excKlasses = []) {
    nextTick(() => {
      if (this.isDef(elem) && (this.touch != null)) {
        return this.touch.listen(elem, incKlasses, excKlasses);
      } else {
        return console.error(msg, "Nav.mountTouch() elem or touch undefined");
      }
    });
  }

  doRoute(obj) {
    var route;
    route = obj.compKey;
    if (route === this.routeLast || route === 'none' || this.isInov(route)) {
      return;
    }
    if (this.router != null) {
      this.router.push({
        name: route
      });
    } else {
      console.error('Nav.doRoute() router not set for', route);
    }
    this.routeLast = route;
  }

  getTabsKey(obj) {
    var tabsKey;
    tabsKey = 'none';
    if (this.isApp('Muse')) {
      if (this.inArray(obj.compKey, this.musePlanes)) {
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
    if (obj.page === 'none') {
      return this.getPageKey(this.getTabsKey(obj), false);
    } else {
      return obj.pageKey;
    }
  }

  objInov(obj) {
    if (this.inArray(obj.compKey, this.musePlanes)) {
      return this.getPageKey(obj.compKey);
    } else {
      return 'none';
    }
  }

  isShow(tabsKey, pageKey) {
    var pageNav;
    pageNav = this.getPageKey(tabsKey);
    return pageKey === pageNav;
  }

  // When @page matches return
  //  otherwise look for when the page is true at eech level
  //  this supports setting show true in pages
  show(pageArg) {
    switch (false) {
      case pageArg !== this.pageKey:
        return true;
      case this.level !== "Disp":
        return pageArg === this.getPageKey(this.dispKey);
      case this.level !== "Prac":
        return pageArg === this.getPageKey(this.pracKey);
      case this.level !== "Comp":
        return pageArg === this.getPageKey(this.compKey);
      default:
        return false;
    }
  }

  keyIdx(key, idx) {
    return key + idx;
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
    if (pageKey === 'none') {
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
      return 'none';
    }
    ref = this.pages[tabsKey];
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      page = ref[key];
      if (page.show) {
        return key;
      }
    }
    return 'none';
  }

  hasPage(tabsKey, pageKey, log = true) {
    if (this.isDef(tabsKey) && this.hasTabs(tabsKey)) {
      if (this.isDef(pageKey) && (this.pages[tabsKey][pageKey] != null)) {
        return true;
      } else {
        if (log && pageKey !== 'none') {
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
      if (log && pageKey !== 'none') {
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
      return 'none';
    }
  }

  getInovKey(tabsKey) {
    if (this.inArray(tabsKey, this.musePlanes)) {
      return this.getPageKey(tabsKey);
    } else {
      return 'none';
    }
  }

  hasTabs(tabsKey, log = false) {
    var has;
    has = this.isDef(tabsKey) && this.isDef(this.pages[tabsKey]);
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
    if (this.batch[compKey] != null) {
      return this.batch[compKey].data.pracs;
    } else {
      return {};
    }
  }

  disps(compKey, pracKey) {
    if (this.batch[compKey] != null) {
      return this.batch[compKey].data.pracs[pracKey].disps;
    } else {
      return {};
    }
  }

  // Called as await sleep(2000) inside an asych function
  sleep(ms) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  }

  delayCallback(ms, callback) {
    setTimeout(callback, ms);
  }

  // --- Innovate --- Inov in one place

    // Across the board Inov detector for compKey pageKey and route
  isInov(compKey) {
    return this.inArray(compKey, this.museInovs);
  }

  addInovToNavs(komps) {
    var navs;
    if (!this.isApp('Muse')) {
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

  userAgent() {
    return navigator.userAgent.toLowerCase();
  }

  // Looks up lower case strings in navigator userAngent
  //   like 'android' 'mac' 'iphone' 'firefox'
  //   not 100% certain but usefull
  inUserAgent(str) {
    return this.userAgent().indexOf(str) > -1;
  }

  isMobile() {
    return this.inUserAgent('android') || this.inUserAgent('iphone');
  }

};

export default Nav;

/*
  set:( msg, isReplay ) ->
    if isReplay
       if msg.pageKey isnt 'none'
          tabsKey = @getTabsKey(msg)
          @setPageKey( tabsKey, msg.pageKey, {} ) # Short message on 'Tab' subject
          @stream.publish( 'Tab',           { compKey:tabsKey, pageKey:msg.pageKey } )
          console.log( 'Nav.set() pageKey', { compKey:tabsKey, pageKey:msg.pageKey } ) if @debug
       if msg.inovKey isnt 'none'
         @setPageKey( msg.compKey, msg.inovKey, {} ) # Short message on 'Tab' subject
         @stream.publish( 'Tab',   { compKey:msg.compKey, pageKey:msg.inovKey } )
         console.log( 'Nav.set() inovKey', { compKey:msg.compKey, inovKey:msg.inovKey } ) if @debug
    for own key, val of msg
      @[key] = val
    return
*/

//# sourceMappingURL=Nav.js.map
