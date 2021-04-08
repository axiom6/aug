
<template>
   <div class="btn-nice" ref="elem" @click="pubBtn()">{{name}}</div>
</template>

<script type="module">

import { inject, ref, onMounted } from 'vue';

let Btn = {

  props: { name:String },

  setup( props ) {

    const mix  = inject( 'mix' );
    const elem = ref(null);

    const pubBtn = function () {
      mix.publish( { pageKey:props.name } ); }

    onMounted( function () {
      } )

    return { elem, pubBtn }; }

}

export default Btn;

</script>

<style scoped lang="less">

  @import '../../css/base/btn.less';

  .btn-nice { width:200px; height:40px; }

  //@btnFS:1.4*@themeFS;

</style>