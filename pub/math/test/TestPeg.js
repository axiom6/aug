
// node --experimental-modules -r esm TestPeg.js

let cmds = process.argv.slice(2);

import Ascii from    '../par/Ascii.esm.js';
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

test("(2.2+3)*(1+2)",      "[Mul,[Par,[Add,2.2,3]],[Par,[Add,1,2]]]" );
test("2.2*3+4*3",          "[Add,[Mul,2.2,3],[Mul,4,3]]" );
test("2.2*3+x*arctan(y)",  "[Add,[Mul,2.2,3],[Mul,x,[Arctan,y]]]" );
test("2.2*3-x^y",          "[Sub,[Mul,2.2,3],[Pow,x,y]]" );
test("2.2^3 = x/y",        "[Equ,[Pow,2.2,3],[Div,x,y]]" );
test("-2.2 * 3-x / -y",    "[Sub,[Mul,[Neg,2.2],3],[Div,x,[Neg,y]]]" );
test("x*x*(a+b_1)",        "[Mul,x,[Mul,x,[Par,[Add,a,[Sus,b,1]]]]]" );
test("a+b*sin(theta)",     "[Add,a,[Mul,b,[Sin,theta]]]" );
test("fn(a+b)*g(theta)",   "[Mul,[Fun,fn,[Add,a,b]],[Fun,g,theta]]" );
test("int(x*2)",           "[Int,[Mul,x,2]]" );
test( "[1,2,3]",           "[Vec,1,2,3]" );
test( "[[1,2,3],[4,5,6]]", "[Mat,[Vec,1,2,3],[Vec,4,5,6]]" );
test("lim_i^n",            "[Lim,i,n]" );
test("sum_i^n~j",          "[Sum,i,n,j]" );
test("sum_i^n~j+1",        "[Sum,i,n,[Add,j,1]]" );

