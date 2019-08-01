
<template>
  <div class="body"></div>
</template>

<script type="module">

  let Body = {

    data() { return { comp:'Body' } },

    mounted: function () {
      this.publish( 'Nav', 'Body' ); }

  }

  export default Body;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .body { }

</style>
