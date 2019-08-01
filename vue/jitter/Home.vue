
<template>
  <div class="home">
    <!--div class="head"><h1>Welcome to the Jitter Mobile App</h1></div-->
    <div class="flavor">Flavor:</div><div class="f1">F1</div><div class="f2">F1</div><div class="f3">F1</div>
    <div class="roast" >Roast: </div><div class="r1">R1</div><div class="r2">R2</div><div class="r3">R3</div>
    <div class="brew"  >Brew:  </div><div class="b1">B1</div><div class="b2">B2</div><div class="b3">B3</div>
    <div class="drink" >Drink: </div><div class="d1">D1</div><div class="d2">D2</div><div class="d3">D3</div>
    <div class="body"  >Body:  </div><div class="s1">S1</div><div class="s2">S2</div><div class="s3">S3</div>
  </div>
</template>

<script type="module">
  
   let Home = {

  data() { return { comp:'Home' } },

   mounted: function () {
       this.publish( 'Nav', 'Home' ); }
   
  }

  import Dash from './Dash.vue';

  Home.Dash = Dash;
  
  export default Home;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid5x4() { display:grid; grid-template-columns:25fr 25fr 25fr 25fr; grid-template-rows:20fr 20fr 20fr 20fr 20fr;
      grid-template-areas:"flavor f1 f2 f3" "roast r1 r2 r3"  "brew b1 b2 b3" "drink d1 d2 d3" "body s1 s2 s3"; }
  
  .home { .grid5x4(); position:relative; left:0; top:0; right:0; bottom:0;
    background-color:@theme-back; color:@theme-color;

  .head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;
          justify-self:stretch; align-self:stretch;
    h1 { font-size:@theme-h1-size; }
    h2 { font-size:@theme-h2-size; } }

  .flavor { grid-area:flavor; justify-self:stretch; align-self:stretch; display:grid; }
  .f1     { grid-area:f1;     justify-self:stretch; align-self:stretch; display:grid; }
  .f2     { grid-area:f2;     justify-self:stretch; align-self:stretch; display:grid; }
  .f3     { grid-area:f3;     justify-self:stretch; align-self:stretch; display:grid; }

  .roast  { grid-area:roast;  justify-self:stretch; align-self:stretch; display:grid; }
  .r1     { grid-area:r1;     justify-self:stretch; align-self:stretch; display:grid; }
  .r2     { grid-area:r2;     justify-self:stretch; align-self:stretch; display:grid; }
  .r3     { grid-area:r3;     justify-self:stretch; align-self:stretch; display:grid; }

  .brew   { grid-area:roast;  justify-self:stretch; align-self:stretch; display:grid; }
  .b1     { grid-area:b1;     justify-self:stretch; align-self:stretch; display:grid; }
  .b2     { grid-area:b2;     justify-self:stretch; align-self:stretch; display:grid; }
  .b3     { grid-area:b3;     justify-self:stretch; align-self:stretch; display:grid; }

  .drink  { grid-area:drink;  justify-self:stretch; align-self:stretch; display:grid; }
  .d1     { grid-area:d1;     justify-self:stretch; align-self:stretch; display:grid; }
  .d2     { grid-area:b2;     justify-self:stretch; align-self:stretch; display:grid; }
  .d3     { grid-area:b3;     justify-self:stretch; align-self:stretch; display:grid; }
  
  .body   { grid-area:body;   justify-self:stretch; align-self:stretch; display:grid; }
  .s1     { grid-area:s1;     justify-self:stretch; align-self:stretch; display:grid; }
  .s2     { grid-area:s2;     justify-self:stretch; align-self:stretch; display:grid; }
  .s3     { grid-area:s3;     justify-self:stretch; align-self:stretch; display:grid; }
  
  }



</style>