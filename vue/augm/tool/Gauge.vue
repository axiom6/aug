<template>
  <div class="gauge-pane" ref="elem"></div>
</template>
<script>

import { ref, inject, onMounted, nextTick, onUnmounted } from "vue";
import SvgMgr    from '../../../lib/pub/draw/SvgMgr.js'
import drawGauge from './GaugeD3.js'

let Gauge = {
  
  setup() {

    const nav   = inject('nav');
    const elem  = ref(null);
    let   opts = { gaugeRadius:160, minVal:0, maxVal:100, needleVal:Math.round(30),
      tickSpaceMinVal:1, tickSpaceMajVal:10, divID:"gaugeBox", gaugeUnits:"%",
      pivotCol:'wheat',  innerCol:'black', tickColMaj:'wheat', tickColMin:'wheat',
      outerEdgeCol:'wheat', unitsLabelCol:'wheat', tickLabelCol:'wheat', needleCol:'wheat' };
    let svgMgr = null;


    const create = () => {
      nav.createElem( "Gauge.create()", elem['value'], nextTick, () => {
        svgMgr = new SvgMgr( 'Gauge', elem['value'], "Comp" )
        opts.gaugeRadius = 0.5 * Math.min( svgMgr.size.w, svgMgr.size.h );
        drawGauge( opts, svgMgr.g ); } ); }
    
  onMounted(  () => {
      create(); } )

  onUnmounted( () => {
    nav.removeElem( elem['value'], nextTick ) ; } )

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

