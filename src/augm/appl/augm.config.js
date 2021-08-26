const { promises:fs } = require("fs");
fs.copyFile( 'src/augm/appl/index.html',    'index.html'    );
fs.copyFile( 'src/augm/appl/manifest.json', 'manifest.json' );
fs.copyFile( 'src/augm/appl/manifest.json', 'dist/manifest.json' );