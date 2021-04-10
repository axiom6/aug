
<template>
  <div   class="navb-rect" @click="doRoute()">
    <div class="navb-name">{{title}}</div>
  </div>
</template>

<script type="module">

  import { inject } from "vue";

  let Navb = {

    props: { title:String, route:String },

    setup( props ) {

      const nav     = inject('nav');

      const doRoute = function () {
        nav.doRoute( { route:props.route } ); }

    return { doRoute }; }
  }

export default Navb;

</script>

<style lang="less">

  @import '../../../css/themes/theme.less';

  .navb-rect { justify-self:center; align-self:center; width:85%; height:85%;
    border-radius:16px; font-family:@theme-font-family; .theme-btns; display:grid; }
  .navb-name { justify-self:center; align-self:center; font-size:195%; }

</style>