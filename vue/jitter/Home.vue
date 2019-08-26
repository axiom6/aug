
<template>
  <div class="home">
    <div class="head"><h1>Jitter</h1></div>
    <div class="summary">
      <div class="Flavor" @click="route('Flavor')"><h-summ name="Flavor" id="SFlavor"></h-summ></div>
      <div class="Roast"  @click="route('Roast')" ><h-summ name="Roast"  id="SRoast"></h-summ></div>
      <div class="Brew"   @click="route('Brew')"  ><h-summ name="Brew"   id="SBrew" ></h-summ></div>
      <div class="Drink"  @click="route('Drink')" ><h-summ name="Drink"  id="SDrink"></h-summ></div>
      <div class="Body"   @click="route('Body')"  ><h-summ name="Body"   id="SBody" ></h-summ></div>
    </div>
  </div>
</template>

<script type="module">

  import Summ from './Summ.vue';
  
  let Home = {

    components:{ 'h-summ':Summ },

  data() { return { comp:'Home', choices:{
      Flavor: { name:'Flavor' },
      Roast:  { name:'Roast'  },
      Brew:   { name:'Brew'   },
      Drink:  { name:'Drink'  },
      Body:   { name:'Body'   } } }; },
  
  methods:{
    route: function( comp ) {
        this.nav().route( comp ); } },

   mounted: function () {}
  }

  import Dash from './Dash.vue';

  Home.Dash = Dash;
  
  export default Home;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  
  .home { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-color;

    .head { position:absolute; left:0; top:0; width:100%; height:20%;
            display:grid;justify-items:center; align-items:center; text-align:center;
      h1 { font-size:@theme-h1-size; }
      h2 { font-size:@theme-h2-size; } }
      
    .summary {  position:absolute; left:0; top:20%; width:100%; height:80%;
      .Flavor { position:absolute; left:0; top:0;   width:100%; height:20%; }
      .Roast  { position:absolute; left:0; top:20%; width:100%; height:20%; }
      .Brew   { position:absolute; left:0; top:40%; width:100%; height:20%; }
      .Drink  { position:absolute; left:0; top:60%; width:100%; height:20%; }
      .Body   { position:absolute; left:0; top:80%; width:100%; height:20%; } }
    
  }

</style>