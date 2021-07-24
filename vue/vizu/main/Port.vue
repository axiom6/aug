
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import { ref, inject, nextTick, onMounted, onUnmounted} from "vue";

let Port = {

  props: { page:Object },

  setup( props ) {

    const nav   = inject('nav');
    const main  = inject('main');
    const elem  = ref(null);
    const debug = true;
    if( debug ) { console.log('Port.setup()', { main:main } ); }

    onMounted( () => {
      if( props.page.show ) {
        nextTick( () => {
          let pageKey = props.page.key;
          if( debug ) { console.log('Port.onMounted()', { pageKey:pageKey, opts:nav.opts2(pageKey) } ); }
          if( nav.isDef(nav.opts(pageKey)) ) {
            main.doApp( elem['value'], nav.opts(pageKey), pageKey ); }
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
