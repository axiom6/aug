
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [
  { input: 'vue/comp/Comp.vue', output: { file: 'pub/vue/comp/Comp.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/comp/Conn.vue', output: { file: 'pub/vue/comp/Conn.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]