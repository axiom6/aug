
<template>
  <div :class="exp.klass" ref="elem"></div>
</template>

<script type="module">

import { ref, nextTick, onMounted } from "vue";

let MathExp = {

  props: { exp:Object },

  setup( props ) {

    const elem = ref(null);
    const debug = false;

    const mathML = () => {
      nextTick( () =>  {
        if( debug ) { console.log( 'PageExp.mathMl()'   ); } // , props.exp.mathML
        elem['value'].innerHTML = props.exp.mathML; } ) }

     onMounted( () =>  {
       if( debug ) { console.log( 'PageExp.onMounted()' ); }  // , props.exp.mathML
       mathML(); } )

  return { elem } }
}

  export default MathExp;

</script>