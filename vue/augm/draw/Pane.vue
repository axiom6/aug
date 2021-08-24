
<template>
  <div ref="elem"></div>
</template>

<script type="module">

  import { ref, nextTick, onMounted, inject, onBeforeUnmount } from "vue";
  import D3D from "../../../pub/augm/show/D3D.js"


  let Pane = {
  
    props: { page:Object },

    setup( props ) {

      const nav  = inject('nav');
      const elem = ref(null);

      const create = () => {
        nav.createElem( "draw/Pane.create()", elem['value'], nextTick, () => {
            props.page.obj = D3D.create( props.page.key, elem['value'], nav ); } ); }

      onMounted( () => {
         create();  } )

      onBeforeUnmount( () => {
        nav.removeElem( "draw/Pane.vue", elem['value'], nextTick ) ; } )

      return { elem } }
  }

  export default Pane;

</script>

<!--
    const create2 = () => {
      nextTick( function() {
        if( nav.isDef(elem['value']) ) {
          props.page.obj = D3D.create( props.page.key, elem['value'], nav ); }
        else {
          console.error( "draw/Pane.create() elem null" ); } } ) }
-->
