
import MuseRollupConfig from 'app/build/rollup.dash.js'
import MuseRollupInfo   from 'app/build/rollup.info.js'
import MuseRollupKnow   from 'app/build/rollup.know.js'
import MuseRollupWise   from 'app/build/rollup.wise.js'
import MuseRollupCube   from 'app/build/rollup.cube.js'
import MuseRollupSvga   from 'app/build/rollup.svga.js'
import Muse             from 'app/muse/Muse.js'
import Router           from 'app/muse/Router.js'
import Info             from 'vue/muse/Info.vue'
import Know             from 'vue/muse/Know.vue'
import Wise             from 'vue/muse/Wise.vue'
import Svga             from 'app/demo/Svga.vue'
import Goog             from 'vue/maps/google/Goog.vue'
import Leaf             from 'vue/maps/leaflet/Leaf.vue'

if( MuseRollupConfig===false && Router===false && Muse===false && Svga===false ) {}
if( MuseRollupInfo===false   && MuseRollupKnow===false && MuseRollupWise===false ) {}
if( MuseRollupCube===false   && MuseRollupSvga===false ) {}
if( Info===false             && Know===false           && Wise===false ) {}
if( Goog===false             && Leaf===false                           ) {}