var Dir;

Dir = class Dir {
  constructor(stream, navs) {
    this.touch = this.touch.bind(this);
    this.stream = stream;
    this.navs = navs;
    this.route = 'Home';
    this.$router = null;
  }

  pub(obj) {
    // console.log('Dir.pub()', obj )
    this.stream.publish('Dir', obj);
  }

  touch(dir, event = null) {
    var obj, route;
    // return if dir is 'prev'
    if (event === null) {
      ({});
    }
    route = this.navs[this.route][dir];
    obj = {
      source: 'Dir',
      route: route
    };
    this.pub(obj);
    this.doRoute(route, dir);
  }

  doRoute(route) {
    if (this.$router != null) {
      this.$router.push({
        name: route
      });
    } else {
      console.error('Nav.router() $router not set');
    }
    // console.log('Dir.doRoute()', { beg:@route, dir:dir, end:route } )
    this.route = route;
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

export default Dir;
