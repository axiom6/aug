
<template><div class="tocs-pane">
  <ul>
    <template v-for="komp in komps">
      <li><!--/* @vite-ignore */ -->
        <div   v-on:click="doComp(komp.key)">
          <div  :style="styleComp(komp.key)"><i :class="komp.icon"></i>{{komp.title}}</div>
        </div>
        <ul v-if="myKomp(komp.key)"><template v-for="prac in tocPracs(compKey,inovKey)">
          <li v-on:click="doPrac(prac.name)" :style="style(prac)">
            <i :class="prac.icon"></i>
            <span>{{prac.name}}</span>
            <ul v-show="pracKey===prac.name"><template v-for="disp in prac.disps">
              <li v-on:click.stop="doDisp(disp.name)" :style="style(disp)">
                <i :class="disp.icon"></i>{{disp.name}}</li>
            </template></ul>
          </li>
        </template></ul>
      </li>
    </template>
  </ul>
</div></template>

<script type="module">

  import { inject, ref, onMounted } from "vue";

  let Tocs = {
    
    setup() {

      const mix     = inject( 'mix' );
      const nav     = inject( 'nav' );
      let   komps   = mix.kompsTocs();
      const compKey = ref('Home');
      const inovKey = ref('None');
      const pracKey = ref('None');
      const dispKey = ref('None');
      const routNav = ref('None');

      const myKomp = function(kompArg) {
        return kompArg===compKey.value && mix.isBatch(compKey.value) }
      const doComp = function(kompKey) {
        let  route    = komps[kompKey].route;
        compKey.value = kompKey;
        inovKey.value = nav.inovKey;
        let obj = { route:route, compKey:compKey.value, source:'Toc' };
        pub( obj ); }
      const doPrac = function(pracArg) {
        pracKey.value = pracArg;
        let route    = toRoute('Prac', pracArg );
        pub( { route:route, pracKey:pracArg, source:'Toc' } ); }
      const doDisp = function(dispArg) {
        dispKey.value = dispArg;
        let route    = toRoute('Disp', dispArg );
        pub( { route:route, dispKey:dispArg, source:'Toc' } ); }
      const pub = function(obj) {
        nav.dirTabs = false;
        nav.pub(obj); }
      const onNav =  function (obj) {
        if( obj.source !== 'Toc' ) {
          if( keyEq(compKey.value,obj.compKey ) ) { compKey.value = obj.compKey; }
          if( keyEq(pracKey.value,obj.pracKey ) ) { pracKey.value = obj.pracKey; }
          if( keyEq(dispKey.value,obj.dispKey ) ) { dispKey.value = obj.dispKey; }
          if( keyEq(inovKey.value,obj.inovKey ) ) { inovKey.value = obj.inovKey; }
          if( keyEq(routNav.value,obj.route   ) ) { routNav.value = obj.route;   } } }
      const keyEq = function( tkey, okey ) {
         return mix.isDef(okey) && tkey !== okey; }
      const styleComp = function( kompArg ) {
        return myKomp(kompArg) ? { backgroundColor:'wheat', color:'black', borderRadius:'0 24px 24px 0' }
                               : { backgroundColor:'#333',  color:'wheat', borderRadius:'0 24px 24px 0' }; }
      const style = function( ikwObj ) {
        return mix.styleObj(ikwObj); }
      const toRoute = function( level, routeArg ) {
        let route = mix.isMuse()   ? level  : routeArg;
            route = compKey.value==='Talk' ? 'Talk' : route;
            return route; }
      const tocPracs = function(compArg,inovArg) {
        let pracs = compArg !== 'Cube' ? mix.inovObject(compArg,inovArg) : {};
        // console.log( 'Tocs.tocPracs()', { compArg:compArg, inovArg:inovArg, pracs:pracs } );
        let filts = {}
        for( let keyn in pracs ) {
          if( pracs.hasOwnProperty(keyn) ) {
            let prac = pracs[keyn];
            if( prac.row !== 'Dim' || compKey.value === 'Prin' ) {
              filts[keyn] = prac; } } }
        return filts; }
    
    onMounted( function () {
      mix.subscribe( 'Nav', 'Tocs.vue', (obj) => {
        onNav(obj); } ); } )
        
  return { komps, myKomp, doComp, compKey, inovKey, style, styleComp, doPrac, doDisp, tocPracs }; }
  
  }
  
   export default Tocs;
   
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @tocsFS:2.2*@themeFS;
  @tocs-back-comp:#333;
  @tocs-back-prac:#444; // Not used yet
  @tocs-back-disp:#555; // Not used yet
  @tocs-fore-disp:white;
  
  .tocs-pane { font-family:@theme-font-family;
    ul { font-size:@tocsFS; padding:0; margin:0; list-style:none; align-self:start; display:grid;
      li  { background-color:@tocs-back-comp; padding-left:0.25rem; align-self:start;   // Comp
            border-radius:0 24px 24px 0; margin:0.2rem 0.2rem 0.2rem 0.2rem;
         i   { margin-right: 0.4rem; }
         div { color:@theme-fore; text-decoration:none; }
         ul { font-size:@tocsFS*0.60; font-weight:bold; padding:0; margin:0;
           li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;            // Prac
             i { margin-right: 0.3rem; }
             a { color:@theme-high; }
             ul { font-size:@tocsFS*0.50; padding:0; margin:0 0 0 0.2rem;
               li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;       // Disp
                 i { margin-right: 0.25rem; } }
               li:hover { background-color:@theme-back!important; color:@tocs-fore-disp!important; } } } } } } }
</style>
