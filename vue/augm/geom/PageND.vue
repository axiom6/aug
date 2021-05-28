
<template>
  <div ref="elem" ></div>
</template>

<script type="module">

import {ref, inject, nextTick, onMounted, onUnmounted} from "vue"; // , inject
import Style from "../../../pub/augm/geom/lib/Style.js";

let PageND = {

  props: { page:Object },

  setup( props ) {

    const mix   = inject('mix');
    const elem  = ref(null);

    const create = () => {
       nextTick( () => {
         window['Geom'][props.page.key] = new Style( elem['value'] );
         props.page.obj.ga(); } ) }

    onMounted( () => {
      create(); } )

    onUnmounted( () => {
      mix.removeElem( elem['value'], nextTick ) ; } )

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
    const remove = () => {
      if( mix.isDef(props.page.obj) ) {
        nextTick( () => {
          let dom = elem['value'];
          while( mix.isDef(dom) && mix.isDef(dom.firstChild) ) {
            dom.removeChild(dom.firstChild); } } ) } }


v-if="show"
const show  = ref(false);
show.value = true;
show.value = false;
show,
-->