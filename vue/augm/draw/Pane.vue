
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import {ref, nextTick, onMounted, inject, onUnmounted} from "vue";
import D3D  from '../../../pub/augm/show/D3D.js'

let Pane = {

  props: { page:Object },

  setup( props ) {

    const mix  = inject('mix');
    const elem = ref(null);

    const create = () => {
      nextTick( function() {
          props.page.obj = D3D.create( props.page.key, elem['value'], mix ); } ) }

    onMounted( () => {
      if( props.page.show ) {
        create(); } } )

    onUnmounted( () => {
      mix.removeElem( elem['value'], nextTick ) ; } )

    return { elem } }
}

export default Pane;

</script>
