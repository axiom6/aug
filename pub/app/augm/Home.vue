
<template>
  <div class="home">
    <div class="head">
      <div>
        <h1>Welcome to Augmentation Home Page</h1>
        <h2>Choose an Application Component on the Left</h2>
      </div>
    </div>
    <div class="elem">
      <h-btns comp="Home" :btns="btns" init="Axes" back="#3B5999" active="tan"></h-btns>
    </div>
    <div class="foot">
      <div>
        <h1>Axiom Architectures</h1>
      </div>
    </div>
  </div>
</template>

<script type="module">

  import Btns from '../../../vue/elem/Btns.vue';
  
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
    Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, pos:[60,60,0,30], back:'light',     img:'brew/AutoDrip.jpg' }
    } } },

   mounted: function () {
       this.publish( 'Tocs', 'Close' ); }
   
  }

  import Dash from '../../../vue/dash/Dash.vue';
  import Math from '../../../vue/math/Math.vue';
  import Geom from '../../../vue/geom/Geom.vue';
  import Note from '../../../vue/note/Note.vue';
  import Data from '../../../vue/data/Data.vue';

  Home.Dash = Dash;
  Home.Math = Math;
  Home.Geom = Geom;
  Home.Note = Note;
  Home.Data = Data;
  
  export default Home;
  
</script>

<style lang="less">
  
  .grid3x1() { display:grid; grid-template-columns:100%; grid-template-rows:10vh 80vh 10vh;
      grid-template-areas:"head" "elem" "foot"; }
  
  .home { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;
    background-color:black; color:wheat; }

  .head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;
    justify-self:stretch; align-self:stretch; }
  
  .elem { grid-area:elem; position:relative; left:0; top:0; right:0; height:100%; }

  .foot { grid-area:foot; justify-items:center; align-items:center; text-align:center; display:grid;
    justify-self:stretch; align-self:stretch;  }
  
</style>