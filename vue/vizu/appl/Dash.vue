
<template>
  <div class="dash-pane">
    <d-navd id="navd"></d-navd>
    <d-tocs id="tocs"></d-tocs>
    <d-view id="view" :style="viewStyle(showSide)"></d-view>
    <d-side v-if="showSide"></d-side>
    <div class="side-icon" @click="doSideBar()"><i class="fa fas fa-list-ul"></i></div>
  </div>
</template>

<script type="module">

  import Navd from '../../../lib/vue/dash/Navd.vue';
  import Tocs from '../../../lib/vue/dash/Tocs.vue';
  import View from './View.vue'
  import Side from './Side.vue';
  import { inject, ref, onMounted } from 'vue';

  let Dash = {

    components: {'d-navd':Navd, 'd-tocs':Tocs, 'd-view':View, 'd-side':Side },

    setup() {

      const nav       = inject('nav');
      const showSide  = ref(false);

      const doSideBar = () => {
        showSide.value = !showSide.value; }

      const viewStyle = ( showSide ) => {
        let viewWidth  =  showSide ? "78%" : "88%"
        return `width:${viewWidth};`; }

      const onVizu =  (obj) => {
        console.log( "Dash.onVisu()", obj ); }

      onMounted( () => {
        nav.subscribe('Vizu', 'Dash', (obj) => { onVizu(obj); } ); } )

      return { viewStyle, showSide, doSideBar }; }
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
    #tocs { position:absolute; left:0; top:@theme-navd-height;                          height:@theme-view-height; }
    #view { position:absolute; left:@theme-navd-width; top:0;  width:@theme-view-width; height:100%; }
    .side-icon { position:absolute; left:97%; top:2%; width:  3%; height:  3%; justify-self:center; align-self:center;
                 color:@theme-fore; }
     }

</style>

