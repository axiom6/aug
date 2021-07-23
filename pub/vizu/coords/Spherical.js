var Spherical;

Spherical = class Spherical {
  
    // radius, long = longitude, lat = latitude
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.opts = this.main.opts;
    this.cartesian = this.main.cartesian;
    this.radius = this.opts.radius != null ? this.opts.radius != null : this.cartesian.xmax;
    this.long1 = this.opts.long1 != null ? this.opts.long1 != null : 90; // Degrees
    this.long2 = this.opts.long2 != null ? this.opts.long2 != null : 30; // Degrees
    this.lat1 = this.opts.lat1 != null ? this.opts.lat1 != null : 90; // Degrees
    this.lat2 = this.opts.lat2 != null ? this.opts.lat2 != null : 30; // Degrees
    this.main.log(this.klass + '()', this);
  }

};

export default Spherical;

//# sourceMappingURL=Spherical.js.map
