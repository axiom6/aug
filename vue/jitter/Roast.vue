
<template>
  <div class="roast"><h1>Roast</h1></div>
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
  
  .roast { justify-items:center; align-items:center; text-align:center; display:grid;
           position:absolute; left:0; top:0; right:0; bottom:0;
           background-color:@theme-back; color:@theme-color;
    h1 { font-size:@theme-h1-size; } }

</style>