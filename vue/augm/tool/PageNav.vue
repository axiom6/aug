
<template>
  <div :class="'tool-page-pane'" >
    <t-gauge v-if="show('Gauge')"></t-gauge>
    <t-dnd   v-if="show('DnD')"  ></t-dnd>
  </div>
</template>

<script type="module">

import { ref,onMounted, inject } from "vue";
import Gauge from './Gauge.vue';
import DnD   from './DnD.vue';

let Page = {

  props: { page:Object },

  components: { 't-gauge':Gauge, 't-dnd':DnD },

  setup( props ) {

    const mix     = inject('mix');
    const pageKey = ref('None');
    const debug   = true;

    const onNav = (obj) => {
      if( mix.inArray(obj.pageKey,['Gauge','DnD'] ) ) {
        pageKey.value = obj.pageKey;
        if( debug ) { console.log( 'Page.onNav()', { pageKey:pageKey.value, obj:obj } ); } } }

    const show = (name) => {
      if( debug ) { console.log( 'Page.show()', { name:name, pageKey:pageKey.value } ); }
      return name === pageKey.value }

    onMounted(  () => {
      if( debug ) { console.log( 'Page.onMounted()', props.page.key ); }
      mix.subscribe( 'Nav', 'ToolPage'+props.page.key, (obj) => {
        onNav(obj); } ) } )

    return { show }; }
}

export default Page;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

@pageNDFS:@themeFS;

.tool-page-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; font-size:@pageNDFS; }

</style>