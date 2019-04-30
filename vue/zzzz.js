

import Muse   from '../app/muse/Muse.js'
import Router from '../app/muse/Router.js'
import Info   from '../vue/comp/Info.vue'
import Know   from '../vue/comp/Know.vue'
import Wise   from '../vue/comp/Wise.vue'
import Wave   from '../ani/wave/Wave.vue'
import Goog   from '../vue/maps/google/Goog.vue'
import Leaf   from '../vue/maps/leaflet/Leaf.vue'
import Wood   from '../ani/wood/Wood.vue'
import Geom   from '../vue/comp/Geom.vue'


if( Router===false && Muse===false && Wave===false ) {}
if( Info===false   && Know===false && Wise===false ) {}
if( Goog===false   && Leaf===false && Wood===false ) {}
if( Geom===false   ) {}