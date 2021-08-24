
<template>
  <div class="math-pane" ref="Math">
    <h1>Mathematics</h1>
  </div>
</template>

<script type="module">

  let Math = {

    setup() {

    return {}; }
    
  }
  export default Math;

</script>

<style lang="less">
  
  @import '../../../lib/css/themes/theme.less';

  @mathFS:@themeFS;
  
  .math-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-back; display:grid;
    h1 { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@mathFS; } }

</style>