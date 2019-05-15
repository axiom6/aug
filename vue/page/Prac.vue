
<template>
  <div class="comp">
    <template v-for="prac in practices">
      <div v-show="isPrac(prac.name)" :class="pracDir(prac.dir)" :key="prac.name">
        <div class="prac">
          <div v-show="isDisp(prac.name)" :class="dispDir('cen')" :style="style(prac.hsv)">
            <div class="disp" @click="pubPrac(prac.name)">
              <i   :class="prac.icon"></i>
              <span class="name">{{prac.name}}</span>
              <span class="desc">{{prac.desc}}</span>
            </div>
          </div>
          <template  v-for="disp in prac.disps">
            <div v-show="isDisp(disp.name)" :class="dispDir(disp.dir)" :style="style(disp.hsv)">
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

  export default {
    
    props: { pcomp:{ type:String, default:'None' } },
    
    data() { return {
      comp:'None', prac:'All', disp:'All', tab:'Practices', practices:{},
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
      pubTab: function (tab) {
        this.tab = tab },
      classTab: function (tab) {
        return this.tab===tab ? 'tab-active' : 'tab' },
      pubPrac: function (prac) {
        this.publish( this.comp, { prac:prac, disp:'All' } ); },
      pubDisp: function (prac,disp) {
        this.publish( this.comp, { prac:prac, disp:disp  } ); },
      onPrac: function (prac) {
        this.prac = prac; this.disp='All'; },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onTabs: function (tab) {
        if( tab==='Practices' && this.tab==='Practices' && this.prac!=='All' ) {
          this.onPrac('All'); }
        this.tab = tab; },
      pracDir: function(dir) {
        return this.prac==='All' ? dir : 'fullPracDir'; },
      dispDir: function(dir) {
        return this.disp==='All' ? dir : 'fullDispDir'; },
      areaDir: function() {
        return this.prac==='All' ? 'none' : 'area' },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; } },

    beforeMount: function() {
      this.comp = this.$route.name.substring(0,4);  },
      // console.log( 'Prac.beforeMount()', this.$route.name, this.comp, this.pcomp  );

    mounted: function () {
      this.practices = this.pracs(this.comp,'Cols');
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
         if( obj.disp==='All' ) { this.onPrac(obj.prac); }
         else                   { this.onDisp(obj.prac,obj.disp); } } );
      this.subscribe(  "Tabs",    this.comp+'.vue', (obj) => {
        this.onTabs(obj); } ); }
  }
         
</script>

<style lang="less">
  
  //@import '../../css/fontawesome/init.css';

  .grid3x3() { display:grid; grid-template-columns:33% 33% 34%; grid-template-rows:33% 33% 34%;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }
  
  .grid4x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:13% 29% 29% 29%;
    grid-template-areas: "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid5x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:7% 12% 27% 27% 27%;
    grid-template-areas: "tabs tabs tabs tabs" "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid1x3() { display:grid; grid-template-columns:6% 22% 72%; grid-template-areas: "icon name desc"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .bgc( @bg )
    { background-color:@bg; } // top | right | bottom | left
  
  .comp { background-color:black; position:absolute; left:0; top:5%; right:0; bottom:0; font-size:1.75vmin;
    
    .grid5x4(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid
      .tabs{ grid-area:tabs; display:inline; color:wheat; font-size:1.2em;
             justify-self:start; align-self:center; text-align:left; }
      .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }
      .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
      .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
      .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }
    
      // Placed one level below the 9 Practices Grid
    .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:1em; font-weight:bold;
      .grid3x3(); // The 4 Displine plus Practiice name Grid
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen  { font-size:1.3em; }
      div   { font-size:1.1em; } }
  
    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:1.2em;
      i     { display:inline-block;  margin-right: 0.25em; }
      .name { display:inline-block; }
      .desc { display:none; margin:0.5em 0.5em 0.5em 0.5em; text-align:left; } }
  
    .area { .grid1x3(); justify-self:start; align-self:center; text-align:left; margin-left:1.5em;
      width:90%; height:auto; font-size:1.3em;
      i     { grid-area:icon; }
      .name { grid-area:name; font-weight:900; }
      .desc { grid-area:desc; } }
  
    .none { display:none; }
  
    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction
    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
      .disp { justify-self:center; margin:0;
        i     { font-size:4.8em !important; }
        .name { font-size:4.8em !important; }
        .desc { font-size:2.4em !important; display:block; } }  // Turns on .disp .desc
      .area {   font-size:3.0em !important; padding-bottom:0; } }
  
    .none { display:none; }
    
    // Placed one level above .prac at the 9 Practices Grid Direction
    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;
      .prac { font-size:1em; width:100%; height:100%;
              justify-self:center; align-self:center; display:grid; border-radius:0.5em;
        div {     padding-bottom:2em;
          .disp { padding-bottom:0;
            i     { font-size:1.6em; }
            .name { font-size:1.6em; }
            .desc { font-size:1.0em; display:block; } } }  // Turns on .disp .desc
          .area { padding-bottom:0; } } }
  
    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction
    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
       .disp { justify-self:center; margin:0;
         i     { font-size:4.8em !important; }
         .name { font-size:4.8em !important; }
         .desc { font-size:2.4em !important; display:block; } }  // Turns on .disp .desc
       .area {   font-size:3.0em !important; padding-bottom:0; } }
    
    .em, .in, .en { .prac .cen { font-size:1em; } } // Font size columns
  
    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:1em;
      font-weight:bold; display:grid;
      div { text-align:center; justify-self:center;  align-self:center; font-size:1.8em; color:wheat; }
      i { margin-bottom: 0.2em; display:block; } }
    
    
  }
  
</style>
