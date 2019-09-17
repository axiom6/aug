

<template>
  <div class="note">
    <n-tabs :pages="pages"></n-tabs>  <!-- init="Stand" -->
    <h1 v-if="route==='Note'">Notebooks</h1>
    <template v-for="page in pages">
      <router-view :name="name(page)" :id="page.key"></router-view>
    </template>
  </div>
</template>

<script type="module">

  import Tabs  from '../elem/Tabs.vue';
  
  let Note = {
    
    components:{ 'n-tabs':Tabs },

    data() {
      return { route:'Note', tab:'Stand', pages:{
          Stand: { name:'Stand', key:'Stand', show:false, route:'Stand' },
          Embed: { name:'Embed', key:'Embed', show:false, route:'Embed' },
          Maths: { name:'Maths', key:'Maths', show:false, route:'Maths' },
          Ganja: { name:'Ganja', key:'Ganja', show:false, route:'Ganja' },
        } } },
    
    methods: {
      name: function(page) {
        return page.key; } }
    
  }
  
  export default Note;
  
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .note { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }
</style>