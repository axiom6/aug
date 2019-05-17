var Matcher;

import {
  match,
  _,
  REST
} from '../../bas/util/Match.js';

Matcher = class Matcher {
  static doMatches() {
    var e;
    try {
      Matcher.doMatch(3);
      Matcher.doMatch(3.14);
      Matcher.doMatch(['str', 3.14]);
      Matcher.doMatch([1, 2, 3]);
      Matcher.doMatch({
        x: 'x'
      });
      Matcher.doMatch({});
      Matcher.doLisp();
      return Matcher.doExp();
    } catch (error) {
      e = error;
      return console.error('Marcher.doMatches()', e);
    }
  }

  static doMatch(x) {
    var msg;
    msg = match(x, 3, "this matches the number 3", Number, "matches any JavaScript number", [String, Number], (a, b) => {
      return "a typed Array [a, b] that you can use in a function";
    }, [1, 2, _], "any Array of 3 elements that begins with [1, 2]", {
      x: _
    }, "any Object with a key 'x' and any value associated", _, "anything else");
    console.log('Matcher.doMatch()', msg);
  }

  static doLisp() {
    var lisp, minus, plus, reduce;
    lisp = function(exp) {
      return match(exp, Function, (x) => {
        return x;
      }, [Function, REST], (f, rest) => {
        return f.apply(null, rest.map(lisp));
      }, Array, (l) => {
        return l.map(lisp);
      }, _, (x) => {
        return x;
      });
    };
    plus = (a, b) => {
      return a + b;
    };
    minus = (a, b) => {
      return a - b;
    };
    reduce = (f, l) => {
      return l.reduce(f);
    };
    console.log('lisp 3', lisp([plus, 1, 2]));
    console.log('lisp 3', lisp([plus, 1, [minus, 4, 2]]));
    console.log('lisp 6', lisp([reduce, plus, [1, 2, 3]]));
  }

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
      console.log('adts', adts);
      ptns = new Array(adts.length);
      for (i = j = 0, ref = adts.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        ptns[i] = i % 2 === 1 ? f2(adts[i]) : adts[i];
      }
      return ptns;
    };
    calc1 = function(exp) {
      var ptns;
      ptns = toPtns([
        exp,
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
      console.log('ptns', ptns);
      return match(...ptns);
    };
    calc1(['Add', 1, 2]);
    calc2 = function(exp) {
      return match(exp, f2(Add), (u, v) => {
        return Add(u, v);
      }, f2(Sub), (u, v) => {
        return Sub(u, v);
      }, f2(Mul), (u, v) => {
        return Mul(u, v);
      }, f2(Div), (u, v) => {
        return Div(u, v);
      }, _, 'Calc2 Error');
    };
    calc3 = function(exp) {
      return match(exp, ['Add', _, _], (u, v) => {
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

export default Matcher;
