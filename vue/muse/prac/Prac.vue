
<template>
  <div class="prac-pane"  ref="pracElem" :style="pracStyle()" :key="nav.keyIdx(pracObj['name'],pracIdx)">
    <b-tabs :compKey="'Prac'" :pages="pages"></b-tabs>
    <div class="prac-prac">
      <p-dirs v-show="nav.isShow('Prac','Topics')" :pracObj="pracObj"></p-dirs>
      <p-conn   v-if="nav.isShow('Prac','Graphs')" :pracObj="pracObj" level="Prac"></p-conn>
      <p-desc v-show="nav.isShow('Prac','Texts')"  :pracObj="pracObj"></p-desc>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../../../lib/vue/elem/Tabs.vue';
  import Dirs from './Dirs.vue';
  import Conn from '../comp/Conn.vue';
  import Desc from './Desc.vue';
  import {inject, ref, onBeforeMount, onMounted, nextTick} from 'vue';
  
  let Prac = {

    components:{ 'b-tabs':Tabs, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },

    setup() {

      const nav      = inject('nav');
      const debug    = false;
      const pracObj  = ref(null);
      const pracElem = ref(null);
      const pracIdx  = ref(0);
      let   width    = 0;
      let   height   = 0;
      
      const pages = nav.pages['Prac']

      const heightWidth = () => {
        nextTick( () => {
          pracIdx.value++;
          let elem = pracElem['value'];
          width    = elem['clientWidth' ];
          height   = elem['clientHeight']; } ) }

      const pracStyle = () => {
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

      const onPrac = (obj) => {
        pracObj.value = nav.pracObject( obj.compKey, obj.inovKey, obj.pracKey );
        pracIdx.value++;
        if( debug ) {
          console.log( 'Prac.onPrac()', { pracIdx:pracIdx.value, pracObj:pracObj.value, pracKey:obj.pracKey } ); } }

      const onNav = (obj) => {
        if( nav.isMyNav(obj,'Prac') ) {
          onPrac(obj); } }

      const toPracKey = (pracKey) => {
        if( pracKey==='none' ) {
          console.log( 'Prac.setPrac() pracKey is none', { compKey:nav.compKey, inovKey:nav.inovKey } );
          if(      nav.compKey==='Info') { return 'Team';    }
          else if( nav.compKey==='Know') { return 'Involve'; }
          else if( nav.compKey==='Wise') { return 'Trust';   } }
        else {
          return pracKey; }
      }

      onBeforeMount( () => {
        // nav.setPages( 'Prac', pages );
        let obj = {}
        obj.compKey = nav.compKey;
        obj.pracKey = toPracKey(nav.pracKey);
        obj.inovKey = nav.inovKey;
        onPrac( obj );  } )

      onMounted( () => {
        heightWidth();
        nav.subscribe(  "Nav", 'Prac', (obj) => {
          onNav(obj); } ); } )
      
    return { pracObj, pracIdx, pracElem, pracStyle, pages, nav }; }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../../lib/css/themes/theme.less';

  @pracFS:2.0*@themeFS;
  
  .prac-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    
    .prac-prac { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
      background-color:@theme-back; font-size:@pracFS; border-radius:0.5*@pracFS; } }
  
</style>

