
import Vue      from 'rollup-plugin-vue'
import Coffee   from 'rollup-plugin-coffee-script'
import Less     from 'rollup-plugin-less'
import commonjs from 'rollup-plugin-commonjs';

export default
{ input:          'Logo.vue',
  output: { file: 'Logo.js', format:'esm' },
  plugins: [ Vue(), Coffee(), Less(), commonjs() ] }