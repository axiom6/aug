
<template>
  <div :class="exp.klass" ref="elem"></div>
</template>

<script type="module">

import {ref, inject, nextTick, onMounted, onBeforeUnmount } from "vue";

let MathExp = {

  props: { exp:Object },

  setup( props ) {

    const nav   = inject('nav')
    const elem  = ref(null);

    const create = () => {
      nav.createElem( "MathExo.create()", elem['value'], nextTick, () => {
        elem['value'].innerHTML = props.exp.mathML; } ); }

     onMounted( () =>  {
       create(); } )

    onBeforeUnmount( () => {
      nav.removeElem( "Math.vue", elem['value'], nextTick ) ; } )

  return { elem } }
}

  export default MathExp;

</script>