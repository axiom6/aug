
import VueRollup  from 'rollup-plugin-vue'
import ScssRollup from 'rollup-plugin-scss';
import commonjs   from 'rollup-plugin-commonjs';

export default
{ input:          'app/demo/Svga.vue',
  output: { file: 'app/demo/Svga.js', format:'esm' },
  plugins: [ VueRollup(), ScssRollup(), commonjs() ] }