

let Ascii  = require('./Ascii.js' );
let Tracer = require('../../../node_modules/pegjs-backtrace');

let test = ( a, t ) => {  // console.log(tracer.getBacktraceString());
  let tracer = new Tracer(a);
  let p = "X";
  let e = {};
//let opt = dbg ? { tracer:tracer } : {};
  try {
    p = Ascii.parse( a, { tracer:tracer } ); }
  catch( error ) {
    console.log(tracer.getBacktraceString()); }
  //e.found = error.found; e.msg = error.message; e.loc = error.location; }
  let r = p===t ? "Pass" : "Fail";
  let q = p===t ? t : p;
  console.log( r, a, q, e ) }

test("(2.2+3)*(1+2)",      "Mul(Par(Add(Dbl(2.2),Num(3))),Par(Add(Num(1),Num(2))))" );
test("2.2*3+4*3",          "Add(Mul(Dbl(2.2),Num(3)),Mul(Num(4),Num(3)))" );
test("2.2*3+x*arctan(y)",  "Add(Mul(Dbl(2.2),Num(3)),Mul(Var(x),ATan(Var(y))))" );
test("2.2*3-x^y",          "Sub(Mul(Dbl(2.2),Num(3)),Pow(Var(x),Var(y)))" );
test("2.2^3 = x/y",        "Equ(Pow(Dbl(2.2),Num(3)),Div(Var(x),Var(y)))" );
test("-2.2 * 3-x / -y",    "Sub(Mul(Neg(Dbl(2.2)),Num(3)),Div(Var(x),Neg(Var(y))))" );
test("x*x*(a+b_1)",        "Mul(Var(x),Mul(Var(x),Par(Add(Var(a),Sus(Var(b),Num(1))))))" );
test("a+b*sin(theta)",     "Add(Var(a),Mul(Var(b),Sin(Var(theta))))" );
test("fn(a+b)*g(theta)",   "Mul(Fun(fn,Add(Var(a),Var(b))),Fun(g,Var(theta)))" );
test("int(x*2)",           "Int(Mul(Var(x),Num(2)))" );
test( "[1,2,3]",           "Vec(Num(1),Num(2),Num(3))" );
test( "[[1,2,3],[4,5,6]]", "Mat(Vec(Num(1),Num(2),Num(3)),Vec(Num(4),Num(5),Num(6)))" );
test("lim_i^n",            "Lim(Var(i),Var(n))" );
test("sum_i^n~j",          "Sum(Var(i),Var(n),Var(j))" );
test("sum_i^n~j+1",        "Sum(Var(i),Var(n),Add(Var(j),Num(1)))" );
//st("lim_i#n.",           "Lim(Var(i),Var(n))" );
//st("sum_i^n#(j*2)",      "Sum(Var(i),Var(n)),Par(Mul(Var(j),Num(2)))" );
//st("sum_i^n#i*2",        "Sum(Var(i),Var(n),Mul(Var(i),Num(2))" );

//st("x = (-b +- sqrt(b^2-4ac))/(2a)"
