
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/data/Tables.vue', output: { file: 'pub/vue/data/Tables.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/data/Pivots.vue', output: { file: 'pub/vue/data/Pivots.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/data/Table1.vue', output: { file: 'pub/vue/data/Table1.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/data/Pivot1.vue', output: { file: 'pub/vue/data/Pivot1.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/data/Table2.vue', output: { file: 'pub/vue/data/Table2.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/data/Pivot2.vue', output: { file: 'pub/vue/data/Pivot2.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
]