
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

  @Geom = [@Dot,@Wedge,@Vee,@Dual,@Inverse,@Conjugate,@Reverse,@Involute,@Rotor,@Magnitude,@Grade,@Reflect,@Rotate,@GP]

  # Numbers and Variables
  @Ratio = (u,v) =>  u / v

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

  @Arith = [@Ratio,@Equ,@Add,@Sub,@Mul,@Div,@Pow,@Neg,@Recip,@Abs,@Paren,@Brace]

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

  @Trans = [@Ln,@Log,@Root,@Sqrt,@E,
    @Sin,   @Cos,   @Tan,   @Csc,   @Sec,   @Cot,
    @Arcsin,@Arccos,@Arctan,@Arccsc,@Arcsec,@Arccot]

  # Hyperbolic  with Inverse
  @Sinh    = (u) =>  Math.sinh(u)
  @Cosh    = (u) =>  Math.cosh(u)
  @Tanh    = (u) =>  Math.tanh(u)
  @Arccinh = (u) =>  Math.asinh(u)
  @Arccosh = (u) =>  Math.acosh(u)
  @Arctanh = (u) =>  Math.atanh(u)

  @Hyper = [@Sinh,@Cosh,@Tanh,@Arccinh,@Arccosh,@Arctanh]

  # Calculus, Sum and Typsetting
  @Fun    = (f,u)   => u         # f(u) Function
  @D      = (u)     => u         # d(u) Differentiation
  @Int    = (u)     => u         # Integration
  @DefInt = (a,b,u) => a + b + u # Definite Integral
  @Sum    = (a,b,u) => a + b + u # Summation

  # Subscripts Superscripts Limits
  @Sus = (u,a)   => u + a     # u_a  Subscript  u^b  Superscript is Power
  @Lim = (a,b)   => a + b     #_a^b  Limit for Sum and Itg

  @Calculus = [@Fun,@D,@Int,@DefInt,@Sum,@Sub,@Sus,@Lim]

  # Finge
  #Obj = (k,v)  => { k:v } # ???
  @Sim = (u)     => u         # sim(u) Simplify
  @Not = (u)     => u         # Not an Adt expression
  @Msg = (u)     => u         # Parsing error message
  @Unk = (u)     => u

  @Fringe = [@Sim,@Not,@Msg,@Unk]

  if @Geom  is false and @Arith    is false and @Trans  is false then {}
  if @Hyper is false and @Calculus is false and @Fringe is false then {}

export default Adt