
<template>
  <div      class="icon-pane" :style="style()">
    <div    class="icon-line" @click="doClick()">
      <span class="icon-icon"><i :class="icon"></i></span>
      <span class="icon-name">{{name}}</span>
    </div>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';
  
  let Icon = {

    props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },

    setup( props ) {

      const mix = inject( 'mix' );

      const hasSumm = function() {
        return mix.isDef(props.summ); }

      const doClick = function() {
        if( mix.isDef(props.fnClick) ) {
          props.fnClick(props.name); } }

      const style = function() {
        return mix.fontSizeCss(props.size); }
        
    return { doClick, style, hasSumm }; }
  }
  
  export default Icon;
  
</script>

<style scoped lang="less">
  
  @import '../../css/themes/theme.less';
  
  @iconFS:2.0*@themeFS;

  .icon-pane     { display:grid; height:100%;
  
    .icon-line   { display:inline; justify-self:center; text-align:center;  height:auto;
  
      .icon-icon { display:inline-block;  margin-right: 0.25*@iconFS; }
      
      .icon-name { display:inline-block; } }
  }

  
</style>