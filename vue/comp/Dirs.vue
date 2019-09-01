
<template>
  <div class="dirs">
    <div class="cen" :style="style(pracObj.hsv)">
      <div class="disp" @click="doPrac(pracObj.name)">
        <i   :class="pracObj.icon"></i>
        <span class="name">{{pracObj.name}}</span>
        <span class="desc">{{pracObj.desc}}</span>
      </div>
    </div>
    <template  v-for="dispObj in pracObj.disps">
      <div :class="dispObj.dir" :style="style(dispObj.hsv)"  :ref="dispObj.name" :title="dispObj.name">
        <div class="disp" @click="doDisp(prac.name,dispObj.name)">
          <i   :class="dispObj.icon"></i>
          <span class="name">{{dispObj.name}}</span>
          <span class="desc">{{dispObj.desc}}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">

  let Dirs = {

    props: { pracObj:Object },

    data() { return { dispObj:null } },

    methods: {
      
      doPrac: function (pracKey) {
        let obj = { level:"Prac", pracKey:pracKey };
        this.nav.pub( obj ); },
      doDisp: function (pracKey,dispKey) {
        let obj = { level:"Disp", pracKey:pracKey, dispKey:dispKey };
        this.nav.pub( obj ); },
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
  
  .dirs { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;
    color:black; text-align:center; font-weight:bold; .theme-dirs();
    
      .grid3x3(); // The 4 Displine plus Practiice name Grid
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen  { font-size:@theme-cen-size; }

    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;
      i     { display:inline-block;  margin-right: 0.25rem; }
      .name { display:inline-block; }
      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } } }
  
  
</style>