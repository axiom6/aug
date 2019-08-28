
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [
  { input: 'vue/disp/Disp.vue', output: { file: 'pub/vue/disp/Disp.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]