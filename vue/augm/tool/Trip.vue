<template>
  <div class="trip-pane" ref="elem"></div>
</template>
<script>

import {ref, inject, onMounted, nextTick, onBeforeUnmount } from "vue";
import SvgMgr from '../../../lib/pub/draw/SvgMgr.js';
import TripD3 from '../../../pub/augm/tool/TripD3.js';

let Trip = {

  setup() {

    const nav  = inject('nav');
    const elem = ref(null);
    let svgMgr = null;
    let tripD3 = null;

    const create = () => {
      nav.createElem( "Trip.create()", elem['value'], nextTick, () => {
        svgMgr = new SvgMgr( 'Trip', elem['value'], "Comp" );
        tripD3 = new TripD3( svgMgr );
        tripD3.draw(); } ) }

  onMounted(  () => {
      create(); } )

  onBeforeUnmount( () => {
    nav.removeElem( "Trip.vue", elem['value'], nextTick ) ; } )

  return { elem } }

}

export default Trip

</script>

<style lang="less">

  @import '../../../lib/css/themes/theme.less';

  @tripFS:@themeFS;

  .trip-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; font-size:@tripFS; }

</style>

