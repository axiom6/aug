
<template>
  <div class="ganja">
    <div>
      <h1>Ganja Notebook</h1>
    </div>
  </div>
</template>

<script type="module">
  export default {}
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .ganja { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-obs-size;
    display:grid; justify-items:center; align-items:center; text-align:center;
    background-color:@theme-back; color:@theme-color; }
</style>