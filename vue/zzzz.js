

import Muse   from '../app/muse/Muse.js'
import Router from '../app/muse/Router.js'
import Info   from 'muse/Info.vue'
import Know   from 'muse/Know.vue'
import Wise   from 'muse/Wise.vue'
import Wave   from '../ani/wave/Wave.vue'
import Goog   from 'vue/maps/google/Goog.vue'
import Leaf   from 'vue/maps/leaflet/Leaf.vue'


if( Router===false && Muse===false && Wave===false ) {}
if( Info===false   && Know===false           && Wise===false ) {}
if( Goog===false   && Leaf===false      ) {}