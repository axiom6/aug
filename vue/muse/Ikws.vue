
<template>
  <div class="ikws">
    <b-tabs :comp="comp" :pages="pages"></b-tabs>
    <template v-for="page in pages">
      <router-view :name="comp+page"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  import Tabs from './Tabs.vue';
  
  export default {
    components:{ 'b-tabs':Tabs },

    data() { return { comp:'None', pages:['Prac','Conn','Enli','Data'] } },

    beforeMount: function() {
      this.comp = this.$route.name },
  }
</script>

<style lang="less">
  .ikws { position:relative; left:0; top:0; right:0; bottom:0; }
</style>