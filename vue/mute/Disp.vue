
<template>
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

<script type="module">

  export default {

    data() {
      return { comp:'None', prac:'All', disp:'All', area:'All', tab:'Practices', practices:{}, baseCols:{} } },

    methods: {
      isDisp: function (disp) {
        return this.disp===disp || this.disp==='All' },
      isArea: function (area) {
        return this.area===area || this.area==='All' },
      pubDisp: function (prac,disp) {
        this.publish( this.comp, { prac:prac, disp:disp  } ); },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onArea: function (prac,disp,area) {
        this.prac = prac; this.disp = disp; this.area = area; },
      dispDir: function(dir) {
        return this.disp==='All' ? dir : 'fullDispDir'; },
      areaDir: function() {
        return this.prac!=='All' ? 'area' : 'none' },
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
  
  .grid1x3() { display:grid; grid-template-columns:6% 22% 72%; grid-template-areas: "icon name desc"; }
  
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
  
</style>