
import VueRollup   from 'rollup-plugin-vue'
//port VueTemplate from 'vue-template-compiler'
import LessRollup  from 'rollup-plugin-less'
import NodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs'

export default [
  { input: 'vue/elem/Area.vue', output: { file: 'pub/vue/elem/Area.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), NodeResolve(), commonjs() ] },
  { input: 'vue/elem/Icon.vue', output: { file: 'pub/vue/elem/Icon.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), NodeResolve(), commonjs() ] },
  { input: 'vue/elem/Item.vue', output: { file: 'pub/vue/elem/Item.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), NodeResolve(), commonjs() ] },
  { input: 'vue/elem/Btns.vue', output: { file: 'pub/vue/elem/Btns.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), NodeResolve(), commonjs() ] },  // {compiler:VueTemplate}
  { input: 'vue/elem/Tabs.vue', output: { file: 'pub/vue/elem/Tabs.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), NodeResolve(), commonjs() ] }

]