
<template>
  <div class="data">
    <div>
      <h1>Data Science</h1>
    </div>
  </div>
</template>

<script type="module">
  export default {}
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .data { position:absolute; left:0; top:5%; right:0; bottom:0;
    display:grid; justify-items:center; align-items:center; text-align:center;
    background-color:@theme-back; color:@theme-color;
   h1 { font-size:@theme-h1-size; } }
</style>