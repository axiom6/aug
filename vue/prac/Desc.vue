
<template>
  <div   class="desd">
    <div class="cen" :style="style(prac.hsv)" :ref="prac.name" :title="prac.name">
      <div class="dead2"><d-icon :icon="prac.icon" :name="prac.name" :size="2" ></d-icon></div>
      <div class="summ2">{{prac.desc}}</div>
    </div>
    <template  v-for="disp in prac.disps">
        <div  :class="disp.dir" @click="doDisp(disp.name)" :style="style(disp.hsv)" :ref="disp.name" :title="disp.name">
          <div class="dead2"><d-icon :icon="disp.icon" :name="disp.name" :size="2"></d-icon></div>
          <div class="summ2">{{disp.desc}}</div>
        </div>
  </template>
  </div>
</template>

<script type="module">
  
  import Icon from "../elem/Icon.vue"

  let Desc = {

    props: {  },
    
    components: { 'd-icon':Icon },

    data() { return { comp:"None", prac:null, page:"Desc" } },

    methods: {
      onPrac: function () {
        this.comp = this.nav().comp;
        this.prac = this.pracs(this.comp)[this.nav().prac]; },
      doDisp: function (disp) {
        this.nav().pub({level: 'Disp', prac: this.prac.name, disp:disp.name }) },
      style: function (hsv) {
        return {backgroundColor: this.toRgbaHsv(hsv)};},
    },

    beforeMount: function() {
      this.onPrac(); },

    mounted: function () {
      this.subscribe(  "Nav", this.comp+'Prac.Dirs.vue', (obj) => {
        if( obj === false ) {} // obj ignored
        this.onPrac();  } ); }
  }
  export default Desc;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .grid2x1() { display:grid;  grid-template-columns:1fr; grid-template-rows:20fr 80fr;
    grid-template-areas: "dead" "summ"; }

  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .desd { position:absolute; left:0; top:0; right:0; bottom:0; .grid3x3(); .theme-desc(); color:black;
    
    .cen { .ddir(cen); .grid2x1();
      .dead2 { grid-area:dead; }
      .summ2 { grid-area:summ; display:grid; align-self:start;  justify-self:start; text-align:left;
        margin:0.5rem 0.5rem 0.5rem 0.5rem; font-size:@theme-desc-size; } }
    
    .west  { .ddir(west);  }
    .north { .ddir(north); }
    .east  { .ddir(east);  }
    .south { .ddir(south); }
  
    .west, .north, .east, .south { .grid2x1();
      .dead2 { grid-area:dead; }
      .summ2 { grid-area:summ; display:grid; align-self:start;  justify-self:start; font-size:@theme-desc-size;
        margin:0.5rem 0.5rem 0.5rem 0.5rem; } }
  }
  
</style>