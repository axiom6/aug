

<template>
  <div class="math-nd-pane">
    <d-tabs :compKey="pracKey" :pages="toPages()"></d-tabs>
      <template v-for="page in toPages()" :key="nav.keyIdx(page.key,pageIdx)">
        <m-math-grid v-if="nav.show(page.key)" :exps="page.obj" class="math-nd-comp"></m-math-grid>
      </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';
  import Tabs     from '../../../lib/vue/elem/Tabs.vue';
  import MathGrid from './MathGrid.vue';
  import MathMgr  from "../../../pub/augm/math/doc/MathMgr";

  let MathND = {

    components:{ 'd-tabs':Tabs, 'm-math-grid':MathGrid },

    props: { pracKey:String },
    
    setup( props ) {

      const nav     = inject('nav');
      const page    = ref(null);
      let   pageIdx = ref(0);
      const mathMgr = new MathMgr();
    //const debug   = false;

      const toPages = () => {
        return nav.pages[props.pracKey]; }

      const onNav = (obj) => {
        if( props.pracKey===obj.pracKey && nav.hasPage(props.pracKey,obj.pageKey) ) {
          page.value     = nav.getPage(props.pracKey,obj.pageKey);
          page.value.obj = mathMgr.createExps(page.value);
          pageIdx.value++; } }


    onMounted( () => { // Follow up with the last Nav.pub(obj) that mounted this vue component
      onNav( { pracKey:props.pracKey, pageKey:nav.getPageKey(props.pracKey) } );
      nav.subscribe( 'Nav', 'MathND', (obj) => {
          onNav( obj ); } ); } )

      return { nav, pageIdx, toPages }; }
  }
  
export default MathND;

</script>

<style lang="less">
  
  @import '../../../lib/css/themes/theme.less';
  
  @mathFS:@themeFS;

  .math-nd-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    .math-nd-comp { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
        background-color:@theme-back;font-size:2*@mathFS; } }

</style>

<!--
      <m-math-grid v-if="show('Differ')" :exps="differExps"></m-math-grid>
      <m-math-grid v-if="show('Solves')" :exps="solvesExps"></m-math-grid>
      <m-math-grid v-if="show('Basics')" :exps="basicsExps"></m-math-grid>

      const createExps = function( page ) {
        page,obj = mathMgr.createExps(page);
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
-->