
<template>
  <div class="defs-pane">
    <template v-for="plane in planes">
      <div   class="defs-plane" :style="stylePlane(plane)">
        <template v-for="pracObj in plane.compObj">
          <div class="defs-pract" :style="stylePract(plane,pracObj)">
            <p-icon  :icon="pracObj.icon" :name="pracObj.name" :size="2.0" ></p-icon>
          </div>
        </template>
      </div>
    </template>
  </div>
  <div     class="defs-defs">
    <div   class="defs-west">
      <div class="defs-term" id="IKW">IKW</div>
      <div class="defs-term" id="Practice">Practice</div>
      <div class="defs-term" id="Discipline">Discipline</div>
    </div>
    <div   class="defs-east">
      <div class="defs-term" id="name">name</div>
      <div class="defs-term" id="column">column</div>
      <div class="defs-term" id="row">row</div>
      <div class="defs-term" id="plane">plane</div>
      <div class="defs-term" id="description">description</div>
    </div>
  </div>
</template>

<script type="module">
  
  import Sign from '../comp/Sign.vue';
  import Icon from '../../../lib/vue/base/elem/Icon.vue';
  import {ref, onBeforeMount, inject } from "vue";
  
  let Defs = {

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
  
  export default Defs;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @ikwFS:1.3*@themeFS;
  @defFS:1.7*@themeFS;

  .defs-pane { position:absolute; left:0; top:0; width:100%; height:70%;
    .defs-plane { font-size:@ikwFS;  border-radius:2.0*@ikwFS; // border:@theme-fore solid 2px;
                  color:@theme-fore; background-color:transparent; }
    .defs-pract { font-size:@ikwFS;  border-radius:2.0*@ikwFS;    border:@theme-fore solid 2px;
                  color:@theme-fore; background-color:@theme-gray; }
    .defs-plane-icon { position:absolute; left:0; top:0; width:100%; height:10%; font-size:@defFS; }  }
  .defs-defs {   position:absolute; left:0;   top:70%; width:100%; height:30%; font-size:@ikwFS; color:@theme-fore;
    .defs-west { position:absolute; left:0;   top:0;   width: 50%; height:100%;}
    .defs-east { position:absolute; left:50%; top:0;   width: 50%; height:100%;}
    .defs-term {} }

</style>
