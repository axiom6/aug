
<template>
  <div class="comp" ref="Info" title="Info" >
    <template v-for="prac in practices">
      <div v-show="isPrac(prac.name)" :class="pracDir(prac.dir)" :key="prac.name"
        :ref="prac.name" :title="prac.name">
        <div class="prac">
          <div v-show="isDisp(prac.name)" :class="dispDir('cen')" :style="style(prac.hsv)">
            <div class="disp" @click="pubPrac(prac.name)">
              <i   :class="prac.icon"></i>
              <span class="name">{{prac.name}}</span>
              <span class="desc">{{prac.desc}}</span>
            </div>
          </div>
          <template  v-for="disp in prac.disps">
            <div v-show="isDisp(disp.name)" :class="dispDir(disp.dir)" :style="style(disp.hsv)"
              :ref="disp.name" :title="disp.name">
            <div class="disp" @click="pubDisp(prac.name,disp.name)">
              <i   :class="disp.icon"></i>
              <span class="name">{{disp.name}}</span>
              <span class="desc">{{disp.desc}}</span>
            </div>
            <template v-for="area in disp.areas">
              <div :class="areaDir()">
                <i :class="area.icon"></i>
                <span class="name">{{area.name}}</span>
                <span class="desc">{{area.desc}}</span>
              </div>
            </template>
          </div>
          </template>
        </div>
      </div>
    </template>
    <template v-for="row in rows">
      <div v-show="isRows()" :class="row.dir" :key="row.name"><div class="row">
        <div><i :class="row.icon"></i>{{row.name}}</div></div></div>
    </template>
  </div>  
</template>

<script type="module">
  
//import Touch from '../../pub/base/util/Touch.js';

  export default {
    
    props: { pcomp:{ type:String, default:'None' } },
    
    data() { return {
      comp:'None', prac:'All', disp:'All', practices:{},
      rows: {
        Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
        Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cogs" },
        Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },
    
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.prac==='All' },
      isDisp: function (disp) {
        return this.disp===disp || this.disp==='All' },
      isRows: function () {
        return this.prac==='All' },
      pubPrac: function (prac) {
        this.publish( this.comp, { prac:prac, disp:'All' } ); },
      pubDisp: function (prac,disp) {
        this.publish( this.comp, { prac:prac, disp:disp  } ); },
      onPrac: function (prac) {
        this.prac = prac; this.disp='All'; },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onPage: function (obj) {
        console.log( 'Prac.onPage()', obj ); },
      onNone: function (obj) {
        console.error( 'Prac Nav Error', { obj:obj } ); },
      onNav:  function (obj) {
        switch( obj.level ) {
          case 'Prac' : this.onPrac(obj.prac);          break;
          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
          case 'Page' : this.onPage(obj);               break;
          default     : this.onNone(obj); } },
      pracDir: function(dir) {
        return this.prac==='All' ? dir : 'fullPracDir'; },
      dispDir: function(dir) {
        return this.disp==='All' ? dir : 'fullDispDir'; },
      areaDir: function() {
        return this.prac==='All' ? 'none' : 'area' },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      elems: function() { // Add DON elements. Must be called within $nextTick for $refs
        this.infoElem = this.$refs['Info']
        let pracs = this.conns(this.comp); // We access conns because col practices have been filtered out
        for( let pkey in pracs ) {
          let prac = pracs[pkey];
          prac.elem = this.$refs[prac.name][0];
          this.touch.events( prac.elem );
          let disps = this.disps(this.comp,prac.name)
          for( let dkey in disps ) {
            let disp = disps[dkey];
            disp.elem = this.$refs[disp.name][0]; } } }  // this.touch.events( disp.elem );
      },

    beforeMount: function() {
      this.comp = this.$route.name.substring(0,4);  },
      // console.log( 'Prac.beforeMount()', this.$route.name, this.comp, this.pcomp  );

    mounted: function () {
    //this.touch     = new Touch();
      this.practices = this.pracs(this.comp); // 'Cols'
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
         if( obj.disp==='All' ) { this.onPrac(obj.prac); }
         else                   { this.onDisp(obj.prac,obj.disp); } } );
      this.subscribe(  "Nav",     this.comp+'.vue', (obj) => {
        this.onNav(obj); } );
      this.$nextTick( function() {
        if( this.nav().queued ) {
          this.onNav( this.nav().que('Prac',false) ) } } ); }
  }
         
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }
  
  .grid4x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:13vh 29fr 29fr 29fr;
    grid-template-areas: "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid5x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:7fr 12fr 27fr 27fr 27fr;
    grid-template-areas: "tabs tabs tabs tabs" "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid1x3() { display:grid; grid-template-columns:6fr 22fr 72fr; grid-template-areas: "icon name desc"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .bgc( @bg )
    { background-color:@bg; } // top | right | bottom | left
  
  .comp { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-prac-size;
          background-color:@theme-back; color:@theme-color-prac;
    .grid5x4(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid
      .tabs{ grid-area:tabs; display:inline; color:@theme-color; font-size:@theme-tab-size;
             justify-self:start; align-self:center; text-align:left; }
      .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }
      .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
      .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
      .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }
    
      // Placed one level below the 9 Practices Grid   - Check on background-color:#603;
    .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:@theme-prac-size;
      font-weight:bold;
      .grid3x3(); // The 4 Displine plus Practiice name Grid
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen  { font-size:@theme-cen-size; }
      div   { font-size:@theme-dir-size; } }
  
    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;
      i     { display:inline-block;  margin-right: 0.25rem; }
      .name { display:inline-block; }
      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }
  
    .area { .grid1x3(); justify-self:start; align-self:center; text-align:left; margin-left:1.5em;
      width:90%; height:auto; font-size:@theme-area-size;
      i     { grid-area:icon; }
      .name { grid-area:name; font-weight:900; }
      .desc { grid-area:desc; } }
  
    .none { display:none; }
  
    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction
    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
      .disp { justify-self:center; margin:0;
        i     { font-size:@theme-area-icon-size !important; }
        .name { font-size:@theme-area-name-size !important; }
        .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc
      .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }
  
    .none { display:none; }
    
    // Placed one level above .prac at the 9 Practices Grid Direction
    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;
      .prac { font-size:@theme-full-size; width:100%; height:100%;
              justify-self:center; align-self:center; display:grid; border-radius:0.5rem;
        div {     padding-bottom:2rem;
          .disp { padding-bottom:0;
            i     { font-size:@theme-disp-size; }
            .name { font-size:@theme-disp-size; }
            .desc { font-size:@theme-disp-size; display:block; } } }  // Turns on .disp .desc
          .area { padding-bottom:0; } } }
  
    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction
    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
       .disp { justify-self:center; margin:0;
         i     { font-size:@theme-area-icon-size !important; }
         .name { font-size:@theme-area-name-size !important; }
         .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc
       .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }
    
    .em, .in, .en { .prac .cen { font-size:@theme-row-size; } } // Font size columns
  
    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:@theme-row-size;
      font-weight:bold; display:grid;
      div { text-align:center; justify-self:center;  align-self:center; font-size:@theme-row-size; color:@theme-color; }
      i { margin-bottom: 0.2rem; display:block; } }
    
    
  }
  
</style>
