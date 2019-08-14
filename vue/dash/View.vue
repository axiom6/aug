
<template>
  <div ref="View">
    <router-view name="Data"></router-view>
    <router-view name="Math"></router-view>
    <router-view name="Geom"></router-view>
    <router-view name="Draw"></router-view>
    <router-view name="Note"></router-view>
    <router-view name="Home"></router-view>
    <router-view name="Prin"></router-view>
    <router-view name="Info"></router-view>
    <router-view name="Know"></router-view>
    <router-view name="Wise"></router-view>
    <router-view name="Cube"></router-view>
    <router-view name="Wood"></router-view>
    <router-view name="Prac"></router-view>
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
      } ) }
      
    }

</script>

<style lang="less">


</style>



