
<template><div class="tocs">
  <ul><template v-for="komp in komps">
    <li :key="komp.name"><span v-on:click="showPlane(komp.name)">
      <router-link :to="{ name:komp.name }">{{komp.name}}</router-link></span>
      <ul  v-if="plane===komp.name"><template v-for="prac in komps[komp.name].pracs" >
        <li v-on:click="showPrac(prac.name)" :style="style(prac.hsv)" :key="prac.name">{{prac.name}}
          <ul><template v-for="disp in prac.disps">
            <li v-on:click.stop="showDisp(prac.name,disp.name)" :style="style(disp.hsv)" :key="disp.name"
              :data-dir="disp.dir">{{disp.name}}</li>
          </template></ul>
        </li>
      </template></ul>
    </li>
  </template></ul>
</div></template>

<script type="module">
  
  let Tocs = {
    
    data() { return { plane:'None', prac:'None',
        komps:{ Cube:{ name:'Cube', pracs:{} },
                Info:{ name:'Info', pracs:{} },
                Know:{ name:'Know', pracs:{} },
                Wise:{ name:'Wise', pracs:{} },
                Svga:{ name:'Svga', pracs:{} } } } },
    
    methods: {
      showPlane: function(plane) {
        this.plane =  plane;
        this.showPrac('All'); },
      showPrac: function(prac) {
        this.prac = prac;
        this.publish( this.plane, { prac:this.prac, disp:'All' } ); },
      showDisp: function(prac,disp) {
        this.publish( this.plane, { prac:prac,      disp:disp  } ); },
      doSelect: function(select) {
        this.publish( 'Select',   select ); },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; } },
    
    mounted: function () {
      for( let key in this.komps ) {
        if( this.komps.hasOwnProperty(key) && key !== 'Cube' && key !== 'Svga' ) {
          this.komps[key].pracs = this.pracs(key); } } } };
  
   export default Tocs;
   
</script>

<style lang="less">
  .tocs { background-color:black;
    ul { padding:0; list-style:none; align-self:start; font-size:3vh; display:grid;
      li  { background-color:#333; padding-left:0.25em; align-self:start;                            // Comp
            border-radius:0 24px 24px 0; margin:0.2em 0.2em 0.2em 0.2em;
         a  { color:wheat; text-decoration:none; }
         ul { font-size:2vh;
           li { border-radius:0 12px 12px 0; color:black; margin:0.2em 0.2em 0.2em 0.2em;            // Prac
             ul { font-size:1.5vh; margin-left:1em; display:none;
               li { border-radius:0 12px 12px 0; color:white; margin:0.2em 0.2em 0.2em 0.2em; } } }  // Disp
           li:hover { background-color:coral; color:black;                                           // Prac :hover
             ul { font-size:1.5vh; margin-left:1em; display:block;
               li { border-radius:0 12px 12px 0;  color:black; margin:0.2em 0.2em 0.2em 0.2em; }     // Disp :hover
               li:hover { background-color:black!important; color:white; }
           } } } } }
  }
  
</style>
