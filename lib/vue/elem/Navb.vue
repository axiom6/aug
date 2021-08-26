
<template>
  <div   class="navb-rect" @click="doComp()">
    <div class="navb-name">{{title}}</div>
  </div>
</template>

<script type="module">

  import { inject } from "vue";

  let Navb = {

    props: { title:String, compKey:String },

    setup( props ) {

      const nav     = inject('nav');

      const doComp = function () {
        nav.pub( { compKey:props.compKey } ); }

    return { doComp }; }
  }

export default Navb;

</script>

<style lang="less">

  @import '../../css/themes/theme.less';

  @navbFS:2.0*@themeFS;

  .navb-rect { justify-self:center; align-self:center; width:85%; height:85%;
    border-radius:16px; font-family:@theme-font-family; .theme-btns; display:grid; }
  .navb-name { justify-self:center; align-self:center; font-size:@navbFS; }

</style>