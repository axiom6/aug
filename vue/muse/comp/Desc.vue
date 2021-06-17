
<template>
  <div      class="comp-desc-pane">
    <d-icon class="comp-desc-icon" :icon="pracObj.icon" :name="pracObj.name" :size="2.5" ></d-icon>
    <div    class="comp-desc-summ">{{pracObj['desc']}}</div>
  </div>
</template>

<script type="module">
  
  import Icon from "../../../lib/vue/base/elem/Icon.vue"

  let Desc = {
    
    components: { 'd-icon':Icon },

    props: { pracObj:Object, from:String },

    setup( props ) {

    return {}; }
    
  }
  export default Desc;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @descFS:@themeFS;
  @summFS:1.4*@descFS;

.comp-desc-pane {   font-size:@descFS; color:@theme-fore; border-radius:2.0*@descFS; background-color:@theme-gray;
                    position:relative; left:0;  top: 0;  width: 90%; height: 90%;
  .comp-desc-icon { position:absolute; left:0;  top: 2%; width:100%; height: 26%; }
  .comp-desc-summ { position:absolute; left:3%; top:28%; width: 94%; height: 70%; text-align:left; font-size:@summFS;} }
  
</style>