
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

    const mathML = () => {
      nextTick( () =>  {
        if( mix.isDef(elem['value']) ) {
          elem['value'].innerHTML = props.exp.mathML; }
        else {
          console.error( "MathExp.mathML() elem null" ); } } ) }

     onMounted( () =>  {
       mathML(); } )

    onUnmounted( () => {
      mix.removeElem( elem['value'], nextTick ) ; } )

  return { elem } }
}

  export default MathExp;

</script>