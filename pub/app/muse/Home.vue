
<template>
  <div class="home-pane">
    <div class="theme-header">
      <div>
        <h1 class="theme-h1">Welcome to Muse Home Page</h1>
        <h2 class="theme-h2">Choose an Application Component on the Left</h2>

      </div>
    </div>
    <div  class="theme-section">
      <h3 class="theme-h3">H3</h3>
      <h4 class="theme-h4">H4</h4>
      <h5 class="theme-h5">H5</h5>
      <h6 class="theme-h6">H6</h6>
      <div class="home-list">
        <ul class="theme-ul">
          <li>LI 1<ul>
            <li>LI 2<ul>
              <li>LI 3</li></ul>
            </li></ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="theme-footer">
      <div>
        <h1 class="theme-h1">Humanistic Practices</h1>
        <h1 class="theme-h1">Axiom Architectures</h1>
      </div>
    </div>
  </div>
</template>

<script type="module">
  
  let Home = {

    data() { return { comp:'Home', key:'Home' } },
    
    mounted: function () {
      this.publish( 'Tocs', 'Close' ); }
  }

  import Dash from '../../../vue/dash/Dash.vue';
  import Talk from '../../../vue/talk/Talk.vue';
  import Cube from '../../../vue/comp/Cube.vue';
  import Prin from '../../../vue/prin/Prin.vue';
  import Comp from '../../../vue/comp/Comp.vue';
  import Prac from '../../../vue/prac/Prac.vue';
  import Disp from '../../../vue/disp/Disp.vue';
  
  Home.Dash = Dash;
  Home.Talk = Talk;
  Home.Cube = Cube;
  Home.Prin = Prin;
  Home.Comp = Comp;
  Home.Prac = Prac;
  Home.Disp = Disp;
  
  export default Home;
  
</script>

<style lang="less">
  
  @import '../../../pub/css/themes/theme.less';
  
  @homeFS:2.0*@themeFS;
  
  .home-grid3x1() { display:grid; grid-template-columns:1fr; grid-template-rows:20fr 60fr 20fr;
      grid-template-areas:"head" "midd" "foot"; }
  
  .home-pane { .home-grid3x1(); width:100%; height:100%;
    background-color:@theme-back; color:@theme-fore;

    .home-head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;
      justify-self:stretch; align-self:stretch; }
    
    .home-midd { grid-area:midd; position:relative; left:0; top:0; right:0; height:100%; display:grid;
      justify-self:stretch; align-self:stretch; }
    
    .home-list { .themeCenterSelf(); }
  
    .home-foot { grid-area:foot; justify-items:center; align-items:center; text-align:center; display:grid;
      justify-self:stretch; align-self:stretch;  }
  

 }
 
</style>