
<template>
  <div class="dirs-prac">
    <div class="cen" :style="style(pracObj)">
      <d-disp v-if="isDisp()" :dispObj="pracObj"></d-disp>
      <d-dims v-if="isDims()" :dispObj="pracObj"></d-dims>
    </div>
    <template  v-for="dispObj in pracObj.disps">
      <div :class="dispObj.dir" :style="style(dispObj)">
        <d-disp v-if="isDisp()" :dispObj="dispObj"></d-disp>
        <d-dims v-if="isDims()" :dispObj="dispObj"></d-dims>
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
        this.nav.pub( obj ); },
      isDims: function () {
        return this.pracObj.row === 'Dim'; },
      isDisp: function () {
        return this.pracObj.row !== 'Dim'; },
      style: function( ikwObj ) {
        return this.styleHsv(ikwObj); } },

    mounted: function () {
      if( !this.isDef(this.pracObj) ) {
        console.error( 'prac.Dirs.mounted() pracObj not defined' ); } }
    
  }

  export default Dirs;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .dirs-prac { position:absolute; left:0; top:0; right:0; bottom:0; background-color:@theme-icon-back;
    color:black; text-align:center; font-weight:bold; .theme-prac-dirs(); .grid3x3();
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen  { font-size:@theme-cen-size; } }

    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size*3;
      i     { display:inline-block;  margin-right: 0.25rem; }
      .name { display:inline-block; }
      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }
  
</style>