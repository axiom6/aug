
<template>
  <div     class="home-pane">
    <div   class="home-head">
      <div class="home-name">Coffee</div>
      <div class="home-done">
        <h-navb :title="'Done'" :route="'Done'"></h-navb>
      </div>
    </div>
    <div   class="home-summ">
      <div class="home-flavor"><h-summ name="Flavor" route='Flavor' @click="route('Flavor')"></h-summ></div>
      <div class="home-roast" ><h-summ name="Roast"  route='Roast'  @click="route('Roast')" ></h-summ></div>
      <div class="home-brew"  ><h-summ name="Brew"   route='Brew'   @click="route('Brew')"  ></h-summ></div>
      <div class="home-drink" ><h-summ name="Drink"  route='Drink'  @click="route('Drink')" ></h-summ></div>
      <div class="home-body"  ><h-summ name="Body"   route='Body'   @click="route('Body')"  ></h-summ></div>
    </div>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';
  import Summ       from '../main/Summ.vue';
  import Dash       from '../main/Dash.vue';
  import Btns       from '../../../lib/vue/elem/Btns.vue';
  import Navb       from '../../../lib/vue/elem/Navb.vue';
  
  let Home = {

    components: { 'h-btns':Btns, 'h-summ':Summ, 'h-navb':Navb },

    setup() {
      const nav     = inject('nav');
      const route   = function (comp) {
        nav.doRoute( { compKey:comp } ); }
      return { route }; }
  }

  Home.Dash = Dash;
  
  export default Home;
  
</script>

<style lang="less">

  @import '../../../css/font/roboto/Roboto.css';
  @import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css';
  @import '../../../css/themes/theme.less';
  
  .home-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-fore;

    .home-head { position:absolute; left:0; top:0; width:100%; height:20%; border:1px solid @theme-fore;
       display:grid;justify-items:center; align-items:center; text-align:center;

      .home-name { position:absolute; left:25%; top:30%; width:50%; height:25%; font-size:4.0*@themeFS; }
      .home-done { position:absolute; left:70%; top: 8%; width:30%; height:30%; z-index:2; display:grid; } }

    .home-summ{  position:absolute; left:0; top:20%; width:100%; height:80%;
      .home-flavor { position:absolute; left:0; top:0;   width:100%; height:20%; }
      .home-roast  { position:absolute; left:0; top:20%; width:100%; height:20%; }
      .home-brew   { position:absolute; left:0; top:40%; width:100%; height:20%; }
      .home-drink  { position:absolute; left:0; top:60%; width:100%; height:20%; }
      .home-body   { position:absolute; left:0; top:80%; width:100%; height:20%; } }
    
  }

</style>