
<template>
  <div ref="elem" ></div>
</template>

<script type="module">

import {ref, inject, nextTick, onMounted, onUnmounted} from "vue"; // , inject
import Style   from "../../../pub/augm/geom/lib/Style.js";
import GeomMgr from "../../../pub/augm/geom/lib/GeomMgr.js";

let PageND = {

  props: { page:Object },

  setup( props ) {

    const nav     = inject('nav');
    const elem    = ref(null);
    const geomMgr = new GeomMgr();

    const create = () => {
       nextTick( () => {
         if( nav.isDef(elem['value']) ) {
           window['Geom'][props.page.key] = new Style( elem['value'] );
           props.page.obj = geomMgr.createPageObj(props.page);
           props.page.obj.ga(); }
         else {
           console.error( "PageND.create() elem null" ); } } ) }

    onMounted( () => {
        create(); } )

    onUnmounted( () => {
      nav.removeElem( elem['value'], nextTick ) ; } )

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
      if( nav.isDef(props.page.obj) ) {
        nextTick( () => {
          let dom = elem['value'];
          while( nav.isDef(dom) && nav.isDef(dom.firstChild) ) {
            dom.removeChild(dom.firstChild); } } ) } }


v-if="show"
const show  = ref(false);
show.value = true;
show.value = false;
show,
-->