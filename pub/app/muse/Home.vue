
<template>
  <div class="home-pane">
    <div class="home-header">
      <div>
        <h1 class="theme-h1">Welcome to Muse Home Page</h1>
        <h2 class="theme-h2">Choose an Application Component on the Left</h2>
      </div>
    </div>
    <div class="home-footer">
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
  import Sect from '../../../vue/talk/Sect.vue';
  import Cube from '../../../vue/comp/Cube.vue';
  import Prin from '../../../vue/prin/Prin.vue';
  import Comp from '../../../vue/comp/Comp.vue';
  import Prac from '../../../vue/prac/Prac.vue';
  import Disp from '../../../vue/disp/Disp.vue';
  
  Home.Dash = Dash;
  Home.Talk = Talk;
  Home.Sect = Sect;
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
  
  .home-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-fore;

    .home-head { position:absolute; left:0; top:20%;   width:100%; height:20%; .themeCenterItems(); }
    
    .home-midd { position:absolute; left:0; top:40%; width:100%; height:10%; .themeCenterItems(); }
    
    .home-list { .themeCenterSelf(); }
  
    .home-foot { position:absolute; left:0; top:50%; width:100%; height:20%; .themeCenterItems(); }
  

 }
 
</style>

<!--div  class="theme-section">
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
</div-->