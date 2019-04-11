
import VueRollup  from 'rollup-plugin-vue'
import commonjs   from 'rollup-plugin-commonjs';

export default
{ input:          'app/anim/wood/Wood.vue',
  output: { file: 'app/anim/wood/Wood.js', format:'esm' },
  plugins: [ VueRollup(), commonjs() ] }