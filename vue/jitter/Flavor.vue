
<template>
  <div class="flavor"><h1>Flavor</h1></div>
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
  
  .flavor { justify-items:center; align-items:center; text-align:center; display:grid;
            position:absolute; left:0; top:0; right:0; bottom:0;
            background-color:@theme-back; color:@theme-color;
    h1 { font-size:@theme-h1-size; } }
  
</style>