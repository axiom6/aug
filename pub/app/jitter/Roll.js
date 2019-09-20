
import Vue      from 'rollup-plugin-vue'
//port Coffee   from 'rollup-plugin-coffee-script'
import Less     from 'rollup-plugin-less'
import commonjs from 'rollup-plugin-commonjs';

export default [
  { input: 'vue/jitter/Choice.vue', output: { file: 'pub/vue/jitter/Choice.js', format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] },
  { input: 'vue/jitter/Flavor.vue', output: { file: 'pub/vue/jitter/Flavor.js', format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] },
  { input: 'vue/jitter/Roast.vue',  output: { file: 'pub/vue/jitter/Roast.js',  format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] },
  { input: 'vue/jitter/Brew.vue',   output: { file: 'pub/vue/jitter/Brew.js',   format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] },
  { input: 'vue/jitter/Drink.vue',  output: { file: 'pub/vue/jitter/Drink.js',  format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] },
  { input: 'vue/jitter/Body.vue',   output: { file: 'pub/vue/jitter/Body.js',   format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] },
  { input: 'vue/jitter/Home.vue',   output: { file: 'pub/vue/jitter/Home.js',   format:'esm' },
    plugins: [ Vue(), Less(), commonjs() ] }
]    

