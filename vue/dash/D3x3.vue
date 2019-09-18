
<template>
  <div class="dash">
    <d-logo id="logo"></d-logo>
    <d-menu id="menu"></d-menu>
    <d-find id="find"></d-find>
    <d-tocs id="tocs"></d-tocs>
    <d-view id="view"></d-view>
    <d-side id="side"></d-side>
    <d-pref id="pref"></d-pref>
    <d-foot id="foot"></d-foot>
    <d-trak id="trak"></d-trak>
  </div>
</template>

<script type="module">
  
  import Logo from '../dash/Logo.vue';
  import Menu from '../dash/Menu.vue';
  import Find from '../dash/Find.vue';
  import Tocs from '../dash/Tocs.vue';
  import View from '../dash/View.vue';
  import Side from '../dash/Side.vue';
  import Pref from '../dash/Pref.vue';
  import Foot from '../dash/Foot.vue';
  import Trak from '../dash/Trak.vue';
  
  let Dash = {
      name: 'dash',
      components: {
        'd-logo':Logo, 'd-menu':Menu, 'd-find':Find,
        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,
        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };
  
  export default Dash;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .dash { font-family:@theme-font-family;
   position:absolute; left:0; top:0; right:0; bottom:0; display:grid;
   grid-template-columns: @theme-west  @theme-center @theme-east;
   grid-template-rows:    @theme-north @theme-middle @theme-south;
   grid-template-areas:
     "logo menu find"
     "tocs view side"
     "pref foot trak";
  
  #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; .theme-logo; }
  #menu { grid-area:menu; justify-self:stretch; align-self:stretch; display:grid; .theme-menu; }
  #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; .theme-find; }
  #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; .theme-tocs; }
  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; .theme-view; }
  #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; .theme-side; }
  #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; .theme-pref; }
  #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; .theme-foot; }
  #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; .theme-trak; } }
  
</style>

