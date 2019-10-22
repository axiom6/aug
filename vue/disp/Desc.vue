
<template>
  <div      class="ddesc-pane" :style="style(dispObj)">
    <d-icon class="ddesc-icon" :icon="dispObj.icon" :name="dispObj.name" :size="5.0" ></d-icon>
    <div    class="ddesc-summ" :style="{'font-size':'2rem'}">{{dispObj['desc']}}</div>
    <template v-for="areaObj in dispObj.areas">
      <d-item :class="clArea" :icon="areaObj.icon" :name="areaObj.name" :summ="tsSumm(areaObj['desc'])" :size="2.0"></d-item>
  </template>
  </div>
</template>

<script type="module">
  
  import Icon from "../elem/Icon.vue"
  import Item from "../elem/Item.vue"

  let Desc = {
    
    components: { 'd-icon':Icon, 'd-item':Item },

    props: { dispObj:Object, from:String },

    data() { return { areaObj:null, iarea:1 } },

    methods: {
      style: function (ikwObj) {
        return this.styleObj(ikwObj); },
      clArea: function() {
        let  klass = 'ddesc-area'+this.iarea;
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
  
  @descFS:@themeFS;

  .grid5x1() { display:grid;  grid-template-columns:1fr; grid-template-rows:20fr 20fr 20fr 20fr 20fr;
    grid-template-areas: "iconq" "summq""area1" "area2" "area3"; }
  
  .ddesc-pane { .grid5x1(); position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%;
    font-size:@descFS; color:black; border-radius:2.0*@descFS;
    .ddesc-icon  { grid-area:iconq; }
    .ddesc-summ  { grid-area:summq; margin-left:1.2*@descFS; }
    .ddesc-area1 { grid-area:area1; }
    .ddesc-area2 { grid-area:area2; }
    .ddesc-area3 { grid-area:area3; }
    

  }
  
</style>