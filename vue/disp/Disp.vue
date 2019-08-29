
<template>
  <div class="disp" ref="Disp" title="Disp">
    <b-tabs :comp="comp" :pages="pages"></b-tabs>
    <d-desc v-show="pages['Desc'].show" :comp="comp" :prac="prac" :disp="disp"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Desc from './Desc.vue';
  
  let Disp = {

    components:{ 'b-tabs':Tabs, 'd-desc':Desc },
    
    data() { return {
      comp:'None', prac:'None', disp:'None', pobj:null, dobj:null,
      pages:{
        Desc: { name:'Desc', show:false } } } },
    
    methods: {
      onPage: function() {
        if( !this.isDef(this.pages[this.nav().page]) ) {
          this.nav().page = 'Desc'; }
        for( let pkey in this.pages ) {
          this.pages[pkey].show = pkey === this.nav().page; } },
      onNav:  function (obj) {
        if( obj===false ) {}
        this.onPage(); } },

    beforeMount: function() {
      this.comp = this.nav().comp;
      this.prac = this.nav().prac;
      this.disp = this.nav().disp;
      this.onPage(); },

    mounted: function () {
      this.practices = this.pracs(this.comp); // 'Cols'
      this.subscribe(  "Nav",     this.comp+'.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .grid5x4() { display:grid; grid-template-columns:13fr 29fr 29fr 29fr; grid-template-rows:8fr 24fr 24fr 24fr 24fr;
    grid-template-areas: "tabs tabs tabs tabs" "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid1x3() { display:grid; grid-template-columns:6fr 22fr 72fr; grid-template-areas: "icon name desc"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .bgc( @bg )
    { background-color:@bg; } // top | right | bottom | left
  
  .comp { position:relative; left:0; top:0; right:0; bottom:0; font-size:@theme-prac-size;
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
  
    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction
    .dispFull { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;
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

