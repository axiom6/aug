
<template>
  <div>              <!--  :key="$route.fullPath" reloads Base  -->
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
  .ikw { position:relative; left:0; top:0; right:0; bottom:0; }
  .enli, .data { background-color:black; color:wheat;
                 display:grid; justify-self:center;  align-self:center;  text-align:center; }
  .banner {      display:grid; justify-items:center; align-items:center; text-align:center;
    background-color:black; color:wheat; }
</style>



