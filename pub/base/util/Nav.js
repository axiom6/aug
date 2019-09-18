var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../../ikw/cube/Build.js';

Nav = class Nav {
  constructor(stream, batch, navs = null) {
    this.tap = this.tap.bind(this);
    this.touch = this.touch.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.navs = navs;
    this.build = new Build(this.batch);
    this.$router = null;
    this.route = 'None'; // Prac Disp
    this.compKey = 'None';
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.pageKey = 'Icon';
    this.pageKeys = ['Icon', 'Dirs', 'Conn', 'Desc'];
    this.compass = "";
  }

  pub(change) {
    var obj, routeChanged;
    routeChanged = (change.route != null) && change.route !== this.route;
    this.set(change);
    obj = {
      route: this.route,
      compKey: this.compKey,
      pracKey: this.pracKey,
      dispKey: this.dispKey,
      pageKey: this.pageKey
    };
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
      console.error('Nav.routeLevel() $router not set');
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

  setPages(array) {
    var i, len, obj;
    this.pageKeys = [];
    for (i = 0, len = array.length; i < len; i++) {
      obj = array[i];
      this.pageKeys.push(obj.key);
    }
  }

  tap() {
    console.log('Nav.tap()');
  }

  touch(dr, event = null) {
    var route;
    // return if dr is 'prev'
    if (event === null) {
      ({});
    }
    route = this.dirs[this.comp][dr];
    this.pub(comp);
    this.doRoute(route);
    // console.log('Nav.dir()', { beg:@comp, dir:dr, end:comp } )
    this.comp = comp;
  }

  dir(dr, event = null) {
    console.log('Nav.dir()', dr);
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
      case 'Page':
        this.dirPage(dr);
        break;
      default:
        this.dirNone(dr);
    }
  }

  dirComp(dir) {
    this.compKey = this.adjComp(this.compKey, dir);
    this.pracObj = this.build.getPractice(this.pracKey.row, this.pracKey.column, this.compKey);
    return this.dispKey = this.getDisp(this.pracKey, this.dispKey.dir);
  }

  dirPrac(dir) {
    var adj, obj;
    adj = this.adjPrac(dir);
    // console.log('Nav.adj()', adj )
    if (adj.name !== 'None') {
      obj = {};
      obj.route = this.route;
      obj.comp = this.compKey;
      if (adj.name !== this.pracKey) {
        obj.prac = adj.name;
        this.pracKey = adj.name;
      }
      if (adj.plane !== this.compKey) {
        obj.comp = adj.plane;
        this.compKey = adj.plane;
        this.doRrouteoute(this.route); // @compKey+@pageKey
      }
      this.pub(obj);
    }
  }

  dirDisp(dir) {
    var adj, dis, obj, prc;
    prc = this.pracKeys(this.compKey)[this.pracKey];
    dis = prc[this.dispKey];
    // if current prac.dir is dir or next or prev we will nav to adjacent prac
    if (dir === dis.dir || (dir === 'next' || dir === 'prev')) {
      adj = this.adjPrac(dir);
      dis = this.getDisp(this.adjDir(this.compass), adj);
    } else {
      adj = prc;
      dis = this.getDisp(this.compass, prc);
    }
    if (adj.name !== 'None') {
      obj = {};
      obj.route = this.route;
      obj.comp = this.compKey;
      obj.prac = adj.name;
      this.pracKey = adj.name;
      obj.disp = dis.name;
      this.dispKey = dis.name;
      if (adj.plane !== this.compKey) {
        obj.comp = adj.plane;
        this.compKey = adj.plane;
        this.doRoute(this.route); // @compKey+@pageKey
      }
      this.pub(obj);
    }
  }

  dirPage(dir) {
    var idx, obj, page;
    if (this.pageKeys.length > 0 && this.pageKey !== 'None') {
      idx = this.pageKeys.indexOf(this.pageKey);
      if (dir === 'east' && idx < this.pageKeys.length - 1) {
        page = this.pageKeys[idx++];
      }
      if (dir === 'west' && idx > 1) {
        page = this.pageKeys[idx--];
      }
      if (page !== this.pageKey) {
        obj = {};
        obj.route = this.route;
        obj.compKey = this.compKey;
        obj.pageKey = page;
        this.pageKey = page;
        this.doRoute(this.route); // @compKey+@pageKey
      }
    } else {
      this.dirNone(dr);
    }
  }

  dirNone(dir) {
    console.error('Nav.dirNone unknown dir', {
      dir: dir,
      route: this.route
    });
  }

  adjComp(compKey, dir) {
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

  adjPrac(dir) {
    var adjcObj, pracObj;
    pracObj = this.pracs(this.compKey)[this.pracKey];
    adjcObj = this.build.adjacentPractice(pracObj, dir);
    // console.log( 'Nav.adjPrac()', { dir:dir, pracObj:pracObj, adjcObj:adjcObj } )
    return adjcObj;
  }

  getDisp(pracObj, dirDisp) {
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
    return this.batch[compKey].data[compKey].pracs;
  }

  disps(compKey, pracKey) {
    return this.batch[compKey].data[compKey][pracKey].disps;
  }

};

export default Nav;
