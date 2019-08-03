
<template>
  <div class="drink"><h1>Drink</h1></div>
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
  
  .drink { justify-items:center; align-items:center; text-align:center; display:grid;
           background-color:@theme-back; color:@theme-color;
           position:absolute; left:0; top:0; right:0; bottom:0;
    h1 { font-size:@theme-h1-size; } }

</style>