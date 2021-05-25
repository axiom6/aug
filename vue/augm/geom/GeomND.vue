
<template>
  <div class="geom-nd-pane">
    <d-tabs :compKey="compKey" :pages="toPages()"></d-tabs>
    <template v-for="page in toPages(pageKey)" :key="page.key">
      <g-page :page="page" class="geom-nd-page"></g-page>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from "vue";
  import Tabs    from '../../base/elem/Tabs.vue';
  import PageND  from './PageND.vue'
  import Graph   from "../../../src/augm/geom/2D/Graph.js";
  import Basics  from "../../../src/augm/geom/2D/Basics.js";
  import Grids   from "../../../src/augm/geom/3D/Grids.js";
  import Isomet  from "../../../src/augm/geom/3D/Isomet.js";
  import Play    from "../../../src/augm/geom/3D/Play.js";
  import Isohed  from "../../../src/augm/geom/3D/Isohed.js";
  import Torus   from "../../../src/augm/geom/3D/Torus.js";
  import Sphere  from "../../../src/augm/geom/4D/Sphere.js";

  let GeomND = {

    components:{ 'd-tabs':Tabs, 'g-page':PageND },

    setup() {

      const mix      = inject('mix');
      const nav      = inject('nav');
      const page     = ref(null);
      const compKey  = ref('Geom2D');
      const pageKey  = ref('Graph');
      const compKeys = ['Geom2D','Deom3D'];

      const toPages = function() {
        return nav.pages[compKey.value]; }

      const onNav = function(obj) {
        if( mix.inArray(  obj.pracKey, compKeys ) ) {
          compKey.value = obj.pracKey;
          pageKey.value = obj.pageKey;
          page.value    = nav.pages[compKey.value][pageKey.value];
          create(page); } }

      const create = (page) => {
        if( page.obj===null ) {
          if(      page.key==='Graph'  ) { page.obj = new Graph();  }
          else if( page.key==='Basics' ) { page.obj = new Basics(); }
          else if( page.key==='Grids'  ) { page.obj = new Grids();  }
          else if( page.key==='Isomet' ) { page.obj = new Isomet(); }
          else if( page.key==='Play'   ) { page.obj = new Play();   }
          else if( page.key==='Isohed' ) { page.obj = new Isohed(); }
          else if( page.key==='Torus'  ) { page.obj = new Torus();  }
          else if( page.key==='Sphere' ) { page.obj = new Sphere(); } } }

      onMounted( function () {
        mix.subscribe(  'Nav', 'GeomND', (obj) => {
          onNav(obj); } ) } )

      return { compKey, pageKey, toPages }; }
  }
  export default GeomND;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @geomNDFS:@themeFS;
  
  .geom-nd-pane {}
  
  .geom-nd-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
     background-color:@theme-back; display:grid; font-size:@geomNDFS; }

</style>