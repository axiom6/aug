
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import { ref, inject, nextTick, onMounted, onUnmounted} from "vue";
import Box from "../../../pub/augm/hues/Box.js";

let Port = {

  props: { page:Object },

  setup( props ) {

    const nav   = inject('nav');
    const elem  = ref(null);

    onMounted( () => {
      if( props.page.show ) {
        nextTick( () => {
          if( nav.isDef(elem['value']) ) {
            Box.doApp( props.page.key, elem['value'] ); }
          else {
            console.error( "Port.onMounted() elem null" ); } } ) } } )

    onUnmounted( () => {
      nav.removeElem( elem['value'], nextTick ) ; } )

    return { elem } }
}

export default Port;

</script>
