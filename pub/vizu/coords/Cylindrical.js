var Cylindrical;

Cylindrical = class Cylindrical {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.opts = this.main.opts;
    this.cartesian = this.main.cartesian;
    this.radius = this.opts.radius != null ? this.opts.radius != null : this.cartesian.xmax;
    this.height = this.opts.height != null ? this.opts.height != null : this.cartesian.ymax;
    this.dtick1 = this.opts.dtick1 != null ? this.opts.dtick1 != null : 90; // Degrees
    this.dtick2 = this.opts.dtick2 != null ? this.opts.dtick2 != null : 30; // Degrees
    this.rtick1 = this.opts.rtick1 != null ? this.opts.rtick1 != null : this.radius * 0.10;
    this.rtick2 = this.opts.rtick2 != null ? this.opts.rtick2 != null : this.radius * 0.01;
    this.htick1 = this.opts.htick1 != null ? this.opts.htick1 != null : this.height * 0.10;
    this.htick2 = this.opts.htick2 != null ? this.opts.htick2 != null : this.height * 0.01;
    this.main.log(this.klass + '()', this);
  }

};

export default Cylindrical;

//# sourceMappingURL=Cylindrical.js.map
