var TestDiffEQ;

import Ptn from '../adt/Ptn.js';

import DiffEQ from '../ptn/DiffEQ.js';

TestDiffEQ = class TestDiffEQ {
  constructor() {
    this.diffEQ = new DiffEQ();
  }

  testDiffEQ() {
    var exp, exps, key, ssa, sst, status;
    exps = {
      Sin1: {
        ast: ['Sin', 'u'],
        dst: ['Mul', ['Cos', 'u'], ['D', 'u']],
        dsa: []
      },
      Add1: {
        ast: ['Add', 'u', 'v'],
        dst: ['Add', ['D', 'u'], ['D', 'v']]
      },
      Mul1: {
        ast: ['Mul', 'u', 'v'],
        dst: ['Add', ['Mul', 'v', ['D', 'u']], ['Mul', 'u', ['D', 'v']]]
      },
      Div1: {
        ast: ['Div', 'u', 'v'],
        dst: ['Div', ['Sub', ['Mul', 'v', ['D', 'u']], ['Mul', 'u', ['D', 'v']]], ['Pow', 'v', 2]],
        dsa: []
      },
      Pow1: {
        ast: ['Pow', 'u', 3],
        dst: ['Mul', ['Mul', 3, ['Pow', 'u', 2]], ['D', 'u']],
        dsa: []
      }
    };
    console.log("-------------------- testDiffEQ ----------------------------");
    for (key in exps) {
      exp = exps[key];
      exp.dsa = this.diffEQ.d(exp.ast);
      sst = Ptn.toSst(exp.dst);
      ssa = Ptn.toSst(exp.dsa);
      status = sst === ssa ? 'Pass' : 'Fail';
      console.log(status, key, exp.ast, '\n  ', sst, '\n  ', ssa);
    }
  }

};

export default TestDiffEQ;

//# sourceMappingURL=TestDiffEQ.js.map
