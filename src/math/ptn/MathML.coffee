
import {match} from '../../bas/util/Match.js'
import A       from '../ptn/Adt.js'
import Ptn     from '../ptn/Ptn.js'
import Ascii   from '../par/Ascii.esm.js'

#let Ascii = { parse:peg$parse, error:peg$SyntaxError };
#export default Ascii;

class MathML

  constructor:() ->
    @key  = ""
    @math = {}
    @ptns = @doPtns()

  doParse:( asc, key ) ->
    par = "X"
    asa = []
    err = {};
    # console.log( 'doParse() asc', asc )

    try
      par = Ascii.parse(  asc )
      # console.log( 'MathML.doParse() par', par )
      try
        asa = eval( par )
        # console.log( 'MathML.doParse() asa', asa )
        @markup( asa, key )
      catch e
        console.error( 'MathML.doParse() eval  error', key, e )
    catch e
      err.found = e.found; err.msg = e.message; err.loc = e.location
      console.error( 'MathML.doParse() parse error', { key:key, ascii:asc, error:err } )

    return

  markup:( asa, key ) ->
    @key = key
    @math[@key] = ""
    #head()
    @app( "<math>")
    @exp(  asa )
    @app( "</math>" ) # ,"</root>"
    # console.log( 'MathML.markup()', @math[@key] )
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
    @beg('mfenced'); @exp(u); @end('mfenced')
    return

  vec:( rest ) ->
    @beg("mfenced open='[' close=']'" )
    @exp(e) for e in rest   # MathML takes care of commans
    @end("mfenced" )
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

  exp:( asa ) ->
    try
      # console.log( 'MathML.exp(asa)', asa )
      match( asa, ...@ptns )
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
    A.D,      (u)      => @uni('d',       u ),
    A.Int,    (u)      => @uni('\u222B', u ),
    A.DefInt, (a,b,u)  => @sum('msubsup',   a, b, '\u222B', u ),
    A.Sum,    (a,b,u)  => @sum('munderover',a, b, '\u2211', u ),
    A.Sus,    (u,v)    => @tuv('msub',      u, v ),
    A.Lim,    (a,b)    => @lim( 'msubsup',  a,  b, 'lim' ),
    A.Ratio,  (u,v)    => @tuv('mfrac', u,v ),
    A.Vec,    (rest)   => @vec( rest ),
    A.Mat,    (rest)   => @vec( rest ),
    'String', (s)      => @tag('mi',s ),            # Using String identifiers
    'Number', (n)      => @tag('mn',n ),
    '_',      (q)      => @unk(q)
  ] )

export default MathML
