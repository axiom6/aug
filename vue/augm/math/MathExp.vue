
<template>
  <div :class="exp.klass" ref="elem"></div>
</template>

<script type="module">

import { ref, inject, nextTick, onMounted, onUnmounted} from "vue";

let MathExp = {

  props: { exp:Object },

  setup( props ) {

    const mix   = inject('mix')
    const elem  = ref(null);
    const debug = false;

    const mathML = () => {
      nextTick( () =>  {
        if( debug ) { console.log( 'PageExp.mathMl()'   ); } // , props.exp.mathML
        elem['value'].innerHTML = props.exp.mathML; } ) }

     onMounted( () =>  {
       if( debug ) { console.log( 'PageExp.onMounted()' ); }  // , props.exp.mathML
       mathML(); } )

    onUnmounted( () => {
      mix.removeElem( elem['value'], nextTick ) ; } )

  return { elem } }
}

  export default MathExp;

</script>