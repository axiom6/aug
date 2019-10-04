
<template>
  <div   class="desd" :style="style(dispObj)">
    <d-icon class="iconq" :icon="dispObj.icon" :name="dispObj.name" :size="5.0" ></d-icon>
    <div    class="summq">{{dispObj.desc}}</div>
    <template v-for="areaObj in dispObj.areas">
      <d-icon :class="clArea" :icon="areaObj.icon" :name="areaObj.name" :summ="tsSumm(areaObj.desc)" :size="3.0"
      ></d-icon>
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
      style: function (ikwObj) {
        return this.styleHsv(ikwObj); },
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
  
  .desd { .grid5x1(); position:absolute; left:0; top:5%; right:0; bottom:0; .theme-disp-desc(); color:black;
           border-radius:36px;
    .iconq { grid-area:iconq; }
    .summq { grid-area:summq; margin-left:@theme-disp-size; }
    .area1 { grid-area:area1; }
    .area2 { grid-area:area2; }
    .area3 { grid-area:area3; }
    

  }
  
</style>