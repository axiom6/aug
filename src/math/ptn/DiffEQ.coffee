
import {match} from '../../base/util/Match.js'
import A       from '../adt/Adt.js'
import Ptn     from '../adt/Ptn.js'

class DiffEQ

  constructor:() ->
    @ptns = @doPtns()

  vec:( ...args ) =>
    a = []
    a.push( @d(arg) ) for arg in args
    a

  pow:( u, v ) =>
    adt1 = []
    if typeof(v) is 'number'
      adt1 = ['Mul', ['Mul', v, ['Pow',u,v-1]], @d(u) ]
    else
      adt2 = ['Mul', ['Mul', v, ['Pow',u,['Sub',v,1]]], @d(u) ]
      adt3 = ['Mul', ['Mul', ['Ln',u], ['Pow',u,v]],  @d(v) ]
      adt1 = ['Add',adt2,adt3]
    adt1

  d:( ast ) ->
    dst = []
    try
      dst = match( ast, ...@ptns )
    catch e
      console.error( 'DiffEQ.d()', e )
    dst

  doPtns:() -> Ptn.toPtns( [
    A.Equ,    (u,v)    => ['Equ', @d(u), @d(v) ],
    A.Add,    (u,v)    => ['Add', @d(u), @d(v) ],
    A.Sub,    (u,v)    => ['Sub', @d(u), @d(v) ],
    A.Mul,    (u,v)    => ['Add', ['Mul',v,@d(u)],['Mul',u,@d(v)] ],
    A.Div,    (u,v)    => ['Div', ['Sub', ['Mul',v,@d(u)], ['Mul',u,@d(v) ]],['Pow',v,2]],
    A.Pow,    (u,v)    => @pow( u, v ),
    A.Neg,    (u)      => ['Neg', @d(u) ],
    A.Recip,  (u)      => ['Div', ['Neg',@d(u)], ['Pow',u,2] ],
    A.Abs,    (u)      => ['Abs',   @d(u) ],
    A.Paren,  (u)      => ['Paren', @d(u) ],
    A.Brace,  (u)      => ['Brace', @d(u) ],
    A.Ln,     (u)      => ['Div', @d(u), u ],
    A.Log,    (u,v)    => ['Mul',['Log',['E',r]],['Div', @d(u), u ]],
    A.Root,   (u,v)    => ['Div',@d(u),['Mul',u,['Root',u,v]]],
    A.Sqrt,   (u)      => ['Div',@d(u),['Mul',['Sqrt',u],2]],
    A.E,      (u)      => ['Mul',['E',u],@d(u)],
    A.Sin,    (u)      => ['Mul',['Cos',u],@d(u)],
    A.Cos,    (u)      => ['Neg',['Mul',['Sin',u],@d(u)]],
    A.Tan,    (u)      => ['Neg',['Mul',['Pow',['Sec',u],2],@d(u)]],
    A.Csc,    (u)      => ['Neg',['Mul',['Mul',['Csc',u],['Cot',u]],@d(u)]],
    A.Sec,    (u)      =>        ['Mul',['Mul',['Sec',u],['Tan',u]],@d(u)],
    A.Cot,    (u)      => ['Neg',['Mul',['Pow',['Csc',u],2],@d(u)]],
    A.Arcsin, (u)      =>        ['Div',@d(u),['Sub',['Sqrt',1,['Pow',u,2]]]],
    A.Arccos, (u)      => ['Neg',['Div',@d(u),['Sub',['Sqrt',1,['Pow',u,2]]]]],
    A.Arctan, (u)      =>        ['Div',@d(u),['Add',1,['Pow',u,2]]],
    A.Arccot, (u)      => ['Neg',['Div',@d(u),['Add',1,['Pow',u,2]]]],
    A.Arccsc, (u)      => ['Neg',['Div',@d(u),['Mul',u,['Sqrt',['Sub',['Pow',u,2],1]]]]],
    A.Arcsec, (u)      =>        ['Div',@d(u),['Mul',u,['Sqrt',['Sub',['Pow',u,2],1]]]],
    A.Fun,    (f,u)    => ['Mul',['D',f],@d(u)],
    A.D,      (u)      => @d(u),
    A.Int,    (u)      => u
    A.DefInt, (a,b,u)  => u
    A.Sum,    (a,b,u)  => ['Sum',a,b,@d(u)],
    A.Sus,    (u,v)    => ['Sus',@d(u),v],
    A.Lim,    (a,b)    => ['Lim',a,b,@d(u)],
    A.Ratio,  (u,v)    => 0,
    A.Vec,    (rest)   => @vec( rest ),
    A.Mat,    (rest)   => @vec( rest ),
    A.Latex,  (o)      => @latex( o ),
    'String', (s)      => ['D',s],
    'Number', (n)      => 0,
    '_',      (q)      => @unk(q)
  ] )

export default DiffEQ


