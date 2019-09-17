
<template><div class="tocs">
  <ul>
    <template v-for="komp in komps">
    <li :key="komp.key">
      <div   v-on:click="doComp(komp)">
        <div><i :class="komp.icon"></i>{{komp.title}}</div>
      </div>
      <ul v-if="compKey===komp.key"><template v-for="prac in komps[komp.key].pracs" >
        <li v-on:click="doPrac(prac.name)" :style="stylePrac(prac.hsv)" :key="prac.name">
          <i :class="prac.icon"></i>
          <span        v-if="!komp.link">{{prac.name}}</span>
          <ul v-show="pracKey===prac.name"><template v-for="disp in prac.disps">
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
    
    data: function() { return { komps:{}, compKey:'None', pracKey:'None', dispKey:'None' } },
    
    methods: {
      
      doComp: function(komp) {
        this.compKey = komp.key;
        let route    = komp.route;
        let obj      = { route:route, compKey:this.compKey, page:this.nav().pageKey, source:'Toc' }
        this.nav().pub(obj); },
      doPrac: function(pracKey) {
        this.pracKey =  pracKey
        let obj      = { route:'Prac', pracKey:pracKey, source:'Toc' }
        this.nav().pub(obj); },
      doDisp: function(dispKey) {
        this.dispKey =  dispKey;
        let obj      = { route:'Disp', dispKey:dispKey, source:'Toc' }
        this.nav().pub(obj); },
      onNav:  function (obj) {
        if( obj.source !== 'Toc' ) {
          switch( obj.route ) {
            case 'Prin' : this.compKey = obj.compKey; break;
            case 'Comp' : this.compKey = obj.compKey; break;
            case 'Prac' : this.pracKey = obj.pracKey; break;
            case 'Disp' : this.dispKey = obj.dispKey; break;
            default     : this.onNone(obj); } } },
      onNone: function (obj) {
        console.log( 'Tocs.onNone()', obj ); },
      stylePrac: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      styleDisp: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      filterPracs: function(pracs,kompKey) {
        let filt = {}
        for( let key in pracs ) {
          let prac = pracs[key];
          if( prac.row !== 'Dim' || kompKey === 'Prin' ) {
            filt[key] = prac; } }
        return filt;
      } },
    
    mounted: function () {
      this.komps = this.kompsTocs();
      for( let key in this.komps ) {
        let komp = this.komps[key];
        if( komp.ikw ) {  // this.komps.hasOwnProperty(key) &&
          komp.pracs = this.filterPracs( this.pracs(komp.key), komp.key ); } }
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

