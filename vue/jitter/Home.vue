
<template>
  <div class="home">
    <div class="head"><h1>Welcome to the Jitter Mobile App</h1></div>
    <div class="summary">
      <div class="r1c1" @click="route('Flavor')">Flavor:</div>
        <div class="r1c2">F1</div><div class="r1c3">F2</div><div class="r1c4">F3</div>
      <div class="r2c1"  @click="route('Roast')" >Roast: </div>
        <div class="r2c2">R1</div><div class="r2c3">R2</div><div class="r2c4">R3</div>
      <div class="r3c1" @click="route('Brew')"  >Brew:  </div>
        <div class="r3c2">B1</div><div class="r3c3">B2</div><div class="r3c4">B3</div>
      <div class="r4c1" @click="route('Drink')" >Drink: </div>
        <div class="r4c2">D1</div><div class="r4c3">D2</div><div class="r4c4">D3</div>
      <div class="r5c1" @click="route('Body')"  >Body:  </div>
        <div class="r5c2">S1</div><div class="r5c3">S2</div><div class="r5c4">S3</div>
    </div>
  </div>
</template>

<script type="module">
  
  let Home = {

  data() { return { comp:'Home' } },
  
  methods:{
    route: function( comp ) {
        this.nav().route( comp, {} ); } },

   mounted: function () {
       this.publish( 'Nav', 'Home' ); }
  }

  import Dash from './Dash.vue';

  Home.Dash = Dash;
  
  export default Home;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid5x4(){ display:grid; grid-template-rows: 20fr 20fr 20fr 20fr 20fr; grid-template-columns:40fr 20fr 20fr 20fr;
    grid-template-areas:   "r1c1 r1c2 r1c3 r1c4" "r2c1 r2c2 r2c3 r2c4"
     "r3c1 r3c2 r3c3 r3c4" "r4c1 r4c2 r4c3 r4c4" "r5c1 r5c2 r5c3 r5c4"; }

  .c( @rc ) { display:grid; grid-area:@rc; justify-self:stretch; align-self:stretch;
    justify-items:center; align-items:center; background-color:@theme-back; color:@theme-color;
    border:solid thin @theme-color; }
  
  .home { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-color;

    .head { position:absolute; left:0; top:0; width:100%; height:20%;
            display:grid;justify-items:center; align-items:center; text-align:center;
      h1 { font-size:@theme-h1-size; }
      h2 { font-size:@theme-h2-size; } }
      
    .summary {  .grid5x4(); position:absolute; left:0; top:20%; width:100%; height:80%;
      .r1c1{.c(r1c1)}; .r1c2{.c(r1c2)}; .r1c3{.c(r1c3)}; .r1c4{.c(r1c4)};
      .r2c1{.c(r2c1)}; .r2c2{.c(r2c2)}; .r2c3{.c(r2c3)}; .r2c4{.c(r2c4)};
      .r3c1{.c(r3c1)}; .r3c2{.c(r3c2)}; .r3c3{.c(r3c3)}; .r3c4{.c(r3c4)};
      .r4c1{.c(r4c1)}; .r4c2{.c(r4c2)}; .r4c3{.c(r4c3)}; .r4c4{.c(r4c4)};
      .r5c1{.c(r5c1)}; .r5c2{.c(r5c2)}; .r5c3{.c(r5c3)}; .r5c4{.c(r5c4)};
    }
  }



</style>