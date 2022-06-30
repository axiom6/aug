
<template>
  <div   class="comp-pane" ref="compElem">
    <div class="comp-port" :style="compStyle()" :key="nav.keyIdx('CompPort',compIdx)">
      <b-tabs :compKey="compKey" :pages="tabPages('Comp')"  position="left"  :isComp="soTrue()"></b-tabs>
      <b-tabs :compKey="compKey" :pages="tabPages(compKey)" position="right" :isInov="soTrue()" v-if="hasInov()"></b-tabs>
      <div   class="comp-comp">
        <template   v-for="pracObj in compObj" :key="nav.keyIdx(pracObj['name'],pracIdx)">
          <div :class="pracObj['dir']">
            <p-sign   v-if="isShow('Icons')"  :pracObj="pracObj"></p-sign>
            <p-dirs   v-if="isShow('Topics')" :pracObj="pracObj"></p-dirs>
            <p-desc   v-if="isShow('Texts')"  :pracObj="pracObj"></p-desc>
            <template v-if="isShow('Graphs')">
              <p-conn v-if="!isDim(pracObj)" :pracObj="pracObj" level="Comp"></p-conn>
              <p-sign v-if=" isDim(pracObj)" :pracObj="pracObj"></p-sign>
            </template>
          </div>
        </template>
        <template v-for="row in myRows">
          <div v-show="isRows()" :class="row.dir">
            <p-sign :pracObj="row"></p-sign>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script type="module">

import Tabs from '../../../lib/vue/elem/Tabs.vue';
import Sign from './Sign.vue';
import Dirs from './Dirs.vue';
import Conn from './Conn.vue';
import Desc from './Desc.vue';
import { ref, inject, onMounted, nextTick } from 'vue';

let Comp = {

  components:{ 'b-tabs':Tabs, 'p-sign':Sign, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },

  setup( {} ) {

    const nav       = inject('nav');
    const compKey   = ref('Info');
    const pageKey   = ref(nav.getPageKey('Comp'));
    const inovKey   = ref('Info');
    const compElem  = ref(null);
    const compIdx   = ref(0);
    const pracIdx   = ref(0);
    let   compObj   = ref({});
    let   pracObj   = ref({});
    let   width     = 0;
    let   height    = 0;
    const debug     = false;
    const inovComps = ['Info','Know','Wise'];
    let   myRows    = nav.getTabs('Rows');
    if( debug ) { console.log( 'Comp.setup()', { pageKey:pageKey.value } ); }

    const tabPages = (compArg) => {
      return nav.getTabs(compArg); }

    const soTrue = () => {
      return true; }

    const isShow = ( pageArg ) => {
      if( debug ) { console.log( 'Comp.isShow()',
          { pageKey:pageKey.value, pageArg:pageArg, isEq:pageArg===pageKey } ); }
      return pageArg===pageKey.value; }

    const onComp = (obj) => {
      compKey.value = obj.compKey;
      pageKey.value = obj.pageKey;
      inovKey.value = obj.inovKey;
      onRows();
      compObj.value = nav.inovObject( compKey.value, inovKey.value );
      pracIdx.value++;
      if( debug ) { console.log( 'Comp.onComp()',
          { obj:obj, pageKey:pageKey.value, pageObj:obj.pageKey, compObj:compObj.value } ); } }

    const heightWidth = () => {
        nextTick( () => {
          compIdx.value++;
          let elem = compElem['value'];
          width    = elem['clientWidth' ];
          height   = elem['clientHeight']; } ) }

    const compStyle = () => {
      let css = `position:absolute; left:0; top:0; width:100%; height:100%;`;
      if( debug ) { console.log( 'Comp.compStyle() One', { width:width, height:height } ); }
      if( width > 0 && height > 0 ) {
        let aspect = width / height;
        let w = aspect > 2.0 ? 100/aspect : 100;
        let h = aspect < 0.5 ? 100*aspect : 100;
        css   = `position:absolute; left:0; top:0; width:${w}%; height:${h}%;`;
        if( debug ) { console.log( 'Comp.compStyle() Two',
          { css:css, width:width, height:height, aspect:aspect, w:w, h:h } ); } }
        return css;  }

    const isDim = (pracArg) => {
      return pracArg.row === "Dim"; }

    const isRows = () => {
      return true; }

    const onRows = () => {
      const myKey = compKey.value;
      let                   page = nav.getTabs('Info');
      let                   inov = 'Info'
      if( myKey==='Know') { page = nav.getTabs('Know'); inov = 'Know'; }
      if( myKey==='Wise') { page = nav.getTabs('Wise'); inov = 'Wise'; }
      if( nav.inArray( myKey, inovComps ) ) {
        console.log( { mykey:myKey, page:page, inov:inov,  myRows:myRows } )
        myRows['Plane'].name = myKey;
        myRows['Plane'].icon = page[inov].icon; }  }

    const onNav = (obj) => {
      if( nav.isMyNav(obj,'Comp') ) {
        onComp(obj); } }

    const hasInov = () => {
      let has = nav.inArray( compKey.value, inovComps );
      if( debug ) { console.log( 'Comp.hasInov()', { has:has, compKey:compKey.value, inovComps:inovComps } ); }
      return has; }

    // nav.setPages( 'Comp', Comp );
    onComp({ compKey:nav.compKey, pageKey:nav.getPageKey('Comp'), inovKey:nav.inovKey } );

    onMounted( () => {
      heightWidth();
      nav.subscribe('Nav', 'Comp', (obj) => { onNav(obj); } ); } )

    return { compKey, compObj, compStyle, compElem, compIdx, pracIdx, nav, pracObj, tabPages,
      hasInov, isDim, isRows, myRows, isShow, soTrue }; }
}

export default Comp;

</script>

<style lang="less">

@import '../../../lib/css/themes/theme.less';

.comp-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
  grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

.comp-grid4x4() { display:grid; grid-template-columns:16fr 28fr 28fr 28fr; grid-template-rows:25fr 25fr 25fr 25fr;
  grid-template-areas:"cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

.pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
  justify-items:center; align-items:center; }

@compFS:2.00*@themeFS;
@bordFS:1.25*@themeFS;

.comp-pane { position:absolute; left:0; top:0; width:100%; height:100%; }
.comp-port { position:absolute; left:0; top:0; width:100%; height:100%; }

  .comp-comp { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
    background-color:@theme-back; color:@theme-dark; font-size:@compFS; border-radius:@bordFS;
    .comp-grid4x4(); justify-items:center; align-items:center; // The 4x4 Dim + Row + 9 Practices Grid
    .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }
    .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
    .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
    .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }

    .cm .comp-sign { background-color:@theme-back; }
  }

</style>

<!--
    const tabPages = (compArg) => {
      let pages = Comp;
      switch( compArg ) {
        case 'Comp': pages = Comp; break;
        case 'Info': pages = Info; break;
        case 'Know': pages = Know; break;
        case 'Wise': pages = Wise; break;
        case 'Rows': pages = Rows; break; }
      if( debug ) { console.log( 'Comp.tabPages()', { compArg:compArg, pages:pages } ); }
      return pages; }

routKey.value
-->

