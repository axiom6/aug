
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
  
  import Touch from '../../pub/base/util/Touch.js'
  
  export default {

    data() { return { touch:null, elem:null }; },
    
    methods:{
      show:function() {
        return this.$route.name===null } },
    
    mounted: function () {
      this.$nextTick( function() {  // Enable touch events inside all views
        this.touch = new Touch();
        this.elem  = this.$refs['View'];
        this.touch.onNav( this.elem, this.nav() );
        this.nav().set( { $router:this.$router } );
      } ) }
      
    }

</script>

<style lang="less">


</style>



