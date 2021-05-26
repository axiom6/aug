

<template>
  <div class="draw-pane">
    <d-tabs :compKey="compKey" :pages="toPages()"></d-tabs>
    <h1 v-if="showH1">Drawings in D3</h1>
    <template v-for="page in toPages()" :key="pageIdx">
      <d-pane  v-if="page.show" :page="page" class="pane-pane"></d-pane>
    </template>
    </div>
</template>

<script type="module">

 import { inject, ref, onMounted } from 'vue';
 import Tabs from '../../base/elem/Tabs.vue';
 import Pane from './Pane.vue'

 let Draw = {

    components:{ 'd-tabs':Tabs, 'd-pane':Pane },

    setup() {

      const mix     = inject('mix');
      const nav     = inject('nav');
      const compKey = 'Draw';
      let   showH1  = ref(true);
      const pageIdx = ref(0);
      const page    = ref(null);

      const toPages = function() {
        return nav.getTabs('Draw'); }

      const onNav = function(obj) {
        if( obj.compKey==='Draw' ) {
            showH1.value = false;
            pageIdx.value++; } }

      onMounted( function () {
        showH1.value  = true;
        mix.subscribe(  'Nav', 'Draw', (obj) => {
          onNav(obj); } ); } )

    return { compKey, toPages, page, pageIdx, showH1 }; }
  }
  export default Draw;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @drawFS:@themeFS;
  
  .draw-pane { position:absolute; left:0; top:0; width:100%; height:100%;display:grid;
               background-color:@theme-back; font-family:@theme-font-family;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@drawFS; }
    .pane-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;  } }

  // Chords
  .group-tick line { stroke:#000;       }
  .ribbons         { fill-opacity:0.67; }
</style>