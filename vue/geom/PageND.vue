
<template>
  <div v-if="show" :class="'page-nd-pane'" ref="elem" ></div>
</template>

<script type="module">

import { ref, nextTick, onMounted, inject } from "vue";
import Style from "../../src/geom/Style.js";

let PageND = {

  props: { page:Object },

  setup( props ) {

    const mix  = inject('mix');
    const show = ref(false);
    const elem = ref(null );

    const create = function() {
       nextTick( function() {
         window['Geom'][props.page.key] = new Style( elem.value );
         props.page.obj.ga(); } ) }

    const remove = function() {
      nextTick( function() {
        while( mix.isDef(elem.value) && mix.isDef(elem.value.firstChild) ) {
          elem.value.removeChild(elem.value.firstChild); } } ) }

    const onNav = function(obj) {
      console.log( 'PageND.onNav()', { key:props.page.key }, obj );
      if( props.page.key === obj.pageKey ) {
        show.value = true;
        create(); }
       else {
         show.value = false;
         remove(); } }

    onMounted( function () {
      console.log( 'PageND.onMounted()' );
      mix.subscribe( 'Nav', 'PageND.vue'+props.page.key, (obj) => {
        onNav(obj); } ) } )

    return { show, elem }; }
}

export default PageND;

</script>

<style lang="less">

@import '../../css/themes/theme.less';

@pageNDFS:@themeFS;

.page-nd-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; font-size:@pageNDFS; }

</style>