
<template>
  <div class="tocs">
    <ul>
      <template v-for="komp in komps">
          <li :key="komp.name"><span v-on:click="showPlane(komp.name)">
            <router-link :to="{ name:komp.name }">{{komp.name}}</router-link></span>
            <ul  v-if="plane===komp.name">
              <template v-for="prac in komps[komp.name].pracs" >
                <li v-on:click="showPrac(prac.name)" :key="prac.name">{{prac.name}}
                  <ul>
                    <template v-for="disp in prac.disps">
                      <li v-on:click.stop="showDisp(disp.name)" :key="disp.name" :data-dir="disp.dir">{{disp.name}}</li>
                    </template>
                  </ul>
                </li>
              </template>
            </ul>
          </li>
      </template>
    </ul>
  </div>
</template>

<script type="module">
  
  let Tocs = {
    
    data() { return { plane:'None', prac:'None',
        komps:{ Info:{ name:'Info', pracs:{} },
                Know:{ name:'Know', pracs:{} },
                Wise:{ name:'Wise', pracs:{} } } } },
    methods: {
      showPlane: function(plane) {
        this.plane =  plane;
        this.showPrac('All'); },
      showPrac: function(prac) {
        this.prac = prac;
        this.publish( this.plane, { prac:this.prac, disp:'All' } ); },
      showDisp: function(disp) {
        this.publish( this.plane, { prac:this.prac, disp:disp  } ); },
      doSelect: function(select) {
        this.publish( 'Select',   select ); } },
    mounted: function () {
      for( let key in this.komps ) {
        if( this.komps.hasOwnProperty(key) ) {
          this.komps[key].pracs = this.pracs(key); } } } };
  
   export default Tocs;
   
</script>

<style lang="less">
  .tocs { background-color:black;
    ul { padding:0; list-style: none; align-self:start; font-size:3vh; display:grid;
      li  { background-color:#333; padding-left:0.25em; align-self:start;
            border-radius:0 24px 24px 0; margin:0.2em 0.2em 0.2em 0.2em;
         a  { color:white; text-decoration:none; }
         ul { font-size:2vh;
           li { border-radius:0 12px 12px 0; color:white; margin:0.2em 0.2em 0.2em 0.2em; background-color:#666;
             ul { font-size:1.5vh; margin-left:1em; display:none;
               li { border-radius:0 12px 12px 0; color:white; margin:0.2em 0.2em 0.2em 0.2em;background-color:#666; } } }
           li:hover { background-color:coral; color:black;
             ul { font-size:1.5vh; margin-left:1em; display:block;
               li { border-radius:0 12px 12px 0;  color:black; margin:0.2em 0.2em 0.2em 0.2em; }
               li:hover { background-color:black; color:white; }
           } } } } }
    .bgc( @bg )        { background-color:@bg   !important; } //
    [data-dir]:hover   { background-color:black !important;; color:white !important; }
    [data-dir="cen"  ] { .bgc(coral);        }
    [data-dir="west" ] { .bgc(springgreen); }
    [data-dir="north"] { .bgc(gold);        }
    [data-dir="east" ] { .bgc(salmon); }
    [data-dir="south"] { .bgc(peru);   }
  }
  
</style>

