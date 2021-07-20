
# cd   pub/augm/math/test
# node  node --experimental-modules -r esm TestMatch.js

import {match,_} from '../../../lib/pub/util/Match.js'

class TestMatch

  @doExp:() ->

    Add = (u,v) =>  u + v
    Sub = (u,v) =>  u - v
    Mul = (u,v) =>  u * v
    Div = (u,v) =>  u / v
    Neg = (u)   => -u

    f1 = (f) => [f.name,_]
    f2 = (f) => [f.name,_,_]
    fa = (f) =>
      a = [f.name]
      a.push(_) for i in [0...f.length]
      a

    console.log( 'f2 Add', f2(Add) )
    console.log( 'fa Add', fa(Add) )
    console.log( 'fa Neg', fa(Neg) )

    toPtns = ( adts ) =>
      # console.log( 'MathML.doExp.toPtns() adts', adts )
      ptns = new Array(adts.length)
      for i in [0...adts.length]
        ptns[i] = if i%2 is 0 then f2(adts[i]) else adts[i]
      console.log( 'MathML.doExp.toPtns() ptns', ptns )
      ptns

    calc1 = ( ast ) ->
      ptns = toPtns([
        Add, (u,v) => Add(u,v),
        Sub, (u,v) => Sub(u,v),
        Mul, (u,v) => Mul(u,v),
        Div, (u,v) => Div(u,v)  ] )
      match( ast, ...ptns )

    calc1(['Add',1,2] )

    calc2 = ( ast ) ->
      match(  ast,
        f2(Add), (u,v) => Add(u,v),
        f2(Sub), (u,v) => Sub(u,v),
        f2(Mul), (u,v) => Mul(u,v),
        f2(Div), (u,v) => Div(u,v),
        _,            'Calc2 Error'
      )

    calc3 = ( ast ) ->
      match(  ast,
        ['Add',_,_], (u,v) => Add(u,v),
        ['Sub',_,_], (u,v) => Sub(u,v),
        ['Mul',_,_], (u,v) => Mul(u,v),
        ['Div',_,_], (u,v) => Div(u,v),
        _,            'Calc3 Error'
      )

    console.log( 'doExp Add', calc2(['Add',1,2] ) )
    console.log( 'doExp Sub', calc3(['Sub',3,2] ) )
    console.log( 'doExp Mul', calc2(['Mul',3,4] ) )
    console.log( 'doExp Div', calc1(['Div',6,2] ) )

    if calc1 is false and calc2 is false  and calc3 is false and f1 is false and fn is false then {}

TestMatch.doExp()

export default TestMatch