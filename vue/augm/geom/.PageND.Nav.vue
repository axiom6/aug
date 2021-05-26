
<template>
  <div ref="elem" ></div>
</template>

<script type="module">

import { ref, nextTick, onMounted, inject } from "vue";
import Style from "../../../pub/augm/geom/lib/Style.js";

let PageND = {

  props: { page:Object },

  setup( props ) {

    const mix   = inject('mix');

    const elem  = ref(null );
    const debug = true;

    const create = () => {
       nextTick( () => {
         window['Geom'][props.page.key] = new Style( elem['value'] );
         props.page.obj.ga(); } ) }

    const remove = () => {
      if( mix.isDef(props.page.obj) )
      nextTick( () => {
        let dom = elem['value'];
        while( mix.isDef(dom) && mix.isDef(dom.firstChild) ) {
          dom.removeChild(dom.firstChild); } } ) }

    const onNav = (obj) => {
      if( debug ) { console.log( 'PageND.onNav()', { key:props.page.key }, obj ); }
      if( props.page.key === obj.pageKey ) { create(); }
      else                                 { remove(); } }

    onMounted( () => {
      if( debug ) { console.log( 'PageND.onMounted()', { page:props.page } ); }
      mix.subscribe( 'Nav', 'PageND'+props.page.key, (obj) => {
        onNav(obj); } ) } )

    return { elem }; }
}

export default PageND;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

@pageNDFS:@themeFS;

.page-nd-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; font-size:@pageNDFS; }

</style>

<!--
v-if="show"
const show  = ref(false);
show.value = true;
show.value = false;
show,
-->