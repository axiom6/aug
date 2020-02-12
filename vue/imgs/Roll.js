
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [
  { input: 'vue/imgs/Imgs.vue', output: { file: 'pub/vue/imgs/Imgs.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]