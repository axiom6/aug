
import VueRollup  from 'rollup-plugin-vue'
import commonjs   from 'rollup-plugin-commonjs';

export default
{ input:              'vue/wood/Wood.vue',
  output: { file: 'pub/vue/comp/Wood.js', format:'esm' },
  plugins: [ VueRollup(), commonjs() ] }