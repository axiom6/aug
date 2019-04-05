
<template>
  <div class="tocs">
    <ul>
      <li v-on:click="showPlane('Info')"><router-link :to="{ name:'Info' }">Info</router-link>
        <ul v-if="plane==='Info'">
          <router-link :to="{ name:'Collab'   }" tag="li">Collab</router-link>
          <router-link :to="{ name:'Domain'   }" tag="li">Domain</router-link>
          <router-link :to="{ name:'Discover' }" tag="li">Discover</router-link>
          <router-link :to="{ name:'Adapt'    }" tag="li">Adapt</router-link>
          <router-link :to="{ name:'Make'     }" tag="li">Make</router-link>
          <router-link :to="{ name:'Benefit'  }" tag="li">Benefit</router-link>
          <router-link :to="{ name:'Change'   }" tag="li">Change</router-link>
          <router-link :to="{ name:'Deliver'  }" tag="li">Deliver</router-link>
          <router-link :to="{ name:'Govern'   }" tag="li">Govern</router-link>
        </ul>
      </li>
      <li v-on:click="showPlane('Know')"><router-link :to="{ name:'Know' }">Know</router-link>
        <ul v-if="plane==='Know'">
          <router-link :to="{ name:'Human'   }" tag="li">Human</router-link>
          <router-link :to="{ name:'Science' }" tag="li">Science</router-link>
          <router-link :to="{ name:'Grasp'   }" tag="li">Grasp</router-link>
          <router-link :to="{ name:'Conduct' }" tag="li">Conduct</router-link>
          <router-link :to="{ name:'Think'   }" tag="li">Think</router-link>
          <router-link :to="{ name:'Reason'  }" tag="li">Reason</router-link>
          <router-link :to="{ name:'Evolve'  }" tag="li">Evolve</router-link>
          <router-link :to="{ name:'Educate' }" tag="li">Educate</router-link>
          <router-link :to="{ name:'Culture' }" tag="li">Culture</router-link>
        </ul>
      </li>
      <li v-on:click="showPlane('Wise')"><router-link :to="{ name:'Wise' }">Wise</router-link>
        <ul v-if="plane==='Wise'">
          <router-link :to="{ name:'Trust'   }" tag="li">Trust</router-link>
          <router-link :to="{ name:'Nature'  }" tag="li">Nature</router-link>
          <router-link :to="{ name:'Truth'   }" tag="li">Truth</router-link>
          <router-link :to="{ name:'Explore' }" tag="li">Explore</router-link>
          <router-link :to="{ name:'Create'  }" tag="li">Create</router-link>
          <router-link :to="{ name:'Mind'    }" tag="li">Mind</router-link>
          <router-link :to="{ name:'Emerge'  }" tag="li">Emerge</router-link>
          <router-link :to="{ name:'Inspire' }" tag="li">Inspire</router-link>
          <router-link :to="{ name:'Actual'  }" tag="li">Actual</router-link>
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
        this.plane = plane;
      },
      doSelect: function(select) {
        console.log( 'Tocs.vue', select );
        this.publish("Select",   select ); }
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