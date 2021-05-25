
<template>
  <div class="tools-pane">
    <d-tabs :compKey="pracKey" :pages="toPages()"></d-tabs>
    <template v-for="page in toPages()" :key="page">
      <t-page v-if="show(pageKey)" :page="page" class="tools-page"></t-page>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from "vue";
  import Tabs  from '../../base/elem/Tabs.vue';
  import Page  from './Page.vue';

  let Tools = {

    components:{ 'd-tabs':Tabs, 't-page':Page },

    props: { pracKey:String },

    setup( props ) {

      const mix      = inject('mix');
      const nav      = inject('nav');
      const debug    = true
      const pageKey  = ref(null);
      const page     = ref(null);
      
      const show = (pageArg) => {
        return pageArg === pageKey.value; }

      const toPages = function() {
        return nav.pages[props.pracKey]; }

      const onNav = function(obj) {
        if( obj.compKey==='Tool' && obj.pageKey!=='None' && obj.pracKey===props.pracKey ) {
          if(debug) { console.log( 'Tools.onNav()', { compKey:obj.compKey, pracKey:props.pracKey, pageKey:obj.pageKey } ); }
          pageKey.value = obj.pageKey; } }

      onMounted( function () {
        mix.subscribe(  'Nav', 'Tools', (obj) => {
          onNav(obj); } ) } )

      return { pageKey, page, toPages, show }; }
  }
  export default Tools;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @geomNDFS:@themeFS;
  
  .tools-pane {}
  
  .tools-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
     background-color:@theme-back; display:grid; font-size:@geomNDFS; }

</style>

<!--
      onBeforeMount( function () {
        pageKey.value = mix.inArray(nav.route,pageKeys) ? nav.pageKey : 'Gauges'; } )
-->