
<template>
  <div :class="exp.klass" ref="elem" ></div>
</template>

<script type="module">

import { ref, nextTick, onMounted } from "vue";

let PageExp = {

  props: { exp:Object },

  setup( props ) {

    const elem = ref(null);

    const mathML = function () {
      nextTick( function() {
        elem.value.innerHTML = props.exp.mathML; } ) }

     onMounted( function() {
       mathML(); } )

  return { elem } }
}

  export default PageExp;

</script>