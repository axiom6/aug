
<template>
  <div class="dirs" prac="prac">
    <div class="cen" :style="style(prac.hsv)">
      <div class="disp" @click="doPrac(prac.name)">
        <i   :class="prac.icon"></i>
        <span class="name">{{prac.name}}</span>
        <span class="desc">{{prac.desc}}</span>
      </div>
    </div>
    <template  v-for="disp in prac.disps">
      <div :class="disp.dir" :style="style(disp.hsv)" :ref="disp.name" :title="disp.name">
        <div class="disp" @click="doDisp(prac.name,disp.name)">
          <i   :class="disp.icon"></i>
          <span class="name">{{disp.name}}</span>
          <span class="desc">{{disp.desc}}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">

  let Dirs = {

    props: { comp:String, prac:Object },

    data() { return {  } },

    methods: {
      
      doPrac: function (prac) {
        this.nav().pub( { prac:prac } ); },
      doDisp: function (prac,disp) {
        this.nav().pub( { prac:prac, disp:disp } ); },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; } }
    
  }

  export default Dirs;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .dirs { position:absolute; left:0; top:0; right:0; bottom:0; background-color:@theme-icon-back;
    color:black; text-align:center; font-weight:bold; .theme-dirs(); .grid3x3();
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen  { font-size:@theme-cen-size; } }

    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size*3;
      i     { display:inline-block;  margin-right: 0.25rem; }
      .name { display:inline-block; }
      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }
  
</style>