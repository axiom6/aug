
<template>
  <div   class="flavor-pane">
    <div class="flavor-summ"><h-summ :name="name" ></h-summ></div>
    <div class="flavor-wheel" :ref="name"></div>
  </div>
</template>

<script type="module">

  import Summ    from './Summ.vue';
  import SvgMgr  from '../../pub/draw/base/SvgMgr.js';
  import Wheel   from '../../pub/base/vue/Wheel.js';

  let Flavor = {

    components:{ 'h-summ':Summ },

    data() { return { name:'Flavor', svgMgr:null, wheel:null } },
    
    methods: {

      onChoice: function ( choice, roast ) {
        this.choose(  this.name, choice );
        if( roast===false ) {}
        // console.log( 'Flavor.onChoice()', { name:this.name, choice:choice, roast:roast } );
        this.publish( this.name, choice ); },
    },

    mounted: function () {
      this.$nextTick( function() {
        let elem    = this.$refs[this.name];
        this.svgMgr = new SvgMgr( this.name, elem, 'Flavor' );
        this.wheel  = new Wheel(  this.svgMgr, this.onChoice ); } ) }

  }
  
  export default Flavor;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .flavor-pane { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-fore;

    .flavor-summ  { position:absolute; left:0; top:0;   width:100%; height:15%; }
    
    .flavor-wheel { position:absolute; left:0; top:15%; width:100%; height:85%;
      .themeCenterItems(); background-color:@theme-back; color:@theme-fore; border:1px solid @theme-fore; }
  }
  
</style>