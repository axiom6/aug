
<template>
  <div class="tocs">
    <ul>
      <li><span v-on:click="showPlane('Info')" ><router-link :to="{ name:'Info' }">Info</router-link></span>
        <ul v-if="plane==='Info'">
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
        <ul v-if="plane==='Know'">
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
        <ul v-if="plane==='Wise'">
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
  let Tocs = {
    data() { return { plane:"None" } },
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
   export default Tocs;
</script>

<style lang="less">
.tocs { background-color:darkgrey;
  ul    { margin:0; padding:0; list-style: none;
    li    { margin:0; background-color:black; color:white; border:white solid 1px; padding-left:0.25em;
       a    { color:white; text-decoration:none; }
       ul { margin-left:1em; } }
    li:hover { margin:0; background-color:white; color:black; border:white solid 1px;
       a       { color:black; text-decoration:none; } } } }
</style>

/*
  <!--ul>
  path:'/info', path:'/know', path:'/wise',
    <li @click="doSelect('Collaborate')">Collaborate</li>
    <li @click="doSelect('Domain')"     >Domain</li>
    <li @click="doSelect('Discover')"   >Discover</li>
    <li @click="doSelect('Adapt')"      >Adapt</li>
    <li @click="doSelect('Technology')" >Technology</li>
    <li @click="doSelect('Benefit')"    >Benefit</li>
    <li @click="doSelect('Change')"     >Change</li>
    <li @click="doSelect('Deliver')"    >Deliver</li>
    <li @click="doSelect('Govern')"     >Govern</li>
    <li @click="doSelect('View')"       >View</li>
  </ul-->
*/