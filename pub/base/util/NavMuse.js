var NavMuse,
  hasProp = {}.hasOwnProperty;

import Build from '../../ikw/cube/Build.js';

NavMuse = class NavMuse {
  constructor(stream, batch, comp1) {
    // console.log('Nav.set()', obj, @page )
    this.tap = this.tap.bind(this);
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.comp = comp1;
    this.build = new Build(this.batch, this.comp);
    this.$router = null;
    this.level = 'Prac'; // Prac Disp Tab
    this.prac = 'None';
    this.disp = 'None';
    this.page = 'Conn';
    this.pages = [
      'Conn',
      'Prac',
      'Data',
      'Enli',
      'Icon' // Set by the active view component
    ];
    this.queue = null; // Last published obj created before route call request by new component
    this.queued = false;
    this.compass = "";
    this.subscribe();
  }

  subscribe() {
    return this.stream.subscribe('Page', 'NavMuse', (page) => {
      console.log('NavMuse.sub()', page);
      return this.page = page;
    });
  }

  // Publish twice because Tocs needs to update comp before any Nav view updates
  pub(obj) {
    // console.log('Nav.pub()', obj )
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
      case 'Prac':
        this.dirPrac(dr);
        break;
      case 'Disp':
        this.dirDisp(dr);
        break;
      case 'Tabs':
        this.dirTabs(dr);
        break;
      default:
        this.dirNone(dr);
    }
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

  dirTabs(dir) {
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

  route(level, comp, page, obj) {
    if (this.$router != null) {
      if (level !== 'Tabs') {
        this.$router.push({
          name: comp
        });
      }
      this.$router.push({
        name: comp + page
      });
    } else {
      // console.log(   'Nav.router()', { name:comp+page } )
      console.error('Nav.router() $router not set');
    }
    // Oueue up obj for for component to request when mounted
    this.queue = obj;
    this.queued = true;
  }

  que(source, queued) {
    // console.log( 'Nav.que()', { source:source, queued:@queued, queue:@queue } )
    this.queued = queued;
    return this.queue;
  }

  adjPrac(dir) {
    var adj, prc;
    prc = this.pracs(this.comp)[this.prac];
    adj = this.build.adjacentPractice(prc, dir);
    // console.log( 'Nav.adjPrac()', { dor:dir, prc:prc, adj:adj } )
    return adj;
  }

  getDisp(dir, practice) {
    var dis;
    dis = this.build.getDir(practice, dir);
    // console.log( 'Nav.getDisp()', { dir:dir, practice:practice, dis:dis } )
    return dis;
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
