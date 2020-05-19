

<template>
  <div class="note-pane">
    <n-tabs route="Note" :pages="pages"></n-tabs>
    <h1 v-show="myRoute()">Notebooks</h1>
    <template v-for="page in pages">
      <router-view :name="page.key"></router-view>
    </template>
  </div>
</template>

<script type="module">

  import Tabs  from '../elem/Tabs.vue';
  
  let Note = {
    
    components:{ 'n-tabs':Tabs },

    data() {
      return { route:'Note', pages:{
          Stand: { title:'Stand', key:'Stand', show:false, route:'Stand' },
          Embed: { title:'Embed', key:'Embed', show:false, route:'Embed' },
          Maths: { title:'Maths', key:'Maths', show:false, route:'Maths' },
          Ganja: { title:'Ganja', key:'Ganja', show:false, route:'Ganja' }
        } } },
    
    methods: {
      
      myRoute: function() {
        return this.mix().isRoute('Note'); } },

    mounted: function () {
      this.nav().setPages( this.route, this.pages ); }

  }
  
  export default Note;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @noteFS:@themeFS;
  
  .note-pane { position:absolute; left:0; top:0; width:100%; height:100%;
      background-color:@theme-back; display:grid;
    h1 { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@noteFS; } }
</style>