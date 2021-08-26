const { promises: fs } = require("fs");
fs.copyFile( 'src/muse/appl/index.html',    'index.html' );
fs.copyFile( 'src/muse/appl/manifest.json', 'manifest.json' );
fs.copyFile( 'src/muse/appl/manifest.json', 'dist/manifest.json' );