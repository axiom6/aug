var Points;

Points = class Points {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.main.log(this.klass + '()', this);
  }

};

export default Points;

//# sourceMappingURL=Points.js.map
