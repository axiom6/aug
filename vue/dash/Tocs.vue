
<template><div class="tocs">
  <ul>
    <template v-for="komp in komps">
    <li :key="komp.name">
      <div   v-on:click="doComp(komp.name)">
        <!--router-link :to="{ name:'Comp' }"><i :class="komp.icon"></i>{{komp.name}}</router-link-->
        <div><i :class="komp.icon"></i>{{komp.name}}</div>
      </div>
      <ul  v-if="comp===komp.name"><template v-for="prac in komps[komp.name].pracs" >
        <li v-on:click="doPrac(prac.name)" :style="stylePrac(prac.name,prac.hsv)" :key="prac.name">
          <i :class="prac.icon"></i>
          <router-link v-if=" komp.link" :to="{ name:prac.name }">{{prac.name}}</router-link>
          <span        v-if="!komp.link">{{prac.name}}</span>
          <ul v-show="isPrac(prac.name)"><template v-for="disp in prac.disps">
            <li v-on:click.stop="doDisp(prac.name,disp.name)" :style="styleDisp(disp.name,disp.hsv)" :key="disp.name">
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
    
    data() { return {  comp:'None', prac:'None', disp:'None', komps:{} } },
    
    methods: {
      
      isPrac: function(prac) {
        return this.prac === prac;  },
      onComp: function(comp) {
        if( this.comp !== comp ) {
            this.comp  =  comp; } },
      onPrac: function(prac) {
        this.prac = prac; },
      onDisp: function(prac,disp) {
        this.prac = prac; this.disp = disp; },
      onPage: function (obj) {
        console.log( 'Tocs.onPage()', obj ); },
      onNone: function (obj) {
        console.log( 'Tocs.onNone()', obj ); },
      onNav:  function (obj) {
        switch( obj.level ) {
          case 'Comp' : this.onComp(obj.comp);          break;
          case 'Prac' : this.onPrac(obj.prac);          break;
          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
          default     : this.onNone(obj); } },
      doComp: function(comp) {
        this.comp = comp;
        let obj   = { level:'Comp', comp:comp, prac:'All', disp:'All', page:this.nav().page }
        this.nav().pub(obj);
        this.nav().routeLevel('Comp'); },
      doPrac: function(prac) {
        this.prac = prac;
        let obj   = { level:'Prac', prac:prac, disp:'All' }
        this.nav().pub(obj);
        this.nav().routeLevel('Prac'); },
      doDisp: function(prac,disp) {
        this.prac = prac;
        this.disp = disp;
        let obj   = { level:'Disp', prac:prac, disp:disp }
        this.nav().pub(obj);
        this.nav().routeLevel('Disp'); },
      doSelect: function(select) {
        this.publish( 'Select',   select ); },
      stylePrac: function( prac, hsv ) {
        if( prac===false ) {} // Consume arg
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      styleDisp: function( disp, hsv ) {
        if( this.disp!==disp ) {
          return { color:'black', backgroundColor:this.toRgbaHsv(hsv) }; }
        else {
          return { color:'white', backgroundColor:'black' }; } },
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
            komp.pracs = this.filterPracs( this.pracs(komp.comp), komp.comp );
            this.subscribe( key, 'Tocs.vue', (obj) => {
            //this.onComp(key);
              if( obj.disp==='All' ) { this.onPrac(obj.prac); }
              else                   { this.onDisp(obj.prac,obj.disp); } } ); } }
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
