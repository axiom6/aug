
<template>
  <div class="tools-pane">
    <d-tabs :route="pagesKey" :pages="toPages()"></d-tabs>
    <template v-for="page in toPages(pagesKey)" :key="page.key">
      <t-page :page="page" class="tools-page"></t-page>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted, onBeforeMount } from "vue";
  import Tabs  from '../../base/elem/Tabs.vue';
  import Page  from './Page.vue';


  let Tools = {

    components:{ 'd-tabs':Tabs, 't-page':Page },

    setup() {

      const mix   = inject('mix');
      const nav   = inject('nav');
      const pages = {
        Gauges: {
          Gauge:   { title:'Gauge', key:'Gauge' } },
        Widget: {
          Kan:     { title:'Kan',   key:'Kan'   },
          KanOn:   { title:'KanOn', key:'KanOn' },
          KanJQ:   { title:'KanJQ', key:'KanJQ' } } }

      const page     = ref(null);
      const pagesKey = ref(null);
      const pageKeys = Object.keys(pages);

      const toPages = function() {
        return pages[pagesKey.value]; }

      const onNav = function(obj) {
        console.log( 'Tools.onNav()', { route:obj.route, pageKeys:pageKeys } );
        if( mix.inArray(   obj.route, pageKeys ) ) {
          pagesKey.value = obj.route; } }

      onBeforeMount( function () {
        pagesKey.value = mix.inArray(nav.route,pageKeys) ? nav.route : 'Gauges'; } )

      onMounted( function () {
        mix.subscribe(  'Nav', 'Tools.vue', (obj) => {
          onNav(obj); } ) } )

      return { pagesKey, page, toPages }; }
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
  <template>
    <div class="tools-pane">
      <d-tabs :route="pagesKey" :pages="toPages()"></d-tabs>
      <template v-for="page in toPages(pagesKey)" :key="page.key">
        <t-page :page="page" class="tools-page"></t-page>
      </template>
    </div>
  </template>
-->