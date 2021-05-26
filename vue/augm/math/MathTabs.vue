

<template>
  <div class="math-tabs-pane">
    <d-tabs :compKey="pracKey" :pages="toPages()"></d-tabs>
    <div class="math-tabs-comp" :key="expsIdx">
      <m-math-grid v-if="show('Differ')" :exps="differExps"></m-math-grid>
      <m-math-grid v-if="show('Solves')" :exps="solvesExps"></m-math-grid>
      <m-math-grid v-if="show('Basics')" :exps="basicsExps"></m-math-grid>
    </div>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';
  import Tabs     from '../../base/elem/Tabs.vue';
  import MathGrid from './MathGrid.vue';
  import Differ   from '../../../pub/augm/math/doc/Differ.js';
  import Solves   from '../../../pub/augm/math/doc/Solves.js';
  import Basics   from '../../../pub/augm/math/doc/Basics.js';

  let MathND = {

    components:{ 'd-tabs':Tabs, 'm-math-grid':MathGrid },
    
    setup() {
      const mix     = inject('mix');
      const nav     = inject('nav');
      const pracKey = ref(nav.pracKey);
      const pageKey = ref(nav.pageKey);
      const expsIdx = ref( 0  );
      const debug   = false;

      const toPages = function() {
        return nav.pages[pracKey.value]; }

      const show = ( pageArg ) => {
        return pageKey.value === pageArg;
      }
      
      const onNav = function(obj) {
        if( obj.compKey==='Math' && obj.pageKey!=='None' && ( obj.pracKey==='MathML' || obj.pracKey==='MathEQ') ) {
          pracKey.value = obj.pracKey;
          pageKey.value = obj.pageKey;
          //let page    = getPages(obj.pracKey,obj.pageKey);
          //exps.value  = createExps( page );
          expsIdx.value++; } }

      const createExps = function( page ) {
        if(        page.obj===null    ) {
          if(      page.key==='Differ') { page.obj = new Differ(); }
          else if( page.key==='Solves') { page.obj = new Solves(); }
          else if( page.key==='Basics') { page.obj = new Basics(); } }
        let expsa = page['obj'].math();
        let i    = 0;
        for( let key in expsa ) {
          let exp   = expsa[key];
          exp.klass = klass(i);
          i++; }
        if( debug ) { console.log( 'MathND.createExp()', { obj:page.obj, exps:expsa } ) }
        return expsa; }

      // Generate a row column layout class
      const klass = function( i ) {
        let ncol = 3;
        let mod  = i       % ncol;
        let row  = (i-mod) / ncol + 1;
        let col  = mod + 1;
        return `r${row}c${col}`; }

      const basicsExps = createExps(nav.getPage('MathML','Basics'));
      const solvesExps = createExps(nav.getPage('MathEQ','Solves'));
      const differExps = createExps(nav.getPage('MathEQ','Differ'));

    onMounted( function () {
      mix.subscribe( 'Nav', 'MathND', (obj) => {
          onNav( obj ); } ); } )

      return { pracKey, show, basicsExps, solvesExps, differExps, expsIdx, toPages }; }
  }
  
export default MathND;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @mathFS:@themeFS;

  .math-tabs-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    .math-tabs-comp { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
        background-color:@theme-back;font-size:2*@mathFS; } }

</style>