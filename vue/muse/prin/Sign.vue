
<template>
  <div   class="prin-sign-pane" @click="doPrac(pracObj.name)">
    <i  :class="pracObj.icon"></i>
    <div class="prin-sign-name">{{pracObj.name}}</div>
  </div>
</template>

<script type="module">
  
  import { inject } from "vue";

  let Sign = {
    
    props: { pracObj:Object },

    setup() {

      const nav = inject( 'nav' );

      const doPrac = function (pracKey) {
        let obj = { route:"Prac", pracKey:pracKey };
        nav.pub( obj ); }

      return { doPrac }; }
  }
  export default Sign;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @signFS:2.0*@themeFS;

  .prin-sign-pane { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:@theme-fore; text-align:center; background-color:@theme-gray; border-radius:1.0*@signFS;
    width:90%; height:90%;
    i               { font-size:7.5*@signFS; }
    .prin-sign-name { font-size:2.3*@signFS;  text-align:center; } }
  
</style>