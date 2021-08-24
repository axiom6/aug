

<template>
  <div class="main-pane">
    <d-tabs :compKey="compKey" :pages="toPages()"></d-tabs>
    <h1 v-if="compKey==='Draw'">Mathbox Colors</h1>
    <template v-for="page in toPages()" :key="pageKeyIdx(page.key)">
      <d-port v-if="show(page.key)" :compKey="compKey" :page="page" class="port-pane"></d-port>
    </template>
    </div>
</template>

<script type="module">

 import { inject, ref, onMounted } from 'vue';
 import Tabs from '../../../lib/vue/elem/Tabs.vue';
 import Port from './Port.vue'

 let Main = {

    components:{ 'd-tabs':Tabs, 'd-port':Port },

    setup() {

      const nav       = inject('nav');
      let   compKey   = nav.compKey;
      const pageIdx   = ref(0);
      const page      = ref(null);
      let   pageKey   = 'None'
      const debug     = false;

      const toPages = () => {
        return nav.getTabs(compKey); }

      const show = ( pageArg ) => {
        return pageKey === pageArg; }

      const pageKeyIdx = ( pageArg ) => {
         return pageArg+pageIdx.value; }

      const onNav = (obj) => {
        pageIdx.value++;
        if( nav.isDef(obj.pageKey) && nav.hasPage(compKey,obj.pageKey) ) {
            if(debug) { console.log( 'Main.onNav()', obj ); }
            compKey = obj.compKey;
            pageKey = obj.pageKey; } }

      onMounted( () => { // Follow up with the last Nav.pub(obj) that mounted this vue component
        // onNav( { compKey:compKey, pageKey:nav.getPageKey(compKey) } );
        nav.subscribe(  'Nav', 'Main.vue', (obj) => {
          onNav(obj); } ); } )

    return { compKey, toPages, page, pageKeyIdx, show }; }
  }
  export default Main;
  
</script>

<style lang="less">
  
  @import '../../../lib/css/themes/theme.less';

  @huesFS:@themeFS;
  
  .main-pane { position:absolute; left:0; top:0; width:100%; height:100%;display:grid;
               background-color:@theme-back; font-family:@theme-font-family;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@huesFS; }
    .port-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;  } }

</style>