
<template>
  <div class="enli">
    <div>
      <h1>Enlightenment</h1>
    </div>
  </div>
</template>

<script type="module">
  export default {}
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .enli { position:absolute; left:0; top:5%; right:0; bottom:0;
      display:grid; justify-items:center; align-items:center; text-align:center;
      background-color:@theme-back; color:@theme-color;
    h1 { font-size:@theme-h1-size; } }
</style>