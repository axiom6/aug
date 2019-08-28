
<template>
  <div ref="View">
    <template v-for="view in rviews">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  import Touch from '../../pub/base/util/Touch.js'
  
  export default {

    data() { return { touch:null, elem:null, rviews:this.views() }; },
    
    methods:{
      show:function() {
        return this.$route.name===null } },
    
    mounted: function () {
      this.$nextTick( function() {  // Enable touch events inside all views
        // this.touch = new Touch();
        // this.elem  = this.$refs['View'];
        // this.touch.onNav( this.elem, this.nav() );
      } ) }
      
    }

</script>

<style lang="less">


</style>



