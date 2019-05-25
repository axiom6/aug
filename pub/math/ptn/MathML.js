var MathML;

import {
  match
} from '../../bas/util/Match.js';

import A from '../ptn/Adt.js';

import Ascii from '../par/Ascii.js';

//let Ascii = { parse:peg$parse, error:peg$SyntaxError };
//export default Ascii;
MathML = class MathML {
  constructor() {
    // console.log( 'Ascii Import', Ascii )
    A.mathML = this;
    this.key = "";
    this.math = {};
    this.ptns = this.toPtns();
  }

  doParse(asc, key) {
    var asa, err, error, par;
    par = "X";
    err = {};
    try {
      par = Ascii.parse(asc);
      asa = eval(par);
      this.markup(asa, key);
    } catch (error1) {
      error = error1;
      err.found = error.found;
      err.msg = error.message;
      err.loc = error.location;
      console.error('MathML.doParse()', {
        key: key,
        ascii: asc,
        error: err
      });
    }
    return par;
  }

  markup(asa, key) {
    this.key = key;
    this.math[this.key] = "";
    //head()
    this.app("<math>");
    this.exp(asa);
    this.app("</math>"); // ,"</root>"
    console.log('MathML.markup()', this.math[this.key]);
  }

  head() {
    return this.math[this.key] += "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\">\n<?xml-stylesheet type=\"text/css\" href=\"MathML.css\">\n<root xmlns=\"http://www.w3.org/1998/Math/MathML\">";
  }

  app(...args) {
    var arg, i, len;
    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];
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
    this.math[this.key] += `<${t}>${v.toString()}</${t}>`;
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

  unk(q) {
    console.log('Adt _ Unknown', q);
  }

  sum(t, a, b, sym, u) {
    this.beg(t);
    this.tuv(sym, a, b);
    this.end(t);
    this.exp(u);
  }

  exp(asa) {
    var e;
    try {
      // console.log( 'MathML.exp(asa)', asa )
      match(asa, ...this.ptns);
    } catch (error1) {
      e = error1;
      console.error('MathML.exp()', e);
    }
  }

  toPtns() {
    return A.toPtns([
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
      },
      A.Ratio,
      (u,
      v) => {
        return this.tuv('mfrac',
      u,
      v);
      },
      'String',
      (s) => {
        return this.tag('mi',
      s); // Using String identifiers
      },
      'Number',
      (n) => {
        return this.tag('mn',
      n);
      },
      '_',
      (q) => {
        return this.unk(q);
      }
    ]);
  }

  testMarkup(key) {
    var Add, Equ, Sin, Sum, adts;
    Sin = (u) => {
      return A.Sin(A.Num(Math.PI / 6));
    };
    Add = [A.Add, [A.Var, 'a'], [A.Var, 'b']];
    Equ = (u, v) => {
      return A.Equ(A.Var`E`, A.Mul(A.Var`m`, A.Pow(A.Var('C'), A.Num(2))));
    };
    Sum = (a, b, u) => {
      return A.Sum(A.Equ(A.Var('i'), A.Num(1)), A.Var('n'), A.Sub(A.Var('x'), A.Var('i')));
    };
    adts = {
      Sin: Sin,
      Add: Add,
      Equ: Equ,
      Sum: Sum
    };
    console.log('Sin', Sin, A.f1(A.Sin(A.Num(Math.PI / 6))));
    console.log('Equ', Equ, A.f2(A.Equ(A.Var`E`, A.Mul(A.Var`m`, A.Pow(A.Var('C'), A.Num(2))))));
    console.log('Sum', Sum, A.f3(A.Sum(A.Equ(A.Var('i'), A.Num(1)), A.Var('n'), A.Sub(A.Var('x'), A.Var('i')))));
    return;
    switch (key) {
      case 'Sin':
        this.markup(adts.Sin, key);
        break;
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

  testExp() {
    var Adda, Adds, Sina, Sins, Suma, Sums;
    Sina = ['Sin', Math.PI / 6];
    Adda = [
      'Add',
      'a',
      'b' // ['Add','a',['Mul',['x','y']]]
    ];
    Suma = ['Sum', 'i', 'n', 'j'];
    Sins = eval("['Sin',Math.PI/6]");
    Adds = eval("['Add','a','b']");
    Sums = eval("['Sum','i','n','j']");
    console.log('Sin', Sina, Sins);
    console.log('Add', Adda, Adds);
    console.log('Sin', Suma, Sums);
    this.markup(Sina, 'Sina');
    this.markup(Sins, 'Sins');
    this.markup(Adda, 'Adda');
  }

};

//markup( Adds, 'Adds' )
//markup( Suma, 'Suma' )
//markup( Sums, 'Sums' )
export default MathML;
