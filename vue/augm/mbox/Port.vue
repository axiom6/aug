
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import { ref, inject, nextTick, onMounted, onUnmounted} from "vue";
import Box from "../../../pub/augm/mbox/Box.js";

let Port = {

  props: { page:Object },

  setup( props ) {

    const mix  = inject('mix');
    const elem = ref(null);

    const doApp = function( pageKey ) {
      nextTick( function() {
          Box.doApp( pageKey, elem['value'] ); } ) }

    onMounted( function() {
      if(      props.page.show ) {
        doApp( props.page.key  ); } } )

    onUnmounted( () => {
      mix.removeElem( elem['value'], nextTick ) ; } )

    return { elem } }
}

export default Port;

</script>
