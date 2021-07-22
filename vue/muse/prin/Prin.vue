
<template>
  <div class="prin-pane">
    <b-tabs :compKey="compKey" :pages="pages"></b-tabs>
    <div class="prin-comp">
        <template v-for="pracObj in compObj" :key="nav.keyIdx(pracObj[name],pracIdx)">
          <div   :class="pracObj['dir']" :ref="pracObj['name']">
            <p-sign v-show="nav.isShow('Prin','Icons')"  :pracObj="pracObj"></p-sign>
            <p-dirs v-show="nav.isShow('Prin','Topics')" :pracObj="pracObj"></p-dirs>
          </div>
        </template>
      </div>
    </div>
</template>

<script type="module">

  import Tabs from '../../../lib/vue/elem/Tabs.vue';
  import Sign from './Sign.vue';
  import Dirs from './Dirs.vue';
  import { inject, ref, onMounted, onBeforeMount } from 'vue'

  let Prin = {

    components:{ 'b-tabs':Tabs, 'p-sign':Sign, 'p-dirs':Dirs },

    setup() {

      const mix     = inject( 'mix' );
      const nav     = inject( 'nav' );
      const compKey = 'Prin'
      const compObj = ref(null );
      const pracObj = ref(null );
      const pracIdx = ref(0    );
      const pages   = nav.pages['Prin']

      const onComp = function( compKey ) {
        // nav.setPages( compKey, pages );
        compObj.value = mix.compObject(compKey);
        pracIdx.value++; }

      const onNav = (obj) => {
        if( nav.isMyNav(obj,'Comp') ) {
          onComp( obj.compKey ); } }

      onBeforeMount( function() {
        onComp('Prin'); } )

      onMounted( function () {
        mix.subscribe( 'Nav', 'Prin', (obj) => {
          onNav(obj); } ); } )

    return { compKey, pages, pracObj, compObj, pracIdx, nav }; }
  }
  
  export default Prin;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  .prin-grid1x3() { display:grid; grid-template-columns:29fr 29fr 29fr; grid-template-rows:100fr;
    grid-template-areas: "em in en" }
  
  .prin-dir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }

  @prinFS:2.0*@themeFS;

  .prin-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  
    .prin-comp { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
      background-color:@theme-back; color:@theme-dark; font-size:@prinFS; border-radius:0.5*@prinFS;
      .prin-grid1x3(); justify-items:center; align-items:center; // The 4x4 Dim + Row + 9 Practices Grid
        .em { .prin-dir(em); } .in { .prin-dir(in); }  .en  { .prin-dir(en); } } }
  
</style>
