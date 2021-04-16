

<template>
  <div ref="elem" class="comp-grid-pane"></div>
</template>

<script type="module">

  import Tabulator from 'tabulator-tables'
  import {nextTick, onMounted, ref, inject } from "vue";
  import DataMgr from '../../../pub/data/dataset/DataMgr.js'

let Store = {

  props: { compKey:String, inovKey:String },
  
  setup(props) {

    const mix   = inject('mix');
    const dataMgr = new DataMgr();
    const elem  = ref(null);
    let   table = null;
    const compKey   = 'Info';
    const inovKey   = 'Info';

    onMounted( function () {
      nextTick( function() {
        const pracs  = mix.inovObject( compKey, inovKey );
        table        = new Tabulator( elem['value'], dataMgr.opts(pracs) );
     // let pageSize = table.getPageSize();
     // console.log( 'Grid.vue.onMounted()', { pageSize:pageSize } );
        table.setPageSize(13);

      } ); } );

    return { elem }; }

}
export default Store;

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
