

<template>
  <div class="hues-pane">
    <d-tabs :compKey="compKey" :pages="toPages()"></d-tabs>
    <h1 v-if="compKey==='Draw'">Mathbox Colors</h1>
    <template v-for="page in toPages()" :key="nav.keyIdx(page.key,pageIdx)">
      <d-port v-if="nav.show(page.key)" :page="page" class="port-pane"></d-port>
    </template>
    </div>
</template>

<script type="module">

import {inject, ref, onMounted, onUnmounted } from 'vue';
import Tabs from '../../../lib/vue/elem/Tabs.vue';
import Port from './Port.vue'

 let Hues = {

    components:{ 'd-tabs':Tabs, 'd-port':Port },

    setup() {

      const mix       = inject('mix');
      const nav       = inject('nav');
      const compKey   = 'Hues';
      const pageIdx   = ref(0);
      const page      = ref(null);
      const debug     = false;
      const scriptSrc = "/assets/mathbox-bundle.js"
      mix.addScript( scriptSrc );

      const toPages = () => {
        return nav.getTabs(compKey); }

      const onNav = (obj) => {
        if( obj.compKey===compKey && mix.isDef(obj.pageKey) && nav.hasPage(compKey,obj.pageKey) ) {
            if(debug) { console.log( 'Hues.onNav()', obj ); }
            pageIdx.value++; } }

      onMounted( () => { // Follow up with the last Nav.pub(obj) that mounted this vue component
        mix.subscribe(  'Nav', 'Hues', (obj) => {
          onNav(obj); } ); } )

      onUnmounted( () => {
        mix.delScript( scriptSrc ); } )

    return { compKey, toPages, page, pageIdx, nav }; }
  }
  export default Hues;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  @import '../../../css/themes/mathbox.css';

  @huesFS:@themeFS;
  
  .hues-pane { position:absolute; left:0; top:0; width:100%; height:100%;display:grid;
               background-color:@theme-back; font-family:@theme-font-family;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@huesFS; }
    .port-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;  } }

</style>