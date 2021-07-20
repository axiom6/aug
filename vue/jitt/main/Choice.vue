
<template>
  <div       class="choice-pane">
    <div     class="choice-home">
      <h-navb :title="'Home'" :compKey="'Home'"></h-navb>
    </div>
    <div class="choice-summ">
      <h-summ :name="name" ></h-summ>
    </div>
    <div class="choice-btns">
      <h-btns :name="name"   :btns="btns"></h-btns>
    </div>
  </div>
</template>

<script type="module">

  import Summ from './Summ.vue';
  import Btns from '../../../lib/vue/elem/Btns.vue';
  import Navb from '../../../lib/vue/elem/Navb.vue';

  let Choice = {

    components:{ 'h-summ':Summ, 'h-btns':Btns, 'h-navb':Navb },

    setup() { /// Not called

      const name    = 'Choice';
      const btns    = {};

      console.log( 'Choice.vue.setup()' );

      return { name, btns }; }
  }

  export default Choice;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  .choice-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-fore;

    .choice-home { position:absolute; left:0; top:1%; width: 30%; height: 6%; z-index:2; display:grid; }
    .choice-summ { position:absolute; left:0; top:0;  width:100%; height:15%; }
    
    .choice-btns { position:absolute; left:0; top:15%; width:100%; height:85%;
                   background-color:@theme-back; color:@theme-fore;  border:1px solid @theme-fore; }
  }

</style>

<!--h-btns :name="'Home'" :btns="homeBtn"></h-btns-->
