

<template>
  <div ref="elem" class="comp-grid-pane"></div>
</template>

<script type="module">

  import Tabulator from 'tabulator-tables'
  import {nextTick, onMounted, ref, inject } from "vue";
  //port Demo from '../../../pub/data/table/Demo.js'
  import Tabu from '../../../pub/data/table/Tabu.js'

let Table = {

  props: { compKey:String, inovKey:String },
  
  setup(props) {

    const mix   = inject('mix');
    //nst demo  = new Demo();
    const tabu  = new Tabu();
    const elem  = ref(null);
    let   table = null;
    const compKey   = 'Info';
    const inovKey   = 'Info';

    // console.log( 'Grid.vue.setup()', { compKey:props.compKey, inovKey:props.inovKey, props:props } );

    onMounted( function () {
      nextTick( function() {
        const pracs  = mix.inovObject( compKey, inovKey );
        table        = new Tabulator( elem['value'], tabu.opts(pracs) );
     // let pageSize = table.getPageSize();
     // console.log( 'Grid.vue.onMounted()', { pageSize:pageSize } );
        table.setPageSize(13);

      } ); } );

    return { elem }; }

}
export default Table;

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
