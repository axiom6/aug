var Nav,
  hasProp = {}.hasOwnProperty;

Nav = class Nav {
  constructor(stream, dirs, comp1) {
    // console.log('Nav.set()', obj, @tab )
    this.dir = this.dir.bind(this);
    this.stream = stream;
    this.dirs = dirs;
    this.comp = comp1;
    this.$router = null;
    this.queue = null; // Last published obj created before route call request by new component
    this.queued = false;
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

  dir(dr, event = null) {
    var comp;
    if (dr === 'prev') {
      return;
    }
    if (event === null) {
      ({});
    }
    comp = this.dirs[this.comp][dr];
    this.pub(comp);
    if (this.$router != null) {
      this.$router.push({
        name: comp
      });
    }
    console.log('Nav.dir()', {
      beg: this.comp,
      dir: dr,
      end: comp
    });
    this.comp = comp;
  }

  route(comp, obj) {
    if (this.$router != null) {
      this.$router.push({
        name: comp
      });
    } else {
      // console.log(   'Nav.router()', { name:comp } )
      console.error('Nav.router() $router not set');
    }
    // Oueue up obj for for component to request when mounted
    this.comp = comp;
    this.queue = obj;
    this.queued = true;
  }

  que(source, queued) {
    // console.log( 'Nav.que()', { source:source, queued:@queued, queue:@queue } )
    this.queued = queued;
    return this.queue;
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

};

export default Nav;
