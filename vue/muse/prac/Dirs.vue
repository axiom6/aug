
<template>
  <div class="prac-dirs-pane">
    <div class="cen" :style="toStyle(pracObj)">
      <d-disp v-if="isDisc()" :dispObj="pracObj" :from="'Dirs'"></d-disp>
      <d-dims v-if="isDims()" :dispObj="pracObj" :from="'Dirs'"></d-dims>
    </div>
    <template  v-for="dispObj in pracObj.disps">
      <div :class="dispObj.dir" :style="toStyle(dispObj)">
        <d-disp v-if="isDisc()" :dispObj="dispObj" :from="'Dirs'"></d-disp>
        <d-dims v-if="isDims()" :dispObj="dispObj" :from="'Dirs'"></d-dims>
      </div>
    </template>
  </div>
</template>

<script type="module">

  import Disc from './Disc.vue';
  import Dims from './Dims.vue';
  import { inject, ref } from 'vue';

  let Dirs = {

    components:{ 'd-disp':Disc, 'd-dims':Dims },

    props: { pracObj:Object },

    setup( props ) {

      const mix = inject( 'mix' );
      const dispObj = ref(null );

      const isDims = function () {
        // console.log( 'Dirs.isDims()', props.pracObj.row === 'Dim', props.pracObj.row );
        return props.pracObj.row === 'Dim'; }

      const isDisc = function () {
        // console.log( 'Dirs.isDisp()', props.pracObj.row !== 'Dim', props.pracObj.row );
        return props.pracObj.row !== 'Dim'; }

      const toStyle = function( ikwObj ) {
         return mix.styleObj( ikwObj ); }
    
   return { dispObj, isDims, isDisc, toStyle }; }
  
  }

  export default Dirs;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @pracDirsFS:2.0*@themeFS;
  
  .prac-dirs-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .prac-dir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .prac-dirs-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-gray;
    color:black; text-align:center; font-weight:bold; .prac-dirs-grid3x3(); font-size:2.0*@pracDirsFS;
                                 .north { .prac-dir(north); }
      .west { .prac-dir(west); } .cen   { .prac-dir(cen);   } .east { .prac-dir(east); }
                                 .south { .prac-dir(south); } }
  
  
</style>

<!--
      const onDisp = function( obj ) {
        dispObj.value = mix.dispObject( obj.compKey, obj.inovKey, obj.pracKey, obj.dispKey );
        console.log('Dirs.onDisp()',{ comp:obj.compKey, prac:obj.pracKey, disp:obj.dispKey, dispObj:dispObj.value } );
        if( !mix.isDef(dispObj.value) ) {
          console.error('Dims.onDisp() disp null',{comp:obj.compKey, prac:obj.pracKey, disp:obj.dispKey } ) } }
-->