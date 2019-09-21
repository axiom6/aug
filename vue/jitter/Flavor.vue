
<template>
  <div class="flavor">
    <div class="csumm"><h-summ :name="name" ></h-summ></div>
    <div class="wheel" :ref="name"></div>
  </div>
</template>

<script type="module">

  import Summ    from './Summ.vue';
  import SvgMgr  from '../../pub/base/vue/SvgMgr.js';
  import Wheel   from '../../pub/base/vue/Wheel.js' ;
  import * as d3 from '../../pub/lib/d3/d3.5.9.0.esm.js';

  let Flavor = {

    components:{ 'h-summ':Summ },

    data() { return { name:'Flavor', svgMgr:null, wheel:null } },
    
    methods: {

      onChoice: function ( choice, roast ) {
        this.choose(  this.name, choice );
        if( roast===false ) {}
        // console.log( 'Flavor.onChoice()', { name:this.name, choice:choice, roast:roast } );
        this.publish( this.name, choice ); },

      // Should only be called within $nextTick()
      calcSize: function(elem) {
        let sz        = {}
        sz.elemWidth  = elem['clientWidth' ];
        sz.elemHeight = elem['clientHeight'];
        sz.elem       = elem;
        sz.name       = this.name;
        return sz; }
    },

    mounted: function () {
      this.$nextTick( function() {
        let elem    = this.$refs[this.name];
        let size    = this.calcSize( elem );
        this.svgMgr = new SvgMgr( this.name, elem, size, d3 );
        this.wheel  = new Wheel(  this.svgMgr, this.onChoice ); } ) }

  }
  
  export default Flavor;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .flavor { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-color;

    .csumm { position:absolute; left:0; top:0;   width:100%; height:15%; }
    
    .wheel { position:absolute; left:0; top:15%; width:100%; height:85%;
      .themeCenterItems(); background-color:@theme-back; color:@theme-color; border:1px solid @theme-color; }
  }
  
</style>