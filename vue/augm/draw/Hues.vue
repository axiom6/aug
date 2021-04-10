

<template>
  <div class="hues-pane">
    <d-tabs :route="route" :pages="pages"></d-tabs>
    <h1 v-if="route==='Draw'">Mathbox Colors</h1>
    <template v-for="page in pages" :key="pageIdx">
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
      const route   = 'Hues';
      const pageIdx = ref(0);
      const page    = ref(null);
      const pages   = {
        Color:   { title:'Color',   key:'Color',   show:false },
        Rgbs:    { title:'Rgbs',    key:'Rgbs',    show:false },
        Polar:   { title:'Polar',   key:'Polar',   show:false },
        Vecs:    { title:'Vecs',    key:'Vecs',    show:false },
        Sphere:  { title:'Sphere',  key:'Sphere',  show:false },
        Regress: { title:'Regress', key:'Regress', show:false } };

      mix.addScript( "/assets/mathbox-bundle.js" )

      const onNav = function(obj) {
        if( nav.isMyNav( obj, route ) && nav.hasPageKey( route, obj.pageKey ) ) {
            nav.setPageKey( route, obj.pageKey );
            pageIdx.value++; } } // console.log( 'Darw.onNav()', pages );

      onMounted( function () {
        nav.setPages( route, pages );
        mix.subscribe(  'Nav', 'Hues.vue', (obj) => {
          onNav(obj); } ); } )

    return { route, pages, page, pageIdx }; }
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