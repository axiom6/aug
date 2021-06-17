
<template>
  <div class="view-pane">
    <v-home   v-if="show('Comp','Home')"   :key="viewIdx"></v-home>
    <v-prin   v-if="show('Comp','Prin')"   :key="viewIdx"></v-prin>
    <v-comp   v-if="show('Comp','Comp')"   :key="viewIdx"></v-comp>
    <v-prac   v-if="show('Prac','Prac')"   :key="viewIdx"></v-prac>
    <v-disp   v-if="show('Disp','Disp')"   :key="viewIdx"></v-disp>
    <v-defs   v-if="show('Comp','Defs')"   :key="viewIdx"></v-defs>
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
  import Defs   from './Defs.vue'
  import Test   from '../../../lib/vue/base/test/Test.vue'
  import Replay from '../../../lib/vue/base/test/Replay.vue';
  import Result from '../../../lib/vue/base/test/Result.vue';
  
  let View = {

    components:{ 'v-home':Home, 'v-prin':Prin, 'v-comp':Comp, 'v-prac':Prac, 'v-disp':Disp,
      'v-defs':Defs, 'v-test':Test, 'v-replay':Replay, 'v-result':Result },

    setup() {
      const mix     = inject('mix');
      const nav     = inject('nav');
      const viewIdx = ref(0);
      let   level   = 'Comp'
      let   module  = 'Home'
      let   debug   = false

      const show = ( levelArg, moduleArg ) => {
        let isShow = level===levelArg && module===moduleArg;
        if( debug ) { console.log( 'View.show()',
            { isShow:isShow, level:level, module:module, levelArg:levelArg, moduleArg:moduleArg } ); }
        return isShow; }

      const onNav = (obj) => {
        level  = obj.level;
        module = obj.compKey;
        if( mix.inArray(obj.compKey,nav.musePlanes) ) { module = level;       }
        else if( obj.compKey==='Prin'               ) { module = level==='Comp' ? 'Prin' : 'Prac'; }
        else if( level==='Prac'                     ) { module = obj.pracKey; }
        viewIdx.value++;
        if( debug ) { console.log( 'View.onNav()', { level:level, module:module, obj:obj } ); } }

      onMounted( () => {
        mix.subscribe('View', 'View', (obj) => { onNav(obj); } ); } )

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



