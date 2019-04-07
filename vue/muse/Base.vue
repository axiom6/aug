
<template>
  <div class="comp">
    <template v-for="prac in practices">
      <div v-show="isPrac(prac.name)" :class="pracClass(prac.dir)" :key="prac.name">
        <div class="prac">
          <div     v-show="isDisp(prac.name)" :class="dispClass('cen')"    data-dir="cen">
            <div class="disp">{{prac.name}}</div></div>
          <template v-for="disp in prac.disps">
              <div v-show="isDisp(disp.name)" :class="dispClass(disp.dir)" :data-dir="disp.dir">
                <div class="disp">{{disp.name}}</div></div>
          </template>
        </div>
      </div>
    </template>
  </div>  
</template>

<script type="module">

  export default {
    
    data() {
      return { comp:'None', prac:'All', disp:'All', practices:{} } },
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.prac==='All' },
      isDisp: function (disp) {
        return this.disp===disp || this.disp==='All' },
      onPrac: function (prac) {
        this.prac = prac; this.disp = 'All'; },
      onDisp: function (disp) {
        this.disp= disp; },
      pracClass: function(dir) {
        return this.prac==='All' ? dir : 'fullPrac'; },
      dispClass: function(dir) {
        return this.disp==='All' ? dir : 'fullDisp'; } },

    mounted: function () {
      this.practices = this.pracs(this.comp);
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
         if( obj.disp==='All' ) { this.onPrac(obj.prac); }
         else                   { this.onDisp(obj.disp); } } ); } }
</script>

<style lang="less">

.grid3x3() { display:grid; grid-template-columns:33% 33% 34%; grid-template-rows:33% 33% 34%;
             grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

.pdir( @dir     ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
  justify-items:center; align-items:center; }

.ddir( @dir,@bg ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
  border-radius:36px; background-color:@bg }

.bgc( @bg )
  { background-color:@bg; }

.comp { background-color:black; position:relative;

  // The 9 Practices Grid
  .grid3x3(); justify-items:center; align-items:center;
    .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
    .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
    .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }

  // Placed one level below the 9 Practices Grid
  .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:3vh; font-weight:bold;
    .grid3x3(); // The 4 Displine plus Practiice name Grid
      .cen   { .ddir(cen,coral); font-size:4vh; }
      .west  { .ddir(west,springgreen); }
      .north { .ddir(north,gold);   }
      .east  { .ddir(east,salmon);  }
      .south { .ddir(south,peru);   }
       div .disp { text-align:center; justify-self:center;  align-self:center; } }

  // Placed one level above .prac at the 9 Practices Grid level
  .fullPrac { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;
    .prac { font-size:1.5em; width:100%; height:100%; background-color:#603;
            justify-self:center; align-self:center; display:grid; border-radius:0.5em; }
    div .disp  { text-align:center; justify-self:center;  align-self:center; font-size:2em; } }

  // Placed one level below .prac at the 4 Disipline plus Practice name Grid
  .fullDisp { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;
     .disp  { text-align:center; justify-self:center;  align-self:center; font-size:2em; } }
  [data-dir="cen"  ] { .bgc(coral);  }
  [data-dir="west" ] { .bgc(springgreen); }
  [data-dir="north"] { .bgc(gold);   }
  [data-dir="east" ] { .bgc(salmon); }
  [data-dir="south"] { .bgc(peru);   }

}

</style>

