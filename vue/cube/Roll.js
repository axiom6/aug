
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default
{ input:              'vue/cube/Cube.vue',
  output: { file: 'pub/vue/cube/Cube.js', format:'esm' },
  plugins: [ VueRollup(), LessRollup(), commonjs() ] }