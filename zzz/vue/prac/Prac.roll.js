
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/prac/Prac.vue', output: { file: 'pub/vue/prac/Prac.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/prac/Conn.vue', output: { file: 'pub/vue/prac/Conn.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/prac/Enli.vue', output: { file: 'pub/vue/prac/Enli.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/prac/Data.vue', output: { file: 'pub/vue/prac/Data.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]