
<template>
  <div ref="elem" class="cube-pane"></div>
</template>

<script type="module">
  
  // These imports from CoffeeScipt source files outputs insignificant
  // warning messages for Util Data Cube3D and Rect when this file Cube.vue
  // is compiled by rollup.config.cube.js However the dynamic import of
  // this Cube.vue ends the warning messages. CoffeeScript import of original
  // CoffeeScript does not produce warning messages.
  import Build  from '../../pub/util/Build.js'
  import CubeTh from '../../pub/cube/CubeTh.js'
  import { inject, ref, onMounted, onUnmounted, nextTick } from 'vue';
  
  let Cube = {

    setup() {

      const nav    = inject('nav');
      const elem   = ref(null);
      const build  = new Build(  nav.batch );
      let   cubeTh = {}

      const create = () => {
        nav.createElem( "Cube.create()", elem['value'], nextTick, () => {
          cubeTh = new CubeTh( build, elem['value'], false );
          cubeTh.animate(); } ) }

      onMounted( () => {
        create(); } )

      onUnmounted( () => {
        nav.removeElem( "Cube.onUnmounted()", elem['value'], nextTick ) ; } )
      
    return { elem }; }
  }

  export default Cube;
</script>


<style lang="less">
  .cube-pane { position:absolute; left:0; top:0; width:100%; height:100%; }
</style>