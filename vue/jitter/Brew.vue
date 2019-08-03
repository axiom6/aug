
<template>
  <div class="brew"><h1>Brew</h1></div>
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
  
  .brew { justify-items:center; align-items:center; text-align:center; display:grid;
          position:absolute; left:0; top:0; right:0; bottom:0;
          background-color:@theme-back; color:@theme-color;
     h1 { font-size:@theme-h1-size; } }

</style>