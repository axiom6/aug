
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default
{ input:          'vue/muse/Cube.vue',
  output: { file: 'vue/muse/Cube.js', format:'esm' },
  plugins: [ VueRollup(), LessRollup(), commonjs() ] }