
<template>
  <div id="CubeTh" class="cube-pane"></div>
</template>

<script type="module">

  import Build  from '../../../lib/pub/util/Build.js'
  import CubeTh from '../../../pub/augm/cube/CubeTh.js'
  import { inject, onMounted, nextTick } from 'vue';
  
  let Cube = {

    setup() {

      const nav    = inject('nav');
      const build  = new Build(  nav.batch() );
      let   cubeTh = {}

      onMounted( () => {
        nextTick(  () => {
          cubeTh = new CubeTh( build, "CubeTh", false, nav );
          cubeTh.animate(); } )  } )


      
    return {}; }
  }

  export default Cube;
</script>


<style lang="less">
  .cube-pane { position:absolute; left:0; top:0; width:100%; height:100%; }
</style>

<!--
      onUnmounted( () => {
        nextTick(  () => {
        //cubeTh.dispose();
        //nav.removeElem( elem['value'] );
        } ) } )
-->