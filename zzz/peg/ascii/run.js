

let Ascii = require('./Ascii.js' );

let test = ( a, t ) => {
  let p = "X";
  let e = {};
  try {
    p = Ascii.parse( a ); }
  catch( error ) {
    e.found = error.found; e.msg = error.message; e.loc = error.location; }
  let r = p===t ? "Pass" : "Fail";
  let q = p===t ? t : p;
  console.log( r, a, q, e ) }

test( "(2.2+3)*(1+2)",     "Mul(Par(Add(Dbl(2.2),Num(3))),Par(Add(Num(1),Num(2))))" );
test("2.2*3+4*3",          "Add(Mul(Dbl(2.2),Num(3)),Mul(Num(4),Num(3)))" );
test("2.2*3+x*arctan(y)",  "Add(Mul(Dbl(2.2),Num(3)),Mul(Var(x),ATan(Var(y))))" );
test("2.2*3-x^y",          "Sub(Mul(Dbl(2.2),Num(3)),Pow(Var(x),Var(y)))" );
test("2.2^3 = x/y",        "Equ(Pow(Dbl(2.2),Num(3)),Div(Var(x),Var(y)))" );
test("-2.2 * 3-x / -y",    "Sub(Mul(Neg(Dbl(2.2)),Num(3)),Div(Var(x),Neg(Var(y))))" );
test("x*x*(a+b_1)",        "Mul(Var(x),Mul(Var(x),Par(Add(Var(a),Sus(Var(b),Num(1))))))" );
test("a+b*sin(theta)",     "Add(Var(a),Mul(Var(b),Sin(Var(theta))))" );
test("f(a+b)*g(theta)",    "Mul(Fun(f,Add(Var(a),Var(b))),Fun(g,Var(theta)))" );
test("int~(x*2)",          "Itg(Par(Mul(Var(x),Num(2))))" );
test( "[1,2,3]",           "Vec(Num(1),Num(2),Num(3))" );
test( "[[1,2,3],[4,5,5]]", "Mat(Vec(Num(1),Num(2),Num(3)),Vec(Num(4),Num(5),Num(6)))" );
//st("sum_(i=1)^n(j*3)",   "Sum(Par(Equ(Var(i),Num(1))),Var(n),Mul(Var(j),Num(3)))" );
//st("int_(i=1)^n~j*3",    "Itl(Par(Equ(Var(i),Num(1))),Var(n),Mul(Var(j),Num(3)))" );
//st("sum_(i=1)^n j*3=((n(n+1))/2)^2", "?" );
//st("sum_(i=1)^n(j*3)=((n(n+1))/2)^2", "?" );
//st("x = (-b +- sqrt(b^2-4ac))/(2a)"