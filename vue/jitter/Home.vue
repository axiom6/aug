
<template>
  <div     class="home-pane">
    <div   class="home-head"><h1>Jitter</h1></div>
    <div   class="home-summ">
      <div class="home-flavor" @click="route('Flavor')"><h-summ name="Flavor" id="SFlavor"></h-summ></div>
      <div class="home-roast"  @click="route('Roast')" ><h-summ name="Roast"  id="SRoast"></h-summ></div>
      <div class="home-brew"   @click="route('Brew')"  ><h-summ name="Brew"   id="SBrew" ></h-summ></div>
      <div class="home-drink"  @click="route('Drink')" ><h-summ name="Drink"  id="SDrink"></h-summ></div>
      <div class="home-body"   @click="route('Body')"  ><h-summ name="Body"   id="SBody" ></h-summ></div>
    </div>
  </div>
</template>

<script type="module">

  import Summ from './Summ.vue';
  
  let Home = {

    components:{ 'h-summ':Summ },

  data() { return { comp:'Home' }; },
  
  methods:{
    route: function( comp ) {
        this.dir().doRoute( comp ); } },

   mounted: function () {}
  }

  import Dash from './Dash.vue';

  Home.Dash = Dash;
  
  export default Home;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  
  .home-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-fore;

    .home-head { position:absolute; left:0; top:0; width:100%; height:20%; border:1px solid @theme-fore;
            display:grid;justify-items:center; align-items:center; text-align:center;
      h1 { font-size:@theme-h1-FS; }
      h2 { font-size:@theme-h2-FS; } }
      
    .home-summ{  position:absolute; left:0; top:20%; width:100%; height:80%;
      .home-flavor { position:absolute; left:0; top:0;   width:100%; height:20%; }
      .home-roast  { position:absolute; left:0; top:20%; width:100%; height:20%; }
      .home-brew   { position:absolute; left:0; top:40%; width:100%; height:20%; }
      .home-drink  { position:absolute; left:0; top:60%; width:100%; height:20%; }
      .home-body   { position:absolute; left:0; top:80%; width:100%; height:20%; } }
    
  }

</style>