
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/note/Stand.vue', output: { file: 'pub/vue/note/StandVue.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Embed.vue', output: { file: 'pub/vue/note/EmbedVue.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Maths.vue', output: { file: 'pub/vue/note/MathsVue.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/note/Ganja.vue', output: { file: 'pub/vue/note/GanjaVue.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }
]