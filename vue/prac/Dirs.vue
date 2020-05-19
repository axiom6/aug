
<template>
  <div class="prac-dirs-pane">
    <div class="cen" :style="style(pracObj)">
      <d-disp v-if="isDisp()" :dispObj="pracObj" from="Dirs"></d-disp>
      <d-dims v-if="isDims()" :dispObj="pracObj" from="Dirs"></d-dims>
    </div>
    <template  v-for="dispObj in pracObj.disps">
      <div :class="dispObj.dir" :style="style(dispObj)">
        <d-disp v-if="isDisp()" :dispObj="dispObj" from="Dirs"></d-disp>
        <d-dims v-if="isDims()" :dispObj="dispObj" from="Dirs"></d-dims>
      </div>
    </template>
  </div>
</template>

<script type="module">

  import Disp from './Disp.vue';
  import Dims from './Dims.vue';

  let Dirs = {

    components:{ 'd-disp':Disp, 'd-dims':Dims },

    props: { pracObj:Object },

    data() { return { dispObj:null } },

    methods: {

      doPrac: function (pracKey) {
        let obj = { route:"Prac", pracKey:pracKey };
        this.nav().pub( obj ); },
      isDims: function () {
        return this.pracObj.row === 'Dim'; },
      isDisp: function () {
        return this.pracObj.row !== 'Dim'; },
      style: function( ikwObj ) {
        return this.mix().styleObj(ikwObj); } },

    mounted: function () {
      if( !this.mix().isDef(this.pracObj) ) {
        console.error( 'prac.Dirs.mounted() pracObj not defined' ); } }
    
  }

  export default Dirs;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
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