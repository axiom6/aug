const { promises: fs } = require("fs");
fs.copyFile( 'src/data/appl/index.html',    'index.html' );
fs.copyFile( 'src/data/appl/manifest.json', 'manifest.json' );
fs.copyFile( 'src/data/appl/manifest.json', 'dist/manifest.json' );