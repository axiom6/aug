
<template>
  <div class="cube-pane">
    <template v-for="plane in planes">
      <div   class="cube-plane" :style="stylePlane(plane)">
        <!--div class="cube-plane-icon"><p-icon  :icon="plane.icon" :name="plane.name" :size="2.5" ></p-icon></div-->
        <template v-for="pracObj in plane.compObj">
          <div class="cube-pract" :style="stylePract(plane,pracObj)">
            <!--p-sign :pracObj="pracObj"></p-sign-->
            <p-icon  :icon="pracObj.icon" :name="pracObj.name" :size="2.7" ></p-icon>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script type="module">
  
  import Sign from './Sign.vue';
  import Icon from '../../base/elem/Icon.vue';
  import {ref, onBeforeMount, inject } from "vue";
  
  let Cube = {

    components:{ 'p-icon':Icon, 'p-sign':Sign },

    setup() {

      const mix = inject( 'mix' );

      let   pracObj = ref({} );

      const planes = {
        Wise:{ name:'Wise', title:'Wisdom',      left:18, top:26, compObj:{}, back:'#222', icon:"fas fas fa-tripadvisor" },
        Know:{ name:'Know', title:'Knowledge',   left:14, top:18, compObj:{}, back:'#333', icon:"fas fas fa-university"},
        Info:{ name:'Info', title:'Information', left:10, top:10, compObj:{}, back:'#444', icon:"fas fas fa-th" } };

      const cols = { Embrace:0, Innovate:33.30, Encourage:66.7 };
      const rows = { Learn:  1, Do:      44.50, Share:    87.5 };

      const stylePlane = function( plane ) {
        return { position:'absolute', left:plane.left+'%', top:plane.top+'%', width:'66.7%', height:'62%' } }

      const stylePract = function( plane, pract ) {
        let left = cols[pract.column]; // plane.left;
        let top  = rows[pract.row];    // plane.top    +
        return { position:'absolute', left:left+'%', top:top+'%', width:'33%', height:'11.1%', 'z-index':2,
          'background-color':plane.back } }

    onBeforeMount(  function() {
      for( let ckey in planes ) {
        let plane   =  planes[ckey];
        let compObj =  mix.compObject(ckey,false);
        for( let pkey in compObj ) {
          if( mix.isChild(pkey) && !mix.isDef(cols[pkey] ) ) {
            plane.compObj[pkey] = compObj[pkey]; } } } } )

    return { pracObj, planes, stylePlane, stylePract } }
    
  }
  
  export default Cube;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @ikwFS:2.0*@themeFS;

  .cube-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    .cube-plane { font-size:@ikwFS;  border-radius:2.0*@ikwFS; // border:@theme-fore solid 2px;
                  color:@theme-fore; background-color:transparent; }
    .cube-pract { font-size:@ikwFS;  border-radius:2.0*@ikwFS;    border:@theme-fore solid 2px;
                  color:@theme-fore; background-color:@theme-gray; }
    .cube-plane-icon { position:absolute; left:0; top:0; width:100%; height:10%; font-size:@ikwFS; }
    
  }

</style>
