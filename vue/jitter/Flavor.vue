
<template>
  <div class="flavor"></div>
</template>

<script type="module">

  let Flavor = {

    data() { return { comp:'Flavor' } },

    mounted: function () {
      this.publish( 'Nav', 'Flavor' ); }

  }
  
  export default Flavor;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .flavor { }
  
</style>