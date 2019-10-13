
<template><div class="tocs-pane">
  <ul>
    <template v-for="komp in komps">
      <li :key="komp.key">
        <div   v-on:click="doComp(komp.key)">
          <div  :style="styleComp(komp.key)"><i :class="komp.icon"></i>{{komp.title}}</div>
        </div>
        <ul v-if="compKey===komp.key"><template v-for="prac in myPracs(dataKey)" >
          <li v-on:click="doPrac(prac.name)" :style="style(prac)" :key="prac.name">
            <i :class="prac.icon"></i>
            <span>{{prac.name}}</span>
            <ul v-show="pracKey===prac.name"><template v-for="disp in prac.disps">
              <li v-on:click.stop="doDisp(disp.name)" :style="style(disp)" :key="disp.name">
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
    
    data: function() {
      return { komps:{}, compPracs:{}, innovs:['Explore','Model','Simulate'],
        compKey:'Home', dataKey:'Home', pracKey:'None', dispKey:'None' } },
    
    methods: {
      myPracs: function(dataKey) {
        let pracs = {}
        if(      this.isDef(this.compPracs[dataKey]) ) { pracs = this.compPracs[dataKey];   }
        else if( this.isDef(this.komps[dataKey])     ) { pracs = this.komps[dataKey].pracs; }
        return pracs; },

      doComp:  function(compKey) {
        this.compKey = compKey;
        this.dataKey = compKey;
        let  kompKey = compKey==='Data' ? 'Info' : compKey;
        let  route   = this.komps[kompKey].route;
        this.pub( { route:route, compKey:compKey, source:'Toc' } ); },
      doPrac: function(pracKey) {
        this.pracKey  = pracKey;
        let route     = this.isMuse() ? 'Prac' : pracKey;
        let innovKey  = this.innovCompKey( pracKey, 'Data' );
        if( innovKey!== 'None' && innovKey!==this.compKey ) {
          this.doComp( innovKey ) }
        else {
          this.pub( { route:route, pracKey:pracKey, source:'Toc' } ); } },
      innovCompKey: function ( pracKey, compKey ) {
        let pracs   = this.myPracs(compKey)
        let isInnov = this.isMuse() && this.inArray(pracKey,this.innovs) && this.isDef(pracs) && this.isDef(pracs[pracKey]);
        return isInnov ? compKey : 'None' },
      doDisp: function(dispKey) {
        this.dispKey = dispKey;
        this.pub( { route:'Disp', dispKey:dispKey, source:'Toc' } ); },
      pub: function(obj) {
        this.nav().dirTabs = false;
        this.nav().pub(obj); },
      onNav:  function (obj) {
        if( obj.source !== 'Toc' ) {
          if( this.compKey !== obj.compKey ) {
              this.compKey = this.isPageKeyComp(obj.compKey) ? 'Info' : obj.compKey;
              this.dataKey = obj.compKey; }
          if( this.pracKey !== obj.pracKey ) { this.pracKey = obj.pracKey; }
          if( this.dispKey !== obj.dispKey ) { this.dispKey = obj.dispKey; } } },
      styleComp: function( compKey ) {
        return compKey===this.compKey ? { backgroundColor:'wheat', color:'black', borderRadius:'0 24px 24px 0' }
                                      : { backgroundColor:'#333',  color:'wheat', borderRadius:'0 24px 24px 0' }; },
      style: function( ikwObj ) {
        return this.styleObj(ikwObj); },
      filterPracs: function(pracs,compKey) {
        let filt = {}
        for( let key in pracs ) {
          let prac = pracs[key];
          if( prac.row !== 'Dim' || compKey === 'Prin' ) {
            filt[key] = prac; } }
        return filt; },
      mergePracs: function( base, add, keys ) {
        let pracs = this.filterPracs( this.pracs(base) )
        let merge = this.pracs(add);
        for( let key of keys ) {
          pracs[key] = merge[key]; }
        return pracs; },
      },

    beforeMount: function () {
      this.komps = this.kompsTocs();
      for( let key in this.komps ) {
        let komp = this.komps[key];
        if( komp.ikw ) {
          if( key==='Info') { komp.pracs = this.mergePracs(  'Info', 'Data', this.innovs ); }
          else              { komp.pracs = this.filterPracs( this.pracs(komp.key), komp.key ); } } }
      if( this.isPageKeyComp('Data') ) {
        this.compPracs['Data'] = this.filterPracs( this.pracs('Data'),'Data'); } },
    
    mounted: function () {
      this.subscribe( 'Nav', 'Tocs.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
   export default Tocs;
   
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .tocs-pane { font-family:@theme-font-family;
    ul { padding:0; margin:0; list-style:none; align-self:start; display:grid;
      li  { background-color:@theme-back-tocs-comp; padding-left:0.25rem; align-self:start;   // Comp
            border-radius:0 24px 24px 0; margin:0.2rem 0.2rem 0.2rem 0.2rem;
         i   { margin-right: 0.4rem; }
         div { color:@theme-color; text-decoration:none; }
         ul { font-size:@theme-tocs-size*0.65; font-weight:bold; padding:0; margin:0;
           li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;            // Prac
             i { margin-right: 0.3rem; }
             a { color:@theme-high; }
             ul { font-size:@theme-tocs-size*0.60; padding:0; margin:0 0 0 0.2rem;
               li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;       // Disp
                 i { margin-right: 0.25rem; } }
               li:hover { background-color:@theme-back!important; color:@theme-color-tocs-disp!important; } } } } } } }
</style>
