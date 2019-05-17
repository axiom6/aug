
import {match} from '../../bas/util/Match.js'
import A       from '../../pub/math/ptn/Adt.js'

class MathML

  constructor:() ->
    @key  = ""
    @math = {}
    @ptns = @toPtns()

  markup:( ex, key ) ->
    @key = key
    @math[@key] = ""
    @head()
    @app( "<math>")
    @exp(  ex )
    @app( "</math>","</root>")
    return

  head:() ->
    @math[key] += """<?xml version="1.0" encoding="UTF-8" standalone="yes">
                     <?xml-stylesheet type="text/css" href="MathML.css">
                     <root xmlns="http://www.w3.org/1998/Math/MathML">"""

  app:( ...args ) ->
    @math[key] += arg for arg in args
    return

  beg:( t ) ->
    @math[key] += "<#{t}>"
    return

  end:( t ) ->
    @math[key] += "</#{t}>"
    return

  tag:( t, v ) ->
    @math[key] += "<#{t}>#{v.toString()}</#{t}>#"
    return

  bin:( t, u, op, v ) ->
    @beg(t); @exp(u); @beg('mo'); @app(op); @end('mo'); @exp(v); @end(t)
    return

  uni:( op, u ) ->
    @beg('mo'); @app(op); @end('mo'); @exp(u)
    return

  sur:( bop, u, eop ) ->
    @beg('mo'); @app(bop); @end('mo'); @exp(u); @beg('mo'); @app(eop); @end('mo');
    return

  tuv:( t, u, v ) ->
    @beg(t); @exp(u); @exp(v); @end(t)
    return

  fun:( f, u ) ->
    @beg('mrow'); @app(f); @fen(u); @end('mrow')
    return

  fen:( u ) ->
    @beg('mfence'); @exp(u); @end('mfence')
    return

  sum:( t, a, b, sym, u ) ->
    @beg(t); @tuv(sym,a,b); @end(t); @exp(u)
    return

  exp:( e ) ->
    match( e, ...@ptns )
    return

  toPtns:() -> A.toPtns( [
    A.Var,  (s)   => @tag('mi',s ),
    A.Num,  (n)   => @tag('mn',n ),
    A.Dbl,  (d)   => @tag('mn',d ),
    A.Rat,  (u,v) => @tuv('mfrac', u,v ),
    A.Equ,  (u,v) => @bin('mrow',  u, '=', v ),
    A.Add,  (u,v) => @bin('mrow',  u, '+', v ),
    A.Sub,  (u,v) => @bin('mrow',  u, '-', v ),
    A.Mul,  (u,v) => @bin('mrow',  u, '*', v ),
    A.Div,  (u,v) => @tuv('mfrac', u,v ),
    A.Pow,  (u,v) => @tuv('msup',  u, v ),
    A.Neg,  (u)   => @uni('-', u ),
    A.Rec,  (v)   => @tuv('mfrac', A.Num(1), v ),
    A.Abs,  (u)   => @sur( '|', u, '|' ),
    A.Par,  (u)   => @fen(u),
    A.Brc,  (u)   => @fen(u),
    A.Lnn,  (u)   => @fun('ln', u ),
    A.Log,  (u,v) => u + v,
    A.Roo,  (u,v) => u + v,
    A.Sqt,  (u)   => @tag('msqrt', u ),
    A.Eee,  (u)   => @tuv('msup', A.Var('e'), v ),
    A.Sin,  (u)   => @fun('sin',    u ),
    A.Cos,  (u)   => @fun('cot',    u ),
    A.Tan,  (u)   => @fun('tan',    u ),
    A.Csc,  (u)   => @fun('csc',    u ),
    A.Sec,  (u)   => @fun('sec',    u ),
    A.Cot,  (u)   => @fun('cot',    u ),
    A.ASin, (u)   => @fun('arcsin', u ),
    A.ACos, (u)   => @fun('arccot', u ),
    A.ATan, (u)   => @fun('arctan', u ),
    A.ACsc, (u)   => @fun('arccsc', u ),
    A.ASec, (u)   => @fun('arcsec', u ),
    A.ACot, (u)   => @fun('arccot', u ),
    A.Fun,  (f,u) => @fun( f,         u ),
    A.Dif,  (u)   => @uni('d',       u ),
    A.Itg,  (u)   => @uni('\u222B;', u ),
    A.Itl,(a,b,u) => @sum('msubsup',   a,b, '\u222B', u ),
    A.Sum,(a,b,u) => @sum('munderover',a,b, '\u2211', u ),
    A.Sub,  (u,v) => @tuv('msub',    u, v ),
    A.Sup,  (u,a) => @tuv('msup',    u, v ),
    A.Lim,  (u,v) => @tuv('msubsup', u, v ) ] )

  @test:(  key ) ->
    apb = A.Add(A.Var('a'),A.Var('b'))
    emc = A.Equ(A.Var'E',A.Mul(A.Var'm',A.Pow(A.Var('C'),A.Num(2))))
    sum = A.Sum(A.Equ(A.Var('i'),A.Num(1)),A.Var('n'),A.Sub(A.Var('x'),A.Var('i')))
    switch key
      when 'emc' then @markup( emc,'emc' )
      when 'sum' then @markup( sum,'sum' )
      else            @markup( apb,'apb' )
    return @math(key)

export default MathML
