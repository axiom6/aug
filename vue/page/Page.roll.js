
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/page/Page.vue', output: { file: 'pub/vue/page/Page.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]