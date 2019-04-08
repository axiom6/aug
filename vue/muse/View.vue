
<template>
  <div>
    <div class="view" v-if="show()"><h1>Welcome to Augmentation<br/>Choose a Component on the Left</h1></div>
    <router-view name="Info"></router-view>
    <router-view name="Know"></router-view>
    <router-view name="Wise"></router-view>
  </div>
</template>

<script type="module">
  export default {
    
    methods:{
      show:function() {
        return this.$route.name===null } } }

</script>

<style lang="less">
  .view { display:grid; justify-items:center; align-items:center; text-align:center;
    background-color:black; color:wheat; }
</style>

