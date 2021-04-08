import {defineConfig} from 'vite';
import vue            from '@vitejs/plugin-vue';
import LessRollup     from 'rollup-plugin-less';
const { promises: fs } = require("fs");

export default  ( { command, mode } ) => {

  if( command === 'build' ) {
    console.log( 'vite.config.js build', { command:command, mode:mode } );
    fs.copyFile( 'pub/appl/Mods.js', 'pub/appl/Load.js' );
    return defineConfig({
      plugins:[vue()] } ); }
  else if( command === 'serve' ) {
    console.log( 'vite.config.js serve', { command:command, mode:mode } );
    if( mode === 'development' ) {
      fs.copyFile( 'pub/appl/Lazy.js', 'pub/appl/Load.js' ); }
    return defineConfig({
      plugins: [vue()] } ); }
  else {
    console.log( 'vite.config.js dev?', { command:command, mode:mode } );
    fs.copyFile( 'pub/appl/Lazy.js',   'pub/appl/Load.js' );
    return defineConfig({
      plugins: [vue()],
      build: { rollupOptions:{ plugins:LessRollup() } } } ); }
}
