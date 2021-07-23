
<template>
  <div      class="disp-desc-pane" :style="style(dispObj)">
    <d-icon class="disp-desc-icon" :icon="dispObj.icon" :name="dispObj.name" :size="5.0" ></d-icon>
    <div    class="disp-desc-summ">{{dispObj['desc']}}</div>
    <d-area class="disp-desc-area" :areat="dispObj.areas" :size="2.0"></d-area>
  </div>
</template>

<script type="module">
  
  import Icon from "../../../lib/vue/elem/Icon.vue";
  import Area from "../../../lib/vue/elem/Area.vue";
  import { inject, ref } from 'vue';

  let Desc = {
    
    components: { 'd-icon':Icon, 'd-area':Area },

    props: { dispObj:Object, from:String },

    setup() {

      const nav = inject( 'nav' );

      const areaObj = ref(null);

      const style = function (ikwObj) {
        return nav.styleObj(ikwObj); }

      const toDesc = function(desc) {
        return nav.isStr(desc) ? desc : "This is a test description"; }
        
    return { areaObj, style, toDesc }; }
  }
  export default Desc;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @descFS:@themeFS;
  @th:@theme-tabs-height;

.disp-desc-pane {   font-size:@descFS; color:black; border-radius:2.0*@descFS;
                    position:absolute; left:0;  top:@th; width:100%; height:100%-@th;
  .disp-desc-icon { position:absolute; left:0;  top: 3%; width:100%; height: 18%; }
  .disp-desc-summ { position:absolute; left:3%; top:21%; width: 94%; height: 28%;text-align:left;font-size:2.5*@descFS;}
  .disp-desc-area { position:absolute; left:3%; top:49%; width: 94%; height: 51%; } }
  
</style>