var Lines;

Lines = class Lines {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.main.log(this.klass + '()', this);
  }

};

export default Lines;

//# sourceMappingURL=Lines.js.map
