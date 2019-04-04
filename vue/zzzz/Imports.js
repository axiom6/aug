
import MuseRollupConfig from 'app/build/rollup.dash.js'
import MuseRollupInfo   from 'app/build/rollup.info.js'
import MuseRollupKnow   from 'app/build/rollup.know.js'
import MuseRollupWise   from 'app/build/rollup.wise.js'
import Muse             from 'app/muse/Muse.js'
import Router           from 'app/muse/Router.js'
import Info             from 'vue/muse/Info.vue'
import Know             from 'vue/muse/Know.vue'
import Wise             from 'vue/muse/Wise.vue'
import View             from 'vue/muse/View.vue'

if( MuseRollupConfig===false && Router===false && Muse===false && View===false ) {}
if( MuseRollupInfo===false   && MuseRollupKnow===false && MuseRollupWise===false ) {}
if( Info===false             && Know===false           && Wise===false ) {}