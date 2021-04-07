
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import { ref, nextTick, onMounted } from "vue";
import Box from "../../pub/math/mbox/Box";

let Port = {

  props: { page:Object },

  setup( props ) {

    const elem = ref(null);

    const doApp = function( pageKey ) {
      nextTick( function() {
          Box.doApp( pageKey, elem.value ); } ) }

    onMounted( function() {
      if(      props.page.show ) {
        doApp( props.page.key  ); } } )

    return { elem } }
}

export default Port;

</script>
