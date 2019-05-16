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
    var Add, Div, Mul, Sub, calc;
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
    calc = function(exp) {
      return match(exp, ['Add', _, _], (u, v) => {
        return Add(u, v);
      }, ['Sub', _, _], (u, v) => {
        return Sub(u, v);
      }, ['Mul', _, _], (u, v) => {
        return Mul(u, v);
      }, ['Div', _, _], (u, v) => {
        return Div(u, v);
      }, _, 'Calc Error');
    };
    console.log('doExp Add', calc(['Add', 1, 2]));
    console.log('doExp Sub', calc(['Sub', 3, 2]));
    console.log('doExp Mul', calc(['Mul', 3, 4]));
    console.log('doExp Div', calc(['Div', 6, 2]));
    return console.log('doExp Pow', calc(['Pow', 2, 3]));
  }

};

export default Matcher;
