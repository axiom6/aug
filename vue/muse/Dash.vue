
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
  import Tocs from './Tocs.vue';
  import View from './View.vue';
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

  // Static imports for minimizing build steps in dev.
  import Home from './Home.vue';
  import Info from './Info.vue';
  import Know from './Know.vue';
  import Wise from './Wise.vue';
//import Cube from './Cube.vue';
//import Wood from '../../app/anim/wood/Wood.vue';

  Dash.Home = Home;
  Dash.Info = Info;
  Dash.Know = Know;
  Dash.Wise = Wise;
//Dash.Cube = Cube;
//Dash.Wood = Wood;
 
  export default Dash;
  
</script>

<style lang="less">

   .dash { font-family:Roboto, sans-serif; font-size:1rem;
     position:absolute; left:0; top:0; right:0; bottom:0; display:grid;
     grid-template-columns: 200px 1fr 50px;
     grid-template-rows:     50px 1fr 50px;
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

<!--script type="module">

  import Logo from '../dash/Logo.vue';
  import Navb from '../dash/Navb.vue';
  import Find from '../dash/Find.vue';
  import Tocs from './Tocs.vue';
  import View from './View.vue';
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

  // Static imports for minimizing build steps in dev.

  import Info from './Info.vue';
  import Know from './Know.vue';
  import Wise from './Wise.vue';
  //import Cube from './Cube.vue';
  import Svga from '../../app/demo/Svga.vue';

  Dash.Info = Info;
  Dash.Know = Know;
  Dash.Wise = Wise;
  //Dash.Cube = Cube;
  Dash.Svga = Svga;

  export default Dash;

</script-->
