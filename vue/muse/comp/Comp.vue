
<template>
  <div class="comp-pane">
    <b-tabs :route="routKey" :pages="tabPages(routKey)" position="left" ></b-tabs>
    <b-tabs :route="compKey" :pages="tabPages(compKey)" position="right" isInov="true" v-if="hasInov()"></b-tabs>
    <div   class="comp-comp">
      <p-grid    v-if="nav.isShow('Comp','Grid')" :key="compIdx" :compKey="compKey" :inovKey="inovKey"></p-grid>
      <template v-if="!nav.isShow('Comp','Grid')" :key="compIdx" v-for="pracObj in compObj">
        <div :class="pracObj.dir">
          <p-sign   v-if="nav.isShow('Comp','Sign')" :pracObj="pracObj"></p-sign>
          <p-dirs   v-if="nav.isShow('Comp','Dirs')" :pracObj="pracObj"></p-dirs>
          <p-desc   v-if="nav.isShow('Comp','Desc')" :pracObj="pracObj"></p-desc>
          <template v-if="nav.isShow('Comp','Conn')">
            <p-conn v-if="!isDim(pracObj)" :pracObj="pracObj" level="Comp"></p-conn>
            <p-sign v-if=" isDim(pracObj)" :pracObj="pracObj"></p-sign>
          </template>
        </div>
      </template>
      <template v-if="!nav.isShow('Comp','Grid')" v-for="row in myRows">
        <div v-show="isRows()" :class="row.dir">
          <p-sign :pracObj="row"></p-sign>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="module">

import Tabs from '../../base/elem/Tabs.vue';
import Sign from './Sign.vue';
import Dirs from './Dirs.vue';
import Conn from './Conn.vue';
import Desc from './Desc.vue';
import Grid from '../grid/Tabu.vue';
import { ref, inject, onMounted } from 'vue';

let Comp = {

  components:{ 'b-tabs':Tabs, 'p-sign':Sign, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc, 'p-grid':Grid },

  setup( {} ) {

    const mix       = inject( 'mix' );
    const nav       = inject( 'nav' );
    const routKey   = ref('Comp'); // Same ref but show attr changes
    const compKey   = ref('Info');
    const inovKey   = ref('Info');
    let   compObj   = ref({}    );
    let   pracObj   = ref({}    );
    let   compIdx   = ref(0     );
    const debug     = false;
    const inovComps = ['Info','Know','Wise'];
    const routes    = ['Comp','Info','Know','Wise'];

    let Comp = {
      Sign:{ title:'Prac', key:'Sign', show:true  },
      Dirs:{ title:'Dirs', key:'Dirs', show:false },
      Grid:{ title:'Grid', key:'Dirs', show:false },
      Conn:{ title:'Conn', key:'Conn', show:false },
      Desc:{ title:'Desc', key:'Desc', show:false },
      Grid:{ title:'Grid', key:'Grid', show:false } };
    let Info = {
      Info:{ title:'Core', key:"Info", show:true,  icon:"fas fa-th"},
      Soft:{ title:'Soft', key:"Soft", show:false, icon:"fas fa-codepen"},
      Data:{ title:'Data', key:"Data", show:false, icon:"fas fa-table"} };
    let Know = {
      Know:{ title:'Knowledge', key:"Know", show:true,  icon:"fas fa-university"},
      Scie:{ title:'Science',   key:"Scie", show:false, icon:"fas fa-flask" },
      Math:{ title:'Math',      key:"Math", show:false, icon:"fas fa-calculator"} };
    let Wise = {
      Wise:{ title:'Wisdom',    key:"Wise", show:true, icon:"fas fa-tripadvisor"} };
    let Rows = {
      Plane:{ name:'Info',  dir:'cm', icon:"fas fa-th" },
      Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap"},
      Do:{    name:'Do',    dir:'do', icon:"fas fa-cog"},
      Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square"} };

    const myRows  = ref( Rows );

    const tabPages = function( compArg ) {
      let pages = Comp;
      switch( compArg ) {
        case 'Comp': pages = Comp; break;
        case 'Info': pages = Info; break;
        case 'Know': pages = Know; break;
        case 'Wise': pages = Wise; break;
        case 'Rows': pages = Rows; break; }
      // console.log( 'Comp.tabPages()', {compArg:compArg, source:source, pages:pages } );
      return pages; }

    const onComp = function (obj) {
      compKey.value = obj.compKey;
      inovKey.value = obj.inovKey;
      onRows();
      compObj.value = mix.inovObject( compKey.value, inovKey.value );
      compIdx.value++;
      if( debug ) {
        console.log( 'Comp.onComp()', compObj.value ); }
    }

    const isDim = function( pracArg ) {
      return pracArg.row === "Dim"; }

    const isRows = function () {
      return true; }

    const onRows = function () {
      const pages    = tabPages('Comp', 'Rows');
      const pageKey  = 'Sign';
      const myKey    =  compKey.value;
      let   page     = Info;
      if( myKey==='Know') { page = Know; }
      if( myKey==='Wise') { page = Wise; }
      if( mix.inArray( myKey, inovComps ) ) {
        myRows.value['Plane'].name = myKey;
        myRows.value['Plane'].icon = page[myKey].icon; }  }

    const onNav = function (obj) {
      if( mix.inArray( obj.route, routes ) ) { onComp(obj); } }

    const hasInov = function () {
      let has = mix.inArray( compKey.value, inovComps );
      if( debug ) {
        console.log( 'Comp.hasInov()', { has:has, compKey:compKey.value, inovComps:inovComps } ); }
      return has; }

    nav.setPages( routKey.value, Comp );
    onComp({ route:routKey.value, compKey:nav.compKey, inovKey:nav.inovKey } );

    onMounted( function () {
      mix.subscribe('Nav', 'Comp.vue', (obj) => { onNav(obj); } ); } )


    return { routKey,compKey,inovKey,compObj,compIdx,pracObj,tabPages,hasInov,isDim,isRows,myRows,nav }; }
}

export default Comp;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

.comp-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
  grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

.comp-grid4x4() { display:grid; grid-template-columns:16fr 28fr 28fr 28fr; grid-template-rows:25fr 25fr 25fr 25fr;
  grid-template-areas:"cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

.pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
  justify-items:center; align-items:center; }

@compFS:2.00*@themeFS;
@bordFS:1.25*@themeFS;

.comp-pane { position:absolute; left:0; top:0; width:100%; height:100%;

  .comp-comp { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
    background-color:@theme-back; color:@theme-dark; font-size:@compFS; border-radius:@bordFS;
    .comp-grid4x4(); justify-items:center; align-items:center; // The 4x4 Dim + Row + 9 Practices Grid
    .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }
    .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
    .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
    .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }

    .cm .comp-sign { background-color:@theme-back; }
  }
}

</style>

<!--
routKey.value
-->

