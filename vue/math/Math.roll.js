
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/math/MathEQ.vue', output: { file: 'pub/vue/math/MathEQ.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/math/MathML.vue', output: { file: 'pub/vue/math/MathML.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }

]