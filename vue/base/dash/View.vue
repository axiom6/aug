
<template>
  <div class="view-pane" ref="View">
    <template v-for="view in rviews">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">

  import { inject, onMounted, nextTick } from 'vue';
  
  export default {

    setup() {

      const mix    = inject('mix');
      const elem   = null;
      const rviews = mix.routeNames();

      const show = function() {
        return this.$route.name===null }

      onMounted( function () {
        nextTick( function() {  // Enable touch events inside all views
        } ) } )
      return { rviews }; }
      
    }

</script>

<style lang="less">

      .view-pane {}
  
</style>



