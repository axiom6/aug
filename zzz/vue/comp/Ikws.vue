
<template>
  <div class="ikws">
    <b-tabs :comp="comp" :pages="pages"></b-tabs>
    <h1 v-if="comp==='Prin'">Principles</h1>
    <h1 v-if="comp==='Info'">Information</h1>
    <h1 v-if="comp==='Know'">Knowledge</h1>
    <h1 v-if="comp==='Wise'">Wisdom</h1>
    <template v-for="view in views">
      <router-view :name="comp+view"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  import Tabs from '../elem/Tabs.vue';
  
  export default {
    components:{ 'b-tabs':Tabs },

    data() { return { comp:'None',
      pages:[
        { title:'Icon', view:'Page', page:'Icon' },
        { title:'Dirs', view:'Page', page:'Dirs' },
        { title:'Conn', view:'Page', page:'Conn' },
        { title:'Summ', view:'Page', page:'Summ' },
        { title:'Desc', view:'Page', page:'Desc' },
        { title:'Konn', view:'Konn', page:'None' },
        { title:'Prac', view:'Prac', page:'None' },
        { title:'Enli', view:'Enli', page:'None' },
        { title:'Data', view:'Data', page:'None' } ],
      views:['Page','Konn','Prac','Enli','Data']
      } },

    beforeMount: function() {
      this.comp = this.$route.name;
      this.nav().setPages( this.pages ); },
  }
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .ikws { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color;  font-size:@theme-h1-size; } }
</style>