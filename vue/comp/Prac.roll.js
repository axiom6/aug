
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default
{ input:              'vue/comp/Prac.vue',
  output: { file: 'pub/vue/comp/Prac.js', format:'esm' },
  plugins: [ VueRollup(), LessRollup(), commonjs() ] }