
<template>
  <div   class="home-pane">
    <div class="home-head">
      <div>
        <h1>Welcome to Augmentation Home Page</h1>
        <h2>Choose an Application Component on the Left</h2>
      </div>
    </div>
    <div class="home-midd">
      <!--h-btns comp="Home" :btns="btns" init="Axes" back="#3B5999" active="tan"></h-btns-->
    </div>
    <div class="home-foot">
      <div>
        <h1>Axiom Architectures</h1>
      </div>
    </div>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';
  import Btns from '../elem/Btns.vue';
  import Dash from '../dash/Dash.vue';
  import Math from '../math/Math.vue';
  import Geom from '../geom/Geom.vue';
  import Data from '../data/Data.vue';
  
  let Home = {
    
    components:{ 'h-btns':Btns },

  data() { return { comp:'Draw', key:'Axes', btns:{
    Axes:    { title:'Axes',    key:'Axes',    obj:null, pos:[ 5,10,0,10], back:'primary',   check:true              },
    Chord:   { title:'Chord',   key:'Chord',   obj:null, pos:[30,10,0,20], back:'secondary', img:'brew/AutoDrip.jpg' },
    Cluster: { title:'Cluster', key:'Cluster', obj:null, pos:[50,10,0,10], back:'success',   icon:'fas fa-circle'    },
    Link:    { title:'Link',    key:'Link',    obj:null, pos:[ 5,25,0,20], back:'info',      check:true              },
    Radar:   { title:'Radar',   key:'Radar',   obj:null, pos:[ 5,40,0,10], back:'warning',   icon:'fas fa-circle'    },
    Radial:  { title:'Radial',  key:'Radial',  obj:null, pos:[ 5,55,0,20], back:'danger',    img:'brew/AutoDrip.jpg' },
    Tree:    { title:'Tree',    key:'Tree',    obj:null, pos:[40,40,0,30], back:'light',     icon:'fas fa-circle'    },
    Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, pos:[60,60,0,30], back:'success',   img:'brew/AutoDrip.jpg' }
    } } },

   mounted: function () {
       this.mix = inject('mix');
       this.mix.publish( 'Tocs', 'Close' ); }
   
  }

  Home.Dash = Dash;
  Home.Math = Math;
  Home.Geom = Geom;
  Home.Data = Data;

  export default Home;

</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';
  
  @homeFS:@themeFS;
  
  .grid3x1() { display:grid; grid-template-columns:1fr; grid-template-rows:30fr 40fr 30fr;
      grid-template-areas:"head" "midd" "foot"; }
  
  .home-pane { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;
    background-color:@theme-back; color:@theme-fore;

    .home-head { grid-area:head; .themeCenterItems(); justify-self:stretch; align-self:stretch;
      h1 { font-size:2.5*@homeFS; } }
    
    .home-midd { grid-area:midd; .themeCenterItems(); justify-self:stretch; align-self:stretch;
      h1 { font-size:2.5*@homeFS; } }
  
    .home-foot { grid-area:foot; .themeCenterItems(); justify-self:stretch; align-self:stretch;
      h1 { font-size:2.5*@homeFS; } }
    
  }
  
</style>