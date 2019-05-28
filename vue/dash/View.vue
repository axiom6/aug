
<template>
  <div>              <!--  :key="$route.fullPath" reloads Base  -->
    <router-view name="Math"></router-view>
    <router-view name="Geom"></router-view>
    <router-view name="Draw"></router-view>
    <router-view name="Note"></router-view>
    <router-view name="Home"></router-view>
    <router-view name="Info"></router-view>
    <router-view name="Know"></router-view>
    <router-view name="Wise"></router-view>
    <router-view name="Cube"></router-view>
    <router-view name="Wood"></router-view>
  </div>
</template>

<script type="module">
  
  export default {
    
    methods:{
      show:function() {
        return this.$route.name===null } } }

</script>

<style lang="less">


</style>



