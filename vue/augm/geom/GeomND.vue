
<template>
  <div class="geom-nd-pane">
    <d-tabs :compKey="pracKey" :pages="toPages()"></d-tabs>
    <template v-for="page in toPages()" :key="pageIdx">
      <g-page v-if="show(page.key)" :page="page" class="geom-nd-page"></g-page>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from "vue";
  import Tabs    from '../../base/elem/Tabs.vue';
  import PageND  from './PageND.vue'
  import GeomMgr from '../../../pub/augm/geom/lib/GeomMgr.js'

  let GeomND = {

    components:{ 'd-tabs':Tabs, 'g-page':PageND },

    props: { pracKey:String },

    setup( props ) {

      const mix     = inject('mix');
      const nav     = inject('nav');
      const page    = ref(null);
      const pageIdx = ref(0)
      const debug   = false;
      let   pageKey = 'None'
      const geomMgr = new GeomMgr();

      const toPages = function() {
        return nav.getTabs(props.pracKey); }

      const show = ( pageArg ) => {
        return pageKey === pageArg; }

      const onNav = (obj) => {
        if( props.pracKey===obj.pracKey && nav.hasPage(props.pracKey,obj.pageKey) ) {
          pageKey        = obj.pageKey
          page.value     = nav.getPage(props.pracKey,obj.pageKey);
          page.value.obj = geomMgr.createPageObj(page.value);
          pageIdx.value++;
          if( debug ) { console.log( 'GeomND.onNav()', { obj:obj, page:page, pages:nav.getTabs(props.pracKey) } ); } } }

      onMounted( () => { // Follow up with the last Nav.pub(obj) that mounted this vue component
        onNav( { pracKey:props.pracKey, pageKey:nav.getPageKey(props.pracKey) } );
        mix.subscribe(  'Nav', 'GeomND', (obj) => {        //   also onNav() chacks for valid tabs and pages
          onNav(obj); } ) } )

      return { show, page, pageIdx, toPages }; }
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
