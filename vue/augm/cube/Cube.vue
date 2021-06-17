
<template>
  <div id="CubeTh" class="cube-pane"></div>
</template>

<script type="module">
  
  // These imports from CoffeeScipt source files outputs insignificant
  // warning messages for Util Data Cube3D and Rect when this file Cube.vue
  // is compiled by rollup.config.cube.js However the dynamic import of
  // this Cube.vue ends the warning messages. CoffeeScript import of original
  // CoffeeScript does not produce warning messages.
  import Build  from '../../../lib/pub/base/util/Build.js'
  import CubeTh from '../../../pub/augm/cube/CubeTh.js'
  import { inject, onMounted, onUnmounted, nextTick } from 'vue';
  
  let Cube = {

    setup() {

      const mix    = inject('mix');
      const build  = new Build(  mix.batch() );
      let   cubeTh = {}

      onMounted( () => {
        cubeTh = new CubeTh( build, "CubeTh", false );
        cubeTh.animate(); } )

      onUnmounted( () => {
        mix.removeElem( cubeTh.parElem, nextTick ) ; } )
      
    return {}; }
  }

  export default Cube;
</script>


<style lang="less">
  .cube-pane { position:absolute; left:0; top:0; width:100%; height:100%; }
</style>