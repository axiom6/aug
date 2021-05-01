const { promises: fs } = require("fs");
fs.copyFile( 'src/jitt/appl/index.html', 'index.html' );
fs.rm('assets/mathbox-bundle.js', { force:true } );