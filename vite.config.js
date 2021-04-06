import {defineConfig} from 'vite';
import vue            from '@vitejs/plugin-vue';
import LessRollup     from 'rollup-plugin-less';

export default  ( { command, mode } ) => {

  if( command === 'build' ) {
    console.log( 'vite.config.js build', { command:command, mode:mode } );
    return defineConfig({
      // build: { manifest:true, rollupOptions: { input:'/manifest.json' } },
      plugins:[vue()] } ); }
  else if( command === 'serve' ) {
    console.log( 'vite.config.js serve', { command:command, mode:mode } );
    return defineConfig({
      plugins: [vue()] } ); }
  else {
    console.log( 'vite.config.js dev?', { command:command, mode:mode } );
    return defineConfig({
      plugins: [vue()],
      build: { rollupOptions:{ plugins:LessRollup() } } } ); }
}
