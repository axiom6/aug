
<template>
  <div class="drink"></div>
</template>

<script type="module">

  let Drink = {

    data() { return { comp:'Drink' } },

    mounted: function () {
      this.publish( 'Nav', 'Drink' ); }

  }

  export default Drink;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .drink { }

</style>