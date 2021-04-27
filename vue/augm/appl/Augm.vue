
<template>
  <div   class="home-pane">
    <div class="home-head">
      <div>
        <h1>Welcome to Augmentation Home Page</h1>
        <h2>Choose an Application Component on the Left</h2>
      </div>
    </div>
    <div   class="home-midd">
      <!--div class="home-btns">
        <h-btn name="Button" v-bind:position="[45,45,10,10]" .background="'red'"></h-btn>
      </div-->
    </div>
    <div class="home-foot">
      <div>
        <h1>Axiom Architectures</h1>
      </div>
    </div>
  </div>
</template>

<script type="module">

  import { inject, onMounted } from 'vue';
  import Btn  from '../../base/elem/Btn.vue';
//import Btns from '../../base/elem/Btns.vue';
  import Dash from '../../base/dash/Dash.vue';
  import Math from '../math/Math.vue';
  import Geom from '../geom/Geom.vue';
  import Data from '../data/Data.vue';
  import Tool from '../tool/Tool.vue';
  
  let Home = {
    
    components:{ 'h-btn':Btn },

    setup() {

      const mix = inject('mix');
      const pos = [45,45,10,10];

    onMounted( function () {
      mix.publish( 'Tocs', 'Close' ); } )

    return { pos }; }
  }

  Home.Dash = Dash;
  Home.Math = Math;
  Home.Geom = Geom;
  Home.Data = Data;
  Home.Tool = Tool;

  export default Home;

</script>

<style lang="less">

  @import '../../../css/font/roboto/Roboto.css';
  @import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css';
  @import '../../../css/themes/theme.less';
  
  @homeFS:@themeFS;
  
  .grid3x1() { display:grid; grid-template-columns:1fr; grid-template-rows:30fr 40fr 30fr;
      grid-template-areas:"head" "midd" "foot"; }
  
  .home-pane { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;
    background-color:@theme-back; color:@theme-fore;

    .home-head { grid-area:head; .themeCenterItems(); justify-self:stretch; align-self:stretch;
      h1 { font-size:2.5*@homeFS; } }
    
    .home-midd { grid-area:midd; .themeCenterItems(); justify-self:stretch; align-self:stretch;
      h1 { font-size:2.5*@homeFS; }
      .home-btns { position:relative; left:0; top:0; width:100%; height:100%; } }
  
    .home-foot { grid-area:foot; .themeCenterItems(); justify-self:stretch; align-self:stretch;
      h1 { font-size:2.5*@homeFS; } }
  }
  
  
</style>