
class Op

  #
  # Precedence	Inline JS	AsciiMath	Object Oriented	Functional
  # 5	x.Involute	tilde(x)	x.Involute	A.Involute(x)
  # 5	x.Reverse	ddot(x)	x.Reverse	A.Reverse(x)
  # 5	~x	hat(x)	x.Conjugate	A.Conjugate(x)
  # 5	!x	bar(x)	x.Dual	A.Dual(x)
  # 4 rtl	x**-1	x^-1	x.Inverse	A.Inverse(x)
  # 4 rtl	x**y	x^y	x.Pow(y)	A.Pow(x,y)
  # 3	x^y	x^^y	x.Wedge(y)	A.Wedge(x,y)
  # 3	x<<y	x*y	x.Dot(y)	A.Dot(x,y)
  # 3	x&y	bar(bar(x)^^bar(y))	x.Vee(y)	A.Vee(x,y)
  # 3	x>>>y	x ** y ** hat(x)	x.Mul(y).Mul(x.Conjugate)	A.sw(x,y)
  # 2	x*y	x**y	x.Mul(y)	A.Mul(x,y)
  # 2	x/y	x/y	x.Div(y)	A.Div(x,y)
  # 1	x-y	x-y	x.Sub(y)	A.Sub(x,y)
  # 1	x+y	x+y	x.Add(y)	A.Add(x,y)
  # 1e1	1e_1	new A([0,1])	A.Vector(1)
  # 2e2	2e_2	new A([0,0,2,0])	A.Vector(0,2)
  # 2e12	2e_12	new A([0,0,0,2])	A.Bivector(2)

  constructor:( arg ) ->

  add:( u, v ) -> u + v
  sub:( u, v ) -> u - v
  mul:( u, v ) -> u * v     # Scalar and geometric product
  div:( u, v ) -> u / v
  pow:( u, v ) -> u ** v

  dot:(   u, v ) -> u ~ v
  wedge:( u, v ) -> u ^ v
  vee:(   u, v ) -> u & v

  dual:( u )        -> u
  inverse:( u )     -> u
  conjugate:( u )   -> u
  reverse:( u )     -> u
  involute:( u )    -> u

  rotor;( u )       -> u
  reflect:( u, v )  -> u * v * @conjugate(u)
  rotate:( u, v )   -> u * v * @conjugate(u)
  magnitude:( u )   -> u
  grade:( u )       -> u


export default Op