
<template>
  <div ref="View">
    <router-view name="Home"></router-view>
    <router-view name="Flavor"></router-view>
    <router-view name="Roast"></router-view>
    <router-view name="Brew"></router-view>
    <router-view name="Drink"></router-view>
    <router-view name="Body"></router-view>
    <router-view name="World"></router-view>
    <router-view name="Region"></router-view>
  </div>
</template>

<script type="module">
  
  import Touch from '../../pub/base/nav/Touch.js'
  
  export default {

    data() { return { touch:null, elem:null }; },
    
    methods:{
      show:function() {
        return this.$route.name===null } },
    
    mounted: function () {
      this.$nextTick( function() {  // Enable touch events inside all views
        this.touch = new Touch( this.stream(), this.dir() );
        this.elem  = this.$refs['View'];
        this.touch.onDir( this.elem );
      } ) }
      
    }

</script>

<style lang="less">


</style>



