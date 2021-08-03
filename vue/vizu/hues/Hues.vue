
<template>
  <div class="hues-pane">
    <d-tabs :compKey="compKey" :pages="toPages()"></d-tabs>
    <div class="hues-rect">
      <template v-for="page in toPages()" :key="nav.keyIdx(page.key,pageIdx)">
        <template   v-for="sat in saturates()">
          <template v-for="val in brights()">
            <d-rect  v-if="nav.show(page.key)" :pageKey="page.key" :pageIdx=pageIdx :sat=sat :val=val></d-rect>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script type="module">

import { inject, ref, onMounted } from 'vue';
import  Tabs   from '../../../lib/vue/elem/Tabs.vue';
import  Rect   from './Rect.vue'
import { vis } from '../../../lib/pub/draw/Vis.js'

let Hues = {

  components:{ 'd-tabs':Tabs, 'd-rect':Rect },

  setup() {

    const nav     = inject('nav');
    const compKey = 'Hues';
    let   pageIdx = ref(0);

    const toPages = () => {
      return nav.getTabs('Hues'); }

    const brights = () => {
      return vis.distribution(); }

    const saturates = () =>  {
      return vis.distribution(); }

    const onNav = (obj) => {
      if( obj.compKey==='Hues' ) {
        pageIdx.value++; } }

    onMounted( () => {
      nav.subscribe(  'Nav', 'Hues', (obj) => {
        onNav(obj); } ); } )

    return { compKey, toPages, brights, saturates, nav, pageIdx }; }
}
export default Hues;

</script>

<style lang="less">

@import '../../../lib/css/themes/theme.less';

@drawFS:@themeFS;

.hues-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; font-family:@theme-font-family;
 .hues-rect { position:absolute; left:0; top:@theme-tabs-height; width:@theme-pane-width-vmin;
   height:100%-@theme-tabs-height; } }

</style>