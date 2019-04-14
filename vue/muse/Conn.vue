

<template>
  <div id="Conn" class="conn">
    <div class="tabs">
      <div :class="classTab('Practices')"    @click="pubTab('Practices')"   >Practices</div>
      <div :class="classTab('Connections')"  @click="pubTab('Connections')" >
        <router-link :to="{ name:'Conn' }">Connections</router-link></div>
      <div :class="classTab('Enlight')"      @click="pubTab('Enlight')"     >Enlight</div>
      <div :class="classTab('Data Science')" @click="pubTab('Data Science')">Data Science</div>
    </div>
    <template v-for="prac in practices">
      <div v-show="isPrac(prac.name)" :class="pracDir(prac.dir)" :key="prac.name">
        <div class="prac" :style="style(prac.hsv)"><div class="name">{{prac.name}}</div></div>
      </div>
    </template>
  </div>
</template>

<script type="module">
  
  import Build   from '../../pub/cube/Build.js'
  import Connect from '../../pub/conn/Connect.js'

  export default {

    data() {
      return { build:{}, connect:{}, comp:'Info', prac:'All', disp:'All', tab:'Connections',  practices:{} }; },

    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.prac==='All' },
      onPrac: function (prac) {
        this.prac = prac; this.disp='All'; },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      pracDir: function(dir) {
        return this.prac==='All' ? dir : 'fullPracDir'; },
      pubTab: function (tab) {
        this.tab = tab },
      classTab: function (tab) {
        return this.tab===tab ? 'tab-active' : 'tab' },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; } },

    mounted: function () {
      
      this.build     = new Build(   this.batch() );
      this.connect   = new Connect( this.build   );
      this.practices = this.pracs(  this.comp, 'Cols' );
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
        if( obj.disp==='All' ) { this.onPrac(obj.prac); }
        else                   { this.onDisp(obj.prac,obj.disp); } } ); } }

</script>

<style lang="less">
  .grid5x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:6% 13% 27% 27% 27%;
    grid-template-areas: "tabs tabs tabs tabs" "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
    justify-items:center; align-items:center; }
  
  .conn { background-color:black; position:relative; font-size:1.75vmin;
    .grid5x4(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid
    .tabs{ grid-area:tabs; display:inline; color:wheat; font-size:1.2em;
      justify-self:start; align-self:center; text-align:left; }
    .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }
    .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
    .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
    .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }
  
    .tabs {
      .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;
        border-radius:12px 12px 0 0; border-left: wheat solid thin;
        border-top:wheat solid thin; border-right:wheat solid thin; }
      .tab:hover  { background-color:wheat; color:black; }
      .tab-active { background-color:wheat; color:black; .tab(); } }
  
    .prac { display:grid; border-radius:36px; width:90%; height:80%; font-size:1em; font-weight:bold;
      .name { justify-self:center; align-self:center; text-align:center; } }
  
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
  }
</style>