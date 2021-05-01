const { promises: fs } = require("fs");
fs.copyFile( 'src/muse/appl/index.html', 'index.html' );
fs.rm('assets/mathbox-bundle.js', { force:true } );