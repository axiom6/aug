
import {_} from '../../bas/util/Match.js'

class Adt

  @fa = (f) =>
    a = [f.name]
    a.push(_) for i in [0...f.length]
    a

  @toPtns = ( adts ) =>
    # console.log( 'adts', adts )
    ptns = new Array(adts.length)
    for i in [0...adts.length]
      ptns[i] = if i%2 is 1 then Adt.fa(adts[i]) else adts[i]
    ptns

  # Geometric Algerbra
  @Dot       = (u,v) => u ~ v  # Dot product
  @Wedge     = (u,v) => u ^ v  # Wedge outer generalisze cross product
  @Vee       = (u,v) => u & v  # Meet or join
  @Dual      = (u)   => u      # Dual
  @Inverse   = (u)   => u      # Inverse
  @Conjugate = (u)   => u      # Conjugate
  @Reverse   = (u)   => u      # Reverse
  @Involute  = (u)   => u      # Involute
  @Rotor     = (u)   => u      # Rotor
  @Magnitude = (u)   => u      # Magnitude
  @Grade     = (u)   => u      # Grade
  @Reflect   = (u,v) => u * v * @conjugate(u)
  @Rotate    = (u,v) => u * v * @conjugate(u)
  @GP        = (u,v) => Adt.Dot(u,v) + Adt.Wedge(u,v) # Geometric Product

  # Numbers and Variables
  @Var = (v)   =>  v
  @Num = (n)   =>  n
  @Dbl = (d)   =>  d
  @Rat = (u,v) =>  u / v

  # Arithmetic
  @Equ = (u,v) =>  u =  v
  @Add = (u,v) =>  u +  v
  @Sub = (u,v) =>  u -  v
  @Mul = (u,v) =>  u *  v
  @Div = (u,v) =>  u /  v
  @Pow = (u,v) =>  u ** v

  # Unary operator high precendence
  @Neg = (u)   => -u
  @Rec = (u)   =>  1 / u
  @Abs = (u)   => Math.abs(u)

  # Parenthesis Braces Object Array
  @Par = (u)   => ( u   )
  @Brc = (u)   => { u   }
  @Obj = (k,v) => { k:v } # ???
  @Arr = (u)   => [ u   ] # ???

  @ArithAdts = [@Var,@Num,@Dbl,@Rat,@Equ,@Add,@Sub,@Mul,@Div,@Pow,@Neg,@Rec,@Abs,@Par,@Brc]

  # Natural Log, Log Base, Root, Square Root and e
  @Lnn = (u)   => Math.log(u)                 # ln(u)
  @Log = (u,b) => Math.log(u) / Math.log(b)   # log_b(u)
  @Roo = (u,r) => Math.pow(u,1/r)          # root_b(u)
  @Sqt = (u)   => Math.sqrt(u)                # sqrt(u)
  @Eee = (u)   => Math.exp(u)                 # e**u

  # Trigometric

  @Sin = (u)   =>  Math.sin(u)
  @Cos = (u)   =>  Math.cos(u)
  @Tan = (u)   =>  Math.tan(u)
  @Csc = (u)   =>  1.0 / Math.sin(u)
  @Sec = (u)   =>  1.0 / Math.cos(u)
  @Cot = (u)   =>  1.0 / Math.tan(u)

  # Inverse Trigometric
  @ASin = (u)  =>  Math.ssin(u)
  @ACos = (u)  =>  Math.scos(u)
  @ATan = (u)  =>  Math.atan(u)
  @ACsc = (u)  =>  Math.asin(1/u ) # ???
  @ASec = (u)  =>  Math.acos(1/u ) # ???
  @ACot = (u)  =>  Math.atan(1/u ) # ???

  @TransAdts = [@Lnn,@Log,@Roo,@Sqt,@Eee,@Sin,@Cos,@Tan,@Csc,@Sec,@Cot,@ASin,@ACos,@ATan,@ACsc,@ASec,@ACot]

  # Hyperbolic  with Inverse
  @Sinh  = (u) =>  Math.sinh(u)
  @Cosh  = (u) =>  Math.cosh(u)
  @Tanh  = (u) =>  Math.tanh(u)
  @ASinh = (u) =>  Math.asinh(u)
  @ACosh = (u) =>  Math.acosh(u)
  @ATanh = (u) =>  Math.atanh(u)

  @HyperAdts = [@Sinh,@Cosh,@Tanh,@ASinh,@ACosh,@ATanh]

  # Calculus, Sum and Typsetting
  @Fun = (f,u)   => f(u)      # Function
  @Dif = (u)     => u         # d(u) Differentiation
  @Itg = (u)     => u         # Integration
  @Itl = (a,b,u) => a + b + u # Definite Integral
  @Sum = (a,b,u) => a + b + u # Summation

  # Subscripts Superscripts Limits
  @Sub = (u,a)   => u + a     # u_a  Subscript
  @Sus = (u,b)   => u + b     # u^b  Superscript
  @Lim = (a,b)   => a + b     #_a^b  Limit for Sum and Itg

  @CalculusAdts = [@Fun,@Dif,@Itg,@Itl,@Sum,@Sub,@Sus,@Lim]

  # Finge

  @Sim = (u)     => u         # sim(u) Simplify
  @Not = (u)     => u         # Not an Adt expression
  @Msg = (u)     => u         # Parsing error message


export default Adt