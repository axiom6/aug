
<template>
  <div   class="desc">
    <div class="prac" prac="prac" :style="style(prac.hsv)" :ref="prac.name" :title="prac.name">
      <i   :class="prac.icon"></i>
      <span class="name">{{prac.name}}</span>
      <span class="desc">{{prac.desc}}</span>
    </div>
    <template  v-for="disp in prac.disps">
        <div class="disp" @click="doDisp(disp.name)" :style="style(disp.hsv)" :ref="disp.name" :title="disp.name">
          <i   :class="disp.icon"></i>
          <span class="name">{{disp.name}}</span>
          <span class="desc">{{disp.desc}}</span>
        </div>
        <!--template v-for="area in disp.areas">
          <div  class="area">
            <i :class="area.icon"></i>
            <span class="name">{{area.name}}</span>
            <span class="desc">{{area.desc}}</span>
          </div>
        </template-->
  </template>
  </div>
</template>

<script type="module">

  let Desc = {

    props: { comp:String, prac:Object },

    data() { return { page:"Desc"} },

    methods: {
      doDisp: function (disp) {
        this.nav().pub({level: 'Disp', prac: this.prac.name, disp: disp}) },
      style: function (hsv) {
        return {backgroundColor: this.toRgbaHsv(hsv)};},
    },
    mounted: function () {}
  }
  export default Desc;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .desc { display:grid; align-self:stretch; justify-self:stretch; .theme-desc(); color:@theme-color;
    
    .prac {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;
      i     { font-size:@theme-disp-size; }
      .name { font-size:@theme-disp-size; }
      .desc { font-size:@theme-disp-size; display:block; } }
  
    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;
      i     { display:inline-block;  margin-right: 0.25rem; }
      .name { display:inline-block; }
      .desc { display:inline-block; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }
    
  }
</style>