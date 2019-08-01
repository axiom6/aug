
<template>
  <div class="roast"></div>
</template>

<script type="module">

  let Roast = {

    data() { return { comp:'Roast' } },

    mounted: function () {
      this.publish( 'Nav', 'Roast' ); }

  }

  export default Roast;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .roast { }

</style>