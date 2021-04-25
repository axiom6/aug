const { promises:fs } = require("fs");
fs.copyFile( 'src/augm/appl/augm.html', 'index.html' );
fs.copyFile( 'src/augm/mbox/mathbox-bundle.js', 'assets/mathbox-bundle.js' );