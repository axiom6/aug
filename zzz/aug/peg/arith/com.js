

let Adt = require('./adt.js' );
let a1 = "(2+3)*(1+2)";
let e1 = Adt.parse( a1 );
console.log( 'Adt', a1, e1 );