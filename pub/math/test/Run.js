
// cd   pub/math/test
// node --experimental-modules -r esm Run.js

// let cmds = process.argv.slice(2);

// import TestMatch  from './TestMatch.js'
   import TestMathML from './TestMathML.js';

console.log( "---------------------------- Begin ----------------------------")

let testMathML = new TestMathML();

// TestMatch.doExp();

testMathML.testMarkup( 'Sin' );
testMathML.testMarkup( 'Add' );
testMathML.testMarkup( 'Equ' );
testMathML.testMarkup( 'Sum' );

//testMathML.testParse( 'add' );
//testMathML.testParse( 'trg' );
//testMathML.testParse( 'sus' );