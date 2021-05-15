
<template>
  <div   class="main-pane">
    <div class="link-pane">
      <h1>Routes</h1>
      <ul>
        <li @click="doRoute('Home')">Home</li>
        <li @click="doRoute('Info')">Info</li>
        <li @click="doRoute('Know')">Know</li>
        <li @click="doRoute('Wise')">Wise</li>
      </ul>
    </div>
    <div class="view-pane">
      <h1>Views</h1>
      <v-view></v-view>
    </div>
  </div>
</template>

<script type="module">

import { inject, onMounted } from 'vue';
import View                  from './View.vue';

  let Link = {

    components: { 'v-view':View },

    setup() {

      const router = inject('router');

      const doRoute = (name) => {
        console.log( 'Link.doRoute()', name );
        router.push( { name:name } ); }

      onMounted( () => {
        doRoute('Home');
        console.log( 'Link.onMounted' ); } )

    return { doRoute }; }
  }

export default Link;

</script>

<style>

  .main-pane { position:absolute; top:0;   left:0; width:100%; height:100%; }
  .link-pane { position:absolute; top:0;   left:0; width:100%; height: 20%; }
  .view-pane { position:absolute; top:20%; left:0; width:100%; height: 80%; }

</style>

<!--
   <li><router-link :to="{ name:'Home' }">Home</router-link></li>
   <li><router-link :to="{ name:'Info' }">Info</router-link></li>
   <li><router-link :to="{ name:'Know' }">Know</router-link></li>
   <li><router-link :to="{ name:'Wise' }">Wise</router-link></li>

<li @click="doRoute('Home')">Home</li>
<li @click="doRoute('Info')">Info</li>
<li @click="doRoute('Know')">Know</li>
<li @click="doRoute('Wise')">Wise</li>

   <router-view :name="'Home'"></router-view>
   <router-view :name="'Info'"></router-view>
   <router-view :name="'Know'"></router-view>
   <router-view :name="'Wise'"></router-view>

<template>
  <div   class="main-pane">
    <div class="link-pane">
      <h1>Routing</h1>
      <ul>
        <li><router-link :to="'/'"    >Home</router-link></li>
        <li><router-link :to="'/Info'">Info</router-link></li>
        <li><router-link :to="'/Know'">Know</router-link></li>
        <li><router-link :to="'/Wise'">Wise</router-link></li>

      </ul>
    </div>
    <div class="view-pane">
      <router-view></router-view>
    </div>
  </div>
</template>

-->