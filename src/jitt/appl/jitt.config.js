const { promises: fs } = require("fs");
fs.copyFile( 'src/jitt/appl/index.html', 'index.html' );
fs.copyFile( 'src/jitt/appl/manifest.json', 'manifest.json' );
fs.copyFile( 'src/jitt/appl/manifest.json', 'dist/manifest.json' );