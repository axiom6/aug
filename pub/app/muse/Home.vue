
<template>
  <div class="home">
    <div class="head">
      <div>
        <h1>Welcome to Muse Home Page</h1>
        <h2>Choose an Application Component on the Left</h2>
      </div>
    </div>
    <div class="midd">
      <h1>Humanistic Practices</h1>
    </div>
    <div class="foot">
      <div>
        <h1>Axiom Architectures</h1>
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
  import Info from '../../../vue/comp/Info.vue';
  import Know from '../../../vue/comp/Know.vue';
  import Wise from '../../../vue/comp/Wise.vue';

  Home.Dash = Dash;
  Home.Info = Info;
  Home.Know = Know;
  Home.Wise = Wise;

    export default Home;
</script>

<style lang="less">
  
  .grid3x1() { display:grid; grid-template-columns:100%; grid-template-rows:30% 40% 30%;
      grid-template-areas:"head" "midd" "foot"; }
  
  .home { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;
    background-color:black; color:wheat; }

  .head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;
    justify-self:stretch; align-self:stretch; }
  
  .midd { grid-area:midd; position:relative; left:0; top:0; right:0; height:100%; display:grid;
    justify-self:stretch; align-self:stretch; }

  .foot { grid-area:foot; justify-items:center; align-items:center; text-align:center; display:grid;
    justify-self:stretch; align-self:stretch;  }
  
  h1 { justify-self:center; align-self:center; font-size:3em; }
  
</style>