
<template>
  <div class="dasm">
    <d-viem id="viem"></d-viem>
  </div>
</template>

<script type="module">
  
  import View from './View.vue';
  
  let Dash = {
      name: 'dash',
      components: {'d-view':View } };
  
  export default Dash;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .dash { font-family:@theme-font-family;
   position:absolute; left:0; top:0; right:0; bottom:0; 
   
  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; .theme-view; }
 }
  
</style>

