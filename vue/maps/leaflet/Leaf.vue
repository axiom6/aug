
<template>
  <div class="leaf-pane"></div>
</template>

<script type="module">
  export default {}
</script>

<style lang="less">
  @import '../../../css/themes/theme.less';
  @leafFS:@themeFS;
  .leaf-pane { background-color:@theme-back; font-size:@leafFS; }
</style>