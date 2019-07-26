
<template>
  <div class="ikws">
    <b-tabs :comp="comp" :pages="pages"></b-tabs>
    <h1 v-if="comp==='Info'">Information</h1>
    <h1 v-if="comp==='Know'">Knowledge</h1>
    <h1 v-if="comp==='Wise'">Wisdom</h1>
    <template v-for="page in pages">
      <router-view :name="comp+page.key"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  import Tabs from '../elem/Tabs.vue';
  
  export default {
    components:{ 'b-tabs':Tabs },

    data() { return { comp:'None', pages:[
        { title:'Practices',    key:'Prac' },
        { title:'Connections',  key:'Conn' },
        { title:'Enlight',      key:'Enli' },
        { title:'Data Science', key:'Data' },
      ] } },

    beforeMount: function() {
      this.comp = this.$route.name },
  }
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .ikws { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color;  font-size:@theme-h1-size; } }
</style>