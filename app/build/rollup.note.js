
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/note/Stand.vue', output: { file: 'pub/note/Stand.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Embed.vue', output: { file: 'pub/note/Embed.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Maths.vue', output: { file: 'pub/note/Maths.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Ganja.vue', output: { file: 'pub/note/Ganja.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]