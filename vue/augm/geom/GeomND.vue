
<template>
  <div class="geom-nd-pane">
    <d-tabs :compKey="pracKey" :pages="toPages()"></d-tabs>
    <template v-for="page in toPages()" :key="nav.keyIdx(page.key,pageIdx)">
      <g-page v-if="nav.show(page.key)" :page="page" class="geom-nd-page"></g-page>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from "vue";
  import Tabs    from '../../../lib/vue/elem/Tabs.vue';
  import PageND  from './PageND.vue'

  let GeomND = {

    components:{ 'd-tabs':Tabs, 'g-page':PageND },

    props: { pracKey:String },

    setup( props ) {

      const nav     = inject('nav');
      const page    = ref(null);
      const pageIdx = ref(0)
      const debug   = false;

      const toPages = function() {
        return nav.getTabs(props.pracKey); }

      const onNav = (obj) => {
        if( props.pracKey===obj.pracKey && nav.hasPage(props.pracKey,obj.pageKey) ) {
          page.value     = nav.getPage(props.pracKey,obj.pageKey);
          // page.value.obj = geomMgr.createPageObj(page.value);
          if( debug ) { console.log( 'GeomND.onNav()', { obj:obj, page:page, pages:nav.getTabs(props.pracKey) } ); }
          pageIdx.value++; } }

      onMounted( () => { // Follow up with the last Nav.pub(obj) that mounted this vue component
        nav.subscribe(  'Nav', 'GeomND', (obj) => {        //   also onNav() chacks for valid tabs and pages
          onNav(obj); } ) } )

      return { page, pageIdx, nav, toPages }; }
  }
  export default GeomND;

</script>

<style lang="less">
  
  @import '../../../lib/css/themes/theme.less';

  @geomNDFS:@themeFS;
  
  .geom-nd-pane {}
  
  .geom-nd-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
     background-color:@theme-back; display:grid; font-size:@geomNDFS; }

</style>
