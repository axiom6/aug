
<template><div class="tocs-pane">
  <ul>
    <template v-for="komp in komps">
      <li :key="komp.key">
        <div   v-on:click="doComp(komp.key)">
          <div  :style="styleComp(komp.key)"><i :class="komp.icon"></i>{{komp.title}}</div>
        </div>
        <ul v-if="myKomp(komp.key)"><template v-for="prac in tocPracs(compKey,inovKey)" >
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
      return { komps:{}, compKey:'Home', inovKey:'None', pracKey:'None', dispKey:'None', routNav:'None' } },
    
    methods: {
      myKomp: function(kompKey) {
        return kompKey===this.compKey && this.mix().isBatch(this.compKey) },
      doComp: function(compKey) {
        let  route   = this.komps[compKey].route;
        this.compKey = compKey;
        this.inovKey = compKey;
        let obj = { route:route, compKey:compKey, inovKey:this.inovKey, source:'Toc' }
        this.pub( obj ); }, // this.mix().nav().pubInov( obj )
      doPrac: function(pracKey) {
        this.pracKey = pracKey;
        let route    = this.mix().isMuse() ? 'Prac' : pracKey;
        this.pub( { route:route, pracKey:pracKey, source:'Toc' } ); },
      doDisp: function(dispKey) {
        this.dispKey = dispKey;
        let route    = this.mix().isMuse() ? 'Disp' : dispKey;
        this.pub( { route:route, dispKey:dispKey, source:'Toc' } ); },
      pub: function(obj) {
        this.mix().nav().dirTabs = false;
        this.mix().nav().pub(obj); },
      onNav:  function (obj) {
        if( obj.source !== 'Toc' ) {
          if( this.keyEq(this.compKey,obj.compKey ) ) { this.compKey = obj.compKey; }
          if( this.keyEq(this.pracKey,obj.pracKey ) ) { this.pracKey = obj.pracKey; }
          if( this.keyEq(this.dispKey,obj.dispKey ) ) { this.dispKey = obj.dispKey; }
          if( this.keyEq(this.inovKey,obj.inovKey ) ) { this.inovKey = obj.inovKey; }
          if( this.keyEq(this.routNav,obj.route   ) ) { this.routNav = obj.route;   } } },
      keyEq: function( tkey, okey ) {
         return this.mix().isDef(okey) && tkey !== okey; },
      styleComp: function( kompKey ) {
        return this.myKomp(kompKey) ? { backgroundColor:'wheat', color:'black', borderRadius:'0 24px 24px 0' }
                                    : { backgroundColor:'#333',  color:'wheat', borderRadius:'0 24px 24px 0' }; },
      style: function( ikwObj ) {
        return this.mix().styleObj(ikwObj); },

      tocPracs: function(compKey,inovKey) {
        let pracs = this.mix().inovObject( compKey, inovKey );
        let filts = {}
        for( let key in pracs ) {
          let prac = pracs[key];
          if( prac.row !== 'Dim' || compKey === 'Prin' ) {
            filts[key] = prac; } }
        return filts; },
      },

    beforeMount: function () {
      this.komps = this.mix().kompsTocs(); },
    
    mounted: function () {
      this.mix().subscribe( 'Nav', 'Tocs.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
   export default Tocs;
   
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @tocsFS:2*@themeFS;
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
