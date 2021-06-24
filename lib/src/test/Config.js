const { promises:fs } = require("fs");
fs.copyFile(         'lib/src/test/Initial.html',     'index.html' );
console.log( "Copied 'lib/src/test/Initial.html',  to 'index.html'" )