
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

    const create = () => {
      nav.createElem( "hues/Port.create()", elem['value'], nextTick, () => {
        Box.doApp( props.page.key, elem['value'] ); } ); }

    onMounted( () => {
      if( props.page.show ) {
        create(); } } )

    onUnmounted( () => {
      nav.removeElem( elem['value'], nextTick ) ; } )

    return { elem } }
}

export default Port;

</script>
