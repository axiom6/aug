
<template>
  <div class="dash-pane">
    <d-navd id="navd"></d-navd>
    <d-tocs id="tocs"></d-tocs>
    <d-view id="view"></d-view>
  </div>
</template>

<script type="module">

  import Navd from '../../../lib/vue/dash/Navd.vue';
  import Tocs from '../../../lib/vue/dash/Tocs.vue';
  import View from './View.vue'

  let Dash = {

    components: {'d-navd':Navd, 'd-tocs':Tocs, 'd-view':View },

    setup() {
      // const name = 'dash'
      return {}; }
  }

  export default Dash;

</script>

<style lang="less">

  @import '../../../css/themes/theme.less';

  html { font-size:calc(1em + 1vmin); }
  body { background-color:@theme-back; margin:0; }

  .dash-pane { font-family:@theme-font-family;
            position:absolute; left:0; top:0;                  width:100%;              height:100%; overflow:hidden;
    #navd { position:absolute; left:0; top:0;                  width:@theme-navd-width; height:@theme-navd-height; }
    #tocs { position:absolute; left:0; top:@theme-navd-height; width:@theme-navd-width; height:@theme-view-height; }
    #view { position:absolute; left:@theme-navd-width; top:0;  width:@theme-view-width; height:100%; } }

</style>

