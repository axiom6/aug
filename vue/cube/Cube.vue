
<template>
  <div id="CubeTh" class="cube-pane"></div>
</template>

<script type="module">
  
  // These imports from CoffeeScipt source files outputs insignificant
  // warning messages for Util Data Cube3D and Rect when this file Cube.vue
  // is compiled by rollup.config.cube.js However the dynamic import of
  // this Cube.vue ends the warning messages. CoffeeScript import of original
  // CoffeeScript does not produce warning messages.
  import Build  from '../../pub/base/util/Build.js'
  import CubeTh from '../../pub/math/cube/CubeTh.js'
  import { inject } from 'vue';
  
  export default {
    
    data() {
      return { build:{}, cubeTh:{} }; },
    
    mounted: function () {
      this.build  = new Build(  this.mix.batch() );
      this.cubeTh = new CubeTh( this.build, "CubeTh", false );
      this.cubeTh.animate(); } }
      
</script>

<style lang="less">
  .cube-pane { position:absolute; left:0; top:0; width:100%; height:100%; }
</style>