var Differ, Exps,
  hasProp = {}.hasOwnProperty;

import Ptn from '../adt/Ptn.js';

import DiffEQ from '../ptn/DiffEQ.js';

import MathML from '../ptn/MathML.js';

Exps = {
  Sin1S: {
    ascii: "sin(u)",
    klass: "r1c1",
    ast: [],
    mathML: ""
  },
  Add1S: {
    ascii: "u+v",
    klass: "r1c2",
    ast: [],
    mathML: ""
  },
  Mul1S: {
    ascii: "u*v",
    klass: "r1c3",
    ast: [],
    mathML: ""
  },
  Sin1D: {
    ascii: "sin(u)",
    klass: "r2c1",
    ast: [],
    mathML: ""
  },
  Add1D: {
    ascii: "u+v",
    klass: "r2c2",
    ast: [],
    mathML: ""
  },
  Mul1D: {
    ascii: "u*v",
    klass: "r2c3",
    ast: [],
    mathML: ""
  },
  Div1S: {
    ascii: "u/v",
    klass: "r3c1",
    ast: [],
    mathML: ""
  },
  Pow1S: {
    ascii: "u^3",
    klass: "r3c2",
    ast: [],
    mathML: ""
  },
  Lnn1S: {
    ascii: "ln(u)",
    klass: "r3c3",
    ast: [],
    mathML: ""
  },
  Div1D: {
    ascii: "u/v",
    klass: "r4c1",
    ast: [],
    mathML: ""
  },
  Pow1D: {
    ascii: "u^3",
    klass: "r4c2",
    ast: [],
    mathML: ""
  },
  Lnn1D: {
    ascii: "ln(u)",
    klass: "r4c3",
    ast: [],
    mathML: ""
  }
};

Differ = class Differ {
  constructor() {
    this.diffEQ = new DiffEQ();
    this.mathML = new MathML();
    this.ncol = 3;
  }

  math(exps = Exps) {
    var exp, key;
    for (key in exps) {
      if (!hasProp.call(exps, key)) continue;
      exp = exps[key];
      if (key.charAt(4) === 'S') {
        this.mathExp(key, exps);
      }
    }
    return exps;
  }

  mathExp(key, exps) {
    var ked;
    ked = key.substring(0, 4) + 'D';
    exps[key].ast = Ptn.parse(exps[key].ascii);
    exps[ked].ast = this.diffEQ.d(exps[key].ast);
    exps[key].mathML = this.mathML.markup(exps[key].ast, key);
    exps[ked].mathML = this.mathML.markup(exps[ked].ast, ked);
  }

};

export default Differ;

//# sourceMappingURL=Differ.js.map
