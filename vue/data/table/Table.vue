

<template>
  <div ref="elem" class="comp-grid-pane"></div>
</template>

<script type="module">

  import Tabulator from 'tabulator-tables'
  import {nextTick, onMounted, ref, inject, onBeforeUnmount } from "vue";
  //port Demo from '../../../pub/data/table/Demo.js'
  import Tabu from '../../../pub/data/table/Tabu.js'

let Table = {

  props: { compKey:String, inovKey:String },
  
  setup() {

    const nav   = inject('nav');
    //nst demo  = new Demo();
    const tabu  = new Tabu();
    const elem  = ref(null);
    let   table = null;
    const compKey   = 'Info';
    const inovKey   = 'Info';

    const create = () => {
      nav.createElem( "Table.create()", elem['value'], nextTick, () => {
        const pracs  = nav.inovObject( compKey, inovKey );
        table        = new Tabulator( elem['value'], tabu.opts(pracs) );
        // let pageSize = table.getPageSize();
        // console.log( 'Grid.vue.onMounted()', { pageSize:pageSize } );
        table.setPageSize(13); } ); }

    onMounted( () =>  {
      create(); } )

    onBeforeUnmount( () => {
      nav.removeElem( "Table.vue", elem['value'], nextTick ) ; } )

    return { elem }; }

}
export default Table;

</script>

<style lang="less">

@import '../../../lib/css/themes/theme.less';
@import  './tabulator_midnight.css';

@gridFS:@themeFS;
@summFS:1.4*@gridFS;

.comp-grid-pane {   font-size:@gridFS; color:@theme-fore; display:grid;
  background-color:@theme-gray; position:absolute; left:1%;  top:0;  width:96%; height:99%;

  .comp-grid-name { font-size:4*@gridFS; color:@theme-fore; justify-self:center; align-self:center; } }

</style>
