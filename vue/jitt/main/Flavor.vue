
<template>
  <div   class="flavor-pane">
    <div class="choice-home">
      <h-navb :title="'Home'" :compKey="'Home'"></h-navb>
    </div>
    <div class="flavor-summ">
      <h-summ :name="name" ></h-summ>
    </div>
    <div class="flavor-wheel" ref="elem"></div>
  </div>
</template>

<script type="module">

import {inject, ref, onMounted, nextTick, onUnmounted} from 'vue';
  import Navb    from '../../../lib/vue/elem/Navb.vue';
  import Btns    from '../../../lib/vue/elem/Btns.vue';
  import Summ    from './Summ.vue';
  import SvgMgr  from '../../../lib/pub/draw/SvgMgr.js';
  import Wheel   from '../../../pub/augm/show/Wheel.js';


  let Flavor = {

    components:{ 'h-summ':Summ, 'h-btns':Btns, 'h-navb':Navb },

    setup( ) {

      const nav     = inject('nav');
      const name    = 'Flavor';
      const elem    = ref(null);
    //const homeBtn = inject('homeBtn');
      
      const onChoice = function ( choice, checked ) {
        nav.pub( { source:'Flavor.vue', compKey:name, choice:choice, checked:checked } ); }

      const create = () => {
        nav.createElem( "Flavor.create()", elem['value'], nextTick, () => {
          let svgMgr = new SvgMgr( name, elem['value'], 'Flavor' );
          new Wheel( svgMgr, onChoice, nav, true ); } ) }

      onMounted( () =>  {
        create(); } )

      onUnmounted( () => {
        nav.removeElem( "Flavor.vue", elem['value'], nextTick ); } )

    return { name, elem }; }
  }
  
  export default Flavor;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  .flavor-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-fore;
    
    .choice-home { position:absolute; left:0;   top:1%;  width: 30%; height: 6%; z-index:2; display:grid; }
    .flavor-summ { position:absolute; left:0;   top:0;   width:100%; height:15%; }
    .choice-done { position:absolute; left:80%; top:0;   width: 20%; height: 8%; z-index:2; }

    .flavor-summ  { position:absolute; left:0; top:0;   width:100%; height:15%; }
    
    .flavor-wheel { position:absolute; left:0; top:15%; width:100%; height:85%;
      .themeCenterItems(); background-color:@theme-back; color:@theme-fore; border:1px solid @theme-fore; }
  }
  
</style>