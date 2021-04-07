
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import {ref, nextTick, onMounted, inject} from "vue";
import D3D  from '../../pub/draw/show/D3D.js'

let Pane = {

  props: { page:Object },

  setup( props ) {

    const mix  = inject('mix');
    const elem = ref(null);

    const create =function() {
      nextTick( function() {
          props.page.obj = D3D.create( props.page.key, elem.value, mix ); } ) }

    onMounted( function() {
      if( props.page.show ) {
        create(); } } )

    return { elem } }
}

export default Pane;

</script>
