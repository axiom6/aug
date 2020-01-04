
<template>
  <div class="view-pane" ref="View">
    <template v-for="view in rviews">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  export default {

    data() { return { elem:null, rviews:this.mix().views() }; },
    
    methods:{
      show:function() {
        return this.$route.name===null } },
    
    mounted: function () {
      this.$nextTick( function() {  // Enable touch events inside all views
      } ) }
      
    }

</script>

<style lang="less">

      .view-pane {}
  
</style>



