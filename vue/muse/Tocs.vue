
<template><div class="tocs">
  <ul>
    <template v-for="komp in komps">
    <li :key="komp.name">
      <div   v-on:click="pubComp(komp.name)">
        <router-link :to="{ name:komp.comp }"><i :class="komp.icon"></i>{{komp.name}}</router-link>
      </div>
      <ul  v-if="comp===komp.name"><template v-for="prac in komps[komp.name].pracs" >
        <li v-on:click="pubPrac(prac.name)" :style="stylePrac(prac.name,prac.hsv)" :key="prac.name">
          <i :class="prac.icon"></i>{{prac.name}}
          <ul v-show="isPrac(prac.name)"><template v-for="disp in prac.disps">
            <li v-on:click.stop="pubDisp(prac.name,disp.name)" :style="styleDisp(disp.name,disp.hsv)" :key="disp.name">
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
    
    data() { return {  comp:'None', prac:'None', disp:'None',
        komps:{ Info:{ name:'Info', comp:'Info', pracs:{}, ikw:true,  icon:"fas fa-th"          },
                Know:{ name:'Know', comp:'Know', pracs:{}, ikw:true,  icon:"fas fa-university"  },
                Wise:{ name:'Wise', comp:'Wise', pracs:{}, ikw:true,  icon:"fab fa-tripadvisor" },
                Cube:{ name:'Cube', comp:'Cube', pracs:{}, ikw:false, icon:"fas fa-cubes"       },
                Wood:{ name:'Wood', comp:'Wood', pracs:{}, ikw:false, icon:"fas fa-tree"        } } } },
    
    methods: {
      
      isPrac: function(prac) {
        return this.prac === prac;  },
      onComp: function(comp) {
        this.comp = comp; },
      onPrac: function(prac) {
        this.prac = prac; },
      onDisp: function(prac,disp) {
        this.prac = prac; this.disp = disp; },
      pubComp: function(comp) {
        this.comp =   comp;
        this.pubPrac('All'); },
      pubPrac: function(prac) {
        this.prac = prac;
        this.publish( this.comp, { prac:this.prac, disp:'All' } ); },
      pubDisp: function(prac,disp) {
        this.publish( this.comp, { prac:prac,      disp:disp  } ); },
      doSelect: function(select) {
        this.publish( 'Select',   select ); },
      stylePrac: function( prac, hsv ) {
        if( prac===false ) {} // Consume arg
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      styleDisp: function( disp, hsv ) {
        if( this.disp!==disp ) {
          return { color:'black', backgroundColor:this.toRgbaHsv(hsv) }; }
        else {
          return { color:'white', backgroundColor:'black' }; } } },
    
    mounted: function () {
      
      for( let key in this.komps ) {
        if( this.komps.hasOwnProperty(key) && this.komps[key].ikw ) {
          this.komps[key].pracs = this.pracs(key);
          this.subscribe( key, 'Tocs.vue', (obj) => {
            this.onComp(key);
            if( obj.disp==='All' ) { this.onPrac(obj.prac); }
            else                   { this.onDisp(obj.prac,obj.disp); } } ); } }
      }
    }
  
   export default Tocs;
   
</script>

<style lang="less">
  @import '../../css/fontawesome/init.css'; // top | right | bottom | left
  .tocs { background-color:black; font-size:3vh;
    ul { padding:0; margin:0; list-style:none; align-self:start; display:grid;
      li  { background-color:#333; padding-left:0.25em; align-self:start;                            // Comp
            border-radius:0 24px 24px 0; margin:0.2em 0.2em 0.2em 0.2em;
         i  { margin-right: 0.4em; }
         a  { color:wheat; text-decoration:none; }
         ul { font-size:0.8em; font-weight:bold; padding:0; margin:0;
           li { border-radius:0 12px 12px 0; color:black; margin:0.2em 0.2em 0.2em 0.2em;            // Prac
             i { margin-right: 0.3em; }
             ul { font-size:0.8em; padding:0; margin:0 0 0 0.2em;
               li { border-radius:0 12px 12px 0; color:black; margin:0.2em 0.2em 0.2em 0.2em;       // Disp
                 i { margin-right: 0.25em; } }
               li:hover { background-color:black!important; color:white!important; } } } } } } }
</style>
