
import MathML  from '../ptn/MathML.js';

Exps =
  Par1:{ asc:"(a+b)*(c^2)",        klass:"", mathML:"" }
  Trg1:{ asc:"cos(x)+sin(x)",      klass:"", mathML:"" }
  Sus1:{ asc:"x_1 + x_2",          klass:"", mathML:"" }
  Mul1:{ asc:"(2.2+3)*(1+2)",      klass:"", mathML:"" }
  Add2:{ asc:"2.2*3+4*3",          klass:"", mathML:"" }
  Tan1:{ asc:"2.2*3+x*arctan(y)",  klass:"", mathML:"" }
  Sub1:{ asc:"2.2*3-x^y",          klass:"", mathML:"" }
  Equ2:{ asc:"2.2^3 = x/y",        klass:"", mathML:"" }
  Sub2:{ asc:"-2.2 * 3-x / -y",    klass:"", mathML:"" }
  Mul3:{ asc:"x*x*(a+b_1)",        klass:"", mathML:"" }
  Sin2:{ asc:"a+b*sin(\\theta)",   klass:"", mathML:"" }
  Fun1:{ asc:"fn(a+b)*g(theta)",   klass:"", mathML:"" }
  Int1:{ asc:"int(x*2)",           klass:"", mathML:"" }
  Vec1:{ asc:"[1,2,3]",            klass:"", mathML:"" }
  Mat1:{ asc:"[[1,2,3],[4,5,6]]",  klass:"", mathML:"" }
  Lim1:{ asc:"lim_i^n",            klass:"", mathML:"" }
  Sum2:{ asc:"sum_i^n~j",          klass:"", mathML:"" }
  Sum3:{ asc:"sum_i^n~j+1",        klass:"", mathML:"" }

class Basics

  constructor:() ->
    @mathML = new MathML();
    @ncol   = 3

  doExps:( exps=Exps ) ->
    i = 0
    for own   key, exp of exps
      @doExp( key, exp, i )
      i = i + 1
    return exps

  doExp:( key, exp, i  ) ->
    @mathML.doParse( exp.asc, key )
    exp.mathML = @mathML.math[key]
    mod = i       % @ncol
    row = (i-mod) / @ncol + 1
    col = mod + 1
    exp.klass = "r#{row}c#{col}"
    # console.log( 'Basics.mathML', exp.mathML )
    return

export default Basics