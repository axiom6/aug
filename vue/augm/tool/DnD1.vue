<template>
  <div class="dnd-pane" ref="elem"></div>
</template>
<script>

import { ref, onMounted, nextTick } from "vue";
import dnds from 'vue-easy-dnd'

let Dnd = {
  
  setup() {

    
  onMounted( function () {
    nextTick( function() {
      svgMgr = new SvgMgr( 'Gauge', elem['value'], "Comp" )
      opts.gaugeRadius = 0.5 * Math.min( svgMgr.size.w, svgMgr.size.h );
      drawGauge( opts, svgMgr.g ) ;
    } ) } )

  return { elem } }

}

export default Dnd

</script>

<style lang="less">

  @import '../../../css/themes/theme.less';

  @guageFS:@themeFS;

  .dnd-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; font-size:@guageFS; }

</style>

