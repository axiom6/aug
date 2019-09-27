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
    this.pageKey = 'Icon';
    this.pages = {};
    this.compass = "";
    this.keyEvents();
  }

  pub(change) {
    var obj, routeChanged;
    routeChanged = (change.route != null) && change.route !== this.route;
    this.set(change);
    obj = {
      source: this.source,
      route: this.route,
      compKey: this.compKey,
      pracKey: this.pracKey,
      dispKey: this.dispKey,
      pageKey: this.pageKey
    };
    if (change.pageKey != null) {
      obj.pageKey = change.pageKey; // Bandaid fix
    }
    obj.source = change.source != null ? change.source : 'None';
    console.log('Nav.pub()', obj);
    this.stream.publish('Nav', obj);
    if (routeChanged) {
      this.doRoute(this.route);
    }
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
      if (key === 'pageKey') {
        console.log('Nav.set() key', key, val, this[key]);
      }
    }
    console.log('Nav.set() obj', obj);
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

  dir(dr, event = null) {
    this.source = dr;
    if (event === null) {
      ({});
    }
    if (dr !== 'next' && dr !== 'prev') {
      this.compass = dr;
    }
    switch (this.route) {
      case 'Comp':
        this.dirComp(dr);
        break;
      case 'Prac':
        this.dirPrac(dr);
        break;
      case 'Disp':
        this.dirDisp(dr);
        break;
      default:
        this.dirNavs(dr);
    }
  }

  dirComp(dir) {
    var compKey;
    compKey = this.adjCompKey(this.compKey, dir);
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
    var adj, dis, obj, prc;
    prc = this.pracs(this.compKey)[this.pracKey];
    dis = prc[this.dispKey];
    // if current prac.dir is dir or next or prev we will nav to adjacent prac
    if (dir === dis.dir || (dir === 'next' || dir === 'prev')) {
      adj = this.adjPracObj(dir);
      dis = this.getDispObj(adj, this.adjDir(this.compass));
    } else {
      adj = prc;
      dis = this.getDispObj(prc, this.compass);
    }
    if (adj.name !== 'None') {
      obj = {};
      obj.source = 'Nav.dirDisp';
      obj.compKey = this.compKey;
      obj.pracKey = adj.name;
      obj.dispKey = dis.name;
      if (adj.plane !== this.compKey) {
        obj.compKey = adj.plane;
      }
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
      if (this.pageKey === 'None') {
        obj.pageKey = 'Icon';
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
        pageKey: pageKey,
        source: 'Nav.dorPage'
      });
    }
  }

  movePage(page, dir) {
    var idx, ndx;
    if (this.hasPageKey(page)) {
      page.pageKey = dir === 'east' ? page.pageKeys[0] : page.pageKeys[page.pageKeys.length - 1];
    } else {
      idx = page.pageKeys.indexOf(page.pageKey);
      if (dir === 'east') {
        ndx = this.range(idx + 1);
      }
      if (dir === 'west') {
        ndx = this.range(idx - 1);
      }
      page.pageKey = page.pageKeys[ndx];
    }
    return page.pageKey;
  }

  range(idx, max) {
    var ndx;
    ndx = idx;
    if (ndx >= max) {
      ndx = 0;
    }
    if (ndx < 0) {
      ndx = max - 1;
    }
    return ndx;
  }

  hasPageKey(page) {
    return (page.pageKey == null) || page.pageKey === 'None';
  }

  setPages(route, pagesObj) {
    this.pages[route] = {};
    this.pages[route].pageKey = 'None';
    this.pages[route].pageKeys = Object.keys(pagesObj);
  }

  setPageKey(route, pageKey) {
    if (this.pages[route] == null) {
      this.pages[route].pageKey = pageKey;
    }
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
        return 'west';
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
