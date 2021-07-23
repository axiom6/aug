
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import { ref, inject, nextTick, onMounted, onUnmounted} from "vue";
import Main from "../../../pub/vizu/main/Main.js";

let Port = {

  props: { page:Object },

  setup( props ) {

    const nav   = inject('nav');
    const elem  = ref(null);
    const main  = new Main( nav.stream, nav )
    const debug = true;
    if( debug ) { console.log('Port.setup()', { main:main } ); }

    onMounted( () => {
      if( props.page.show ) {
        nextTick( () => {
          let pageKey = props.page.key;
          if( debug ) { console.log('Port.onMounted()', { pageKey:pageKey, opts:nav.opts2(pageKey) } ); }
          if( nav.isDef(nav.opts2(pageKey)) ) {
            main.doApp( elem['value'], nav.opts2(pageKey), pageKey ); }
           else {
             console.log( 'Port.onMounted() Main app not implemented', pageKey ); } } ) } } )

    onUnmounted( () => {
      nextTick(  () => {
        main.dispose();
        nav.removeElem( elem['value'] ); } ) } )

    return { elem } }
}

export default Port;

</script>
