
<template>
  <div class="flavor" :ref="name"></div>
</template>

<script type="module">

  import Drew    from '../../pub/base/d3d/Drew.js' ;
  import Wheel   from '../../pub/base/d3d/Wheel.js' ;
  import * as d3 from '../../pub/lib/d3/d3.5.9.0.esm.js';

  let Flavor = {

    data() { return { name:'Flavor', wheel:null } },
    
    methods: {
      
      calcSize: function(elem) { // Should only be called within $nextTick()
        let sz        = {}
        sz.elemWidth  = elem['clientWidth' ];
        sz.elemHeight = elem['clientHeight'];
        sz.elem       = elem;
        sz.name       = this.name;
        return sz; }
    },

    mounted: function () {
      this.$nextTick( function() {
        let elem   = this.$refs[this.name];
        let size   = this.calcSize( elem );
        let drew   = new Drew(  this.stream(), elem, size );
        this.wheel = new Wheel( drew, d3, this.name, elem, size ); } ) }

  }
  
  export default Flavor;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .flavor { justify-items:center; align-items:center; text-align:center; display:grid;
            position:absolute; left:0; top:0; right:0; bottom:0;
            background-color:@theme-back; color:@theme-color; }
  
</style>