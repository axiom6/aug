var MathML;

import {
  match,
  _
} from '../../bas/util/Match.js';

import A from '../ptn/Adt.js';

import Ascii from '../par/Ascii.js';

MathML = class MathML {
  constructor() {
    // console.log( 'Ascii Import', Ascii )
    this.key = "";
    this.math = {};
    this.ptns = this.toPtns();
  }

  doParse(asc, key) {
    var ast, err, error, par;
    par = "X";
    err = {};
    try {
      par = Ascii.parse(asc);
      ast = new Function(par);
      return this.markup(ast, key);
    } catch (error1) {
      error = error1;
      err.found = error.found;
      err.msg = error.message;
      err.loc = error.location;
      return console.error('MathML.doParse()', {
        key: key,
        ascii: asc,
        error: err
      });
    } finally {
      return par;
    }
  }

  markup(ast, key) {
    this.key = key;
    this.math[this.key] = "";
    this.head();
    this.app("<math>");
    this.exp(ast);
    this.app("</math>", "</root>");
  }

  head() {
    return this.math[this.key] += "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\">\n<?xml-stylesheet type=\"text/css\" href=\"MathML.css\">\n<root xmlns=\"http://www.w3.org/1998/Math/MathML\">";
  }

  app(...args) {
    var arg, j, len;
    for (j = 0, len = args.length; j < len; j++) {
      arg = args[j];
      this.math[this.key] += arg;
    }
  }

  beg(t) {
    this.math[this.key] += `<${t}>`;
  }

  end(t) {
    this.math[this.key] += `</${t}>`;
  }

  tag(t, v) {
    this.math[this.key] += `<${t}>${v.toString()}</${t}>#`;
  }

  bin(t, u, op, v) {
    this.beg(t);
    this.exp(u);
    this.beg('mo');
    this.app(op);
    this.end('mo');
    this.exp(v);
    this.end(t);
  }

  uni(op, u) {
    this.beg('mo');
    this.app(op);
    this.end('mo');
    this.exp(u);
  }

  sur(bop, u, eop) {
    this.beg('mo');
    this.app(bop);
    this.end('mo');
    this.exp(u);
    this.beg('mo');
    this.app(eop);
    this.end('mo');
  }

  tuv(t, u, v) {
    this.beg(t);
    this.exp(u);
    this.exp(v);
    this.end(t);
  }

  fun(f, u) {
    this.beg('mrow');
    this.app(f);
    this.fen(u);
    this.end('mrow');
  }

  fen(u) {
    this.beg('mfence');
    this.exp(u);
    this.end('mfence');
  }

  unk(u) {
    console.log('Adt _ Unknown', u);
  }

  sum(t, a, b, sym, u) {
    this.beg(t);
    this.tuv(sym, a, b);
    this.end(t);
    this.exp(u);
  }

  exp(ast) {
    var e, ex;
    ex = A.toExp(ast);
    try {
      console.log('MathML.exp(ast)', ast, ex);
      return match(ex, ...this.ptns);
    } catch (error1) {
      e = error1;
      return console.error('MathML.exp()', e);
    } finally {
      return;
    }
  }

  toPtns() {
    return A.toPtns([
      A.Var,
      (s) => {
        return this.tag('mi',
      s);
      },
      A.Num,
      (n) => {
        return this.tag('mn',
      n);
      },
      A.Dbl,
      (d) => {
        return this.tag('mn',
      d);
      },
      A.Ratio,
      (u,
      v) => {
        return this.tuv('mfrac',
      u,
      v);
      },
      A.Equ,
      (u,
      v) => {
        return this.bin('mrow',
      u,
      '=',
      v);
      },
      A.Add,
      (u,
      v) => {
        return this.bin('mrow',
      u,
      '+',
      v);
      },
      A.Sub,
      (u,
      v) => {
        return this.bin('mrow',
      u,
      '-',
      v);
      },
      A.Mul,
      (u,
      v) => {
        return this.bin('mrow',
      u,
      '*',
      v);
      },
      A.Div,
      (u,
      v) => {
        return this.tuv('mfrac',
      u,
      v);
      },
      A.Pow,
      (u,
      v) => {
        return this.tuv('msup',
      u,
      v);
      },
      A.Neg,
      (u) => {
        return this.uni('-',
      u);
      },
      A.Recip,
      (v) => {
        return this.tuv('mfrac',
      A.Num(1),
      v);
      },
      A.Abs,
      (u) => {
        return this.sur('|',
      u,
      '|');
      },
      A.Paren,
      (u) => {
        return this.fen(u);
      },
      A.Brace,
      (u) => {
        return this.fen(u);
      },
      A.Ln,
      (u) => {
        return this.fun('ln',
      u);
      },
      A.Log,
      (u,
      v) => {
        return u + v;
      },
      A.Root,
      (u,
      v) => {
        return u + v;
      },
      A.Sqrt,
      (u) => {
        return this.tag('msqrt',
      u);
      },
      A.E,
      (u) => {
        return this.tuv('msup',
      A.Var('e'),
      v);
      },
      A.Sin,
      (u) => {
        return this.fun('sin',
      u);
      },
      A.Cos,
      (u) => {
        return this.fun('cot',
      u);
      },
      A.Tan,
      (u) => {
        return this.fun('tan',
      u);
      },
      A.Csc,
      (u) => {
        return this.fun('csc',
      u);
      },
      A.Sec,
      (u) => {
        return this.fun('sec',
      u);
      },
      A.Cot,
      (u) => {
        return this.fun('cot',
      u);
      },
      A.Arcsin,
      (u) => {
        return this.fun('arcsin',
      u);
      },
      A.Arccos,
      (u) => {
        return this.fun('arccot',
      u);
      },
      A.Arctan,
      (u) => {
        return this.fun('arctan',
      u);
      },
      A.Arccsc,
      (u) => {
        return this.fun('arccsc',
      u);
      },
      A.Arcsec,
      (u) => {
        return this.fun('arcsec',
      u);
      },
      A.Arccot,
      (u) => {
        return this.fun('arccot',
      u);
      },
      A.Fun,
      (f,
      u) => {
        return this.fun(f,
      u);
      },
      A.D,
      (u) => {
        return this.uni('d',
      u);
      },
      A.Int,
      (u) => {
        return this.uni('\u222B;',
      u);
      },
      A.DefInt,
      (a,
      b,
      u) => {
        return this.sum('msubsup',
      a,
      b,
      '\u222B',
      u);
      },
      A.Sum,
      (a,
      b,
      u) => {
        return this.sum('munderover',
      a,
      b,
      '\u2211',
      u);
      },
      A.Sus,
      (u,
      v) => {
        return this.tuv('msub',
      u,
      v);
      },
      A.Lim,
      (a,
      b) => {
        return this.tuv('msubsup',
      a,
      b);
      }
    ]);
  }

  doExp() {
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
    calc1 = function(exp) {
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
      return match(exp, ...ptns);
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

  testMarkup(key) {
    var Add, Equ, Sum, adts;
    Add = [A.Add, [A.Var, 'a'], [A.Var, 'b']];
    Equ = (u, v) => {
      return A.Equ(A.Var`E`, A.Mul(A.Var`m`, A.Pow(A.Var('C'), A.Num(2))));
    };
    Sum = (a, b, u) => {
      return A.Sum(A.Equ(A.Var('i'), A.Num(1)), A.Var('n'), A.Sub(A.Var('x'), A.Var('i')));
    };
    adts = {
      Add: Add,
      Equ: Equ,
      Sum: Sum
    };
    switch (key) {
      case 'Add':
        this.markup(adts.Add, key);
        break;
      case 'Equ':
        this.markup(adts.Equ, key);
        break;
      default:
        this.markup(adts.Sum, key);
    }
    console.log("-------------------- testMarkup ----------------------------");
    console.log('MathML.markup', {
      key: key,
      adt: adts[key],
      mathML: this.math[key]
    });
  }

  testParse(key) {
    var ascs;
    ascs = {
      add: "(a+b)*(c^2)",
      trg: "cos(x)+sin(x)",
      sus: "x_1 + x_2"
    };
    switch (key) {
      case 'add':
        this.doParse(ascs.add, 'add');
        break;
      case 'trg':
        this.doParse(ascs.trg, 'trg');
        break;
      default:
        this.doParse(ascs.sus, 'sus');
    }
    console.log('MathML.parse', {
      key: key,
      asc: ascs[key],
      mathML: this.math[key]
    });
    console.log("---------------------- testParse --------------------------");
  }

};

export default MathML;
