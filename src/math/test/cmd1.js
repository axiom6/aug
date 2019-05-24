
// let cmds = process.argv.slice(2);

import mathML from '../ptn/MathML';

mathML.testMarkup( 'add' );
mathML.testMarkup( 'trg' );
mathML.testMarkup( 'sus' );

mathML.testParse( 'add' );
mathML.testParse( 'trg' );
mathML.testParse( 'sus' );