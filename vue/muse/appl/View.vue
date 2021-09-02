
<template>
  <div ref="viewElem" class="view-pane">
    <v-home   v-if="show('Comp','Home')"   :key="nav.keyIdx(  'Home',viewIdx)"></v-home>
    <v-prin   v-if="show('Comp','Prin')"   :key="nav.keyIdx(  'Prin',viewIdx)"></v-prin>
    <v-comp   v-if="show('Comp','Comp')"   :key="nav.keyIdx(  'Comp',viewIdx)"></v-comp>
    <v-prac   v-if="show('Prac','Prac')"   :key="nav.keyIdx(  'Prac',viewIdx)"></v-prac>
    <v-disp   v-if="show('Disp','Disp')"   :key="nav.keyIdx(  'Disp',viewIdx)"></v-disp>
    <v-defs   v-if="show('Comp','Defs')"   :key="nav.keyIdx(  'Defs',viewIdx)"></v-defs>
    <v-test   v-if="show('Comp','Test')"   :key="nav.keyIdx(  'Test',viewIdx)"></v-test>
    <v-replay v-if="show('Prac','Replay')" :key="nav.keyIdx('Replay',viewIdx)"></v-replay>
    <v-result v-if="show('Prac','Result')" :key="nav.keyIdx('Result',viewIdx)"></v-result>
  </div>
</template>

<script type="module">

import {inject, ref, onMounted, nextTick } from 'vue';
  import Home   from '../../muse/appl/Home.vue'
  import Prin   from '../../muse/prin/Prin.vue'
  import Comp   from '../../muse/comp/Comp.vue'
  import Prac   from '../../muse/prac/Prac.vue'
  import Disp   from '../../muse/disp/Disp.vue'
  import Defs   from './Defs.vue'
  import Test   from '../../../lib/vue/test/Test.vue'
  import Replay from '../../../lib/vue/test/Replay.vue';
  import Result from '../../../lib/vue/test/Result.vue';
  
  let View = {

    components:{ 'v-home':Home, 'v-prin':Prin, 'v-comp':Comp, 'v-prac':Prac, 'v-disp':Disp,
      'v-defs':Defs, 'v-test':Test, 'v-replay':Replay, 'v-result':Result },

    setup() {
      const nav       = inject('nav');
      const viewIdx   = ref(0);
      const viewElem  = ref(null);
      const compEnums = "|Home|Prin|Defs|Test|"
      const pracEnums = "|Replay|Result|"
      let   level     = 'Comp'
      let   module    = 'Home'
      let   debug     = false
      
      const show = ( levelArg, moduleArg ) => {
        let isShow = level===levelArg && module===moduleArg;
        if( debug ) {
          let keyIdx = nav.keyIdx(module,viewIdx.value);
          console.log( 'View.show()',
            { isShow:isShow, keyIdx:keyIdx, level:level, module:module, levelArg:levelArg, moduleArg:moduleArg } ); }
        return isShow; }

      const onNav = (obj) => {
        level  = obj.level;
        module = obj.level;
        if(      obj.level==='Comp' && nav.inEnums(obj.compKey,compEnums) ) { module = obj.compKey }
        else if( obj.level==='Prac' && nav.inEnums(obj.pracKey,pracEnums) ) { module = obj.pracKey }
        viewIdx.value++;
        if( debug ) { console.log( 'View.onNav()', { level:level, module:module, obj:obj } ); } }

      onMounted( () => {
        nav.mountTouch( "View", viewElem['value'], nextTick, ['view-pane'], ['tabs-pane','tabs-tab'] );
        nav.subscribe(  'View', 'View', (obj) => { onNav(obj); } ); } )

      return { show, viewIdx, viewElem, nav }; }
    }

  export default View

</script>

<style lang="less">

      .view-pane {}
  
</style>

<!--

      const onNav = (obj) => {
        level  = obj.level;
        module = obj.compKey;
        if( nav.inArray(obj.compKey,nav.musePlanes) ) { module = level;       }
        else if( obj.compKey==='Prin'               ) { module = level==='Comp' ? 'Prin' : 'Prac'; }
        else if( level==='Prac'                     ) { module = obj.pracKey; }
        viewIdx.value++;
        if( debug ) { console.log( 'View.onNav()', { level:level, module:module, obj:obj } ); } }

-->



