
import {match} from '../../bas/util/Match.js'
import A         from '../ptn/Adt.js'
import Ascii     from '../par/Ascii.js'

#let Ascii = { parse:peg$parse, error:peg$SyntaxError };
#export default Ascii;

class MathML

  constructor:() ->
    # console.log( 'Ascii Import', Ascii )
    A.mathML = @
    @key  = ""
    @math = {}
    @ptns = @toPtns()

  doParse:( asc, key ) ->
    par = "X";
    err = {};
    try
      par = Ascii.parse(  asc )
      asa = eval( par )
      @markup( asa, key )
    catch error
      err.found = error.found; err.msg = error.message; err.loc = error.location;
      console.error( 'MathML.doParse()', { key:key, ascii:asc, error:err } )
    return par

  markup:( asa, key ) ->
    @key = key
    @math[@key] = ""
    #head()
    @app( "<math>")
    @exp(  asa )
    @app( "</math>" ) # ,"</root>"
    console.log( 'MathML.markup()', @math[@key] )
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
    @math[@key] += "<#{t}>#{v.toString()}</#{t}>"
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

  unk:( q ) ->
    console.log( 'Adt _ Unknown', q )
    return

  sum:( t, a, b, sym, u ) ->
    @beg(t); @tuv(sym,a,b); @end(t); @exp(u)
    return

  exp:( asa ) ->
    try
      # console.log( 'MathML.exp(asa)', asa )
      match( asa, ...@ptns )
    catch e
      console.error( 'MathML.exp()', e )
    return

  toPtns:() -> A.toPtns( [
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
    A.Lim,    (a,b)   => @tuv('msubsup', a, b ),
    A.Ratio,  (u,v)   => @tuv('mfrac', u,v ),
    'String', (s)     => @tag('mi',s ),            # Using String identifiers
    'Number', (n)     => @tag('mn',n ),
    '_',      (q)     => @unk(q)
  ] )

  testMarkup:(  key ) ->

    Sin = (u)     => A.Sin(A.Num(Math.PI/6))
    Add = [A.Add,[A.Var,'a'],[A.Var,'b']]
    Equ = (u,v)   => A.Equ(A.Var'E',A.Mul(A.Var'm',A.Pow(A.Var('C'),A.Num(2))))
    Sum = (a,b,u) => A.Sum(A.Equ(A.Var('i'),A.Num(1)),A.Var('n'),A.Sub(A.Var('x'),A.Var('i')))
    adts = { Sin:Sin, Add:Add, Equ:Equ, Sum:Sum }

    console.log( 'Sin', Sin, A.f1(A.Sin(A.Num(Math.PI/6))) )
    console.log( 'Equ', Equ, A.f2(A.Equ(A.Var'E',A.Mul(A.Var'm',A.Pow(A.Var('C'),A.Num(2))))) )
    console.log( 'Sum', Sum, A.f3(A.Sum(A.Equ(A.Var('i'),A.Num(1)),A.Var('n'),A.Sub(A.Var('x'),A.Var('i')))) )
    return
    switch key
      when 'Sin' then @markup( adts.Sin, key )
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

  testExp:() ->
    Sina = ['Sin',Math.PI/6]
    Adda = ['Add','a','b'] # ['Add','a',['Mul',['x','y']]]
    Suma = ['Sum','i','n','j']
    Sins = eval("['Sin',Math.PI/6]" )
    Adds = eval("['Add','a','b']" )
    Sums = eval("['Sum','i','n','j']" )
    console.log( 'Sin', Sina, Sins )
    console.log( 'Add', Adda, Adds )
    console.log( 'Sin', Suma, Sums )

    @markup( Sina, 'Sina' )
    @markup( Sins, 'Sins' )
    @markup( Adda, 'Adda' )
    #markup( Adds, 'Adds' )
    #markup( Suma, 'Suma' )
    #markup( Sums, 'Sums' )

    return

export default MathML
