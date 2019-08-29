
<template>
  <div   class="desc">
    <div class="cen" prac="prac" :style="style(prac.hsv)" :ref="prac.name" :title="prac.name">
      <div class="dead">
        <i   :class="prac.icon">{{prac.name}}</i>
        <!--span class="name">{{prac.name}}</span-->
      </div>
      <div class="summ">{{prac.desc}}</div>
    </div>
    <template  v-for="disp in prac.disps">
        <div  :class="disp.dir" @click="doDisp(disp.name)" :style="style(disp.hsv)" :ref="disp.name" :title="disp.name">
          <div class="dead">
            <i   :class="disp.icon">{{disp.name}}</i>
            <!--span class="name">{{disp.name}}</span-->
          </div>
          <div class="summ">{{disp.desc}}</div>
        </div>
  </template>
  </div>
</template>

<script type="module">

  let Desc = {

    props: { comp:String, prac:Object },

    data() { return { page:"Desc"} },

    methods: {
      doDisp: function (disp) {
        this.nav().pub({level: 'Disp', prac: this.prac.name, disp:disp }) },
      style: function (hsv) {
        return {backgroundColor: this.toRgbaHsv(hsv)};},
    }
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
  
  .desc { position:absolute; left:0; top:0; right:0; bottom:0; .grid3x3(); .theme-desc(); color:black;
    
    .cen { .ddir(cen); .grid2x1();
      .dead { grid-area:dead; display:grid; align-self:center; justify-self:center;
        margin-top:1rem; font-size:@theme-prac-size;
        i     { }
        .name { } }
      .summ { grid-area:summ; display:grid; align-self:start;  justify-self:start; text-align:left;
        margin:0.5rem 0.5rem 0.5rem 0.5rem; font-size:@theme-desc-size; } }
    
    .west  { .ddir(west);  }
    .north { .ddir(north); }
    .east  { .ddir(east);  }
    .south { .ddir(south); }
  
    .west, .north, .east, .south { .grid2x1();
      .dead { grid-area:dead; display:grid; align-self:center; justify-self:center; margin-top:1rem;
        font-size:@theme-prac-size;
        i     { }
        .name { } }
      .summ { grid-area:summ; display:grid; align-self:start;  justify-self:start; font-size:@theme-desc-size;
        margin:0.5rem 0.5rem 0.5rem 0.5rem; } }
    
  }
</style>