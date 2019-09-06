
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [
  { input: 'vue/prin/Prin.vue', output: { file: 'pub/vue/prin/Prin.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]