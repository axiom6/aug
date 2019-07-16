
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
  
  @import '../../../pub/css/themes/theme.less';
  
  .grid3x1() { display:grid; grid-template-columns:1fr; grid-template-rows:30fr 40fr 30fr;
      grid-template-areas:"head" "midd" "foot"; }
  
  .home { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;
    background-color:@theme-back; color:@theme-color; }

  .head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;
    justify-self:stretch; align-self:stretch; }
  
  .midd { grid-area:midd; position:relative; left:0; top:0; right:0; height:100%; display:grid;
    justify-self:stretch; align-self:stretch; }

  .foot { grid-area:foot; justify-items:center; align-items:center; text-align:center; display:grid;
    justify-self:stretch; align-self:stretch;  }
  
  h1 { justify-self:center; align-self:center; font-size:@theme-h1-size; }
  h2 { justify-self:center; align-self:center; font-size:@theme-h2-size; }
  
</style>