
import {match} from '../../../../lib/pub/base/util/Match.js'
import Latex   from '../../../../lib/pub/base/draw/Latex.js'
import A       from '../adt/Adt.js'
import Ptn     from '../adt/Ptn.js'

class MathML

  constructor:() ->
    @key  = ""
    @math = {}
    @ptns = @doPtns()

  parse:( ascii, key ) =>
    ast  = Ptn.parse( ascii )
    @markup( ast, key )

  markup:( ast, key ) =>
    @key = key
    @math[@key] = ""
    @app( "<math>")
    @exp(  ast )
    @app( "</augm/math>" )
    @math[@key]

  app:( ...args ) ->
    @math[@key] += arg for arg in args
    return

  beg:( t ) ->
    @math[@key] += "<#{t}>"
    return

  end:( t ) ->
    @math[@key] += "</#{t}>"
    return

  tag:( t, v ) ->
    @math[@key] += "<#{t}>#{v.toString()}</#{t}>"
    return

  bin:( t, u, op, v ) ->
    @beg(t); @exp(u); @beg('mo'); @app(op); @end('mo'); @exp(v); @end(t)
    return

  uni:( op, u ) ->
    @beg('mrow'); @beg('mo'); @app(op); @end('mo'); @exp(u); @end('mrow');
    return

  sur:( bop, u, eop ) ->
    @beg('mo'); @app(bop); @end('mo'); @exp(u); @beg('mo'); @app(eop); @end('mo');
    return

  tuv:( t, u, v ) ->
    @beg(t); @exp(u); @exp(v); @end(t)
    return

  fun:( f, u ) ->
    @beg('mrow'); @tag('mi', f ); @fen(u); @end('mrow')
    return

  fen:( u ) ->
    @tag('mo','('); @exp(u); @tag('mo',')')
    return

  vec:( rest ) ->
    @tag('mo','[')
    @exp(e) for e in rest   # MathML takes care of commans
    @tag('mo',']')
    return

  unk:( q ) ->
    console.log( '_ MathML Unknown', q )
    return

  noop:( arg ) ->
    if arg is false then {}
    return

  sum:( t, a, b, sym, u ) ->
    @beg(t); @tag('mo',sym ); @exp(a); @exp(b); @end(t); @exp(u)
    return

  # A little off for now
  lim:( t, a, b, u ) ->
    @beg(t); @tag('mi', u ); @exp(a); @exp(b); @end(t)
    return

  latex:( o ) ->
    obj = Latex[o]
    uni = if obj? then obj.uc else '?'
    @tag('mo', uni )
    return

  exp:( ast ) ->
    try
      # console.log( 'MathML.exp(asa)', asa )
      match( ast, ...@ptns )
    catch e
      console.error( 'MathML.exp()', e )
    return

  doPtns:() -> Ptn.toPtns( [
    A.Equ,    (u,v)    => @bin('mrow',  u, '=', v ),
    A.Add,    (u,v)    => @bin('mrow',  u, '+', v ),
    A.Sub,    (u,v)    => @bin('mrow',  u, '-', v ),
    A.Mul,    (u,v)    => @bin('mrow',  u, '*', v ),
    A.Div,    (u,v)    => @tuv('mfrac', u,v ),
    A.Pow,    (u,v)    => @tuv('msup',  u, v ),
    A.Neg,    (u)      => @uni('-', u ),
    A.Recip,  (v)      => @tuv('mfrac', 1, v ),
    A.Abs,    (u)      => @sur( '|', u, '|' ),
    A.Paren,  (u)      => @fen(u),
    A.Brace,  (u)      => @fen(u),
    A.Ln,     (u)      => @fun('ln', u ),
    A.Log,    (u,v)    => u + v,
    A.Root,   (u,v)    => u + v,
    A.Sqrt,   (u)      => @tag('msqrt', u ),
    A.E,      (u)      => @tuv('msup', 'e', v ),
    A.Sin,    (u)      => @fun('sin',    u ),
    A.Cos,    (u)      => @fun('cos',    u ),
    A.Tan,    (u)      => @fun('tan',    u ),
    A.Csc,    (u)      => @fun('csc',    u ),
    A.Sec,    (u)      => @fun('sec',    u ),
    A.Cot,    (u)      => @fun('cot',    u ),
    A.Arcsin, (u)      => @fun('arcsin', u ),
    A.Arccos, (u)      => @fun('arccot', u ),
    A.Arctan, (u)      => @fun('arctan', u ),
    A.Arccsc, (u)      => @fun('arccsc', u ),
    A.Arcsec, (u)      => @fun('arcsec', u ),
    A.Arccot, (u)      => @fun('arccot', u ),
    A.Fun,    (f,u)    => @fun( f,         u ),
    A.D,      (u)      => @uni('d',    u ),   # @dd;
    A.Int,    (u)      => @uni('\u222B', u ),
    A.DefInt, (a,b,u)  => @sum('msubsup',   a, b, '\u222B', u ),
    A.Sum,    (a,b,u)  => @sum('munderover',a, b, '\u2211', u ),
    A.Sus,    (u,v)    => @tuv('msub',      u, v ),
    A.Lim,    (a,b)    => @lim( 'msubsup',  a,  b, 'lim' ),
    A.Ratio,  (u,v)    => @tuv('mfrac', u,v ),
    A.Vec,    (rest)   => @vec( rest ),
    A.Mat,    (rest)   => @vec( rest ),
    A.Latex,  (o)      => @latex( o ),
    'String', (s)      => @tag('mi',s ),            # Using String identifiers
    'Number', (n)      => @tag('mn',n ),
    '_',      (q)      => @unk(q)
  ] )

export default MathML
