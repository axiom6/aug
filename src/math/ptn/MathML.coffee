
import {match} from '../../bas/util/Match.js'
import A from './Adt'

class MathML

  constructor:() ->
    @key  = ""
    @math = {}
    @ptns = @toPtns()

  markup:( exp, key ) ->
    @key = key
    @math[@key] = ""
    @m( exp )
    return

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
    @beg(t); @exp(u); @app('+'); @exp(v); @end(t)
    return

  tuv:( t, u, v, ) ->
    @beg(t); @exp(u); @exp(v); @end(t)
    return

  exp:( e ) ->
    match( e, ...@ptns )
    return

  toPtns:() -> A.toPtns( [
    A.Num, (n)   => @tag('mn',n ),
    A.Dbl, (d)   => @tag('mn',d ),
    A.Rat, (u,v) => @tuv('mfrac', u,v ),
    A.Add, (u,v) => @bin('mrow', u, '+', v ),
    A.Sub, (u,v) => @bin('mrow', u, '-', v ),
    A.Mul, (u,v) => @bin('mrow', u, '*', v ),
    A.Div, (u,v) => @tuv('mfrac', u,v ),
    A.Rec, (v)   => @tuv('mfrac', A.Num(1), v ),
    A.Pow, (u,v) => @tuv('msup', u,v ),
    A.Neg, (u,v) => @tuv('msup', u,v ),

  ] )


  def funcML( t:Text, func:String, u:Exp )
  {
    t.app( '<',  "mrow", '>' )
  mathML( t, "mi", func )
  mathML( t, "mfence", u )
  t.app( "</", "mrow", '>' )
  }

  def mathML( t:Text, tag:String, u:Exp, v:Exp )
  {
    t.app( '<',  tag,  '>' )
  u.mathML(t)
  v.mathML(t)
  t.app( "</", tag, '>' )
  }

  def mathML( t:Text, tag:String, u:Exp, op:String, v:Exp )
  {
    t.app( '<',  tag,  '>' )
  u.mathML(t)
  mathML( t, "mo", op )
  v.mathML(t)
  t.app( "</", tag, '>' )
  }

  def operML( t:Text, tag:String, op:String, a:Exp, b:Exp, u:Exp )
  {
    t.app( '<',  tag,  '>' )
  mathML( t, "mo", op )
  a.mathML(t)
  b.mathML(t)
  t.app( "</", tag, '>' )
  u.mathML(t)
  }

  def mathMLCex( t:Text, r:Exp, i:Exp )
    { r.mathML(t); i.mathML(t); t.app("<mi>i</mi>") }

  def mathMLVex( t:Text, a:Array[Exp] )
  {
    t.app( "<mfenced open='[' close=']'>" )
  for( i <- a.indices )
  a(i).mathML(t)            // MathML takes care of commas
  t.app( "</mfenced>" )
  }

  def mathMLMex( t:Text, mat:Array[Vex] )
  {
    t.app( "<mfenced open='[' close=']'>", "<mtable>" )
    for( i <- mat.indices )
    {
      t.app( "<mtr>" )
    for( j <- 0 until mat(i).n )
    { t.app("<mtd>"); mat(i)(j).mathML(t); t.app("</mtd>") }
    t.app( "</mtr>" )
    }
    t.app( "</mtable>", "</mfenced>" )
  }

  def headML( t:Text )
  {
    t.app( "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>", Text.eol )
    t.app( "<?xml-stylesheet type=\"text/css\" href=\"MathML.css\" ?>", Text.eol )
    t.app( "<root xmlns=\"http://www.w3.org/1998/Math/MathML\">", Text.eol )
    }

    def begML(  t:Text ) { t.app("<math>") }
    def endML(  t:Text ) { t.app("</math>", Text.eol ) }
    def footML( t:Text ) { t.app("</root>", Text.eol ) }


export default MathML
