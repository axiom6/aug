
<template>
  <div :class="'tool-page-pane'" >
    <t-gauge v-if="show('Gauge')"></t-gauge>
    <t-trip  v-if="show('Trip')"></t-trip>
    <t-dnd   v-if="show('DnD')"></t-dnd>
  </div>
</template>

<script type="module">

import Gauge from './Gauge.vue';
import Trip  from './Trip.vue';
import DnD   from './DnD.vue';

let Page = {

  props: { page:Object },

  components: { 't-gauge':Gauge, 't-trip':Trip, 't-dnd':DnD },

  setup( props ) {

    const debug = false;

    const show = (name) => {
      if( debug ) { console.log( 'Page.show()', { name:name, pageKey:props.page.key } ); }
      return name === props.page.key }

    return { show }; }
}

export default Page;

</script>

<style lang="less">

@import '../../../lib/css/themes/theme.less';

@pageNDFS:@themeFS;

.tool-page-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; font-size:@pageNDFS; }

</style>