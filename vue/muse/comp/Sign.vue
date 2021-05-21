
<template>
  <div  class="comp-sign-pane" @click="doPrac(pracObj.name)">
    <i  :class="pracObj.icon"></i>
    <div class="comp-sign-name">{{pracObj.name}}</div>
  </div>
</template>

<script type="module">
  
  import {inject} from "vue";

  let Sign = {
    
    props: { pracObj:Object },

    setup() {

      const nav = inject( 'nav' );

      const doPrac = function (pracKey) {
          let obj = { level:pracKey, pracKey:pracKey, source:'Sign' };
          nav.pub( obj ); }

    return { doPrac }; }
  }
  export default Sign;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @signFS:2.0*@themeFS;
  @bordFS:1.25*@themeFS;

  .theme-sign { font-size:@signFS;  border-radius:0.7em; }
  
  .comp-sign-pane { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:@theme-fore; text-align:center; background-color:@theme-gray; border-radius:@bordFS;
    width:98%; height:97%;
    i               { font-size:2.7*@signFS; }
    .comp-sign-name { font-size:1.2*@signFS;  text-align:center; } }
  
</style>