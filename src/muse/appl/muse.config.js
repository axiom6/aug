const { promises: fs } = require("fs");
fs.copyFile( 'src/muse/appl/muse.html', 'index.html' );
fs.rm('assets/mathbox-bundle.js', { force:true } );