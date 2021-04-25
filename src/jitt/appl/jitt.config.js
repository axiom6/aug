const { promises: fs } = require("fs");
fs.copyFile( 'src/jitt/appl/jitt.html', 'index.html' );
fs.rm('assets/mathbox-bundle.js', { force:true } );