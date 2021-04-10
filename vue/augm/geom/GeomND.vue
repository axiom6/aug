
<template>
  <div class="geom-nd-pane">
    <d-tabs :route="pagesKey" :pages="toPages()"></d-tabs>
    <template v-for="page in toPages(pagesKey)" :key="page.key">
      <g-page :page="page" class="geom-nd-page"></g-page>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted, onBeforeMount } from "vue";
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

      const mix   = inject('mix');
      const nav   = inject('nav');
      const pages = {
        Geom2D: {
          Graph:  { title:'Graph',   key:'Graph',    obj:Graph   },
          Basics: { title:'Basics',  key:'Basics',   obj:Basics  } },
        Geom3D: {
          Grids:   { title:'Grids',   key:'Grids',   obj:Grids   },
          Isomet:  { title:'Isomet',  key:'Isomet',  obj:Isomet  },
          Play:    { title:'Play',    key:'Play',    obj:Play    },
          Isohed:  { title:'Isohed',  key:'Isohed',  obj:Isohed  },
          Torus:   { title:'Torus',   key:'Torus',   obj:Torus   },
          Sphere:  { title:'Sphere',  key:'Sphere',  obj:Sphere  } } }

      const page     = ref(null);
      const pagesKey = ref(null);
      const pageKeys = Object.keys(pages);

      const toPages = function() {
        // console.log( 'GeomND.toPages()', { pagesKey:pagesKey.value, paged:pages[pagesKey.value] } );
        return pages[pagesKey.value]; }

      const onNav = function(obj) {
        if( mix.inArray(   obj.route, pageKeys ) ) {
          pagesKey.value = obj.route; } }

      onBeforeMount( function () {
        pagesKey.value = mix.inArray(nav.route,pageKeys) ? nav.route : 'Geom2D'; } )

      onMounted( function () {
        mix.subscribe(  'Nav', 'GeomND.vue', (obj) => {
          onNav(obj); } ) } )

      return { pagesKey, page, toPages }; }
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