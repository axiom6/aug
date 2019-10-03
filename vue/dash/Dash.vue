
<template>
  <div class="dash">
    <d-logo id="logo"></d-logo>
    <d-tocs id="tocs"></d-tocs>
    <d-view id="view"></d-view>
  </div>
</template>

<script type="module">
  
  import Logo from '../dash/Logo.vue';
  import Tocs from '../dash/Tocs.vue';
  import View from '../dash/View.vue';
  
  let Dash = {
      name: 'dash',
      components: { 'd-logo':Logo, 'd-tocs':Tocs, 'd-view':View } };
  
  export default Dash;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .dash { font-family:@theme-font-family;
     position:absolute; left:0; top:0; right:0; bottom:0; display:grid; overflow:hidden;
     grid-template-columns: 10fr 90fr;
     grid-template-rows:    10fr 90fr;
     grid-template-areas:
       "logo view"
       "tocs view";
  
  #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; .theme-logo; }
  #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; .theme-tocs; padding-bottom:1rem; }
  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; .theme-view; padding:       1rem; } }
  
</style>

