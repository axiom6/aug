// cd   pub/math/test
// Imported and called by Run.js
// node --experimental-modules -r esm Run.js
var TestMathML;

import MathML from '../ptn/MathML.js';

TestMathML = class TestMathML extends MathML {
  constructor() {
    super();
  }

  testMarkup(key) {
    var Add, Equ, Exps, Sin, Sum;
    Sin = ['Sin', Math.PI / 6];
    Add = ['Add', 'a', 'b'];
    Equ = ['Equ', 'E', ['Mul', 'm', ['Pow', 'C', 2]]];
    Sum = ['Sum', ['Equ', 'i', 1], 'n', ['Sub', 'x', 'i']];
    Exps = {
      Sin: Sin,
      Add: Add,
      Equ: Equ,
      Sum: Sum
    };
    switch (key) {
      case 'Sin':
        this.markup(Sin, key);
        break;
      case 'Add':
        this.markup(Add, key);
        break;
      case 'Equ':
        this.markup(Equ, key);
        break;
      case 'Sum':
        this.markup(Sum, key);
        break;
      default:
        this.markup(Add, key);
    }
    console.log("-------------------- testMarkup ----------------------------");
    console.log('MathML.markup', {
      key: key,
      exp: Exps[key],
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
export default TestMathML;
