
<template>
  <div class="geom-nd-pane">
    <d-tabs :compKey="pracKey" :pages="toPages()"></d-tabs>
    <template v-for="page in toPages()" :key="page.key">
      <g-page v-if="show(page.key)" :page="page" class="geom-nd-page"></g-page>
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

    props: { pracKey:String },

    setup( props ) {

      const mix      = inject('mix');
      const nav      = inject('nav');
      const page     = ref(null);
      const pageKey  = ref('None');
      const debug    = true;

      const toPages = function() {
        return nav.pages[props.pracKey]; }

      const show = ( pageArg ) => {
        return pageKey.value === pageArg; }

      const onNav = (obj) => {
        if( debug ) { console.log( 'GeomND.onNav()', obj ); }
        if( props.pracKey === obj.pracKey && mix.isDef(obj.pageKey) ) {
          pageKey.value  = obj.pageKey;
          page.value     = nav.pages[props.pracKey][pageKey.value];
          page.value.obj = create(page.value); }
        else if( !mix.isDef(obj.pageKey) ) {
          console.log( 'GeomND.onNav() pageKey None', obj ); } }

      const create = (page) => {
        if( debug ) { console.log( 'GeomND.create()', { page:page.value } ); }
        if( mix.isDef(page.obj) ) {
          return page.obj; }
        else {
          if(      page.key==='Graph'  ) { return Graph;  }
          else if( page.key==='Basics' ) { return Basics; }
          else if( page.key==='Grids'  ) { return Grids;  }
          else if( page.key==='Isomet' ) { return Isomet; }
          else if( page.key==='Play'   ) { return Play;   }
          else if( page.key==='Isohed' ) { return Isohed; }
          else if( page.key==='Torus'  ) { return Torus;  }
          else if( page.key==='Sphere' ) { return Sphere; }
          else                           { return Graph;  } } }

      if( debug ) { console.log( 'GeomND.subscribe() in setup()', { pracKey:props.pracKey, pageKey:pageKey.value } ); }
    //if( mix.isDef(pageKey.value) ) { onNav( { pageKey:pageKey.value } ); }
      mix.subscribe(  'Nav', 'GeomND', (obj) => {
        onNav(obj); } )

      onMounted( () => {
        if( debug ) { console.log( 'GeomND.onMounted()', { pracKey:props.pracKey, pageKey:pageKey.value } ); } } )

      return { show, page, toPages }; }
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