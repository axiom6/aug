
<template>
  <div class="view-pane">
    <v-home   v-if="show('Comp','Home')"   :key="viewIdx"></v-home>
    <v-prin   v-if="show('Comp','Prin')"   :key="viewIdx"></v-prin>
    <v-comp   v-if="show('Comp','Comp')"   :key="viewIdx"></v-comp>
    <v-prac   v-if="show('Prac','Prac')"   :key="viewIdx"></v-prac>
    <v-disp   v-if="show('Disp','Disp')"   :key="viewIdx"></v-disp>
    <v-cube   v-if="show('Comp','Cube')"   :key="viewIdx"></v-cube>
    <v-test   v-if="show('Comp','Test')"   :key="viewIdx"></v-test>
    <v-replay v-if="show('Prac','Replay')" :key="viewIdx"></v-replay>
    <v-result v-if="show('Prac','Result')" :key="viewIdx"></v-result>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';
  import Home   from '../../muse/appl/Home.vue'
  import Prin   from '../../muse/prin/Prin.vue'
  import Comp   from '../../muse/comp/Comp.vue'
  import Prac   from '../../muse/prac/Prac.vue'
  import Disp   from '../../muse/disp/Disp.vue'
  import Cube   from '../../muse/comp/Cube.vue'
  import Test   from '../../base/test/Test.vue'
  import Replay from '../../base/test/Replay.vue';
  import Result from '../../base/test/Result.vue';
  
  let View = {

    components:{ 'v-home':Home, 'v-prin':Prin, 'v-comp':Comp, 'v-prac':Prac, 'v-disp':Disp,
      'v-cube':Cube, 'v-test':Test, 'v-replay':Replay, 'v-result':Result },

    setup() {
      const mix     = inject('mix');
      const nav     = inject('nav');
      const viewIdx = ref(0);
      let   level   = 'Comp'
      let   module  = 'Home'
      let   debug   = true

      const show = ( levelArg, moduleArg ) => {

        return level===levelArg && module===moduleArg; }

      const onNav = (obj) => {
        level = obj.level;
        if( level==='Prac' ) {
          module = obj.compKey==='Prac' ? 'Prac' : obj.pracKey; }
        else {
          module = nav.inArray(obj.compKey,nav.musePlanes) ? level : obj.compKey; }
        viewIdx.value++;
        if( debug ) { console.log( 'View.onNav()', { level:level, module:module } ); } }

      onMounted( () => {
        mix.subscribe('Nav', 'View', (obj) => { onNav(obj); } ); } )

      return { show, viewIdx }; }
    }

  export default View

</script>

<style lang="less">

      .view-pane {}
  
</style>

<!--

if( debug ) { console.log( 'View.show()', { level:level, module:module } ); }

-->



