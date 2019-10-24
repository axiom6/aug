
<template>
  <div      class="disp-desc-pane" :style="style(dispObj)">
    <d-icon class="disp-desc-icon" :icon="dispObj.icon" :name="dispObj.name" :size="5.0" ></d-icon>
    <div    class="disp-desc-summ">{{dispObj['desc']}}</div>
    <div    class="disp-desc-area">
      <template v-for="areaObj in dispObj.areas">
        <d-item :class="clArea" :icon="areaObj.icon" :name="areaObj.name" :summ="tsSumm(areaObj['desc'])" :size="2.0"></d-item>
      </template>
    </div>
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
        let  klass = 'disp-desc-area'+this.iarea;
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
  @th:@theme-tabs-height;

.disp-desc-pane {   font-size:@descFS; color:black; border-radius:2.0*@descFS;
                    position:absolute; left:0;  top:@th; width:100%; height:100%-@th;
  .disp-desc-icon { position:absolute; left:0;  top: 3%; width:100%; height: 18%; }
  .disp-desc-summ { position:absolute; left:3%; top:21%; width: 94%; height: 28%;text-align:left;font-size:2.5*@descFS;}
  .disp-desc-area { position:absolute; left:3%; top:49%; width: 94%; height: 51%; } }
  
</style>