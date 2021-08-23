

<template>
  <div ref="elem" class="comp-grid-pane"></div>
</template>

<script type="module">

  import Tabulator from 'tabulator-tables'
  import {nextTick, onMounted, ref, inject, onBeforeUnmount } from "vue";
  import Search from '../../../pub/data/query/Search.js'

let Query = {

  props: { compKey:String, inovKey:String },
  
  setup() {

    const nav   = inject('nav');
    const search = new Search();
    const elem  = ref(null);
    let   table = null;
    const compKey   = 'Info';
    const inovKey   = 'Info';

    const create = () => {
      nav.createElem( "Query.create()", elem['value'], nextTick, () => {
        const pracs  = nav.inovObject( compKey, inovKey );
        table        = new Tabulator( elem['value'], search.opts(pracs) );
        // let pageSize = table.getPageSize();
        // console.log( 'Grid.vue.onMounted()', { pageSize:pageSize } );
        table.setPageSize(13); } ); }

    onMounted( () =>  {
      create(); } )

    onBeforeUnmount( () => {
      nav.removeElem( "Query.vue", elem['value'], nextTick ) ; } )

    return { elem }; }

}
export default Query;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';
@import  './tabulator_midnight.css';

@gridFS:@themeFS;
@summFS:1.4*@gridFS;

.comp-grid-pane {   font-size:@gridFS; color:@theme-fore; display:grid;
  background-color:@theme-gray; position:absolute; left:1%;  top:0;  width:96%; height:99%;

  .comp-grid-name { font-size:4*@gridFS; color:@theme-fore; justify-self:center; align-self:center; } }

</style>
