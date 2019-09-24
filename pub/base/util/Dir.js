var Dir;

Dir = class Dir {
  constructor(stream, navs, route1 = 'Home') {
    this.touch = this.touch.bind(this);
    this.stream = stream;
    this.navs = navs;
    this.route = route1;
    this.route = 'Home';
    this.$router = null;
  }

  pub(route) {
    // console.log('Dir.pub()', route )
    this.stream.publish('Dir', route);
  }

  touch(dir, event = null) {
    var route;
    // return if dir is 'prev'
    if (event === null) {
      ({});
    }
    route = this.navs[this.route][dir];
    this.pub(route);
    this.doRoute(route, dir);
  }

  doRoute(route, dir = 'None') {
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
