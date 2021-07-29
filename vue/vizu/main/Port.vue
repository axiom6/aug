
<template>
  <div ref="elem"></div>
</template>

<script type="module">

import { ref, inject, nextTick, onMounted } from "vue";

let Port = {

  props: { compKey:String, page:Object },

  setup( props ) {

    const nav   = inject('nav');
    const main  = inject('main');
    const elem  = ref(null);
    const debug = false;
    if( debug ) { console.log('Port.setup()', { main:main } ); }

    // Still too complicated even with nav.createElem(...)
    const create = () => {
      nav.createElem( "main/Port.create()", elem['value'], nextTick, () => {
        let pageKey = props.page.key;
        if( debug ) { console.log('Port.onMounted()', { pageKey:pageKey, opts:nav.opts(pageKey) } ); }
        if( props.compKey === "Hues" ) {
          main.doApp( elem['value'], nav.opts(props.compKey), props.compKey, pageKey ); }
        else if( nav.isDef(nav.opts(pageKey)) ) {
          main.doApp( elem['value'], nav.opts(pageKey),       props.compKey, pageKey ); }
        else {
          console.log( 'Port.create() not implemented',       props.compKey, pageKey ); } } ) }

    onMounted(  () => {
      create(); } )

    return { elem } }
}

export default Port;

</script>

<!--
    onUnmounted( () => {
      nav.removeElem( "main/Port.vue", elem['value'], nextTick, () => {
         main.dispose();  } ) } )
-->
