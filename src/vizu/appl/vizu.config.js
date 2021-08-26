const { promises:fs } = require("fs");
fs.copyFile( 'src/vizu/appl/index.html',    'index.html' );
fs.copyFile( 'src/vizu/appl/manifest.json', 'manifest.json' );
fs.copyFile( 'src/vizu/appl/manifest.json', 'dist/manifest.json' );