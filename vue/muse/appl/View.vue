
<template>
  <div class="view-pane">
    <v-home v-if="show('Comp','Home')" :key="viewIdx"></v-home>
    <v-prin v-if="show('Comp','Prin')" :key="viewIdx"></v-prin>
    <v-comp v-if="show('Comp','Comp')" :key="viewIdx"></v-comp>
    <v-prac v-if="show('Prac','Prac')" :key="viewIdx"></v-prac>
    <v-disp v-if="show('Disp','Disp')" :key="viewIdx"></v-disp>
    <v-cube v-if="show('Comp','Cube')" :key="viewIdx"></v-cube>
    <v-test v-if="show('Comp','Test')" :key="viewIdx"></v-test>
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
//import Replay from '../../base/test/Replay.vue';
//import Result from '../../base/test/Result.vue';
  
  let View = {

    components:{ 'v-home':Home, 'v-prin':Prin, 'v-comp':Comp, 'v-prac':Prac, 'v-disp':Disp, 'v-cube':Cube, 'v-test':Test },

    setup() {
      const mix     = inject('mix');
      const nav     = inject('nav');
      const viewIdx = ref(0);
      let   level   = 'Comp'
      let   compKey = 'Home'
      let   debug   = false

      const show =  (levelArg,compArg) => {
        if( debug ) { console.log( 'View.show()', { level:level, compKey:compKey } ); }
        return level===levelArg && compKey===compArg; }

      const onNav = (obj) => {
        level   = obj.level;
        compKey = nav.inArray(obj.compKey,nav.musePlanes) ? level : obj.compKey;
        viewIdx.value++;
        if( debug ) { console.log( 'View.onNav()', { level:level, compKey:compKey } ); } }

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

<router-view :name="view"></router-view>

<router-view :key="$route.fullPath" />

const rviews = mix.routeNames();

   // const elem   = null;

import { inject, onMounted, nextTick } from 'vue';
      onMounted( function () {
        nextTick( function() {  // Enable touch events inside all views
        } ) } )

   // const show = function() {
   //   return this.$route.name===null }

<template>


  <div class="view-pane" ref="View">
    <router-view name="Home"></router-view>
    <router-view name="Prin"></router-view>
    <router-view name="Info"></router-view>
    <router-view name="Know"></router-view>
    <router-view name="Wise"></router-view>
    <router-view name="Cube"></router-view>
    <router-view name="Team"></router-view>
  </div>
</template>
-->



