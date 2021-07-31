
<template>
  <div class="hues-pane">
    <d-tabs :compKey="compKey" :pages="toPages()"></d-tabs>
    <div class="hues-rect">
      <template v-for="page in toPages()" :key="nav.keyIdx(page.key,pageIdx)">
        <template   v-for="sat in percents()">
          <template v-for="val in percents()">
            <d-rect  v-if="nav.show(page.key)" :pageKey="page.key" :pageIdx=pageIdx :sat=sat :val=val></d-rect>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script type="module">

import { inject, ref, onMounted } from 'vue';
import Tabs from '../../../lib/vue/elem/Tabs.vue';
import Rect from './Rect.vue'

let Hues = {

  components:{ 'd-tabs':Tabs, 'd-rect':Rect },

  setup() {

    const nav     = inject('nav');
    const compKey = 'Hues';
    let   pageIdx = ref(0);

    const toPages = () => {
      return nav.getTabs('Hues'); }

    const percents = () => {
      return [0,10,20,30,40,50,60,70,80,90,100]; }

    const onNav = (obj) => {
      if( obj.compKey==='Hues' ) {
        pageIdx.value++; } }

    onMounted( () => {
      nav.subscribe(  'Nav', 'Hues', (obj) => {
        onNav(obj); } ); } )

    return { compKey, toPages, percents, nav, pageIdx }; }
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