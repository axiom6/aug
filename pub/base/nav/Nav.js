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
    this.routeLast = 'None';
    this.compKey = 'Home'; // Also specifies current plane
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.pageKey = 'None';
    this.warnMsg = 'None';
    this.pages = {};
    this.setPagesCallbacks = {};
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
    if ((msg.compKey != null) && !this.hasCompKey(msg.compKey)) {
      ok = false;
    }
    return ok;
  }

  toObj(msg) {
    this.set(this.reviseMsg(msg));
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

  // A hack for Innovate Tabs
  reviseMsg(msg) {
    if ((msg.route != null) && msg.route === 'Inov') {
      msg.route = 'Comp';
      msg.compKey = msg.pageKey;
      msg.pageKey = this.getPageKey('Comp');
    }
    return msg;
  }

  set(msg) {
    var key, val;
    for (key in msg) {
      if (!hasProp.call(msg, key)) continue;
      val = msg[key];
      this[key] = val;
    }
  }

  doRoute(route) {
    if (route === this.routeLast) {
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
      msg.compKey = this.navs[this.compKey][dir];
      msg.route = this.toRoute(msg.compKey);
      this.doRoute(msg.route);
      msg.pageKey = this.pageKey !== 'None' && this.pageKey !== 'Info' ? this.pageKey : 'Sign';
      //sg.pageKey = if @hasPageKey(msg.route,@pageKey)               then @pageKey else @getPageKey(msg.route)
      this.pub(msg);
    } else if (this.hasActivePageDir(this.route, dir)) {
      this.dirPage(dir);
    } else {
      this.log(msg, {
        warnMsg: 'Missing component'
      });
    }
  }

  dirComp2(dir) {
    var callback, msg;
    msg = {};
    msg.source = `${'Nav.dirComp'}(${dir})`;
    if (this.hasCompKey(this.compKey, dir)) {
      msg.compKey = this.navs[this.compKey][dir];
      msg.route = this.toRoute(msg.compKey);
      callback = () => {
        msg.pageKey = this.hasPageKey(msg.route, this.pageKey) ? this.pageKey : this.getPageKey(msg.route);
        return this.pub(msg);
      };
      if (this.hasPages()) {
        this.doRoute(msg.route);
        callback();
      } else {
        this.setPagesCallbacks[msg.route] = callback;
        this.doRoute(msg.route);
      }
    } else if (this.hasActivePageDir(this.route, dir)) {
      this.dirPage(dir);
    } else {
      this.log(msg, {
        warnMsg: 'Missing component'
      });
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
      this.log(msg, "Missing practice @adjPracObj(dir)");
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
      this.log(msg, "Missing displine @adjPracObj(dir)");
    }
  }

  /*
  dirNavs:( dir ) ->
  msg = {}
  msg.source = "#{'Nav.dirNavs'}(#{dir})"
  if @hasActivePageDir(@route,dir)
   @dirPage( dir )
  else if @hasCompKey(@compKey, dir)
  msg.compKey = @navs[@compKey][dir]
  msg.route   = @toRoute(msg.compKey )
  @pub( msg )
  else
  @log( msg, warnMsg:'Missing compKey or @navs' )
  return
  */
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
        warnMsg: 'Cannot find pageKey'
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

  setPages(route, pagesObj) {
    this.pages[route] = {};
    this.pages[route].pages = pagesObj;
    this.pages[route].keys = Object.keys(pagesObj);
    console.log('Nav().setPages', route, this.pages[route]);
    if (this.setPagesCallbacks[route] != null) {
      this.setPagesCallbacks[route]();
      this.setPagesCallbacks[route] = null; // Only call once
    }
    return this.getPageKey(route);
  }

  setPageKey(route, pageKey) {
    var key, page, ref;
    if (route !== 'Inov') {
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

  getPageKey(route) {
    var key, page, ref;
    if (this.hasPageKey(route, this.pageKey)) {
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
    return this.pages[route].keys[0];
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
    return (this.pages[route] != null) && (this.pages[route].pages != null) && this.pages[route].keys.length > 0;
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

};

export default Nav;
