
// cd   pub/math/test
// node --experimental-modules -r esm Run.js

// let cmds = process.argv.slice(2);

// import TestMatch  from './TestMatch.js';
// import TestAscii  from './TestAscii.js';
// import TestMathML from './TestMathML.js';
   import TestDiffEQ from './TestDiffEQ.js';

console.log( "---------------------------- Begin ----------------------------")

// TestMatch.doExp();

// let testMathML = new TestMathML();
   let testDiffEQ = new TestDiffEQ();

// TestAscii.run();

// testMathML.testMarkup();

//  testMathML.testParse();

   testDiffEQ.testDiffEQ();
