

<template>
  <div class="math-nd-pane">
    <d-tabs :route="route" :pages="toPages()"></d-tabs>
    <div class="math-nd-comp">
      <template v-for="exp in exps">
        <m-exp :exp="exp"></m-exp>
      </template>
    </div>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';
  import Tabs    from '../../base/elem/Tabs.vue';
  import PageExp from './PageExp.vue';
  import Differ from '../../../pub/augm/math/doc/Differ.js';
  import Solves from '../../../pub/augm/math/doc/Solves.js';
  import Basics from '../../../pub/augm/math/doc/Basics.js';

  let MathND = {

    components:{ 'd-tabs':Tabs, 'm-exp':PageExp },
    
    setup() {
      const mix   = inject('mix');
      const nav   = inject('nav');
      const route = ref(nav.route);
      const exps  = ref({ } );
      const pages = {
        MathEQ: {         
          Differ: { title:'Differ', key:'Differ', create:Differ, obj:null, show:false },
          Solves: { title:'Solves', key:'Solves', create:Solves, obj:null, show:false } },
        MathML: {
          Basics: { title:'Basics', key:'Basics', create:Basics, obj:null, show:false } } };

      const toPages = function() {
        // console.log( 'MathND.toPages()', { route:route.value, paged:pages[route.value] } );
        return mix.isDef(pages[route.value]) ? pages[route.value] : {}; }

      const hasPages = function( name, pageKey ) {
        return mix.isDef(pages[name]) && mix.isDef(pages[name][pageKey]); }
      
      const onNav = function(obj) {
        // console.log( 'MathND.onNav()', obj );
        if( hasPages( obj.route, obj.pageKey ) ) {
          route.value = obj.route
          let page    = pages[obj.route][obj.pageKey];
          exps.value = createExps( page ); } }
       //else {
       //  console.log( 'MathND.onNav() unknown route or pageKey', obj );

      const createExps = function( page ) {
        if( page.obj===null ) {
            page.obj = new page.create(); }
        let expsa = page.obj.math();
        let i    = 0;
        for( let key in expsa ) {
          let exp   = expsa[key];
          exp.klass = klass(i);
          i++; }
        return expsa; }

      // Generate a row column layout class
      const klass = function( i ) {
        let ncol = 3;
        let mod  = i       % ncol;
        let row  = (i-mod) / ncol + 1;
        let col  = mod + 1;
        return `r${row}c${col}`; }

    onMounted( function () {
      mix.subscribe( 'Nav', 'MathND.vue', (obj) => {
          onNav( obj ); } ); } )

      return { route, exps, toPages }; }
  }
  
export default MathND;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @mathFS:@themeFS;
  
  .math-nd-grid9x3() { display:grid; grid-template-columns:33fr 33fr 34fr; grid-template-rows:11fr 11fr 11fr 11fr 11fr 11fr 11fr 11fr 12fr;
    grid-template-areas:
      "r1c1 r1c2 r1c3" "r2c1 r2c2 r2c3" "r3c1 r3c2 r3c3"
      "r4c1 r4c2 r4c3" "r5c1 r5c2 r5c3" "r6c1 r6c2 r6c3"
      "r7c1 r7c2 r7c3" "r8c1 r8c2 r8c3" "r9c1 r9c2 r9c3"; }
  
  .c( @rc ) { display:grid; grid-area:@rc; justify-self:stretch; align-self:stretch;
    justify-items:center; align-items:center; background-color:@theme-back; color:@theme-fore;
    border:solid thin @theme-fore; }

  .math-nd-pane { position:absolute; left:0; top:0; width:100%; height:100%; }
  
  .math-nd-comp {
    position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
      background-color:@theme-back;font-size:2*@mathFS;
    .math-nd-grid9x3(); justify-items:center; align-items:center;
    
    .r1c1{.c(r1c1)}; .r1c2{.c(r1c2)}; .r1c3{.c(r1c3)};
    .r2c1{.c(r2c1)}; .r2c2{.c(r2c2)}; .r2c3{.c(r2c3)};
    .r3c1{.c(r3c1)}; .r3c2{.c(r3c2)}; .r3c3{.c(r3c3)};
    .r4c1{.c(r4c1)}; .r4c2{.c(r4c2)}; .r4c3{.c(r4c3)};
    .r5c1{.c(r5c1)}; .r5c2{.c(r5c2)}; .r5c3{.c(r5c3)};
    .r6c1{.c(r6c1)}; .r6c2{.c(r6c2)}; .r6c3{.c(r6c3)};
    .r7c1{.c(r7c1)}; .r7c2{.c(r7c2)}; .r7c3{.c(r7c3)};
    .r8c1{.c(r8c1)}; .r8c2{.c(r8c2)}; .r8c3{.c(r8c3)};
    .r9c1{.c(r9c1)}; .r9c2{.c(r9c2)}; .r9c3{.c(r9c3)};
  }

</style>