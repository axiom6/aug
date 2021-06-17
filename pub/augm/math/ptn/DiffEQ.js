var DiffEQ;

import {
  match
} from '../../../../lib/pub/base/util/Match.js';

import A from '../adt/Adt.js';

import Ptn from '../adt/Ptn.js';

DiffEQ = class DiffEQ {
  constructor() {
    this.vec = this.vec.bind(this);
    this.pow = this.pow.bind(this);
    this.ptns = this.doPtns();
  }

  vec(...args) {
    var a, arg, i, len;
    a = [];
    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];
      a.push(this.d(arg));
    }
    return a;
  }

  pow(u, v) {
    var adt1, adt2, adt3;
    adt1 = [];
    if (typeof v === 'number') {
      adt1 = ['Mul', ['Mul', v, ['Pow', u, v - 1]], this.d(u)];
    } else {
      adt2 = ['Mul', ['Mul', v, ['Pow', u, ['Sub', v, 1]]], this.d(u)];
      adt3 = ['Mul', ['Mul', ['Ln', u], ['Pow', u, v]], this.d(v)];
      adt1 = ['Add', adt2, adt3];
    }
    return adt1;
  }

  d(ast) {
    var dst, e;
    dst = [];
    try {
      dst = match(ast, ...this.ptns);
    } catch (error) {
      e = error;
      console.error('DiffEQ.d()', e);
    }
    return dst;
  }

  doPtns() {
    return Ptn.toPtns([
      A.Equ,
      (u,
      v) => {
        return ['Equ',
      this.d(u),
      this.d(v)];
      },
      A.Add,
      (u,
      v) => {
        return ['Add',
      this.d(u),
      this.d(v)];
      },
      A.Sub,
      (u,
      v) => {
        return ['Sub',
      this.d(u),
      this.d(v)];
      },
      A.Mul,
      (u,
      v) => {
        return ['Add',
      ['Mul',
      v,
      this.d(u)],
      ['Mul',
      u,
      this.d(v)]];
      },
      A.Div,
      (u,
      v) => {
        return ['Div',
      ['Sub',
      ['Mul',
      v,
      this.d(u)],
      ['Mul',
      u,
      this.d(v)]],
      ['Pow',
      v,
      2]];
      },
      A.Pow,
      (u,
      v) => {
        return this.pow(u,
      v);
      },
      A.Neg,
      (u) => {
        return ['Neg',
      this.d(u)];
      },
      A.Recip,
      (u) => {
        return ['Div',
      ['Neg',
      this.d(u)],
      ['Pow',
      u,
      2]];
      },
      A.Abs,
      (u) => {
        return ['Abs',
      this.d(u)];
      },
      A.Paren,
      (u) => {
        return ['Paren',
      this.d(u)];
      },
      A.Brace,
      (u) => {
        return ['Brace',
      this.d(u)];
      },
      A.Ln,
      (u) => {
        return ['Div',
      this.d(u),
      u];
      },
      A.Log,
      (u,
      v) => {
        return ['Mul',
      ['Log',
      ['E',
      r]],
      ['Div',
      this.d(u),
      u]];
      },
      A.Root,
      (u,
      v) => {
        return ['Div',
      this.d(u),
      ['Mul',
      u,
      ['Root',
      u,
      v]]];
      },
      A.Sqrt,
      (u) => {
        return ['Div',
      this.d(u),
      ['Mul',
      ['Sqrt',
      u],
      2]];
      },
      A.E,
      (u) => {
        return ['Mul',
      ['E',
      u],
      this.d(u)];
      },
      A.Sin,
      (u) => {
        return ['Mul',
      ['Cos',
      u],
      this.d(u)];
      },
      A.Cos,
      (u) => {
        return ['Neg',
      ['Mul',
      ['Sin',
      u],
      this.d(u)]];
      },
      A.Tan,
      (u) => {
        return ['Neg',
      ['Mul',
      ['Pow',
      ['Sec',
      u],
      2],
      this.d(u)]];
      },
      A.Csc,
      (u) => {
        return ['Neg',
      ['Mul',
      ['Mul',
      ['Csc',
      u],
      ['Cot',
      u]],
      this.d(u)]];
      },
      A.Sec,
      (u) => {
        return ['Mul',
      ['Mul',
      ['Sec',
      u],
      ['Tan',
      u]],
      this.d(u)];
      },
      A.Cot,
      (u) => {
        return ['Neg',
      ['Mul',
      ['Pow',
      ['Csc',
      u],
      2],
      this.d(u)]];
      },
      A.Arcsin,
      (u) => {
        return ['Div',
      this.d(u),
      ['Sub',
      ['Sqrt',
      1,
      ['Pow',
      u,
      2]]]];
      },
      A.Arccos,
      (u) => {
        return ['Neg',
      ['Div',
      this.d(u),
      ['Sub',
      ['Sqrt',
      1,
      ['Pow',
      u,
      2]]]]];
      },
      A.Arctan,
      (u) => {
        return ['Div',
      this.d(u),
      ['Add',
      1,
      ['Pow',
      u,
      2]]];
      },
      A.Arccot,
      (u) => {
        return ['Neg',
      ['Div',
      this.d(u),
      ['Add',
      1,
      ['Pow',
      u,
      2]]]];
      },
      A.Arccsc,
      (u) => {
        return ['Neg',
      ['Div',
      this.d(u),
      ['Mul',
      u,
      ['Sqrt',
      ['Sub',
      ['Pow',
      u,
      2],
      1]]]]];
      },
      A.Arcsec,
      (u) => {
        return ['Div',
      this.d(u),
      ['Mul',
      u,
      ['Sqrt',
      ['Sub',
      ['Pow',
      u,
      2],
      1]]]];
      },
      A.Fun,
      (f,
      u) => {
        return ['Mul',
      ['D',
      f],
      this.d(u)];
      },
      A.D,
      (u) => {
        return this.d(u);
      },
      A.Int,
      (u) => {
        return u;
      },
      A.DefInt,
      (a,
      b,
      u) => {
        return u;
      },
      A.Sum,
      (a,
      b,
      u) => {
        return ['Sum',
      a,
      b,
      this.d(u)];
      },
      A.Sus,
      (u,
      v) => {
        return ['Sus',
      this.d(u),
      v];
      },
      A.Lim,
      (a,
      b) => {
        return ['Lim',
      a,
      b,
      this.d(u)];
      },
      A.Ratio,
      (u,
      v) => {
        return 0;
      },
      A.Vec,
      (rest) => {
        return this.vec(rest);
      },
      A.Mat,
      (rest) => {
        return this.vec(rest);
      },
      A.Latex,
      (o) => {
        return this.latex(o);
      },
      'String',
      (s) => {
        return ['D',
      s];
      },
      'Number',
      (n) => {
        return 0;
      },
      '_',
      (q) => {
        return this.unk(q);
      }
    ]);
  }

};

export default DiffEQ;

//# sourceMappingURL=DiffEQ.js.map
