
<template>
  <div ref="viewElem" class="view-pane">
    <v-home     v-if="show('Home')"   :key="viewIdx"></v-home>
    <v-math     v-if="show('Math')"   :key="viewIdx"></v-math>
    <v-mathEQ   v-if="show('MathEQ')" :key="viewIdx" :pracKey="'MathEQ'"></v-mathEQ>
    <v-mathML   v-if="show('MathML')" :key="viewIdx" :pracKey="'MathML'"></v-mathML>
    <v-draw     v-if="show('Draw')"   :key="viewIdx"></v-draw>
    <v-tool     v-if="show('Tool')"   :key="viewIdx"></v-tool>
    <v-toolND   v-if="show('Gauges')" :key="viewIdx" :pracKey="'Gauges'"></v-toolND>
    <v-toolND   v-if="show('Widget')" :key="viewIdx" :pracKey="'Widget'"></v-toolND>
    <v-wood     v-if="show('Wood')"   :key="viewIdx"></v-wood>
    <v-geom     v-if="show('Geom')"   :key="viewIdx"></v-geom>
    <v-geom2D   v-if="show('Geom2D')" :key="viewIdx" :pracKey="'Geom2D'"></v-geom2D>
    <v-geom3D   v-if="show('Geom3D')" :key="viewIdx" :pracKey="'Geom3D'"></v-geom3D>
    <v-test     v-if="show('Test')"   :key="viewIdx"></v-test>
    <v-replay   v-if="show('Replay')" :key="viewIdx"></v-replay>
    <v-result   v-if="show('Result')" :key="viewIdx"></v-result>
  </div>
</template>

<script type="module">

import {inject, ref, onMounted, nextTick} from 'vue';
  import Home     from './Home.vue'
  import Math     from '../math/Math.vue';
  import MathND   from '../math/MathND.vue';
  import Draw     from '../draw/Draw.vue';
  import Tool     from '../tool/Tool.vue';
  import ToolND   from '../tool/ToolND.vue';
  import Wood     from '../wood/Wood.vue';
  import Geom     from '../geom/Geom.vue';
  import GeomND   from '../geom/GeomND.vue';
  import Test     from '../../../lib/vue/test/Test.vue';
  import Replay   from '../../../lib/vue/test/Replay.vue';
  import Result   from '../../../lib/vue/test/Result.vue';


  let View = {

    components:{ 'v-home':Home, 'v-math':Math,     'v-mathEQ':MathND, 'v-mathML':MathND, 'v-draw':Draw,
                 'v-tool':Tool, 'v-toolND':ToolND, 'v-wood':Wood,     'v-geom':Geom,      'v-geom2D':GeomND,
                 'v-geom3D':GeomND, 'v-test':Test, 'v-replay':Replay, 'v-result':Result },

    setup() {
      const nav      = inject('nav');
      const viewIdx  = ref(0);
      const viewElem = ref(null);
      let   module   = 'Home'
      let   debug    = false

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
        nav.subscribe(  'View', 'View', (obj) => { onNav(obj); } );
        nav.mountTouch( "View", viewElem['value'], nextTick, ['view-pane'] ); } )

      return { show, viewIdx, viewElem }; }
    }

  export default View

</script>

<style lang="less">

      .view-pane {}
  
</style>

<!--

if( debug ) { console.log( 'View.show()', { level:level, module:module } ); }

-->



