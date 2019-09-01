var NavMuse,
  hasProp = {}.hasOwnProperty;

import Build from '../../ikw/cube/Build.js';

NavMuse = class NavMuse {
  constructor(stream, batch, compKey1) {
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.compKey = compKey1;
    this.build = new Build(this.batch);
    this.$router = null;
    this.level = 'Comp'; // Prac Disp
    this.pracKey = 'None';
    this.dispKey = 'None';
    this.pageKey = 'Icon';
    this.pageKeys = ['Icon', 'Dirs', 'Conn', 'Summ', 'Desc'];
    this.compass = "";
  }

  pub(change) {
    var levelChanged, obj;
    levelChanged = (change.level != null) && change.level !== this.level;
    this.set(change);
    obj = {
      level: this.level,
      compKey: this.compKey,
      pracKey: this.pracKey,
      dispKey: this.dispKey,
      pageKey: this.pageKey
    };
    obj.source = change.source != null ? change.source : 'None';
    console.log('Nav.pub()', obj);
    this.stream.publish('Nav', obj);
    if (levelChanged) {
      this.route(this.level);
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

  dir(dr, event = null) {
    console.log('Nav.dir()', dr);
    if (event === null) {
      ({});
    }
    if (dr !== 'next' && dr !== 'prev') {
      this.compass = dr;
    }
    switch (this.level) {
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
      obj.level = this.level;
      obj.comp = this.compKey;
      if (adj.name !== this.pracKey) {
        obj.prac = adj.name;
        this.pracKey = adj.name;
      }
      if (adj.plane !== this.compKey) {
        obj.comp = adj.plane;
        this.compKey = adj.plane;
        this.route(this.level, this.compKey, this.pageKey, obj);
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
      obj.level = this.level;
      obj.comp = this.compKey;
      obj.prac = adj.name;
      this.pracKey = adj.name;
      obj.disp = dis.name;
      this.dispKey = dis.name;
      if (adj.plane !== this.compKey) {
        obj.comp = adj.plane;
        this.compKey = adj.plane;
        this.route(this.level, this.compKey, this.pageKey, obj);
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
        obj.level = this.level;
        obj.compKey = this.compKey;
        obj.pageKey = page;
        this.pageKey = page;
        this.routeCompPage(this.compKey, this.pageKey);
      }
    } else {
      this.dirNone(dr);
    }
  }

  dirNone(dir) {
    console.error('Nav.dirNone unknown dir', {
      dir: dir,
      level: this.level
    });
  }

  route(level, compKey = null, pageKey = null) {
    var name;
    name = pageKey != null ? compKey + pageKey : compKey ? compKey : level;
    if (this.$router != null) {
      this.$router.push({
        name: name
      });
    } else {
      console.error('Nav.routeLevel() $router not set');
    }
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

export default NavMuse;
