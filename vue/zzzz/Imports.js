
import MuseRollupConfig from 'app/muse/rollup.config.js'
import Router           from 'app/muse/Router.js'
import Info             from 'vue/muse/Info.vue'
import Know             from 'vue/muse/Know.vue'
import Wise             from 'vue/muse/Wise.vue'
import View             from 'vue/muse/View.vue'

if( MuseRollupConfig===false && Router===false ) {}
if( Info===false && Know===false && Wise===false && View===false ) {}