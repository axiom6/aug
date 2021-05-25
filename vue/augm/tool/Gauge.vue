<template>
  <div class="gauge-pane" ref="elem"></div>
</template>
<script>

import { ref, onMounted, nextTick } from "vue";
import SvgMgr    from '../../../pub/base/draw/SvgMgr.js'
import drawGauge from './GaugeD3.js'

let Gauge = {
  
  setup() {
    const elem  = ref(null);
    const debug =  false
    let   opts = { gaugeRadius:160, minVal:0, maxVal:100, needleVal:Math.round(30),
      tickSpaceMinVal:1, tickSpaceMajVal:10, divID:"gaugeBox", gaugeUnits:"%",
      pivotCol:'wheat',  innerCol:'black', tickColMaj:'wheat', tickColMin:'wheat',
      outerEdgeCol:'wheat', unitsLabelCol:'wheat', tickLabelCol:'wheat', needleCol:'wheat' };
    let svgMgr = null;
    
  onMounted( function () {
    nextTick( function() {
      if( debug ) { console.log( 'Gauge.onMounted()', elem['value'] ); }
      svgMgr = new SvgMgr( 'Gauge', elem['value'], "Comp" )
      opts.gaugeRadius = 0.5 * Math.min( svgMgr.size.w, svgMgr.size.h );
      drawGauge( opts, svgMgr.g ) ;
    } ) } )

  return { elem } }

}

export default Gauge

</script>

<style lang="less">

  @import '../../../css/themes/theme.less';

  @guageFS:@themeFS;

  .gauge-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; font-size:@guageFS; }

</style>

