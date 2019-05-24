
import {match,_} from '../../bas/util/Match.js'
import A         from '../ptn/Adt.js'
import Ascii     from '../par/Ascii.js'

class MathML

  constructor:() ->
    # console.log( 'Ascii Import', Ascii )
    @key  = ""
    @math = {}
    @ptns = @toPtns()

  doParse:( asc, key ) ->
    par = "X";
    err = {};
    try
      par = Ascii.parse(  asc )
      ast = new Function( par )
      @markup( ast, key )
    catch error
      err.found = error.found; err.msg = error.message; err.loc = error.location;
      console.error( 'MathML.doParse()', { key:key, ascii:asc, error:err } )
    finally
      return par

  markup:( ast, key ) ->
    @key = key
    @math[@key] = ""
    @head()
    @app( "<math>")
    @exp(  ast )
    @app( "</math>","</root>")
    return

  head:() ->
    @math[@key] += """<?xml version="1.0" encoding="UTF-8" standalone="yes">
                      <?xml-stylesheet type="text/css" href="MathML.css">
                      <root xmlns="http://www.w3.org/1998/Math/MathML">"""

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
    @math[@key] += "<#{t}>#{v.toString()}</#{t}>#"
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

  unk:( u ) ->
    console.log( 'Adt _ Unknown', u )
    return

  sum:( t, a, b, sym, u ) ->
    @beg(t); @tuv(sym,a,b); @end(t); @exp(u)
    return

  exp:( ast ) ->
    ex = A.toExp(ast)
    try
      console.log( 'MathML.exp(ast)', ast, ex )
      match( ex, ...@ptns )
    catch e
      console.error( 'MathML.exp()', e )
    finally
      return

  toPtns:() -> A.toPtns( [
    A.Var,    (s)     => @tag('mi',s ),
    A.Num,    (n)     => @tag('mn',n ),
    A.Dbl,    (d)     => @tag('mn',d ),
    A.Ratio,  (u,v)   => @tuv('mfrac', u,v ),
    A.Equ,    (u,v)   => @bin('mrow',  u, '=', v ),
    A.Add,    (u,v)   => @bin('mrow',  u, '+', v ),
    A.Sub,    (u,v)   => @bin('mrow',  u, '-', v ),
    A.Mul,    (u,v)   => @bin('mrow',  u, '*', v ),
    A.Div,    (u,v)   => @tuv('mfrac', u,v ),
    A.Pow,    (u,v)   => @tuv('msup',  u, v ),
    A.Neg,    (u)     => @uni('-', u ),
    A.Recip,  (v)     => @tuv('mfrac', A.Num(1), v ),
    A.Abs,    (u)     => @sur( '|', u, '|' ),
    A.Paren,  (u)     => @fen(u),
    A.Brace,  (u)     => @fen(u),
    A.Ln,     (u)     => @fun('ln', u ),
    A.Log,    (u,v)   => u + v,
    A.Root,   (u,v)   => u + v,
    A.Sqrt,   (u)     => @tag('msqrt', u ),
    A.E,      (u)     => @tuv('msup', A.Var('e'), v ),
    A.Sin,    (u)     => @fun('sin',    u ),
    A.Cos,    (u)     => @fun('cot',    u ),
    A.Tan,    (u)     => @fun('tan',    u ),
    A.Csc,    (u)     => @fun('csc',    u ),
    A.Sec,    (u)     => @fun('sec',    u ),
    A.Cot,    (u)     => @fun('cot',    u ),
    A.Arcsin, (u)     => @fun('arcsin', u ),
    A.Arccos, (u)     => @fun('arccot', u ),
    A.Arctan, (u)     => @fun('arctan', u ),
    A.Arccsc, (u)     => @fun('arccsc', u ),
    A.Arcsec, (u)     => @fun('arcsec', u ),
    A.Arccot, (u)     => @fun('arccot', u ),
    A.Fun,    (f,u)   => @fun( f,         u ),
    A.D,      (u)     => @uni('d',       u ),
    A.Int,    (u)     => @uni('\u222B;', u ),
    A.DefInt, (a,b,u) => @sum('msubsup',   a,b, '\u222B', u ),
    A.Sum,    (a,b,u) => @sum('munderover',a,b, '\u2211', u ),
    A.Sus,    (u,v)   => @tuv('msub',    u, v ),
    A.Lim,    (a,b)   => @tuv('msubsup', a, b ) 
  ] )

  doExp:() ->

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

    calc1 = ( exp ) ->
      ptns = toPtns([
        Add, (u,v) => Add(u,v),
        Sub, (u,v) => Sub(u,v),
        Mul, (u,v) => Mul(u,v),
        Div, (u,v) => Div(u,v)  ] )
      match( exp, ...ptns )

    calc1(['Add',1,2] )

    calc2 = ( exp) ->
      match( exp,
        f2(Add), (u,v) => Add(u,v),
        f2(Sub), (u,v) => Sub(u,v),
        f2(Mul), (u,v) => Mul(u,v),
        f2(Div), (u,v) => Div(u,v),
        _,            'Calc2 Error'
      )

    calc3 = ( exp) ->
      match( exp,
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

  testMarkup:(  key ) ->
    Add = [A.Add,[A.Var,'a'],[A.Var,'b']]
    Equ = (u,v)   => A.Equ(A.Var'E',A.Mul(A.Var'm',A.Pow(A.Var('C'),A.Num(2))))
    Sum = (a,b,u) => A.Sum(A.Equ(A.Var('i'),A.Num(1)),A.Var('n'),A.Sub(A.Var('x'),A.Var('i')))
    adts = { Add:Add, Equ:Equ, Sum:Sum }
    switch key
      when 'Add' then @markup( adts.Add, key )
      when 'Equ' then @markup( adts.Equ, key )
      else            @markup( adts.Sum, key )
    console.log( "-------------------- testMarkup ----------------------------" )
    console.log( 'MathML.markup', { key:key, adt:adts[key], mathML:@math[key] } )

    return

  testParse:( key ) ->
    ascs = {
      add:"(a+b)*(c^2)"
      trg:"cos(x)+sin(x)"
      sus:"x_1 + x_2"
    }
    switch( key )
      when 'add' then @doParse( ascs.add,'add' )
      when 'trg' then @doParse( ascs.trg,'trg' )
      else            @doParse( ascs.sus,'sus' )
    console.log( 'MathML.parse', { key:key, asc:ascs[key], mathML:@math[key] } )
    console.log( "---------------------- testParse --------------------------" )
    return

export default MathML
