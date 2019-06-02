
import Ptn    from '../adt/Ptn.js';
import DiffEQ from '../ptn/DiffEQ.js';
import MathML from '../ptn/MathML.js';

Exps =
  Sin1S:{ ascii:"sin(u)", klass:"r1c1", ast:[], mathML:"" }
  Add1S:{ ascii:"u+v",    klass:"r1c2", ast:[], mathML:"" }
  Mul1S:{ ascii:"u*v",    klass:"r1c3", ast:[], mathML:"" }
  Sin1D:{ ascii:"sin(u)", klass:"r2c1", ast:[], mathML:"" }
  Add1D:{ ascii:"u+v",    klass:"r2c2", ast:[], mathML:"" }
  Mul1D:{ ascii:"u*v",    klass:"r2c3", ast:[], mathML:"" }
  Div1S:{ ascii:"u/v",    klass:"r3c1", ast:[], mathML:"" }
  Pow1S:{ ascii:"u^3",    klass:"r3c2", ast:[], mathML:"" }
  Lnn1S:{ ascii:"ln(u)",  klass:"r3c3", ast:[], mathML:"" }
  Div1D:{ ascii:"u/v",    klass:"r4c1", ast:[], mathML:"" }
  Pow1D:{ ascii:"u^3",    klass:"r4c2", ast:[], mathML:"" }
  Lnn1D:{ ascii:"ln(u)",  klass:"r4c3", ast:[], mathML:"" }

class Differ

  constructor:() ->
    @diffEQ = new DiffEQ()
    @mathML = new MathML()
    @ncol   = 3

  doExps:( exps=Exps ) ->
    for own   key, exp of exps when key.charAt(4) is 'S'
      @doExp( key, exps )
    return exps

  doExp:( key, exps ) ->
    ked = key.substring(0,4) + 'D'
    exps[key].ast    = Ptn.parse(      exps[key].ascii    )
    exps[ked].ast    = @diffEQ.d(      exps[key].ast      )
    exps[key].mathML = @mathML.markup( exps[key].ast, key )
    exps[ked].mathML = @mathML.markup( exps[ked].ast, ked )
    return

  toKlass:( i ) ->
    mod = i       % @ncol
    row = (i-mod) / @ncol + 1
    col = mod + 1
    "r#{row}c#{col}"    

export default Differ