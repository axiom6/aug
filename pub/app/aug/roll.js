
// Command Line  rollup -c app/roll/roll.js -i Home.vue -o Home.js

import Vue        from 'rollup-plugin-vue'
import Less       from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs'
import Coffee     from 'rollup-plugin-coffee-script'
import Typescript from 'rollup-plugin-coffee-script'
//port Scss       from 'rollup-plugin-scss'   // Has problems

export default
{ input:          'Home.vue',                 // Home.vue is a placeholder for  input:
  output: { file: 'Home.js', format:'esm' },  // Home.js  is a placeholder for output:
  plugins: [ Vue(), Less(), commonjs(), Coffee(), Typescript() ] }