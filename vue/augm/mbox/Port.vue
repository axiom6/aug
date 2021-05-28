
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import { ref, inject, nextTick, onMounted, onUnmounted} from "vue";
import Box from "../../../pub/augm/mbox/Box.js";

let Port = {

  props: { page:Object },

  setup( props ) {

    const mix   = inject('mix');
    const elem  = ref(null);
    const debug = false;

    onMounted( () => {
      if( props.page.show ) {
        nextTick( () => {
          if(debug) { console.log( 'Port.onMounted', props.page ); }
          Box.doApp( props.page.key, elem['value'] ); } ) } } )

    onUnmounted( () => {
      mix.removeElem( elem['value'], nextTick ) ; } )

    return { elem } }
}

export default Port;

</script>
