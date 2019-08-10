
<template><div class="tocs">
  <ul>
    <template v-for="komp in komps">
    <li :key="komp.name">
      <div   v-on:click="pubComp(komp.name)">
        <router-link :to="{ name:komp.comp }"><i :class="komp.icon"></i>{{komp.name}}</router-link>
      </div>
      <ul  v-if="comp===komp.name"><template v-for="prac in komps[komp.name].pracs" >
        <li v-on:click="pubPrac(prac.name)" :style="stylePrac(prac.name,prac.hsv)" :key="prac.name">
          <i :class="prac.icon"></i>
          <router-link v-if=" komp.link" :to="{ name:prac.name }">{{prac.name}}</router-link>
          <span        v-if="!komp.link">{{prac.name}}</span>
          <ul v-show="isPrac(prac.name)"><template v-for="disp in prac.disps">
            <li v-on:click.stop="pubDisp(prac.name,disp.name)" :style="styleDisp(disp.name,disp.hsv)" :key="disp.name">
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
        this.nav().set( { level:'Prac', comp:comp  } );
        this.nav().pub( { level:'Tabs', tab:this.nav().tab } ); // Init view with Prac tab
        this.comp = comp },
      onPrac: function(prac) {
        this.nav().set( { level:'Prac', prac:prac } );
        this.prac = prac; },
      onDisp: function(prac,disp) {
        this.nav().set( { level:'Disp', prac:prac, disp:disp } );
        this.prac = prac; this.disp = disp; },
      onTabs: function () {}, // does nothing
      onNone: function (obj) {
        console.log( 'Tocs Level  ?', { obj:obj } ); },
      onNav:  function (obj) {
        // console.log( 'Tocs.onNav()', { toc:this.comp, nav:obj.comp } );
        if( this.comp !== obj.comp ) {
            this.comp  =  obj.comp; } // Just reset the comp since Nav will call router
        switch( obj.level ) {
          case 'Prac' : this.onPrac(obj.prac);          break;
          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
          case 'Tabs' : this.onTabs();                  break;
          default     : this.onNone(obj); } },
      pubComp: function(comp) {
        this.comp = comp;
        if( this.komps[this.comp].ikw ) {
            this.pubPrac('All'); } },
      pubPrac: function(prac) {
        this.prac = prac;
     //this.nav().pub( { level:'Tabs', tab:this.nav().tab } ); // Init view with Prac tab
        this.publish( this.comp, { prac:this.prac, disp:'All' } ); },
      pubDisp: function(prac,disp) {
        this.publish( this.comp, { prac:prac, disp:disp  } ); },
      doSelect: function(select) {
        this.publish( 'Select',   select ); },
      stylePrac: function( prac, hsv ) {
        if( prac===false ) {} // Consume arg
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      styleDisp: function( disp, hsv ) {
        if( this.disp!==disp ) {
          return { color:'black', backgroundColor:this.toRgbaHsv(hsv) }; }
        else {
          return { color:'white', backgroundColor:'black' }; } } },
    
    mounted: function () {
      this.komps = this.kompsTocs();
      for( let key in this.komps ) {
        if( this.komps.hasOwnProperty(key) && this.komps[key].ikw ) {
          this.komps[key].pracs = this.pracs(key);
          this.subscribe( key, 'Tocs.vue', (obj) => {
            this.onComp(key);
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
         i  { margin-right: 0.4rem; }
         a  { color:@theme-color; text-decoration:none; }
         ul { font-size:@theme-tocs-size*0.60; font-weight:bold; padding:0; margin:0;
           li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;            // Prac
             i { margin-right: 0.3rem; }
             a { color:@theme-high; }
             ul { font-size:@theme-tocs-size*0.50; padding:0; margin:0 0 0 0.2rem;
               li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;       // Disp
                 i { margin-right: 0.25rem; } }
               li:hover { background-color:@theme-back!important; color:@theme-color-tocs-disp!important; } } } } } } }
</style>
