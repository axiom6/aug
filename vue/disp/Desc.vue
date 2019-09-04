
<template>
  <div   class="desd" :style="style(dispObj)">
    <d-icon class="iconq" :icon="dispObj.icon" :name="dispObj.name" :size="3" ></d-icon>
    <div    class="summq">{{dispObj.desc}}</div>
    <template v-for="areaObj in dispObj.areas">
      <d-icon :class="clArea" :icon="areaObj.icon" :name="areaObj.name" :summ="tsSumm(areaObj.desc)" :size="1.7" ></d-icon>
  </template>
  </div>
</template>

<script type="module">
  
  import Icon from "../elem/Icon.vue"

  let Desc = {
    
    components: { 'd-icon':Icon },

    props: { dispObj:Object },

    data() { return { areaObj:null, iarea:1 } },

    methods: {
      style: function (dispObj) {
        let hsv = this.isDef(dispObj) ? dispObj.hsv : [30,90,90];
        return {backgroundColor: this.toRgbaHsv(hsv)}; },
      clArea: function() {
        let  klass = 'area'+this.iarea;
        this.iarea = this.iarea === 3 ? 1 : this.iarea+1;
        return klass; },
      tsSumm: function(summ) {
        return this.isStr(summ) ? summ : "This is a test description"; }
    }
    
    
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