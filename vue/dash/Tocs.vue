
<template><div class="tocs">
  <ul>
    <template v-for="komp in komps">
    <li :key="komp.name">
      <div   v-on:click="doComp(komp.name)">
        <div><i :class="komp.icon"></i>{{komp.name}}</div>
      </div>
      <ul v-if="compn===komp.name"><template v-for="prac in komps[komp.name].pracs" >
        <li v-on:click="doPrac(prac.name)" :style="stylePrac(prac.hsv)" :key="prac.name">
          <i :class="prac.icon"></i>
          <span        v-if="!komp.link">{{prac.name}}</span>
          <ul v-show="pracn===prac.name"><template v-for="disp in prac.disps">
            <li v-on:click.stop="doDisp(disp.name)" :style="styleDisp(disp.hsv)" :key="disp.name">
              <i :class="disp.icon"></i>{{disp.name}}</li>
          </template></ul>
        </li>
      </template></ul>
    </li>
  </template>
  </ul>
</div></template>

<script type="module">
  
  let Tocs = {

    props: { prac:{ type:Object, default:null } },
    
    data: function() { return { komps:{}, compn:'None', pracn:'None', dispn:'None' } },
    
    methods: {
      
      onPage: function (obj) {
        console.log( 'Tocs.onPage()', obj ); },
      doComp: function(compn) {
        this.compn  =  compn;
        let obj   = { level:'Comp', comp:compn, page:this.nav().page, source:'Toc' }
        this.nav().pub(obj);
        this.nav().routeLevel('Comp'); },
      doPrac: function(pracn) {
        this.pracn  =  pracn
        let obj   = { level:'Prac', prac:pracn, page:'Dirs', source:'Toc' }
        this.nav().pub(obj);
        this.nav().routeLevel('Prac'); },
      doDisp: function(dispn) {
        this.dispn  =  dispn;
        let obj   = { level:'Disp', disp:dispn, source:'Toc' }
        this.nav().pub(obj);
        this.nav().routeLevel('Disp'); },
      onNav:  function (obj) {
        if( obj.source !== 'Toc' ) {
          switch( obj.level ) {
            case 'Comp' : this.compn = obj.comp; break;
            case 'Prac' : this.pracn = obj.prac; break;
            case 'Disp' : this.dispn = obj.disp; break;
            default     : this.onNone(obj); } } },
      onNone: function (obj) {
        console.log( 'Tocs.onNone()', obj ); },
      stylePrac: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      styleDisp: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      filterPracs: function(pracs,komp) {
        let filt = {}
        for( let key in pracs ) {
          let prac = pracs[key];
          if( prac.row !== 'Dim' || komp === 'Prin' ) {
            filt[key] = prac; } }
        return filt;
      } },
    
    mounted: function () {
      this.komps = this.kompsTocs();
      for( let key in this.komps ) {
        let komp = this.komps[key];
        if( komp.ikw ) {  // this.komps.hasOwnProperty(key) &&
          komp.pracs = this.filterPracs( this.pracs(komp.comp), komp.comp ); } }
      this.subscribe( 'Nav', 'Tocs.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
   export default Tocs;
   
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .tocs { font-family:@theme-font-family;
    ul { padding:0; margin:0; list-style:none; align-self:start; display:grid;
      li  { background-color:@theme-back-tocs-comp; padding-left:0.25rem; align-self:start;   // Comp
            border-radius:0 24px 24px 0; margin:0.2rem 0.2rem 0.2rem 0.2rem;
         i   { margin-right: 0.4rem; }
         div { color:@theme-color; text-decoration:none; }
         ul { font-size:@theme-tocs-size*0.60; font-weight:bold; padding:0; margin:0;
           li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;            // Prac
             i { margin-right: 0.3rem; }
             a { color:@theme-high; }
             ul { font-size:@theme-tocs-size*0.50; padding:0; margin:0 0 0 0.2rem;
               li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;       // Disp
                 i { margin-right: 0.25rem; } }
               li:hover { background-color:@theme-back!important; color:@theme-color-tocs-disp!important; } } } } } } }
</style>

