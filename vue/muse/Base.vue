
<template>
  <div class="comp">
    <template v-for="prac in practices">
      <div v-show="isPrac(prac.name)" :class="pracClass(prac.dir)" :key="prac.name">
        <div class="prac">
          <div v-show="isDisp(prac.name)" :class="dispClass('cen')" :style="style(prac.hsv)">
            <div class="disp">
              <i   :class="prac.icon"></i>
              <span class="name">{{prac.name}}</span>
              <span class="desc">{{prac.desc}}</span>
            </div>
          </div>
          <template v-for="disp in prac.disps">
            <div v-show="isDisp(disp.name)" :class="dispClass(disp.dir)" :style="style(disp.hsv)">
              <div class="disp">
                  <i   :class="disp.icon"></i>
                  <span class="name">{{disp.name}}</span>
                  <span class="desc">{{disp.desc}}</span>
              </div>
              <template v-for="area in disp.areas">
                <div :class="areaClass()">
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
    
    data() {
      return { comp:'None', prac:'All', disp:'All', area:'All', practices:{}, baseCols:{},
        rows:{ Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
               Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cogs" },
               Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },
    
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.prac==='All' },
      isDisp: function (disp) {
        return this.disp===disp || this.disp==='All' },
      isArea: function (area) {
        return this.area===area || this.area==='All' },
      isRows: function () {
        return this.prac==='All' },
      onPrac: function (prac) {
        this.prac = prac; this.disp='All'; },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onArea: function (prac,disp,area) {
        this.prac = prac; this.disp = disp; this.area = area; },
      pracClass: function(dir) {
        return this.prac==='All' ? dir : 'fullPrac'; },
      dispClass: function(dir) {
        return this.disp==='All' ? dir : 'fullDisp'; },
      areaClass: function() {
        return this.prac!=='All' ? 'area' : 'none' }, // this.area!=='All' ? 'area' : 'fullArea'; },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; } },

    mounted: function () {
      if( this.onArea===false ) {}
      this.practices = this.pracs(this.comp,'Cols');
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
         if( obj.disp==='All' ) { this.onPrac(obj.prac); }
         else                   { this.onDisp(obj.prac,obj.disp); } } ); } }
         
</script>

<style lang="less">
  
  @import '../../css/fontawesome/init.css';

  .grid3x3() { display:grid; grid-template-columns:33% 33% 34%; grid-template-rows:33% 33% 34%;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }
  
  .grid4x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:13% 29% 29% 29%;
    grid-template-areas: "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid1x3() { display:grid; grid-template-columns:10% 25% 65%; grid-template-areas: "icon name desc"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .bgc( @bg )
    { background-color:@bg; }
  
  .comp { background-color:black; position:relative; font-size:1.75vmin;
    
    .grid4x4(); justify-items:center; align-items:center; // The 4x4 Dim + Per + 9 Practices Grid
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
      .cen  { font-size:1.5em; }
      div   { font-size:1.2em; } }
  
    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:1.2em;
      i     { display:inline-block;  margin-right: 0.3em; }
      .name { display:inline-block; }
      .desc { display:none; margin:0.5em 0.5em 0.5em 0.5em; text-align:left; } }
    
    .area { .grid1x3(); justify-self:start; align-self:center; text-align:left; margin-left:1.5em;
            width:100%; height:0.8em; font-size:1em;
      i     { grid-area:icon; }
      .name { grid-area:name; font-weight:900; }
      .desc { grid-area:desc; } }
  
    .none { display:none; }
    
    // Placed one level above .prac at the 9 Practices Grid level
    .fullPrac { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;
      .prac { font-size:1em; width:100%; height:100%;
              justify-self:center; align-self:center; display:grid; border-radius:0.5em;
        div {     padding-bottom:2em;
          .disp { padding-bottom:0;
            i     { font-size:1.4em; }
            .name { font-size:1.4em; }
            .desc { font-size:1.0em; display:block; } } }  // Turns on .disp .desc
          .area { padding-bottom:0; } } }
  
    // Placed one level below .prac at the 4 Disipline plus Practice name Grid
    .fullDisp { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
       .disp    { text-align:center; justify-self:start;  align-self:center; font-size:2em; margin:0; } }
  
    // Placed one level below .disp
    .fullArea { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
      .area  { text-align:center; justify-self:center;  align-self:center; font-size:2em; }
      i      { margin-right:0.5em; } }
    
    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:1em;
           font-weight:bold; display:grid;
      div { text-align:center; justify-self:center;  align-self:center; font-size:2em; color:wheat; }
        i { margin-bottom: 0.2em; display:block; } }
  
    .em, .in, .en { .prac .cen { font-size:1em; } } // Font size columns
  }
  
</style>
