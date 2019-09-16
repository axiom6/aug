
<template>
  <div class="home">
    <div class="head">
      <div>
        <h1>Welcome to the Mobile App Demo</h1>
      </div>
    </div>
  </div>
</template>

<script type="module">
  
  let Home = {

  data() { return { comp:'Draw', key:'Axes' } },

   mounted: function () {
       this.publish( 'Tocs', 'Close' ); }
   
  }

  import Dash from '../../../vue/dash/Dash.vue';

  Home.Dash = Dash;
  
  export default Home;
  
</script>

<style lang="less">
  
  @import '../../../pub/css/themes/theme.less';
  
  .grid3x1() { display:grid; grid-template-columns:1fr; grid-template-rows:10fr 80fr 10fr;
      grid-template-areas:"head" "elem" "foot"; }
  
  .home { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;
    background-color:@theme-back; color:@theme-color; }

  .head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;
          justify-self:stretch; align-self:stretch;
    h1 { font-size:@theme-h1-size; }
    h2 { font-size:@theme-h2-size; } }
  
  .elem { grid-area:elem; position:relative; left:0; top:0; right:0; height:100%;
    h1 { font-size:@theme-h1-size; } }

  .foot { grid-area:foot; justify-items:center; align-items:center; text-align:center; display:grid;
          justify-self:stretch; align-self:stretch;
    h1 { font-size:@theme-h1-size; } }
  
</style>