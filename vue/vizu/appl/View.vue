
<template>
  <div class="view-pane">
    <v-home     v-if="show('Home')"   :key="nav.keyIdx(  'Home',viewIdx)"></v-home>
    <v-main     v-if="show('Main')"   :key="nav.keyIdx(  'Main',viewIdx)"></v-main>
    <v-hues     v-if="show('Hues')"   :key="nav.keyIdx(  'Hues',viewIdx)"></v-hues>
    <v-cube     v-if="show('Cube')"   :key="nav.keyIdx(  'Cube',viewIdx)"></v-cube>
    <v-spot     v-if="show('Spot')"   :key="nav.keyIdx(  'Spot',viewIdx)"></v-spot>
    <v-test     v-if="show('Test')"   :key="nav.keyIdx(  'Test',viewIdx)"></v-test>
    <v-replay   v-if="show('Replay')" :key="nav.keyIdx('Replay',viewIdx)"></v-replay>
    <v-result   v-if="show('Result')" :key="nav.keyIdx('Result',viewIdx)"></v-result>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';
  import Home     from './Home.vue'
  import Main     from '../main/Main.vue';
  import Hues     from '../main/Hues.vue';
  import Spot     from '../main/Spot.vue';
  import Cube     from '../../../lib/vue/cube/Cube.vue';
  import Test     from '../../../lib/vue/test/Test.vue';
  import Replay   from '../../../lib/vue/test/Replay.vue';
  import Result   from '../../../lib/vue/test/Result.vue';
  
  let View = {

    components:{ 'v-home':Home, 'v-cube':Cube, 'v-spot':Spot, 'v-main':Main, 'v-hues':Hues,
      'v-test':Test, 'v-replay':Replay, 'v-result':Result },

    setup() {
      const nav     = inject('nav');
      const viewIdx = ref(0);
      let   module  = 'Home'
      let   debug   = false

      const show = ( moduleArg ) => {
        let isShow = module===moduleArg;
        if( debug ) { console.log( 'View.show()',
            { isShow:isShow, module:module, moduleArg:moduleArg } ); }
        return isShow; }

      const onNav = (obj) => {
        module = obj.level==='Comp' ? obj.compKey : obj.pracKey;
        viewIdx.value++;
        if( debug ) { console.log( 'View.onNav()', { module:module, obj:obj } ); } }

      onMounted( () => {
        nav.subscribe('View', 'View', (obj) => { onNav(obj); } ); } )

      return { show, viewIdx, nav }; }
    }

  export default View

</script>

<style lang="less">

      .view-pane {}
  
</style>




