
<template>
  <div v-show="isDisp(dispp.name)" :class="dispDir(dispp.dir)" :style="style(dispp.hsv)">
    <div class="disp" @click="pubDisp(pracp.name,dispp.name)">
      <i   :class="dispp.icon"></i>
      <span class="name">{{dispp.name}}</span>
      <span class="desc">{{dispp.desc}}</span>
    </div>
    <template v-for="areap in dispp.areas">
      <div :class="areaDir()">
        <i :class="areap.icon"></i>
        <span class="name">{{areap.name}}</span>
        <span class="desc">{{areap.desc}}</span>
      </div>
    </template>
  </div>
</template>

<script type="module">

  export default {
    
    props:{ pracp:Object, dispp:Object, areap:Object },

    data() {
      return { pracd:'All', dispd:'All' } },

    methods: {
      comp:   function() {
        return this.pracp.plane; },
      isDisp: function (dispd) {
        return this.dispd===dispd || this.dispd==='All'  },
      onPrac: function (pracd) {
        this.pracd = pracd; this.disp='All'; },
      onDisp: function (pracd,dispd) {
        this.pracd = pracd; this.dispd=dispd; },
      pubDisp: function (pracn,dispn) {
        this.publish( this.comp(), { prac:pracn, disp:dispn } ); },
      dispDir: function(dir) {
        return this.dispd==='All' ? dir : 'fullDispDir'; },
      areaDir: function() {
        return this.pracd==='All' ? 'none' : 'area' },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) };  } },

    mounted: function () {
      this.subscribe(  this.comp(), 'Disp.vue', (obj) => {
        if( obj.disp==='All' ) { this.onPrac(obj.prac); }
        else                   { this.onDisp(obj.prac,obj.disp); }
        console.log( 'Disp.subscribe()', { name:this.dispp.name, obj:obj, pracd:this.pracd, dispd:this.dispd } ); } );
    }

  }


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

  // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction
  .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
    .disp { justify-self:center; margin:0;
      i     { font-size:4.8em !important; }
      .name { font-size:4.8em !important; }
      .desc { font-size:2.4em !important; display:block; } }  // Turns on .disp .desc
    .area {   font-size:3.0em !important; padding-bottom:0; } }
  
</style>