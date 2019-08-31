var NavMuse,
  hasProp = {}.hasOwnProperty;

import Build from '../../ikw/cube/Build.js';

NavMuse = class NavMuse {
  constructor(stream, batch, comp1) {
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.comp = comp1;
    this.build = new Build(this.batch);
    this.$router = null;
    this.level = 'Comp'; // Prac Disp Page
    this.prac = 'None';
    this.disp = 'None';
    this.page = 'Icon';
    this.pages = ['Icon', 'Dirs', 'Conn', 'Summ', 'Desc'];
    this.compass = "";
  }

  pub(change) {
    var obj;
    this.set(change);
    obj = {
      level: this.level,
      comp: this.comp,
      prac: this.prac,
      disp: this.disp,
      page: this.page
    };
    obj.source = change.source != null ? change.source : 'None';
    console.log('Nav.pub()', obj);
    this.stream.publish('Nav', obj);
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
    this.pages = [];
    for (i = 0, len = array.length; i < len; i++) {
      obj = array[i];
      this.pages.push(obj.key);
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
    this.comp = this.adjComp(this.comp, dir);
    this.prac = this.build.getPractice(this.prac.row, this.prac.column, this.comp);
    return this.disp = this.getDisp(this.prac, this.disp.dir);
  }

  dirPrac(dir) {
    var adj, obj;
    adj = this.adjPrac(dir);
    // console.log('Nav.adj()', adj )
    if (adj.name !== 'None') {
      obj = {};
      obj.level = this.level;
      obj.comp = this.comp;
      if (adj.name !== this.prac) {
        obj.prac = adj.name;
        this.prac = adj.name;
      }
      if (adj.plane !== this.comp) {
        obj.comp = adj.plane;
        this.comp = adj.plane;
        this.route(this.level, this.comp, this.page, obj);
      }
      this.pub(obj);
    }
  }

  dirDisp(dir) {
    var adj, dis, obj, prc;
    prc = this.pracs(this.comp)[this.prac];
    dis = prc[this.disp];
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
      obj.comp = this.comp;
      obj.prac = adj.name;
      this.prac = adj.name;
      obj.disp = dis.name;
      this.disp = dis.name;
      if (adj.plane !== this.comp) {
        obj.comp = adj.plane;
        this.comp = adj.plane;
        this.route(this.level, this.comp, this.page, obj);
      }
      this.pub(obj);
    }
  }

  dirPage(dir) {
    var idx, obj, page;
    if (this.pages.length > 0 && this.page !== 'None') {
      idx = this.pages.indexOf(this.page);
      if (dir === 'east' && idx < this.pages.length - 1) {
        page = this.pages[idx++];
      }
      if (dir === 'west' && idx > 1) {
        page = this.pages[idx--];
      }
      if (page !== this.page) {
        obj = {};
        obj.level = this.level;
        obj.comp = this.comp;
        obj.page = page;
        this.page = page;
        this.route(this.level, this.comp, this.page, obj);
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

  routeLevel(level) {
    if (this.$router != null) {
      if (this.$router.name !== level) {
        this.$router.push({
          name: level
        });
      }
    } else {
      console.error('Nav.routeLevel() $router not set');
    }
  }

  route(comp, page = null) {
    var name;
    name = page != null ? comp + page : comp;
    if (this.$router != null) {
      this.$router.push({
        name: name
      });
    } else {
      console.error('Nav.router() $router not set');
    }
  }

  adjComp(comp, dir) {
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
      return this.build.next(comp);
    } else {
      return this.build.prev(comp);
    }
  }

  adjPrac(dir) {
    var adj, prc;
    prc = this.pracs(this.comp)[this.prac];
    adj = this.build.adjacentPractice(prc, dir);
    // console.log( 'Nav.adjPrac()', { dor:dir, prc:prc, adj:adj } )
    return adj;
  }

  getDisp(prac, dirDisp) {
    var disp;
    disp = this.build.getDir(prac, dirDisp);
    // console.log( 'Nav.getDisp()', { dir:dir, prac:prac, disp:disp } )
    return disp;
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

  pracs(comp) {
    return this.batch[comp].data[comp].pracs;
  }

  disps(comp, prac) {
    return this.batch[comp].data[comp][prac].disps;
  }

};

export default NavMuse;
