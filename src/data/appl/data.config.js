const { promises: fs } = require("fs");
fs.copyFile( 'src/data/appl/data.html', 'index.html' );
fs.rm('assets/mathbox-bundle.js', { force:true } )