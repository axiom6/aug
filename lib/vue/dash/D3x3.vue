
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
  
  import Navd from './Navd.vue';
  import Menu from './Menu.vue';
  import Find from './Find.vue';
  import Tocs from './Tocs.vue';
  import View from './View.vue';
  import Side from './Side.vue';
  import Pref from './Pref.vue';
  import Foot from './Foot.vue';
  import Trak from './Trak.vue';
  
  let Dash = {
      name: 'dash',
      components: {
        'd-logo':Logo, 'd-menu':Menu, 'd-find':Find,
        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,
        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };
  
  export default Dash;
  
</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';

  .dash { font-family:@theme-font-family; .theme-dash();
   position:absolute; left:0; top:0; right:0; bottom:0; display:grid;
   grid-template-columns: 11fr 85fr 4fr;
   grid-template-rows:    10fr 85fr 5fr;
   grid-template-areas:
     "logo menu find"
     "tocs view side"
     "pref foot trak";
  
  #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; .theme-dash(); }
  #menu { grid-area:menu; justify-self:stretch; align-self:stretch; display:grid; .theme-dash(); }
  #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; .theme-dash(); }
  #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; .theme-tocs(); }
  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; .theme-dash(); }
  #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; .theme-dash(); }
  #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; .theme-dash(); }
  #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; .theme-dash(); }
  #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; .theme-dash(); } }
  
</style>

