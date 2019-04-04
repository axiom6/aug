
import VueRollup  from 'rollup-plugin-vue'
import LessRollup from 'rollup-plugin-less'
import commonjs   from 'rollup-plugin-commonjs';

export default
  { input:          'vue/dash/Dash.vue',
    output: { file: 'app/muse/Dash.js', format:'esm' },
    plugins: [ VueRollup(), LessRollup(), commonjs() ] }

