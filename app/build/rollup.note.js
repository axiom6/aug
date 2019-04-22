
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/note/Stand.vue', output: { file: 'src/note/Stand.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Embed.vue', output: { file: 'src/note/Embed.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Maths.vue', output: { file: 'src/note/Maths.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Ganja.vue', output: { file: 'src/note/Ganja.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]