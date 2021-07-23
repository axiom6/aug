var Data;

Data = class Data {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.main.log(this.klass + '()', this);
  }

};

export default Data;

//# sourceMappingURL=Data.js.map
