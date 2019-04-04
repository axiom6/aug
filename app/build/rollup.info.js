
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default
{ input:          'vue/muse/Info.vue',
  output: { file: 'vue/muse/Info.js', format:'esm' },
  plugins: [ VueRollup(), LessRollup(), commonjs() ] }