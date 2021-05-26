

<template>
  <div class="hues-pane">
    <d-tabs :compKey="compKey" :pages="toPages()"></d-tabs>
    <h1 v-if="compKey==='Draw'">Mathbox Colors</h1>
    <template v-for="page in toPages()" :key="pageIdx">
      <d-port v-if="page.show" :page="page" class="port-pane"></d-port>
    </template>
    </div>
</template>

<script type="module">

 import { inject, ref, onMounted } from 'vue';
 import Tabs from '../../base/elem/Tabs.vue';
 import Port from './Port.vue'

 let Hues = {

    components:{ 'd-tabs':Tabs, 'd-port':Port },

    setup() {

      const mix     = inject('mix');
      const nav     = inject('nav');
      const compKey = 'Hues';
      const pageIdx = ref(0);
      const page    = ref(null);
      mix.addScript( "/assets/mathbox-bundle.js" )

      const toPages = () => {
        return nav.getTabs('Hues'); }

      const onNav = (obj) => {
        if( nav.isMyNav( obj,'Prac' ) ) {
            pageIdx.value++; } } // console.log( 'Darw.onNav()', pages );

      onMounted( () => {
        mix.subscribe(  'Nav', 'Hues', (obj) => {
          onNav(obj); } ); } )

    return { compKey, toPages, page, pageIdx }; }
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