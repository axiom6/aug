
<template>
  <div>
    <router-view name="Home"></router-view>
    <router-view name="Cube"></router-view>
    <router-view name="Info"></router-view>
    <router-view name="Know"></router-view>
    <router-view name="Wise"></router-view>
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
  .banner { display:grid; justify-items:center; align-items:center; text-align:center;
    background-color:black; color:wheat; }
</style>



