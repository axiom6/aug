

<template>
  <div class="note">
    <n-tabs :comp="comp" :pages="pages"></n-tabs>  <!-- init="Stand" -->
    <h1 v-if="comp==='Note'">Notebooks</h1>
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
      return { comp:'Note', tab:'Standard', pages:[
          { title:'Standard', key:'Stand' },
          { title:'Embed',    key:'Embed' },
          { title:'Maths',    key:'Maths' },
          { title:'Ganja',    key:'Ganja' },
        ] } },
    
    methods: {
      
      name: function(page) {
        return this.comp+page.key; } },
    
  }
  
  export default Note;
  
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .note { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }
</style>