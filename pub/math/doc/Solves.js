var Exps, Solves,
  hasProp = {}.hasOwnProperty;

import MathML from '../ptn/MathML.js';

Exps = {
  Par1: {
    asc: "(a+b)*(c^2)",
    klass: "",
    mathML: ""
  },
  Trg1: {
    asc: "cos(x)+sin(x)",
    klass: "",
    mathML: ""
  },
  Sus1: {
    asc: "x_1 + x_2",
    klass: "",
    mathML: ""
  },
  Mul1: {
    asc: "(2.2+3)*(1+2)",
    klass: "",
    mathML: ""
  },
  Add2: {
    asc: "2.2*3+4*3",
    klass: "",
    mathML: ""
  },
  Tan1: {
    asc: "2.2*3+x*arctan(y)",
    klass: "",
    mathML: ""
  },
  Sub1: {
    asc: "2.2*3-x^y",
    klass: "",
    mathML: ""
  },
  Equ2: {
    asc: "2.2^3 = x/y",
    klass: "",
    mathML: ""
  },
  Sub2: {
    asc: "-2.2 * 3-x / -y",
    klass: "",
    mathML: ""
  },
  Mul3: {
    asc: "x*x*(a+b_1)",
    klass: "",
    mathML: ""
  },
  Sin2: {
    asc: "a+b*sin(\\theta)",
    klass: "",
    mathML: ""
  },
  Fun1: {
    asc: "fn(a+b)*g(theta)",
    klass: "",
    mathML: ""
  },
  Int1: {
    asc: "int(x*2)",
    klass: "",
    mathML: ""
  },
  Vec1: {
    asc: "[1,2,3]",
    klass: "",
    mathML: ""
  },
  Mat1: {
    asc: "[[1,2,3],[4,5,6]]",
    klass: "",
    mathML: ""
  },
  Lim1: {
    asc: "lim_i^n",
    klass: "",
    mathML: ""
  },
  Sum2: {
    asc: "sum_i^n~j",
    klass: "",
    mathML: ""
  },
  Sum3: {
    asc: "sum_i^n~j+1",
    klass: "",
    mathML: ""
  }
};

Solves = class Solves {
  constructor() {
    this.mathML = new MathML();
    this.ncol = 3;
  }

  math(exps = Exps) {
    var exp, i, key;
    i = 0;
    for (key in exps) {
      if (!hasProp.call(exps, key)) continue;
      exp = exps[key];
      this.mathExp(key, exp, i);
      i = i + 1;
    }
    return exps;
  }

  mathExp(key, exp, i) {
    exp.mathML = this.mathML.parse(exp.asc, key);
    exp.klass = this.mathML.klass(i, this.ncol);
  }

};

export default Solves;
