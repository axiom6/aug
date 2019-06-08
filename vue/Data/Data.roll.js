
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/data/Table.vue', output: { file: 'pub/vue/data/Table.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/data/Pivot.vue', output: { file: 'pub/vue/data/Pivot.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
]