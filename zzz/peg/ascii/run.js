

let Ascii = require('./Ascii.js' );

let a1 = "(2.2+3)*(1+2)";
let e1 = Ascii.parse( a1 );
console.log( 'Ascii 1', a1, e1 );

let a2 = "2.2*3+4*3";
let e2 = Ascii.parse( a2 );
console.log( 'Ascii 2', a2, e2 );

let a3 = "2.2*3+x*y";
let e3 = Ascii.parse( a3 );
console.log( 'Ascii 3', a3, e3 );

let a4 = "2.2*3-x*y";
let e4 = Ascii.parse( a4 );
console.log( 'Ascii 4', a4, e4 );

let a6 = "2.2*3=x/y";
let e6 = Ascii.parse( a6 );
console.log( 'Ascii 6', a6, e6 );

let a7 = "-2.2*3-x/-y";
let e7 = Ascii.parse( a7 );
console.log( 'Ascii 6', a7, e7 );

let a8 = "x*x*(a+b_1)";
let e8 = Ascii.parse( a8 );
console.log( 'Ascii 6', a8, e8 );
/*
let a9 = "sum_(i=1)^n i^3=((n(n+1))/2)^2"
let e9 = Ascii.parse( a9 );
console.log( 'Ascii 6', a9, e9 );

let aa = "x = (-b +- sqrt(b^2-4ac))/(2a)"
let ea = Ascii.parse( aa );
console.log( 'Ascii A', aa, ea );
 */