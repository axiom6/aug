
<template>
  <div class="dirs-prin">
    <div class="cen" :style="style(pracObj)">
      <div class="disp-prin" @click="doPrac(pracObj.name)">
        <i   :class="pracObj.icon"></i>
        <span class="name">{{pracObj.name}}</span>
      </div>
    </div>
    <template  v-for="dispObj in pracObj.disps">
      <div :class="dispObj.dir" :style="style(dispObj)"  :ref="dispObj.name" :title="dispObj.name">
        <div class="disp-prin" @click="doDisp(prac.name,dispObj.name)">
          <i   :class="dispObj.icon"></i>
          <span class="name">{{dispObj.name}}</span>
        </div>
        <template v-for="ddObj in dispObj.disps">
          <div class="disp-prin">
            <i   :class="ddObj.icon"></i>
            <span class="name">{{ddObj.name}}</span>
          </div>
        </template>
        </div>
    </template>
  </div>
</template>

<script type="module">

  let Dirs = {

    props: { pracObj:Object },

    data() { return { dispObj:null, ddObj:null } },

    methods: {
      doPrac: function (pracKey) {
        let obj = { route:"Prac", pracKey:pracKey };
        this.nav.pub( obj ); },
      doDisp: function (pracKey,dispKey) {
        let obj = { route:"Disp", pracKey:pracKey, dispKey:dispKey };
        this.nav.pub( obj ); },
      style: function( ikwObj ) {
        return this.styleHsv(ikwObj); } }
  }

  export default Dirs;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .ddir( @dir ) { .themeCenterItems(); grid-area:@dir; border-radius:36px; }
  
  .dirs-prin { display:grid; align-self:stretch; justify-self:stretch;
    color:black; font-weight:bold; .theme-comp-dirs();
    
      .grid3x3(); // The 4 Displine plus Practiice name Grid
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen { font-size:@theme-dirs-size; }

    .disp-prin {   display:block; text-align:left;
      i     { display:inline-block;  margin-right: 0.25rem; }
      .name { display:inline-block; } } }
  
  
</style>