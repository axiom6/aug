var MathML;

import {
  match
} from '../../bas/util/Match.js';

import A from '../ptn/Adt.js';

import Ptn from '../ptn/Ptn.js';

import Ascii from '../par/Ascii.esm.js';

//let Ascii = { parse:peg$parse, error:peg$SyntaxError };
//export default Ascii;
MathML = class MathML {
  constructor() {
    this.key = "";
    this.math = {};
    this.ptns = this.doPtns();
  }

  doParse(asc, key) {
    var asa, e, err, par;
    par = "X";
    asa = [];
    err = {};
    try {
      par = Ascii.parse(asc);
      try {
        // console.log( 'MathML.doParse() par', par )
        asa = eval(par);
        // console.log( 'MathML.doParse() asa', asa )
        this.markup(asa, key);
      } catch (error) {
        e = error;
        console.error('MathML.doParse() eval  error', key, e);
      }
    } catch (error) {
      e = error;
      err.found = e.found;
      err.msg = e.message;
      err.loc = e.location;
      console.error('MathML.doParse() parse error', {
        key: key,
        ascii: asc,
        error: err
      });
    }
  }

  markup(asa, key) {
    this.key = key;
    this.math[this.key] = "";
    //head()
    this.app("<math>");
    this.exp(asa);
    this.app("</math>"); // ,"</root>"
  }

  // console.log( 'MathML.markup()', @math[@key] )
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
    this.beg('mrow');
    this.beg('mo');
    this.app(op);
    this.end('mo');
    this.exp(u);
    this.end('mrow');
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
    this.tag('mi', f);
    this.fen(u);
    this.end('mrow');
  }

  fen(u) {
    this.beg('mfenced');
    this.exp(u);
    this.end('mfenced');
  }

  vec(rest) {
    var e, i, len;
    this.beg("mfenced open='[' close=']'");
// MathML takes care of commans
    for (i = 0, len = rest.length; i < len; i++) {
      e = rest[i];
      this.exp(e);
    }
    this.end("mfenced");
  }

  unk(q) {
    console.log('_ MathML Unknown', q);
  }

  noop(arg) {
    if (arg === false) {
      ({});
    }
  }

  sum(t, a, b, sym, u) {
    this.beg(t);
    this.tag('mo', sym);
    this.exp(a);
    this.exp(b);
    this.end(t);
    this.exp(u);
  }

  // A little off for now
  lim(t, a, b, u) {
    this.beg(t);
    this.tag('mi', u);
    this.exp(a);
    this.exp(b);
    this.end(t);
  }

  exp(asa) {
    var e;
    try {
      // console.log( 'MathML.exp(asa)', asa )
      match(asa, ...this.ptns);
    } catch (error) {
      e = error;
      console.error('MathML.exp()', e);
    }
  }

  doPtns() {
    return Ptn.toPtns([
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
      1,
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
      'e',
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
        return this.uni('\u222B',
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
        return this.lim('msubsup',
      a,
      b,
      'lim');
      },
      A.Ratio,
      (u,
      v) => {
        return this.tuv('mfrac',
      u,
      v);
      },
      A.Vec,
      (rest) => {
        return this.vec(rest);
      },
      A.Mat,
      (rest) => {
        return this.vec(rest);
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

};

export default MathML;
