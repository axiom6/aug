
<template>
  <div class="brew"></div>
</template>

<script type="module">

  let Brew = {

    data() { return { comp:'Brew' } },

    mounted: function () {
      this.publish( 'Nav', 'Brew' ); }

  }

  export default Brew;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .brew { }

</style>