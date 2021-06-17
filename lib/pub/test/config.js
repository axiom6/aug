const { promises:fs } = require("fs");
fs.copyFile( 'lib/pub/test/index.html', 'index.html' );