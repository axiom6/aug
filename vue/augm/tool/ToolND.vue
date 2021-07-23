
<template>
  <div class="tools-pane">
    <d-tabs :compKey="pracKey" :pages="toPages()"></d-tabs>
    <template v-for="page in toPages()" :key="nav.keyIdx(page.key,pageIdx)">
      <t-page v-if="nav.show(page.key)" :page="page" class="tools-page"></t-page>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from "vue";
  import Tabs  from '../../../lib/vue/elem/Tabs.vue';
  import Page  from './Page.vue';

  let ToolND = {

    components:{ 'd-tabs':Tabs, 't-page':Page },

    props: { pracKey:String },

    setup( props ) {

      const nav      = inject('nav');
      const debug    = false

      const pageIdx  = ref(0)
      const page     = ref(null);

      const toPages = function() {
        return nav.getTabs(props.pracKey); }

      const onNav = function(obj) {
        if( props.pracKey===obj.pracKey && nav.hasPage(props.pracKey,obj.pageKey) ) {
          if(debug) { console.log( 'Tools.onNav()', { pracKey:props.pracKey, pageKey:obj.pageKey } ); }
          pageIdx.value++; } }

      onMounted( function () { // Follow up with the last Nav.pub(obj) that mounted this vue component
        nav.subscribe(  'Nav', 'ToolND', (obj) => {
          onNav(obj); } ) } )

      return { pageIdx, nav, page, toPages }; }
  }
  export default ToolND;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @geomNDFS:@themeFS;
  
  .tools-pane {}
  
  .tools-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
     background-color:@theme-back; display:grid; font-size:@geomNDFS; }

</style>
