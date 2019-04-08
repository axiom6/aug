
<template>
  <div>
    <!-- Banner startup page that disappears once a Route is chosen -->
    <div class="banner" v-if="show()">
      <div>
        <h1>Welcome to Augmentation</h1>
        <h2>Choose a Component on the Left</h2>
      </div>
    </div>
    <router-view name="Cube"></router-view>
    <router-view name="Info"></router-view>
    <router-view name="Know"></router-view>
    <router-view name="Wise"></router-view>
    <router-view name="Svga"></router-view>
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

