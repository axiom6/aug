
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/page/Prac.vue', output: { file: 'pub/vue/page/Prac.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/page/Conn.vue', output: { file: 'pub/vue/page/Conn.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/page/Enli.vue', output: { file: 'pub/vue/page/Enli.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/page/Data.vue', output: { file: 'pub/vue/page/Data.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]