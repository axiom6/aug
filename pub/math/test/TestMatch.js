// cd   pub/math/test
// node  node --experimental-modules -r esm TestMatch.js
var TestMatch;

import {
  match,
  _
} from '../../bas/util/Match.js';

TestMatch = class TestMatch {
  static doExp() {
    var Add, Div, Mul, Neg, Sub, calc1, calc2, calc3, f1, f2, fa, toPtns;
    Add = (u, v) => {
      return u + v;
    };
    Sub = (u, v) => {
      return u - v;
    };
    Mul = (u, v) => {
      return u * v;
    };
    Div = (u, v) => {
      return u / v;
    };
    Neg = (u) => {
      return -u;
    };
    f1 = (f) => {
      return [f.name, _];
    };
    f2 = (f) => {
      return [f.name, _, _];
    };
    fa = (f) => {
      var a, i, j, ref;
      a = [f.name];
      for (i = j = 0, ref = f.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        a.push(_);
      }
      return a;
    };
    console.log('f2 Add', f2(Add));
    console.log('fa Add', fa(Add));
    console.log('fa Neg', fa(Neg));
    toPtns = (adts) => {
      var i, j, ptns, ref;
      // console.log( 'MathML.doExp.toPtns() adts', adts )
      ptns = new Array(adts.length);
      for (i = j = 0, ref = adts.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        ptns[i] = i % 2 === 0 ? f2(adts[i]) : adts[i];
      }
      console.log('MathML.doExp.toPtns() ptns', ptns);
      return ptns;
    };
    calc1 = function(ast) {
      var ptns;
      ptns = toPtns([
        Add,
        (u,
        v) => {
          return Add(u,
        v);
        },
        Sub,
        (u,
        v) => {
          return Sub(u,
        v);
        },
        Mul,
        (u,
        v) => {
          return Mul(u,
        v);
        },
        Div,
        (u,
        v) => {
          return Div(u,
        v);
        }
      ]);
      return match(ast, ...ptns);
    };
    calc1(['Add', 1, 2]);
    calc2 = function(ast) {
      return match(ast, f2(Add), (u, v) => {
        return Add(u, v);
      }, f2(Sub), (u, v) => {
        return Sub(u, v);
      }, f2(Mul), (u, v) => {
        return Mul(u, v);
      }, f2(Div), (u, v) => {
        return Div(u, v);
      }, _, 'Calc2 Error');
    };
    calc3 = function(ast) {
      return match(ast, ['Add', _, _], (u, v) => {
        return Add(u, v);
      }, ['Sub', _, _], (u, v) => {
        return Sub(u, v);
      }, ['Mul', _, _], (u, v) => {
        return Mul(u, v);
      }, ['Div', _, _], (u, v) => {
        return Div(u, v);
      }, _, 'Calc3 Error');
    };
    console.log('doExp Add', calc2(['Add', 1, 2]));
    console.log('doExp Sub', calc3(['Sub', 3, 2]));
    console.log('doExp Mul', calc2(['Mul', 3, 4]));
    console.log('doExp Div', calc1(['Div', 6, 2]));
    if (calc1 === false && calc2 === false && calc3 === false && f1 === false && fn === false) {
      return {};
    }
  }

};

TestMatch.doExp();

export default TestMatch;
