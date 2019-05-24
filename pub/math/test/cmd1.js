
// let cmds = process.argv.slice(2);

import MathML from '../ptn/MathML.js';


console.log( "------------------------ BEGIN --------------------------" )

let mathML = new MathML();
if( mathML===false ) {}

mathML.testExp();

//mathML.doExp();

//mathML.testMarkup( 'Add' );
//mathML.testMarkup( 'Equ' );
//mathML.testMarkup( 'Sum' );
/*
mathML.testParse( 'add' );
mathML.testParse( 'trg' );
mathML.testParse( 'sus' );
*/