
<template>
  <div id="CubeTh" ref="elem" class="cube-pane"></div>
</template>

<script type="module">

  import MuseTh from '../../../pub/vizu/cube/MuseTh.js'
  import { inject, ref, onMounted, nextTick } from 'vue';
  
  let Cube = {

    setup() {

      const main   = inject('main');
      const elem   = ref(null)
      let   museTh = {}

      onMounted( () => {
        nextTick(  () => {
          main.doApp( elem['value'], main.nav.opts('Cube'), Cube );
          museTh = new MuseTh( main );
          museTh.animate(); } )  } )

    return { elem }; }
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
        //mix.removeElem( elem['value'] );
        } ) } )
-->