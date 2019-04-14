
import VueRollup  from 'rollup-plugin-vue'
import commonjs   from 'rollup-plugin-commonjs';

export default
{ input:          'ani/wood/Wood.vue',
  output: { file: 'ani/wood/Wood.js', format:'esm' },
  plugins: [ VueRollup(), commonjs() ] }