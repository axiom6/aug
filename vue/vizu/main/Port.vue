
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

    // Still too complicated even with nav.createElem(...)
    const create = () => {
      nav.createElem( "main/Port.create()", elem['value'], nextTick, () => {
        let pageKey = props.page.key;
        if( debug ) { console.log('Port.onMounted()', { pageKey:pageKey, opts:nav.opts(pageKey) } ); }
        if( nav.isDef(nav.opts(pageKey)) ) {
          main.doApp( elem['value'], nav.opts(pageKey), pageKey ); }
        else {
          console.log( 'Port.create() Main app not implemented', pageKey ); } } ) }

    onMounted(  () => {
      create(); } )

    onUnmounted( () => {
      nav.removeElem( "main/Port.vue", elem['value'], nextTick, () => {
        /* main.dispose(); */ } ) } )


    return { elem } }
}

export default Port;

</script>
