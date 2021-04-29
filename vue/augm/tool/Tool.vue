
<template>
  <div class="tool-pane" ref="Tool">
    <h1 v-show="myRoute()">Gauges and Widges</h1>
    <router-view :name="'Gauges'"></router-view>
    <router-view :name="'Widget'"></router-view>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';

  let Tool = {

    setup() {

      const mix   = inject('mix');

      const myRoute =function() {
        return mix.isRoute('Tool'); }

    return { myRoute, }; }
  }

  export default Tool;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @geomFS:@themeFS;
  
  .tool-pane { position:absolute; left:0; top:0; width:100%; height:100%;
               background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@geomFS; } }
  
</style>;