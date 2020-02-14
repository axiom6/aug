
import Vue      from 'rollup-plugin-vue'
import Coffee   from 'rollup-plugin-coffee-script'
import Less     from 'rollup-plugin-less'
import commonjs from 'rollup-plugin-commonjs';

export default [
  { input: 'vue/talk/Talk.vue', output: { file: 'pub/vue/talk/Talk.js', format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] },
  { input: 'vue/talk/Sect.vue', output: { file: 'pub/vue/talk/Sect.js', format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] },
  { input:          'pub/app/muse/Home.vue',
    output: { file: 'pub/app/muse/Home.js', format:'esm' },
    plugins: [ Vue(), Coffee(), Less(), commonjs() ] }
  ]

