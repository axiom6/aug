// cd   pub/math/test
// Imported and called by Run.js
// node --experimental-modules -r esm Run.js
var TestMathML;

import MathML from '../ptn/MathML.js';

TestMathML = (function() {
  var add1ML, add2ML, equ1ML, equ2ML, fun1ML, int1ML, lim1ML, mat1ML, mul1ML, mul2ML, mul3ML, par1ML, sin1ML, sin2ML, sub1ML, sub2ML, sum1ML, sum2ML, sum3ML, sus1ML, tan1ML, trg1ML, vec1ML;

  class TestMathML extends MathML {
    constructor() {
      super();
    }

    testMarkup() {
      var exps, key, obj, status;
      exps = {
        Sin1: {
          exp: ['Sin', Math.PI / 6],
          math: sin1ML
        },
        Add1: {
          exp: ['Add', 'a', 'b'],
          math: add1ML
        },
        Equ1: {
          exp: ['Equ', 'E', ['Mul', 'm', ['Pow', 'C', 2]]],
          math: equ1ML
        },
        Sum1: {
          exp: ['Sum', ['Equ', 'i', 1], 'n', ['Sub', 'x', 'i']],
          math: sum1ML
        },
        Mul1: {
          exp: ['Mul', ['Paren', ['Add', 2.2, 3]], ['Paren', ['Add', 1, 2]]],
          math: mul1ML
        },
        Mul2: {
          exp: ['Add', ['Mul', 2.2, 3], ['Mul', 4, 3]],
          math: mul2ML
        },
        Tan1: {
          exp: ['Add', ['Mul', 2.2, 3], ['Mul', 'x', ['Arctan', 'y']]],
          math: tan1ML
        },
        Sub1: {
          exp: ['Sub', ['Mul', 2.2, 3], ['Pow', 'x', 'y']],
          math: sub1ML
        },
        Equ2: {
          exp: ['Equ', ['Pow', 2.2, 3], ['Div', 'x', 'y']],
          math: equ2ML
        },
        Sub2: {
          exp: ['Sub', ['Mul', ['Neg', 2.2], 3], ['Div', 'x', ['Neg', 'y']]],
          math: sub2ML
        },
        Mul3: {
          exp: ['Mul', 'x', ['Mul', 'x', ['Paren', ['Add', 'a', ['Sus', 'b', 1]]]]],
          math: mul3ML
        },
        Sin2: {
          exp: ['Add', 'a', ['Mul', 'b', ['Sin', 'theta']]],
          math: sin2ML
        },
        Fun1: {
          exp: ['Mul', ['Fun', 'fn', ['Add', 'a', 'b']], ['Fun', 'g', 'theta']],
          math: fun1ML
        },
        Int1: {
          exp: ['Int', ['Mul', 'x', 2]],
          math: int1ML
        },
        Vec1: {
          exp: ['Vec', 1, 2, 3],
          math: vec1ML
        },
        Mat1: {
          exp: ['Mat', ['Vec', 1, 2, 3], ['Vec', 4, 5, 6]],
          math: mat1ML
        },
        Lim1: {
          exp: ['Lim', 'i', 'n'],
          math: lim1ML
        },
        Sum2: {
          exp: ['Sum', 'i', 'n', 'j'],
          math: sum2ML
        },
        Sum3: {
          exp: ['Sum', 'i', 'n', ['Add', 'j', 1]],
          math: sum3ML
        }
      };
      console.log("-------------------- testMarkup ----------------------------");
      for (key in exps) {
        obj = exps[key];
        this.markup(obj.exp, key);
        status = this.math[key] === obj.math ? 'Pass' : 'Fail';
        console.log(status, key, obj.exp, '\n  ', this.math[key]);
      }
    }

    testParse(key) {
      var exps, obj, status;
      exps = {
        Par1: {
          asc: "(a+b)*(c^2)",
          math: par1ML
        },
        Trg1: {
          asc: "cos(x)+sin(x)",
          math: trg1ML
        },
        Sus1: {
          asc: "x_1 + x_2",
          math: sus1ML
        },
        Mul1: {
          asc: "(2.2+3)*(1+2)",
          math: mul1ML
        },
        Add2: {
          asc: "2.2*3+4*3",
          math: add2ML
        },
        Tan1: {
          asc: "2.2*3+x*arctan(y)",
          math: tan1ML
        },
        Sub1: {
          asc: "2.2*3-x^y",
          math: sub1ML
        },
        Equ2: {
          asc: "2.2^3 = x/y",
          math: equ2ML
        },
        Sub2: {
          asc: "-2.2 * 3-x / -y",
          math: sub2ML
        },
        Mul3: {
          asc: "x*x*(a+b_1)",
          math: mul3ML
        },
        Sin2: {
          asc: "a+b*sin(theta)",
          math: sin2ML
        },
        Fun1: {
          asc: "fn(a+b)*g(theta)",
          math: fun1ML
        },
        Int1: {
          asc: "int(x*2)",
          math: int1ML
        },
        Vec1: {
          asc: "[1,2,3]",
          math: vec1ML
        },
        Mat1: {
          asc: "[[1,2,3],[4,5,6]]",
          math: mat1ML
        },
        Lim1: {
          asc: "lim_i^n",
          math: lim1ML
        },
        Sum2: {
          asc: "sum_i^n~j",
          math: sum2ML
        },
        Sum3: {
          asc: "sum_i^n~j+1",
          math: sum3ML
        }
      };
      console.log("---------------------- testParse --------------------------");
      for (key in exps) {
        obj = exps[key];
        this.doParse(obj.asc, key);
        status = this.math[key] === obj.math ? 'Pass' : 'Fail';
        console.log(status, key, obj.asc, '\n  ', this.math[key]);
      }
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

  trg1ML = "<math><mrow><mrow>cot<mfence><mi>x</mi></mfence></mrow><mo>+</mo>";

  trg1ML += "<mrow>sin<mfence><mi>x</mi></mfence></mrow></mrow></math>";

  par1ML = "<math><mrow><mfence><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mfence>";

  par1ML += "<mo>*</mo><mfence><msup><mi>c</mi><mn>2</mn></msup></mfence></mrow></math>";

  trg1ML = "<math><mrow><mrow>cot<mfence><mi>x</mi></mfence></mrow><mo>+</mo>";

  trg1ML += "<mrow>sin<mfence><mi>x</mi></mfence></mrow></mrow></math>";

  sus1ML = "<math><mrow><msub><mi>x</mi><mn>1</mn></msub><mo>+</mo><msub><mi>x</mi><mn>2</mn></msub></mrow></math>";

  sin1ML = "<math><mrow>sin<mfence><mn>0.5235987755982988</mn></mfence></mrow></math>";

  add1ML = "<math><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></math>";

  add2ML = "<math><mrow><mrow><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow><mo>+</mo>";

  add2ML += "<mrow><mn>4</mn><mo>*</mo><mn>3</mn></mrow></mrow></math>";

  equ1ML = "<math><mrow><mi>E</mi><mo>=</mo><mrow><mi>m</mi><mo>*</mo><msup>";

  equ1ML += "<mi>C</mi><mn>2</mn></msup></mrow></mrow></math>";

  sum1ML = "<math><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow>";

  sum1ML += "<mi>n</mi></munderover><mrow><mi>x</mi><mo>-</mo><mi>i</mi></mrow></math>";

  mul1ML = "<math><mrow><mfence><mrow><mn>2.2</mn><mo>+</mo><mn>3</mn></mrow></mfence>";

  mul1ML += "<mo>*</mo><mfence><mrow><mn>1</mn><mo>+</mo><mn>2</mn></mrow></mfence></mrow></math>";

  mul2ML = "<math><mrow><mrow><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow><mo>+</mo>";

  mul2ML += "<mrow><mn>4</mn><mo>*</mo><mn>3</mn></mrow></mrow></math>";

  tan1ML = "<math><mrow><mrow><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow><mo>+</mo>";

  tan1ML += "<mrow><mi>x</mi><mo>*</mo><mrow>arctan<mfence><mi>y</mi></mfence></mrow></mrow></mrow></math>";

  sub1ML = "<math><mrow><mrow><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow><mo>-</mo><msup>";

  sub1ML += "<mi>x</mi><mi>y</mi></msup></mrow></math>";

  equ2ML = "<math><mrow><msup><mn>2.2</mn><mn>3</mn></msup><mo>=</mo>";

  equ2ML += "<mfrac><mi>x</mi><mi>y</mi></mfrac></mrow></math>";

  sub2ML = "<math><mrow><mrow><mo>-</mo><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow>";

  sub2ML += "<mo>-</mo><mfrac><mi>x</mi><mo>-</mo><mi>y</mi></mfrac></mrow></math>";

  mul3ML = "<math><mrow><mi>x</mi><mo>*</mo><mrow><mi>x</mi><mo>*</mo><mfence><mrow><mi>a</mi>";

  mul3ML += "<mo>+</mo><msub><mi>b</mi><mn>1</mn></msub></mrow></mfence></mrow></mrow></math>";

  sin2ML = "<math><mrow><mi>a</mi><mo>+</mo><mrow><mi>b</mi><mo>*</mo><mrow>sin";

  sin2ML += "<mfence><mi>theta</mi></mfence></mrow></mrow></mrow></math>";

  fun1ML = "<math><mrow><mrow>fn<mfence><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow>";

  fun1ML += "</mfence></mrow><mo>*</mo><mrow>g<mfence><mi>theta</mi></mfence></mrow></mrow></math>";

  int1ML = "<math><mo>∫;</mo><mrow><mi>x</mi><mo>*</mo><mn>2</mn></mrow></math>";

  vec1ML = "<math><mfenced open='[' close=']'><mn>1</mn><mn>2</mn><mn>3</mn></mfenced></math>";

  mat1ML = "<math><mfenced open='[' close=']'>";

  mat1ML += "<mfenced open='[' close=']'><mn>1</mn><mn>2</mn><mn>3</mn></mfenced>";

  mat1ML += "<mfenced open='[' close=']'><mn>4</mn><mn>5</mn><mn>6</mn></mfenced></mfenced></math>";

  lim1ML = "<math><msubsup><mi>i</mi><mi>n</mi></msubsup></math>";

  sum2ML = "<math><munderover><mo>∑</mo><mi>i</mi><mi>n</mi></munderover><mi>j</mi></math>";

  sum3ML = "<math><munderover><mo>∑</mo><mi>i</mi><mi>n</mi></munderover><mrow><mi>j</mi>";

  sum3ML += "<mo>+</mo><mn>1</mn></mrow></math>";

  return TestMathML;

}).call(this);

//markup( Adds, 'Adds' )
//markup( Suma, 'Suma' )
//markup( Sums, 'Sums' )
export default TestMathML;