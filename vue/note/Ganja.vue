
<template>
  <div class="ganja-pane">
    <div>
      <h1>Ganja Notebook</h1>
    </div>
  </div>
</template>

<script type="module">
  export default {}
</script>

<style lang="less">
  @import '../../css/themes/theme.less';
  
  @ganjaFS:@themeFS;

  .ganja-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
    font-size:@ganjaFS;.themeCenterItems(); background-color:@theme-back; color:@theme-fore; overflow:scroll; }
  
</style>