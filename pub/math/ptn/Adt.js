var Adt;

import {
  _
} from '../../bas/util/Match.js';

Adt = (function() {
  class Adt {
    static toPtn(f) {
      var a, i, j, ref;
      a = [];
      // console.log( 'Adt.toPtn()', f, typeof(f) )
      if (typeof f === 'function') {
        a.push(f.name);
        for (i = j = 0, ref = f.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          a.push(_);
        }
      } else if (f === 'String') {
        a.push(String);
      } else if (f === 'Number') {
        a.push(Number);
      } else if (f === 'Under') {
        a.push(_);
      } else {
        console.error('Adt.toPtn() unknown pattern', f);
      }
      return a;
    }

    static toPtns(adts) {
      var i, j, ptns, ref;
      // console.log( 'Adt.toPtns() adts', adts )
      ptns = new Array(adts.length);
      for (i = j = 0, ref = adts.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        ptns[i] = i % 2 === 0 ? Adt.toPtn(adts[i]) : adts[i];
      }
      ptns.push(String, (s) => {
        return Adt.stag(s);
      });
      ptns.push(Number, (n) => {
        return Adt.ntag(n);
      });
      ptns.push(_, (q) => {
        return Adt.unkn(q);
      });
      // console.log( 'Adt.toPtns() ptns', ptns )
      return ptns;
    }

    static stag(s) {
      return Adt.mathML.tag('mi', s);
    }

    static ntag(n) {
      return Adt.mathML.tag('mn', n);
    }

    static unkm(q) {
      return console.log('unknown match asc', q);
    }

    // Geometric Algerbra
    static Dot(u, v) {
      return u(~v); // Dot product
    }

    static Wedge(u, v) {
      return u ^ v; // Wedge outer generalisze cross product
    }

    static Vee(u, v) {
      return u & v; // Meet or join
    }

    static Dual(u) {
      return u; // Dual
    }

    static Inverse(u) {
      return u; // Inverse
    }

    static Conjugate(u) {
      return u; // Conjugate
    }

    static Reverse(u) {
      return u; // Reverse
    }

    static Involute(u) {
      return u; // Involute
    }

    static Rotor(u) {
      return u; // Rotor
    }

    static Magnitude(u) {
      return u; // Magnitude
    }

    static Grade(u) {
      return u; // Grade
    }

    static Reflect(u, v) {
      return u * v * Adt.conjugate(u);
    }

    static Rotate(u, v) {
      return u * v * Adt.conjugate(u);
    }

    static GP(u, v) {
      return Adt.Dot(u, v) + Adt.Wedge(u, v); // Geometric Product
    }

    
    // Numbers and Variables
    static Var(v) {
      return v;
    }

    static Num(n) {
      return n;
    }

    static Dbl(d) {
      return d;
    }

    static Ratio(u, v) {
      return u / v;
    }

    // Arithmetic
    static Equ(u, v) {
      return u = v;
    }

    static Add(u, v) {
      return u + v;
    }

    static Sub(u, v) {
      return u - v;
    }

    static Mul(u, v) {
      return u * v;
    }

    static Div(u, v) {
      return u / v;
    }

    static Pow(u, v) {
      return u ** v;
    }

    // Unary operator high precendence
    static Neg(u) {
      return -u;
    }

    static Recip(u) {
      return 1 / u;
    }

    static Abs(u) {
      return Math.abs(u);
    }

    // Parenthesis Braces Object Array
    static Paren(u) {
      return u;
    }

    static Brace(u) {
      return {u};
    }

    // Natural Log, Log Base, Root, Square Root and e
    static Ln(u) {
      return Math.log(u); // ln(u)
    }

    static Log(u, b) {
      return Math.log(u) / Math.log(b); // log_b(u)
    }

    static Root(u, r) {
      return Math.pow(u, 1 / r); // root_b(u)
    }

    static Sqrt(u) {
      return Math.sqrt(u); // sqrt(u)
    }

    static E(u) {
      return Math.exp(u); // e**u
    }

    
    // Trigometric
    static Sin(u) {
      return Math.sin(u);
    }

    static Cos(u) {
      return Math.cos(u);
    }

    static Tan(u) {
      return Math.tan(u);
    }

    static Csc(u) {
      return 1.0 / Math.sin(u);
    }

    static Sec(u) {
      return 1.0 / Math.cos(u);
    }

    static Cot(u) {
      return 1.0 / Math.tan(u);
    }

    // Inverse Trigometric
    static Arcsin(u) {
      return Math.asin(u);
    }

    static Arccos(u) {
      return Math.acos(u);
    }

    static Arctan(u) {
      return Math.atan(u);
    }

    static Arccsc(u) {
      return Math.asin(1 / u); // ???
    }

    static Arcsec(u) {
      return Math.acos(1 / u); // ???
    }

    static Arccot(u) {
      return Math.atan(1 / u); // ???
    }

    // Hyperbolic  with Inverse
    static Sinh(u) {
      return Math.sinh(u);
    }

    static Cosh(u) {
      return Math.cosh(u);
    }

    static Tanh(u) {
      return Math.tanh(u);
    }

    static Arccinh(u) {
      return Math.asinh(u);
    }

    static Arccosh(u) {
      return Math.acosh(u);
    }

    static Arctanh(u) {
      return Math.atanh(u);
    }

    // Calculus, Sum and Typsetting
    static Fun(f, u) {
      return u; // f(u) Function
    }

    static D(u) {
      return u; // d(u) Differentiation
    }

    static Int(u) {
      return u; // Integration
    }

    static DefInt(a, b, u) {
      return a + b + u; // Definite Integral
    }

    static Sum(a, b, u) {
      return a + b + u; // Summation
    }

    
    // Subscripts Superscripts Limits
    static Sus(u, a) {
      return u + a; // u_a  Subscript  u^b  Superscript is Power
    }

    static Lim(a, b) {
      return a + b; //_a^b  Limit for Sum and Itg
    }

    // Finge
    static Sim(u) {
      return u; // sim(u) Simplify
    }

    static Not(u) {
      return u; // Not an Adt expression
    }

    static Msg(u) {
      return u; // Parsing error message
    }

    static Unk(u) {
      return u;
    }

  };

  //Obj = (k,v) => { k:v } # ???
  //Arr = (u)   => [ u   ] # ???
  Adt.ArithAdts = [Adt.Var, Adt.Num, Adt.Dbl, Adt.Ratio, Adt.Equ, Adt.Add, Adt.Sub, Adt.Mul, Adt.Div, Adt.Pow, Adt.Neg, Adt.Recip, Adt.Abs, Adt.Paren, Adt.Brace];

  Adt.TransAdts = [Adt.Ln, Adt.Log, Adt.Root, Adt.Sqrt, Adt.E, Adt.Sin, Adt.Cos, Adt.Tan, Adt.Csc, Adt.Sec, Adt.Cot, Adt.Arcsin, Adt.Arccos, Adt.Arctan, Adt.Arccsc, Adt.Arcsec, Adt.Arccot];

  Adt.HyperAdts = [Adt.Sinh, Adt.Cosh, Adt.Tanh, Adt.Arccinh, Adt.Arccosh, Adt.Arctanh];

  Adt.CalculusAdts = [Adt.Fun, Adt.D, Adt.Int, Adt.DefInt, Adt.Sum, Adt.Sub, Adt.Sus, Adt.Lim];

  return Adt;

}).call(this);

export default Adt;
