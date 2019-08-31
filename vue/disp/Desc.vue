
<template>
  <div   class="desd" :style="style(dobj)">
    <d-icon class="iconq" :icon="dobj.icon" :name="disp" :size="3" ></d-icon>
    <div    class="summq">{{dobj.desc}}</div>
    <template v-for="area in dobj.areas">
      <d-icon :class="clArea()" :icon="area.icon" :name="area.name" :summ="tsSumm(area.desc)" :size="1.7" ></d-icon>
  </template>
  </div>
</template>

<script type="module">
  
  import Icon from "../elem/Icon.vue"

  let Desc = {

    props: { comp:String, prac:String, disp:String },
    
    components: { 'd-icon':Icon },

    data() { return { dobj:null, iarea:1 } },

    methods: {
      onDisp: function(disp) {
        this.disp =   disp;
        this.dobj = this.pracs(this.comp)[this.prac][this.disp]; },
      style: function (dobj) {
        let hsv = this.isDef(dobj) ? dobj.hsv : [30,90,90];
        return {backgroundColor: this.toRgbaHsv(hsv)}; },
      clArea: function() {
        let  klass = 'area'+this.iarea;
        this.iarea = this.iarea === 3 ? 1 : this.iarea+1;
        return klass; },
      tsSumm: function(summ) {
        return this.isStr(summ) ? summ : "This is a test description"; }
    },

    beforeMount: function() {
      this.comp = this.nav().comp;
      this.prac = this.nav().prac;
      this.disp = this.nav().disp;
      this.onDisp(this.disp); },

    mounted: function () {
      this.subscribe( 'Nav', 'Disp.Desc.vue', (obj) => {
        this.onDisp(obj.disp); } ); }
      
  }
  export default Desc;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .grid5x1() { display:grid;  grid-template-columns:1fr; grid-template-rows:20fr 20fr 20fr 20fr 20fr;
    grid-template-areas: "iconq" "summq""area1" "area2" "area3"; }
  
  .desd { .grid5x1(); position:absolute; left:0; top:5%; right:0; bottom:0; .theme-desc(); color:black;
    .iconq { grid-area:iconq; }
    .summq { grid-area:summq; }
    .area1 { grid-area:area1; }
    .area2 { grid-area:area2; }
    .area3 { grid-area:area3; }
    

  }
  
</style>