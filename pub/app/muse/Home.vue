
<template>
  <div class="home-pane">
    <!--div class="home-head">
      <div>
        <h1 class="home-h1">Welcome to Muse Home Page</h1>
        <h2 class="home-h2">Choose an Application Component on the Left</h2>
      </div>
    </div-->
    <div  class="home-midd">
      <h1 class="home-h1">Humanistic Practices</h1>
    </div>
    <!--div class="home-foot">
      <div>
        <h1 class="home-h1">Axiom Architectures</h1>
      </div>
    </div-->
  </div>
</template>

<script type="module">
  
  let Home = {

    data() { return { comp:'Home', key:'Home' } },
    
    mounted: function () {
      this.publish( 'Tocs', 'Close' ); }
  }

  import Dash from '../../../vue/dash/Dash.vue';
  import Prin from '../../../vue/prin/Prin.vue';
  import Comp from '../../../vue/comp/Comp.vue';
  import Prac from '../../../vue/prac/Prac.vue';
  import Disp from '../../../vue/disp/Disp.vue';
  
  Home.Dash = Dash;
  Home.Prin = Prin;
  Home.Comp = Comp;
  Home.Prac = Prac;
  Home.Disp = Disp;
  
  export default Home;
  
</script>

<style lang="less">
  
  @import '../../../pub/css/themes/theme.less';
  
  .grid3x1() { display:grid; grid-template-columns:1fr; grid-template-rows:30fr 40fr 30fr;
      grid-template-areas:"head" "midd" "foot"; }
  
  .home-pane { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;
    background-color:@theme-back; color:@theme-color;

    .home-head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;
      justify-self:stretch; align-self:stretch; }
    
    .home-midd { grid-area:midd; position:relative; left:0; top:0; right:0; height:100%; display:grid;
      justify-self:stretch; align-self:stretch; }
  
    .home-foot { grid-area:foot; justify-items:center; align-items:center; text-align:center; display:grid;
      justify-self:stretch; align-self:stretch;  }
  
    .home-h1 { justify-self:center; align-self:center; font-size:3.5rem; }
    .home-h2 { justify-self:center; align-self:center; font-size:2.5rem }
 }
 
</style>