
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [
  { input: 'vue/talk/Talk.vue', output: { file: 'pub/vue/talk/Talk.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/talk/Sect.vue', output: { file: 'pub/vue/talk/Sect.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/talk/Prac.vue', output: { file: 'pub/vue/talk/Prac.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/talk/Disp.vue', output: { file: 'pub/vue/talk/Disp.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]