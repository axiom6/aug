
import Ptn    from '../adt/Ptn.js';
import DiffEQ from '../ptn/DifEQ.js';
import MathML from '../ptn/MathML.js';

Exps =
  Par1:{ ascii:"(a+b)*(c^2)",        klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Trg1:{ ascii:"cos(x)+sin(x)",      klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Sus1:{ ascii:"x_1 + x_2",          klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Mul1:{ ascii:"(2.2+3)*(1+2)",      klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Add2:{ ascii:"2.2*3+4*3",          klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Tan1:{ ascii:"2.2*3+x*arctan(y)",  klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Sub1:{ ascii:"2.2*3-x^y",          klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Equ2:{ ascii:"2.2^3 = x/y",        klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Sub2:{ ascii:"-2.2 * 3-x / -y",    klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Mul3:{ ascii:"x*x*(a+b_1)",        klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Sin2:{ ascii:"a+b*sin(\\theta)",   klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Fun1:{ ascii:"fn(a+b)*g(theta)",   klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Int1:{ ascii:"int(x*2)",           klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Vec1:{ ascii:"[1,2,3]",            klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Mat1:{ ascii:"[[1,2,3],[4,5,6]]",  klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Lim1:{ ascii:"lim_i^n",            klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Sum2:{ ascii:"sum_i^n~j",          klass:"", ast:[], dst:[], mathML:"", diffML:"" }
  Sum3:{ ascii:"sum_i^n~j+1",        klass:"", ast:[], dst:[], mathML:"", diffML:"" }

class Differ

  constructor:() ->
    @diffEQ = new DiffEQ()
    @mathML = new MathML()
    @ncol   = 3

  doExps:( exps=Exps ) ->
    i = 0
    for own   key, exp of exps
      @doExp( key, exp, i )
      i = i + 1
    return exps

  doExp:( key, exp, i  ) ->
    exp.ast    = Ptn.parse(      exp.ascii )
    exp.dst    = @diffEQ.d(      exp.ast   )
    exp.mathML = @mathML.markup( exp.ast, key    )
    exp.diffML = @mathML.markup( exp.dst, key+'D')
    exp.klass  = @toKlass( i )
    # console.log( 'Basics.mathML', exp.mathML )
    return

  toKlass:( i ) ->
    mod = i       % @ncol
    row = (i-mod) / @ncol + 1
    col = mod + 1
    "r#{row}c#{col}"    

export default Differ