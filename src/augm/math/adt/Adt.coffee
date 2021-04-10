
class Adt

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
  @Reflect   = (u,v) => u * v * conjugate(u)
  @Rotate    = (u,v) => u * v * conjugate(u)
  @GP        = (u,v) => Adt.Dot(u,v) + Adt.Wedge(u,v) # Geometric Product

  # Vector, Matrix, Numbers and Variables
  @Vec   = (f,rest) =>  f(rest)
  @Mat   = (f,rest) =>  f(rest)
  @Ratio = (u,v)    =>  u / v

  # Arithmetic
  @Equ = (u,v) =>  u =  v
  @Add = (u,v) =>  u +  v
  @Sub = (u,v) =>  u -  v
  @Mul = (u,v) =>  u *  v
  @Div = (u,v) =>  u /  v
  @Pow = (u,v) =>  u ** v

  # Unary operator high precendence
  @Neg   = (u) => -u
  @Recip = (u) =>  1 / u
  @Abs   = (u) => Math.abs(u)

  # Parenthesis Braces Object Array
  @Paren = (u)   => ( u )
  @Brace = (u)   => { u }

  # Natural Log, Log Base, Root, Square Root and e
  @Ln   = (u)   => Math.log(u)                 # ln(u)
  @Log  = (u,b) => Math.log(u) / Math.log(b)   # log_b(u)
  @Root = (u,r) => Math.pow(u,1/r)          # root_b(u)
  @Sqrt = (u)   => Math.sqrt(u)                # sqrt(u)
  @E    = (u)   => Math.exp(u)                 # e**u

  # Trigometric

  @Sin = (u)   =>  Math.sin(u)
  @Cos = (u)   =>  Math.cos(u)
  @Tan = (u)   =>  Math.tan(u)
  @Csc = (u)   =>  1.0 / Math.sin(u)
  @Sec = (u)   =>  1.0 / Math.cos(u)
  @Cot = (u)   =>  1.0 / Math.tan(u)

  # Inverse Trigometric
  @Arcsin = (u)  =>  Math.asin(u)
  @Arccos = (u)  =>  Math.acos(u)
  @Arctan = (u)  =>  Math.atan(u)
  @Arccsc = (u)  =>  Math.asin(1/u ) # ???
  @Arcsec = (u)  =>  Math.acos(1/u ) # ???
  @Arccot = (u)  =>  Math.atan(1/u ) # ???

  # Hyperbolic  with Inverse
  @Sinh    = (u) =>  Math.sinh(u)
  @Cosh    = (u) =>  Math.cosh(u)
  @Tanh    = (u) =>  Math.tanh(u)
  @Arccinh = (u) =>  Math.asinh(u)
  @Arccosh = (u) =>  Math.acosh(u)
  @Arctanh = (u) =>  Math.atanh(u)

  # Calculus, Sum and Typsetting
  @Fun    = (f,u)   => u         # f(u) Function
  @D      = (u)     => u         # d(u) Differentiation
  @Int    = (u)     => u         # Integration
  @DefInt = (a,b,u) => a + b + u # Definite Integral
  @Sum    = (a,b,u) => a + b + u # Summation

  # Subscripts Superscripts Limits
  @Sus = (u,a)   => u + a     # u_a  Subscript  u^b  Superscript is Power
  @Lim = (a,b)   => a + b     #_a^b  Limit for Sum and Itg

  # Finge
  #Obj = (k,v)  => { k:v } # ???
  @Latex = (o)  => o
  @Sim   = (u)  => u         # sim(u) Simplify
  @Not   = (u)  => u         # Not an Adt expression
  @Msg   = (u)  => u         # Parsing error message
  @Unk   = (u)  => u


Adt.Geom     = [Adt.Dot,Adt.Wedge,Adt.Vee,Adt.Dual,Adt.Inverse,Adt.Conjugate,Adt.Reverse,Adt.Involute,Adt.Rotor,
                Adt.Magnitude,Adt.Grade,Adt.Reflect,Adt.Rotate,Adt.GP]
Adt.Arith    = [Adt.Ratio,Adt.Equ,Adt.Add,Adt.Sub,Adt.Mul,Adt.Div,Adt.Pow,Adt.Neg,Adt.Recip,Adt.Abs,Adt.Paren,Adt.Brace]
Adt.Trans    = [Adt.Ln,Adt.Log,Adt.Root,Adt.Sqrt,Adt.E,
                Adt.Sin,   Adt.Cos,   Adt.Tan,   Adt.Csc,   Adt.Sec,   Adt.Cot,
                Adt.Arcsin,Adt.Arccos,Adt.Arctan,Adt.Arccsc, Adt.Arcsec, Adt.Arccot]
Adt.Hyper    = [Adt.Sinh,  Adt.Cosh,  Adt.Tanh,  Adt.Arccinh,Adt.Arccosh,Adt.Arctanh]
Adt.Calculus = [Adt.Fun,Adt.D,Adt.Int,Adt.DefInt,Adt.Sum,Adt.Sub,Adt.Sus,Adt.Lim]
Adt.Fringe   = [Adt.Latex,Adt.Sim,Adt.Not,Adt.Msg,Adt.Unk]

export default Adt