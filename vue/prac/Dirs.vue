
<template>
  <div class="dirs" prac="prac">
    <div :class="dispDir('cen')" :style="style(prac.hsv)">
      <div class="disp" @click="doPrac(prac)">
        <i   :class="prac.icon"></i>
        <span class="name">{{prac.name}}</span>
        <span class="desc">{{prac.desc}}</span>
      </div>
    </div>
    <template  v-for="disp in prac.disps">
      <div v-show="isDisp(disp.name)" :class="dispDir(disp.dir)" :style="style(disp.hsv)"
        :ref="disp.name" :title="disp.name">
        <div class="disp" @click="doDisp(prac.name,disp.name)">
          <i   :class="disp.icon"></i>
          <span class="name">{{disp.name}}</span>
          <span class="desc">{{disp.desc}}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">

  let Dirs = {

    props: { comp:String, prac:Object },

    data() { return { disp:"All" } },

    methods: {

      isPage:  function () {
        return this.nav().page === 'Dirs'; },
      isDisp: function (disp) {
        return this.disp===disp || this.disp==='All' },
      doPrac: function (prac) {
        publish( this.comp, prac ); },
      doDisp: function (prac,disp) {
        this.publish( this.comp, { prac:prac, disp:disp } ); },
      pracDir: function(dir) {
        return this.prac==='All' ? dir : 'pracFull'; },
      dispDir: function(dir) {
        return this.disp==='All' ? dir : 'dispFull'; },
      areaDir: function() {
        return this.prac==='All' ? 'none' : 'area' },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; } },

    mounted: function () {}
  }

  export default Dirs;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .dirs { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:black; text-align:center; font-weight:bold; .theme-prac();
    
      .grid3x3(); // The 4 Displine plus Practiice name Grid
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen  { font-size:@theme-cen-size; } }

    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;
      i     { display:inline-block;  margin-right: 0.25rem; }
      .name { display:inline-block; }
      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }

   
    // Placed one level above .prac at the 9 Practices Grid Direction
    .pracFull { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;
      .prac { font-size:@theme-full-size; width:100%; height:100%;
        justify-self:center; align-self:center; display:grid; border-radius:0.5rem;
        div {     padding-bottom:2rem;
          .disp { padding-bottom:0;
            i     { font-size:@theme-disp-size; }
            .name { font-size:@theme-disp-size; }
            .desc { font-size:@theme-disp-size; display:block; } } }  // Turns on .disp .desc
        .area { padding-bottom:0; } } }
    
    // May not belong here
    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction
    .dispFull { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
      .disp { justify-self:center; margin:0;
        i     { font-size:@theme-area-icon-size !important; }
        .name { font-size:@theme-area-name-size !important; }
        .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc
      .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }
  
</style>