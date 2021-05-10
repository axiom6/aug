
<template>
  <div class="view-pane">
    <template v-for="view in rviews">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';
  
  let View = {
    setup() {
      const mix    = inject('mix');
      const rviews = mix.routeNames();
      // console.log( 'View.setuo()', rviews );
      return { rviews }; }
    }

  export default View

</script>

<style lang="less">

      .view-pane {}
  
</style>

<!--

<router-view :key="$route.fullPath" />

   // const elem   = null;

import { inject, onMounted, nextTick } from 'vue';
      onMounted( function () {
        nextTick( function() {  // Enable touch events inside all views
        } ) } )

   // const show = function() {
   //   return this.$route.name===null }

<template>
  <div class="view-pane" ref="View">
    <router-view name="Home"></router-view>
    <router-view name="Prin"></router-view>
    <router-view name="Info"></router-view>
    <router-view name="Know"></router-view>
    <router-view name="Wise"></router-view>
    <router-view name="Cube"></router-view>
    <router-view name="Team"></router-view>
  </div>
</template>
-->



