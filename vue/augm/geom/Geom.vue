
<template>
  <div class="geom-pane" ref="Geom">
    <h1>Geometric Algebra</h1>
  </div>
</template>

<script type="module">

  let Geom = {

    setup() {

    return {}; }
  }

  export default Geom;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @geomFS:@themeFS;
  
  .geom-pane { position:absolute; left:0; top:0; width:100%; height:100%;
               background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@geomFS; } }
  
</style>;