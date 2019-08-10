
<template>
  <div class="home">
    <div class="head"><h1>Jitter</h1></div>
    <div class="summary">
      <div class="Flavor"><div class="name" @click="route('Flavor')">Flavor</div>
        <div class="c1">F1</div><div class="c2">F2</div><div class="c3">F3</div></div>
      <div class="Roast"><div class="name"  @click="route('Roast')" >Roast</div>
        <div class="c1">R1</div><div class="c2">R2</div><div class="c3">R3</div></div>
      <div class="Brew"><div class="name" @click="route('Brew')"  >Brew</div>
        <div class="c1">B1</div><div class="c2">B2</div><div class="c3">B3</div></div>
      <div class="Drink"><div class="name" @click="route('Drink')" >Drink</div>
        <div class="c1">D1</div><div class="c2">D2</div><div class="c3">D3</div></div>
      <div class="Body"><div class="name" @click="route('Body')"  >Body</div>
        <div class="c1">S1</div><div class="c2">S2</div><div class="c3">S3</div></div>
    </div>
  </div>
</template>

<script type="module">
  
  let Home = {

  data() { return { comp:'Home', choices:{
      Flavor: { key:'Flavor' },
      Roast:  { key:'Roast'  },
      Brew:   { key:'Brew'   },
      Drink:  { key:'Drink'  },
      Body:   { key:'Body'   } } }; },
  
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
    
    .centerItems() { display:grid; align-items:center; justify-items:center; text-align:center; }
    
    .name { position:absolute; left:0;     top:0;   width:100%;   height:50%; .themeCenterItems(); }
    .c1   { position:absolute; left:0;     top:50%; width: 33.3%; height:50%; .themeCenterItems(); }
    .c2   { position:absolute; left:33.3%; top:50%; width: 33.3%; height:50%; .themeCenterItems(); }
    .c3   { position:absolute; left:66.6%; top:50%; width: 33.3%; height:50%; .themeCenterItems(); }
  }

</style>