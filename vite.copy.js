
const path             = require("path");
const { promises: fs } = require("fs");

async function copyDir( src, dest ) {
  await fs.mkdir( dest, { recursive:true } );
  let entries = await fs.readdir( src, { withFileTypes:true } );
  for( let entry of entries ) {
    let srcPath  = path.join(  src,  entry.name );
    let destPath = path.join( dest,  entry.name );
    entry.isDirectory()
      ? await copyDir(     srcPath, destPath )
      : await fs.copyFile( srcPath, destPath ); } }

copyDir( 'assets',  'dist/assets' ).then();
fs.copyFile( 'manifest.json',   'dist/manifest.json' );
fs.copyFile( 'Worker.js',       'dist/Worker.js'     );