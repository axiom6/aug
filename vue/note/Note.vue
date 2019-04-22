

<template>
  <div class="note">
    <n-tabs :comp="comp" :pages="pages"></n-tabs>
    <template v-for="page in pages">
      <router-view :name="name(page)" :id="page.short"></router-view>
    </template>
  </div>
</template>

<script type="module">

  import Tabs  from '../note/Tabs.vue';
/*import Stand from '../note/Stand.vue';
  import Embed from '../note/Embed.vue';
  import Maths from '../note/Maths.vue';
  import Ganja from '../note/Ganja.vue';*/
  
  let Note = {
    
    components:{ 'n-tabs':Tabs },

    data() {
      return { comp:'Note', tab:'Standard', pages:[
          { title:'Standard', short:'Stand' },
          { title:'Embed',    short:'Embed' },
          { title:'Maths',    short:'Maths' },
          { title:'Ganja',    short:'Ganja' },
        ] } },
    
    methods: {
      
      name: function(page) {
        return this.comp+page.short; } },
    
  }
  
/*Note.Stand = Stand;
  Note.Embed = Embed;
  Note.Maths = Maths;
  Note.Ganja = Ganja;*/
  
  export default Note;
</script>

<style lang="less">
  .note { position:relative; left:0; top:0; right:0; bottom:0; }
</style>