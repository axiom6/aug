
<template>
  <div class="tool-pane" ref="Tool">
    <h1>Gauges, Trip and DnD</h1>
  </div>
</template>

<script type="module">

  let Tool = {

    setup() {

    return {}; }
  }

  export default Tool;

</script>

<style lang="less">
  
  @import '../../../lib/css/themes/theme.less';

  @geomFS:@themeFS;
  
  .tool-pane { position:absolute; left:0; top:0; width:100%; height:100%;
               background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@geomFS; } }
  
</style>;