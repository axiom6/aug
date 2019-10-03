var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../../ikw/cube/Build.js';

Nav = class Nav {
  constructor(stream, batch, navs = null) {
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.navs = navs;
    this.build = new Build(this.batch);
    this.$router = null;
    this.source = 'None';
    this.route = 'Home'; // Prac Disp
    this.compKey = 'None'; // Also specifies current plane
    this.pracKey = 'None';
    this.pracObj = null;
    this.dispKey = 'None';
    this.dispObj = null;
    this.pageKey = 'None'; // Used to maintain continuity through dir tranvesals with Prac
    this.pages = {};
    this.dirTabs = false;
    this.keyEvents();
  }

  pub(msg) {
    var obj, reset;
    reset = this.resetRoute(msg);
    this.set(msg);
    obj = {
      source: this.source,
      route: this.route,
      compKey: this.compKey,
      pracKey: this.pracKey,
      dispKey: this.dispKey,
      pageKey: this.pageKey
    };
    obj.source = msg.source != null ? msg.source : 'None';
    console.log('Nav.pub()', obj);
    this.stream.publish('Nav', obj);
    if (reset.changed) {
      this.doRoute(reset.route);
    }
  }

  resetRoute(msg) {
    var reset;
    reset = {};
    reset.route = msg['poute'] != null ? msg['poute'] : msg.route != null ? msg.route : this.route;
    reset.changed = ((msg.route != null) && msg.route !== this.route) || (msg['poute'] != null);
    // console.log( 'Nav.resetRoute()', { msg:msg, prev:@route, next:reset.route, changed:reset.changed })
    this.route = msg.route != null ? msg.route : this.route;
    return reset;
  }

  doRoute(route) {
    // console.log( 'Nav.doRoute()', route )
    if (this.$router != null) {
      this.$router.push({
        name: route
      });
    } else {
      console.error('Nav.doRoute() $router not set');
    }
  }

  set(obj) {
    var key, val;
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      this[key] = val;
    }
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
    if (this.dirTabs && (direct === 'east' || direct === 'west')) {
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
    var compKey;
    compKey = this.adjCompKey(this.compKey, dir);
    this.pageKey = 'None';
    this.pub({
      compKey: compKey,
      source: 'Nav.dirComp'
    });
  }

  dirPrac(dir) {
    var adj, obj;
    adj = this.adjPracObj(dir);
    if (adj.name !== 'None') {
      obj = {};
      obj.source = 'Nav.dirPrac';
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
    ddr = dis.dir; // if dir is 'next' or dir is 'prev' then dis.dir else @adjDir(dir)
    dis = this.getDispObj(adj, ddr);
    if (adj.name !== 'None') {
      obj = {};
      obj.source = 'Nav.dirDisp';
      obj.compKey = adj.plane;
      obj.pracKey = adj.name;
      obj.dispKey = dis.name;
      this.pub(obj);
    }
  }

  dirNavs(dir) {
    var obj, route;
    if ((this.pages[this.route] != null) && dir === 'west' || dir === 'east') {
      this.dirPage(dir);
    } else if ((this.navs != null) && (this.navs[this.route] != null)) {
      route = this.navs[this.route][dir];
      obj = {
        route: route,
        compKey: route,
        source: dir
      };
      if (route === 'Info' || route === 'Know' || route === 'Wise') {
        obj.route = 'Comp';
      }
      this.pub(obj);
    }
  }

  // else
  //  console.error( 'Nav.dirNavs() no pages or @navs not specified', { dir:dir, route:@route } )
  dirPage(dir) {
    var pageKey;
    pageKey = this.movePage(this.pages[this.route], dir);
    if (pageKey !== 'None') {
      this.pub({
        source: 'Nav.dirPage'
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
    if (this.pages[route].pages == null) {
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
    var pageKey;
    pageKey = this.getPageKey2(route, defn);
    // console.log( 'Nav.getPageKey',
    //   { route:route, pageKey:pageKey, pageNav:@pageKey, defn:defn, use:@usePageAtt(route), has:@hasPageKey(route) } )
    // console.trace() if not defn? or defn is 'None'
    return pageKey;
  }

  getPageKey2(route, defn) {
    var key, page, ref;
    if (this.usePageAtt(route)) {
      return this.pageKey;
    }
    if (this.pages[route].pages == null) {
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
    if (this.pages[route].pages == null) {
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
    return this.pageKey !== 'None' && (this.pages[route].pages != null) && (this.pages[route].pages[this.pageKey] != null) && (route === 'Comp' || route === 'Prac' || route === 'Disp');
  }

  isMyNav(obj, route) {
    return obj.route === route && this.hasPageKey(route);
  }

  adjCompKey(compKey, dir) {
    var adjDir;
    adjDir = (function() {
      switch (dir) {
        case 'west':
          return 'prev';
        case 'north':
          return 'prev';
        case 'east':
          return 'next';
        case 'south':
          return 'next';
        case 'prev':
          return 'prev';
        case 'next':
          return 'next';
        default:
          return 'next';
      }
    })();
    if (adjDir === 'next') {
      return this.build.next(compKey);
    } else {
      return this.build.prev(compKey);
    }
  }

  adjPracObj(dir) {
    var adjcObj, pracObj;
    pracObj = this.pracs(this.compKey)[this.pracKey];
    adjcObj = this.build.adjacentPractice(pracObj, dir);
    // console.log( 'Nav.adjPrac()', { dir:dir, pracObj:pracObj, adjcObj:adjcObj } )
    return adjcObj;
  }

  getDispObj(pracObj, dirDisp) {
    var dispObj;
    dispObj = this.build.getDir(pracObj, dirDisp);
    // console.log( 'Nav.getDisp()', { dir:dir, prac:prac, disp:disp } )
    return dispObj;
  }

  adjDir(dir) {
    switch (dir) {
      case 'west':
        return 'east';
      case 'north':
        return 'south';
      case 'east':
        return 'west';
      case 'south':
        return 'north';
      default:
        return dir;
    }
  }

  pracs(compKey) {
    return this.batch[compKey].data.pracs;
  }

  disps(compKey, pracKey) {
    return this.batch[compKey].data.pracs[pracKey].disps;
  }

};

export default Nav;
