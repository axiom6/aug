
<template>
  <div class="dirs-comp">
    <div class="cen" :style="style(pracObj)">
      <div class="disp-comp" @click="doPrac(pracObj.name)">
        <i   :class="pracObj.icon"></i>
        <span class="disp-name">{{pracObj.name}}</span>
        <span class="disp-desc">{{pracObj.desc}}</span>
      </div>
    </div>
    <template  v-for="dispObj in pracObj.disps">
      <div :class="dispObj.dir" :style="style(dispObj)"  :ref="dispObj.name">
        <div class="disp-comp" @click="doDisp(prac.name,dispObj.name)">
          <i   :class="dispObj.icon"></i>
          <span class="disp-name">{{dispObj.name}}</span>
          <span class="disp-desc">{{dispObj.desc}}</span>
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
        let obj = { route:"Prac", pracKey:pracKey };
        this.nav().pub( obj ); },
      doDisp: function (pracKey,dispKey) {
        let obj = { route:"Disp", pracKey:pracKey, dispKey:dispKey };
        this.nav().pub( obj ); },
      style: function( ikwObj ) {
        return this.styleObj(ikwObj); } }
  }

  export default Dirs;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @dirsFS:1.25*@themeFS;
  
  .dirs-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .dirs-dir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:0.5*@dirsFS; }
  
  .dirs-comp { .themeCenterStretch(); font-size:@dirsFS; width:90%; height:90%;
    color:black; background-color:@theme-gray; border-radius:1.0*@dirsFS; font-weight:bold;
    
      .dirs-grid3x3(); // The 4 Displine plus Practiice name Grid
                                 .north { .dirs-dir(north); }
      .west { .dirs-dir(west); } .cen   { .dirs-dir(cen);   } .east { .dirs-dir(east); }
                                 .south { .dirs-dir(south); }
      .cen  { font-size:@dirsFS; }

    .disp-comp   { display:inline; justify-self:center; align-self:center; text-align:center;
      i          { display:inline-block;  margin-right: 0.15*@dirsFS; }
      .disp-name { display:inline-block; }
      .disp-desc { display:none; margin:0.1*@dirsFS; text-align:left; } } }
  
  
</style>