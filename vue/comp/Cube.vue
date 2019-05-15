
<template>
  <div id="CubeTh" class="cube">
  </div>
</template>

<script type="module">
  
  // These imports from CoffeeScipt source files outputs insignificant
  // warning messages for Util Data Cube3D and Rect when this file Cube.vue
  // is compiled by rollup.config.cube.js However the dynamic import of
  // this Cube.vue ends the warning messages. CoffeeScript import of original
  // CoffeeScript does not produce warning messages.
  import Build  from '../../pub/ikw/cube/Build.js'
  import CubeTh from '../../pub/ikw/cube/CubeTh.js'
  
  export default {
    
    data() {
      return { build:{}, cubeTh:{} }; },
    
    mounted: function () {
      this.build  = new Build(  this.batch() );
      this.cubeTh = new CubeTh( this.build, "CubeTh", false );
      this.cubeTh.animate(); } }
      
</script>

<style lang="less">
  .cube {}
</style>