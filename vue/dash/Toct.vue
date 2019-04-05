
<template>
  <div class="tocs">
    <ul>
      <li><span v-on:click="showPlane('Info')" ><router-link :to="{ name:'Info' }">Info</router-link></span>
        <ul v-if="plane==='Info' || init ">
          <li v-on:click="showPrac('Collab'   )">Collab</li>
          <li v-on:click="showPrac('Domain'   )">Domain</li>
          <li v-on:click="showPrac('Discover' )">Discover</li>
          <li v-on:click="showPrac('Adapt'    )">Adapt</li>
          <li v-on:click="showPrac('Make'     )">Make</li>
          <li v-on:click="showPrac('Benefit'  )">Benefit</li>
          <li v-on:click="showPrac('Change'   )">Change</li>
          <li v-on:click="showPrac('Deliver'  )">Deliver</li>
          <li v-on:click="showPrac('Govern'   )">Govern</li>
        </ul>
      </li>
      <li><span v-on:click="showPlane('Know')" ><router-link :to="{ name:'Know' }">Know</router-link></span>
        <ul v-if="plane==='Know' || init ">
          <li v-on:click="showPrac('Human'   )">Human</li>
          <li v-on:click="showPrac('Science' )">Science</li>
          <li v-on:click="showPrac('Grasp'   )">Grasp</li>
          <li v-on:click="showPrac('Conduct' )">Conduct</li>
          <li v-on:click="showPrac('Think'   )">Think</li>
          <li v-on:click="showPrac('Reason'  )">Reason</li>
          <li v-on:click="showPrac('Evolve'  )">Evolve</li>
          <li v-on:click="showPrac('Educate' )">Educate</li>
          <li v-on:click="showPrac('Culture' )">Culture</li>
        </ul>
      </li>
      <li><span v-on:click="showPlane('Wise')" ><router-link :to="{ name:'Wise' }">Wise</router-link></span>
        <ul v-if="plane==='Wise' || init ">
          <li v-on:click="showPrac('Trust'   )">Trust</li>
          <li v-on:click="showPrac('Nature'  )">Nature</li>
          <li v-on:click="showPrac('Truth'   )">Truth</li>
          <li v-on:click="showPrac('Explore' )">Explore</li>
          <li v-on:click="showPrac('Create'  )">Create</li>
          <li v-on:click="showPrac('Mind'    )">Mind</li>
          <li v-on:click="showPrac('Emerge'  )">Emerge</li>
          <li v-on:click="showPrac('Inspire' )">Inspire</li>
          <li v-on:click="showPrac('Actual'  )">Actual</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script type="module">
  let Toct = {
    data() { return { plane:"None", init:true } },
    methods: {
      showPlane: function(plane) {
        this.plane =  plane;
        this.showPrac(plane); },
      showPrac: function(prac) {
        //console.log( 'Tocs.showPrac', { plane:this.plane, 'prac':prac } );
        this.publish( this.plane, prac ); },
      doSelect: function(select) {
        this.publish( 'Select',   select ); }
    } };
   export default Toct;
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
