
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default [

  { input: 'vue/geom/Geom2D.vue', output: { file: 'pub/vue/geom/Geom2D.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/geom/Geom3D.vue', output: { file: 'pub/vue/geom/Geom3D.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] },
  { input: 'vue/geom/Geom4D.vue', output: { file: 'pub/vue/geom/Geom4D.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }

]