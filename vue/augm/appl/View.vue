
<template>
  <div class="view-pane">
    <v-home     v-if="show('Home')"   :key="viewIdx"></v-home>
    <v-math     v-if="show('Math')"   :key="viewIdx"></v-math>
    <v-mathEQ   v-if="show('MathEQ')" :key="viewIdx" :pracKey="'MathEQ'"></v-mathEQ>
    <v-mathML   v-if="show('MathML')" :key="viewIdx" :pracKey="'MathML'"></v-mathML>
    <v-draw     v-if="show('Draw')"   :key="viewIdx"></v-draw>
    <v-hues     v-if="show('Hues')"   :key="viewIdx"></v-hues>
    <v-tool     v-if="show('Tool')"   :key="viewIdx"></v-tool>
    <v-tools    v-if="show('Gauges')" :key="viewIdx" :pracKey="'Gauges'"></v-tools>
    <v-tools    v-if="show('Widget')" :key="viewIdx" :pracKey="'Widget'"></v-tools>
    <v-cube     v-if="show('Cube')"   :key="viewIdx"></v-cube>
    <v-wood     v-if="show('Wood')"   :key="viewIdx"></v-wood>
    <v-geom     v-if="show('Geom')"   :key="viewIdx"></v-geom>
    <v-geom2D   v-if="show('Geom2D')" :key="viewIdx" :pracKey="'Geom2D'"></v-geom2D>
    <v-geom3D   v-if="show('Geom3D')" :key="viewIdx" :pracKey="'Geom3D'"></v-geom3D>
    <v-test     v-if="show('Test')"   :key="viewIdx"></v-test>
    <v-replay   v-if="show('Test')"   :key="viewIdx"></v-replay>
    <v-result   v-if="show('Test')"   :key="viewIdx"></v-result>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';
  import Home     from './Home.vue'
  import Math     from '../math/Math.vue';
  import MathTabs from '../math/MathTabs.vue';
  import Draw     from '../draw/Draw.vue';
  import Hues     from '../mbox/Hues.vue';
  import Tool     from '../tool/Tool.vue';
  import Tools    from '../tool/Tools.vue';
  import Cube     from '../cube/Cube.vue';
  import Wood     from '../wood/Wood.vue';
  import Geom     from '../geom/Geom.vue';
  import GeomND   from '../geom/GeomND.vue';
  import Test     from '../../base/test/Test.vue';
  import Replay   from '../../base/test/Replay.vue';
  import Result   from '../../base/test/Result.vue';


  let View = {

    components:{ 'v-home':Home, 'v-math':Math,     'v-mathEQ':MathTabs, 'v-mathML':MathTabs, 'v-draw':Draw,
                 'v-hues':Hues, 'v-tool':Tool,     'v-tools':Tools,    'v-cube':Cube,     'v-wood':Wood,
                 'v-geom':Geom, 'v-geom2D':GeomND, 'v-geom3D':GeomND, 'v-test':Test,   'v-replay':Replay,
                 'v-result':Result },

    setup() {
      const mix     = inject('mix');
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



