
let cmds = process.argv.slice(2);

let Ascii  = require('./Ascii.js' );
let Tracer = require('../../../node_modules/pegjs-backtrace');

let runTrace = ( asc) => {
  let par = "X";
  let err = {};
  let tracer = new Tracer(asc);
  try {
    par = Ascii.parse( asc, { tracer:tracer } ); }
  catch( error ) {
    err = tracer.getBacktraceString(); }
  return { par:par, err:err };
}

let runParse = ( asc ) => {
  let par = "X";
  let err = {};
  try {         // { trace:false } does not work when --trace flag set for .pegjs to .js
    par = Ascii.parse( asc, { trace:false } ); }
  catch( error ) {
    err.found = error.found; err.msg = error.message; err.loc = error.location; }
  return { par:par, err:err };
}

let test = ( asc, expect ) => {
  let dbg = cmds[0]==='dbg'
  let obj = {};
  if( dbg ) {
    obj = runTrace( asc ); }
  else {
    obj = runParse( asc ); }
  let sta = obj.par===expect ? "Pass" : "Fail";
//let fun = new Function( par );
  console.log( sta, asc, obj.par, obj.err );
}

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
