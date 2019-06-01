
import Ptn    from '../adt/Ptn.js'
import DiffEQ from '../ptn/DiffEQ.js'

class TestDiffEQ

  constructor:() ->
    @diffEQ= new DiffEQ()

  testDiffEQ:() ->

    exps =
      Sin1:{ ast:['Sin','u'],     dst:['Mul',['Cos','u'],['D','u']], dsa:[] }
      Add1:{ ast:['Add','u','v'], dst:['Add',['D','u'],['D','v']] }
      Mul1:{ ast:['Mul','u','v'], dst:['Add',['Mul','v',['D','u']],['Mul','u',['D','v']]] }
      Div1:{ ast:['Div','u','v'], dst:['Div',['Sub',['Mul','v',['D','u']],['Mul','u',['D','v']]],['Pow','v','2']],dsa:[]}
      Pow1:{ ast:['Pow','u','3'], dst:['Mul',['Mul','3',['Pow','u',['Sub','3','1']]],['D','u']], dsa:[] }

    console.log( "-------------------- testDiffEQ ----------------------------" )

    for key, exp of exps
      exp.dsa = @diffEQ.d(  exp.ast )
      sst     =  Ptn.toSst( exp.dst )
      ssa     =  Ptn.toSst( exp.dsa )
      status  = if sst is ssa then 'Pass' else 'Fail'
      console.log( status, key, exp.ast, '\n  ', sst, '\n  ', ssa )
    return

export default TestDiffEQ
