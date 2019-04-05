
<template>
  <div class="tocs">
    <ul>
      <template v-for="komp in komps">
          <li :key="komp.name"><span v-on:click="showPlane(komp.name)">
            <router-link :to="{ name:komp.name }">{{komp.name}}</router-link></span>
            <ul  v-if="plane===komp.name">
              <template v-for="prac in komps[komp.name].pracs" >
                <li v-on:click="showPrac(prac.name)" :key="prac.name">{{prac.name}}</li>
              </template>
            </ul>
          </li>
      </template>
    </ul>
  </div>
</template>

<script type="module">
  
  let Tocs = {
    
    data() {
      return { plane:"None",
        komps:{Info:{name:'Info',pracs:{}},Know:{name:'Know',pracs:{}},Wise:{name:'Wise',pracs:{}}} } },
    methods: {
      showPlane: function(plane) {
        this.plane =  plane;
        this.showPrac(plane); },
      showPrac: function(prac) {
        this.publish( this.plane, prac ); },
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
         li {  border-radius:0 12px 12px 0; color:white;   margin:0.2em 0.2em 0.2em 0.2em; border:none;
                    background-color:#666; }
         li:hover { background-color:white; color:black; } } } } }
</style>

<!--template>
  <div class="tocs">
    <ul>
      <li><span v-on:click="showPlane('Info')" ><router-link :to="{ name:'Info' }">Info</router-link></span>
        <ul  v-if="plane==='Info'">
          <template v-for="prac in infos" >
            <li v-on:click="showPrac(prac.name)" :key="prac.name">{{prac.name}}</li>
          </template>
        </ul>
      </li>
      <li><span v-on:click="showPlane('Know')" ><router-link :to="{ name:'Know' }">Know</router-link></span>
        <ul  v-if="plane==='Know'">
          <template v-for="prac in knows" >
            <li v-on:click="showPrac(prac.name)" :key="prac.name">{{prac.name}}</li>
          </template>
        </ul>
      </li>
      <li><span v-on:click="showPlane('Wise')" ><router-link :to="{ name:'Wise' }">Wise</router-link></span>
        <ul  v-if="plane==='Wise'">
          <template v-for="prac in wises">
            <li v-on:click="showPrac(prac.name)" :key="prac.name">{{prac.name}}</li>
          </template>
        </ul>
      </li>
    </ul>
  </div>
</template-->
