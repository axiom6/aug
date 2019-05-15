
import Vue      from 'rollup-plugin-vue'
import Coffee   from 'rollup-plugin-coffee-script'
import Less     from 'rollup-plugin-less'
import commonjs from 'rollup-plugin-commonjs';

export default
  { input:          'vue/dash/Dash.vue',
    output: { file: 'app/aug/Dash.js', format:'esm' },
    plugins: [ Vue(), Coffee(), Less(), commonjs() ] }

