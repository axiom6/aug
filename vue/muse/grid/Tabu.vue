

<template>
  <div ref="gridElem" class="comp-grid-pane"></div>
</template>

<script type="module">

  import Tabulator from 'tabulator-tables'
  import {nextTick, onMounted, ref, inject } from "vue";
  //port Demo     from '../../pub/base/grid/Demo.js'
  import TabuComp from '../../../pub/base/grid/TabuComp.js'

let Tabu = {

  props: { compKey:String, inovKey:String },
  
  setup(props) {

    const mix      = inject('mix');
    //nst demo     = new Demo();
    const tabuComp = new TabuComp();
    const gridElem = ref(null);
    let   table    = null;

    // console.log( 'Tabu.vue.setup()', { compKey:props.compKey, inovKey:props.inovKey, props:props } );

    onMounted( function () {
      nextTick( function() {
        const pracs = mix.inovObject( props.compKey, props.inovKey );
        table       = new Tabulator( gridElem.value, tabuComp.opts(pracs) );
        let pageSize = table.getPageSize();
     // console.log( 'Tabu.vue.onMounted()', { pageSize:pageSize } );
        table.setPageSize(13);

      } ); } );

    return { gridElem }; }

}
export default Tabu;

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
