
<template>
  <div class="comp-pane">
    <b-tabs :compKey="compKey" :pages="tabPages('Comp')"  position="left"  isComp="true"></b-tabs>
    <b-tabs :compKey="compKey" :pages="tabPages(compKey)" position="right" isInov="true" v-if="hasInov()"></b-tabs>
    <div   class="comp-comp">
      <template  :key="compIdx" v-for="pracObj in compObj">
        <div :class="pracObj['dir']">
          <p-sign   v-if="nav.isShow('Comp','Icons')"  :pracObj="pracObj"></p-sign>
          <p-dirs   v-if="nav.isShow('Comp','Topics')" :pracObj="pracObj"></p-dirs>
          <p-desc   v-if="nav.isShow('Comp','Texts')"  :pracObj="pracObj"></p-desc>
          <template v-if="nav.isShow('Comp','Graphs')">
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
</template>

<script type="module">

import Tabs from '../../base/elem/Tabs.vue';
import Sign from './Sign.vue';
import Dirs from './Dirs.vue';
import Conn from './Conn.vue';
import Desc from './Desc.vue';
import { ref, inject, onMounted } from 'vue';

let Comp = {

  components:{ 'b-tabs':Tabs, 'p-sign':Sign, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },

  setup( {} ) {

    const mix       = inject('mix');
    const nav       = inject('nav');
    const compKey   = ref('Info');
    const inovKey   = ref('Info');
    let   compObj   = ref({}    );
    let   pracObj   = ref({}    );
    let   compIdx   = ref(0     );
    const debug     = false;
    const inovComps = ['Info','Know','Wise'];
    const myRows    = ref( nav.pages['Rows'] );

    const tabPages =  (compArg) => {
      return nav.pages[compArg]; }

    const onComp = (obj) => {
      compKey.value = obj.compKey;
      inovKey.value = obj.inovKey;
      onRows();
      compObj.value = mix.inovObject( compKey.value, inovKey.value );
      compIdx.value++;
      if( debug ) { console.log( 'Comp.onComp()', compObj.value ); }
    }

    const isDim = (pracArg) => {
      return pracArg.row === "Dim"; }

    const isRows = () => {
      return true; }

    const onRows = () => {
      const myKey = compKey.value;
      let                   page = nav.pages['Info'];
      if( myKey==='Know') { page = nav.pages['Know']; }
      if( myKey==='Wise') { page = nav.pages['Wise']; }
      if( mix.inArray( myKey, inovComps ) ) {
        myRows['value']['Plane'].name = myKey;
        myRows['value']['Plane'].icon = page['Core'].icon; }  }

    const onNav = (obj) => {
      if( nav.isMyNav(obj,'Comp') ) {
        onComp(obj); } }

    const hasInov = () => {
      let has = mix.inArray( compKey.value, inovComps );
      if( debug ) { console.log( 'Comp.hasInov()', { has:has, compKey:compKey.value, inovComps:inovComps } ); }
      return has; }

    // nav.setPages( 'Comp', Comp );
    onComp({ compKey:nav.compKey, inovKey:nav.inovKey } );

    onMounted( () => {
      mix.subscribe('Nav', 'Comp', (obj) => { onNav(obj); } ); } )


    return { compKey,inovKey,compObj,compIdx,pracObj,tabPages,hasInov,isDim,isRows,myRows,nav }; }
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

