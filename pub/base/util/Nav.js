var Nav,
  hasProp = {}.hasOwnProperty;

import Build from '../../ikw/cube/Build.js';

Nav = class Nav {
  constructor(stream, batch, comp1) {
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.batch = batch;
    this.comp = comp1;
    this.build = new Build(this.batch, this.comp);
    this.level = 'Comp'; // Plane Prac Disp Tab
    this.prac = 'None';
    this.disp = 'None';
    this.tab = 'Prac';
    this.tabs = [
      'Prac',
      'Conn',
      'Data',
      'Enli' // Set by the active view component
    ];
  }

  
  // Publish twice because Tocs needs to update comp before any Nav view updates
  pub(obj) {
    console.log('Nav.pub()', obj);
    this.stream.publish('Toc', obj);
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

  dir(dr) {
    console.log('Nav.dir()', dr);
    switch (this.level) {
      case 'Comp':
        this.dirPrac(dr);
        break;
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
    console.log('Nav.adj()', adj);
    if (adj.name !== 'None') {
      obj = {};
      obj.level = this.level;
      if (adj.plane !== this.comp) {
        obj.comp = adj.plane;
        this.comp = adj.plane;
      }
      if (adj.name !== this.prac) {
        obj.prac = adj.name;
        this.prac = adj.name;
      }
      this.pub(obj);
    }
  }

  dirDisp(dir) {
    var adj, dis, obj, prc;
    prc = this.pracs(this.comp)[this.prac];
    dis = prc[this.disp];
    if (dis.dir === dir) { // if current prac.dir is dir we will nav to adjacent prac
      adj = this.adjPrac(dir);
      dis = this.getDisp(this.adjDir(dir), adj);
    } else {
      adj = prc;
      dis = this.getDisp(dir, prc);
    }
    if (adj.name !== 'None') {
      obj = {};
      obj.level = this.level;
      if (adj.plane !== this.comp) {
        obj.comp = adj.plane;
        this.comp = adj.plane;
      }
      obj.prac = adj.name;
      this.prac = adj.name;
      obj.disp = dis.name;
      this.disp = dis.name;
      this.pub(obj);
    }
  }

  dirTabs(dir) {
    var idx, obj, tab;
    if (this.tabs.length > 0 && this.tab !== 'None') {
      idx = this.tabs.indexOf(this.tab);
      if (dir === 'east' && idx < this.tabs.length - 1) {
        tab = this.tabs[idx++];
      }
      if (dir === 'west' && idx > 1) {
        tab = this.tabs[idx--];
      }
      if (tab !== this.tab) {
        obj = {};
        obj.level = this.level;
        obj.tab = tab;
        this.tab = tab;
        this.pub(obj);
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

  adjPrac(dir) {
    var adj, prc;
    prc = this.pracs(this.comp)[this.prac];
    adj = this.build.adjacentPractice(prc, dir);
    console.log('Nav.adjPrac()', {
      dor: dir,
      prc: prc,
      adj: adj
    });
    return adj;
  }

  getDisp(dir, practice) {
    return this.build.getDir(practice, dir);
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
      case 'next':
        return 'prev';
      case 'prev':
        return 'next';
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

export default Nav;
