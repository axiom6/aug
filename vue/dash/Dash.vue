
<template>
  <div class="dash">
    <d-logo id="logo"></d-logo>
    <d-navb id="navb"></d-navb>
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
  import Navb from '../dash/Navb.vue';
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
        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,
        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,
        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };
  
  export default Dash;
  
</script>

<style lang="less">
  
  @import 'css/fontawesome/init.css';

  .dash { font-family:Roboto, sans-serif; font-size:1rem;
   position:absolute; left:0; top:0; right:0; bottom:0; display:grid;
   grid-template-columns: 11vw 85vw 4vw;
   grid-template-rows:     6vh 88vh 6vh;
   grid-template-areas:
     "logo navb find"
     "tocs view side"
     "pref foot trak";
  
  #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; }
  #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; }
  #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; }
  #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; }
  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; }
  #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; }
  #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; }
  #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; }
  #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; } }
  
</style>

